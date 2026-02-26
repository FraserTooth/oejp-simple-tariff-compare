import { callGraphQL } from './index';
import type { LineItem, GetChargesResponse } from './types';

export const GET_CHARGES_WITH_LINE_ITEMS = `
  query getCharges($accountNumber: String!, $billingDocumentIdentifier: String!) {
    charges(accountNumber: $accountNumber, billingDocumentIdentifier: $billingDocumentIdentifier) {
      grossAmount
      salesTaxAmount
      lineItems {
        supplyType
        periodStartAt
        periodEndAt
        numberOfUnits
        netAmount
        grossAmount
        currency
        productCode
        contractedCapacityUnit
        contractedCapacityValue
      }
    }
  }
`;

export const getChargesWithLineItems = async (
    token: string,
    accountNumber: string,
    billingDocumentIdentifier: string
): Promise<LineItem[]> => {
    const responseData = await callGraphQL<GetChargesResponse['data']>(token, {
        query: GET_CHARGES_WITH_LINE_ITEMS,
        variables: {
            accountNumber,
            billingDocumentIdentifier,
        },
    });

    // Flatten all line items from all charges
    const allLineItems: LineItem[] = [];
    const charges = responseData.data?.charges || [];

    for (const charge of charges) {
        if (charge.lineItems) {
            allLineItems.push(...charge.lineItems);
        }
    }

    return allLineItems;
};
