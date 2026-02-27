import type { BillComparisonResult } from './types';
import { calculateCurrentTariffCarbonIntensity, calculateSimpleTariffCarbonIntensity } from './carbon';


export const displayComparisonResults = (comparison: BillComparisonResult): void => {
    // Header with rate information - note that renewable surcharge is automatically added (~3¥/kWh per month)
    console.log('📊 TARIFF COMPARISON (Base Rate: ¥' + comparison.rate.toFixed(2) + '/kWh + renewable surcharge)');

    // Monthly comparison table
    const MONTH_WIDTH = 7;
    const KWH_WIDTH = 4;
    const RATE_WIDTH = 7;
    const ACTUAL_WIDTH = 12;
    const SIMPLE_WIDTH = 12;
    const MONEY_WIDTH = 22;
    const CARBON_WIDTH = 15;

    console.log(`${'Month'.padEnd(MONTH_WIDTH)} | ${'kWh'.padEnd(KWH_WIDTH)} | ${'Rate'.padEnd(RATE_WIDTH)} | ${'Actual'.padEnd(ACTUAL_WIDTH)} | ${'Simple'.padEnd(SIMPLE_WIDTH)} | ${'Difference'.padEnd(MONEY_WIDTH)}  | ${'Carbon Saving'.padEnd(CARBON_WIDTH)}`);
    console.log(`${'-'.repeat(MONTH_WIDTH)}-+-${'-'.repeat(KWH_WIDTH)}-+-${'-'.repeat(RATE_WIDTH)}-+-${'-'.repeat(ACTUAL_WIDTH)}-+-${'-'.repeat(SIMPLE_WIDTH)}-+-${'-'.repeat(MONEY_WIDTH)}--+-${'-'.repeat(CARBON_WIDTH)}`);

    for (const comp of comparison.comparisons) {
        const savingLabel = comp.wouldHaveSaved ? '✅' : '❌';
        const moreOrLess = comp.wouldHaveSaved ? 'less' : 'more';
        const month = comp.toDate.slice(0, 7).padEnd(MONTH_WIDTH);
        const kWh = String(Math.round(comp.totalKwh)).padStart(KWH_WIDTH, ' ');
        const resultantRate = (comparison.rate + comp.renewableSurchargeRateYenPerKwh).toFixed(2).padEnd(RATE_WIDTH);
        const actualCost = `¥${Math.round(comp.actualPreTaxCost).toLocaleString()}`.padEnd(ACTUAL_WIDTH);
        const simpleCost = `¥${Math.round(comp.calculatedCost).toLocaleString()}`.padEnd(SIMPLE_WIDTH);
        const differenceString = `${savingLabel} ¥${Math.abs(comp.savings).toLocaleString('en-US', { maximumFractionDigits: 0 })} ${moreOrLess} (${comp.savingsPercentage.toFixed(1)}%)`.padEnd(MONEY_WIDTH);
        const carbonSavingStr = `${Math.round(comp.carbonSavings)}g`.padEnd(CARBON_WIDTH);
        console.log(`${month} | ${kWh} | ${resultantRate} | ${actualCost} | ${simpleCost} | ${differenceString} | ${carbonSavingStr}`);
    }

    // Totals summary
    console.log('\n📈 COST TOTALS (across ' + comparison.comparisons.length + ' months)');
    console.log(`Total Actual: ¥${comparison.totalActualCost.toLocaleString()} | Total Calculated: ¥${comparison.totalCalculatedCost.toLocaleString()}`);
    const switchEmoji = comparison.totalSavingsOnSimple >= 0 ? '✅' : '❌';
    const moreOrLess = comparison.totalSavingsOnSimple >= 0 ? 'less' : 'more';
    console.log(`${switchEmoji} If you had switched to Simple Octopus, you would have paid ¥${Math.abs(comparison.totalSavingsOnSimple).toLocaleString()} ${moreOrLess} (${comparison.totalSavingsPercentage.toFixed(2)}%)`);
    console.log('\n')

    // Carbon impact analysis
    const currentIntensity = calculateCurrentTariffCarbonIntensity();
    const simpleIntensity = calculateSimpleTariffCarbonIntensity();
    const percentageDifference = ((currentIntensity - simpleIntensity) / currentIntensity) * 100;
    console.log('💨 CARBON IMPACT (across ' + comparison.comparisons.length + ' months)');
    console.log(`Carbon Intensity: Standard Tariff: ${currentIntensity} gCO2/kWh | Simple Tariff: ${simpleIntensity} gCO2/kWh (${percentageDifference.toFixed(1)}%)`);
    console.log(`Total Current Tariff: ${Math.round(comparison.totalCurrentTariffCarbon).toLocaleString()}g CO2 | Total Simple Tariff: ${Math.round(comparison.totalSimpleTariffCarbon).toLocaleString()}g CO2`);
    const carbonLabel = comparison.totalCarbonSavings >= 0 ? 'saved' : 'added';
    const carbonEmoji = comparison.totalCarbonSavings >= 0 ? '🌱' : '⚠️';
    console.log(`${carbonEmoji} If you had switched to Simple Octopus, you would have ${carbonLabel} ${Math.round(Math.abs(comparison.totalCarbonSavings)).toLocaleString()}g CO2 (${((comparison.totalCarbonSavings / comparison.totalCurrentTariffCarbon) * -100).toFixed(2)}%)\n`);
};
