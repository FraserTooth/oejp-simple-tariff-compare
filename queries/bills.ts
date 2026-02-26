import ora from 'ora';
import { callGraphQL } from './index';
import { getChargesWithLineItems } from './charges';
import type { BillInformation, GetBillInformationResponse } from './types';

export const GET_BILL_INFORMATION = `
  query getBillInformation($accountNumber: String!) {
    account(accountNumber: $accountNumber) {
      number
      ledgers {
        number
        statements(first: 24) {
          edges {
            node {
              id
              identifier
              startAt
              endAt
              firstIssuedAt
              totalCharges {
                netTotal
                taxTotal
                grossTotal
              }
              transactions(first: 100) {
                edges {
                  node {
                    ... on BillCharge {
                      __typename
                      id
                      postedDate
                      title
                      note
                      reasonCode
                      consumption {
                        startDate
                        endDate
                        quantity
                        unit
                      }
                      amounts {
                        net
                        tax
                        gross
                      }
                    }
                    ... on BillCredit {
                      __typename
                      id
                      postedDate
                      title
                      note
                      reasonCode
                      amounts {
                        net
                        tax
                        gross
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getBillInformation = async (token: string, accountNumber: string): Promise<BillInformation[]> => {
    const spinner = ora('Retrieving bill information...').start();
    try {
        const responseData = await callGraphQL<GetBillInformationResponse['data']>(token, {
            query: GET_BILL_INFORMATION,
            variables: {
                accountNumber,
            },
        });

        const bills: BillInformation[] = [];
        const ledgers = responseData.data?.account?.ledgers || [];

        for (const ledger of ledgers) {
            const statements = ledger.statements?.edges || [];

            for (const statementEdge of statements) {
                const statement = statementEdge.node;

                // Calculate total kWh from transactions
                let totalKwh = 0;
                const transactions = statement.transactions?.edges || [];

                for (const txEdge of transactions) {
                    const tx = txEdge.node;

                    // Only process BillCharge transactions for kWh calculation
                    if (tx.__typename === 'BillCharge') {
                        if (tx.consumption && tx.consumption.unit === 'kWh') {
                            totalKwh += parseFloat(tx.consumption.quantity);
                        }
                    }
                }

                // Fetch line items and calculate costs from them (excluding credits)
                let preTaxCost = 0;
                let taxAmount = 0;
                let totalCost = 0;

                if (statement.identifier) {
                    try {
                        const lineItems = await getChargesWithLineItems(token, accountNumber, statement.identifier);

                        // Sum up amounts from line items, excluding credits (negative amounts)
                        for (const item of lineItems) {
                            if (!item.netAmount || !item.grossAmount) {
                                continue;
                            }

                            const netAmount = parseFloat(item.netAmount);
                            const grossAmount = parseFloat(item.grossAmount);

                            // Only include charges (positive amounts), exclude credits (negative amounts)
                            if (netAmount > 0) {
                                preTaxCost += netAmount;
                                totalCost += grossAmount;
                            }
                        }

                        // Calculate tax as the difference
                        taxAmount = totalCost - preTaxCost;

                    } catch (error) {
                        console.warn(`Could not fetch line items for statement ${statement.id}:`, error);
                    }
                }

                bills.push({
                    billId: statement.id,
                    fromDate: statement.startAt,
                    toDate: statement.endAt,
                    issuedDate: statement.firstIssuedAt,
                    totalKwh,
                    preTaxCost,
                    taxAmount,
                    totalCost,
                });
            }
        }

        spinner.succeed(`✓ Successfully retrieved ${bills.length} bill(s)`);
        return bills;
    } catch (error) {
        spinner.stop();
        throw error;
    }
};
