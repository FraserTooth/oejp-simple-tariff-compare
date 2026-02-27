#!/usr/bin/env bun

import { Command } from 'commander';
import { getOEJPAuthToken } from './queries/auth';
import { getAccountNumber } from './queries/account';
import { getBillInformation } from './queries/bills';
import { getSimpleTariffRate } from './queries/rate';
import { calculateBillComparison } from './processing/comparison';
import { displayComparisonResults } from './processing/display';

const runComparison = async (): Promise<void> => {
  try {
    const token = await getOEJPAuthToken();
    const accountNumber = await getAccountNumber(token);
    const bills = await getBillInformation(token, accountNumber);
    const simpleRate = await getSimpleTariffRate();

    // Calculate and display bill comparison
    const comparison = calculateBillComparison(bills, simpleRate);
    displayComparisonResults(comparison);
  } catch (error) {
    console.error('❌ Process Failed', error);
    process.exit(1);
  }
}

// Set up CLI
const program = new Command()
  .name('oejp-tariff')
  .description('CLI Tool to compare your current Octopus Energy Japan bills against the Simple Tariff, including cost and carbon savings analysis.')
  .version('0.1.0')
  .action(async () => {
    try {
      await runComparison();
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
