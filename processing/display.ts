import type { BillComparisonResult } from './types';
import { calculateCurrentTariffCarbonIntensity, calculateSimpleTariffCarbonIntensity } from './carbon';


export const displayComparisonResults = (comparison: BillComparisonResult): void => {
    // Header with rate information - note that renewable surcharge is automatically added (~3¥/kWh per month)
    console.log('📊 TARIFF COMPARISON (Base Rate: ¥' + comparison.rate.toFixed(2) + '/kWh + renewable surcharge)');

    // Monthly comparison table
    const MONTH_WIDTH = 7;
    const KWH_WIDTH = 4;
    const RATE_WIDTH = 7;
    const MONEY_WIDTH = 22;
    const CARBON_WIDTH = 15;

    console.log(`${'Month'.padEnd(MONTH_WIDTH)} | ${'kWh'.padEnd(KWH_WIDTH)} | ${'Rate'.padEnd(RATE_WIDTH)} | ${'Money Saving'.padEnd(MONEY_WIDTH)} | ${'Carbon Saving'.padEnd(CARBON_WIDTH)}`);
    console.log(`${'-'.repeat(MONTH_WIDTH)}-+-${'-'.repeat(KWH_WIDTH)}-+-${'-'.repeat(RATE_WIDTH)}-+-${'-'.repeat(MONEY_WIDTH)}-+-${'-'.repeat(CARBON_WIDTH)}`);

    for (const comp of comparison.comparisons) {
        const savingLabel = comp.isOverpaying ? '❌' : '✅';
        const month = comp.toDate.slice(0, 7).padEnd(MONTH_WIDTH);
        const kWh = String(Math.round(comp.totalKwh)).padStart(KWH_WIDTH, ' ');
        const resultantRate = (comparison.rate + comp.renewableSurchargeRateYenPerKwh).toFixed(2).padEnd(RATE_WIDTH);
        const moneySavingStr = `${savingLabel} ¥${Math.abs(comp.savings).toLocaleString('en-US', { maximumFractionDigits: 0 })} (${comp.savingsPercentage.toFixed(1)}%)`.padEnd(MONEY_WIDTH);
        const carbonSavingStr = `${Math.round(comp.carbonSavings)}g`.padEnd(CARBON_WIDTH);
        console.log(`${month} | ${kWh} | ${resultantRate} | ${moneySavingStr} | ${carbonSavingStr}`);
    }

    // Totals summary
    console.log('\n📈 TOTALS (across ' + comparison.comparisons.length + ' months)');
    console.log(`Total Actual: ¥${comparison.totalActualCost.toLocaleString()} | Total Calculated: ¥${comparison.totalCalculatedCost.toLocaleString()}`);
    const totalLabel = comparison.totalSavings >= 0 ? '✅ Total Saving' : '❌ Total Overpaying';
    console.log(`${totalLabel}: ¥${Math.abs(comparison.totalSavings).toLocaleString()} (${comparison.totalSavingsPercentage.toFixed(2)}%)`);

    // Carbon impact analysis
    const currentIntensity = calculateCurrentTariffCarbonIntensity();
    const simpleIntensity = calculateSimpleTariffCarbonIntensity();
    const percentageDifference = ((currentIntensity - simpleIntensity) / currentIntensity) * 100;
    console.log(`💨 TOTAL CARBON IMPACT -  Standard Tariff: ${currentIntensity} gCO2/kWh | Simple Tariff: ${simpleIntensity} gCO2/kWh (${percentageDifference.toFixed(1)}%)\n`);
    console.log(`Total Current Tariff: ${Math.round(comparison.totalCurrentTariffCarbon).toLocaleString()}g CO2`);
    console.log(`Total Simple Tariff: ${Math.round(comparison.totalSimpleTariffCarbon).toLocaleString()}g CO2`);
    const carbonSavingLabel = comparison.totalCarbonSavings >= 0 ? '🌱 Saving' : '⚠️ Additional';
    console.log(`${carbonSavingLabel}: ${Math.round(Math.abs(comparison.totalCarbonSavings)).toLocaleString()}g CO2 (${((comparison.totalCarbonSavings / comparison.totalCurrentTariffCarbon) * 100).toFixed(2)}%)\n`);
};
