import type { BillInformation } from '../queries/types';
import type { BillComparison, BillComparisonResult } from './types';
import { calculateCurrentTariffCarbonIntensity, calculateSimpleTariffCarbonIntensity } from './carbon';

// Carbon intensity in gCO2/kWh
// Both current and simple tariffs are calculated from breakdown by energy source
// TODO - Aquire automatically, in case it changes over time, or varies by region
const CURRENT_TARIFF_CARBON_INTENSITY = calculateCurrentTariffCarbonIntensity();
const SIMPLE_TARIFF_CARBON_INTENSITY = calculateSimpleTariffCarbonIntensity();

export const calculateBillComparison = (bills: BillInformation[], rate: number): BillComparisonResult => {
    const comparisons: BillComparison[] = [];
    let totalActualCost = 0;
    let totalCalculatedCost = 0;
    let totalCurrentTariffCarbon = 0;
    let totalSimpleTariffCarbon = 0;

    for (const bill of bills) {
        const calculatedCost = bill.totalKwh * rate;
        const savings = calculatedCost - bill.preTaxCost;
        const savingsPercentage = (savings / bill.preTaxCost) * 100;
        const isOverpaying = bill.preTaxCost > calculatedCost;

        // Calculate carbon emissions
        const currentTariffCarbon = bill.totalKwh * CURRENT_TARIFF_CARBON_INTENSITY;
        const simpleTariffCarbon = bill.totalKwh * SIMPLE_TARIFF_CARBON_INTENSITY;
        const carbonSavings = currentTariffCarbon - simpleTariffCarbon;

        comparisons.push({
            billId: bill.billId,
            fromDate: bill.fromDate,
            toDate: bill.toDate,
            totalKwh: bill.totalKwh,
            actualPreTaxCost: bill.preTaxCost,
            calculatedCost,
            savings,
            savingsPercentage,
            isOverpaying,
            currentTariffCarbon,
            simpleTariffCarbon,
            carbonSavings,
        });

        totalActualCost += bill.preTaxCost;
        totalCalculatedCost += calculatedCost;
        totalCurrentTariffCarbon += currentTariffCarbon;
        totalSimpleTariffCarbon += simpleTariffCarbon;
    }

    const totalSavings = totalCalculatedCost - totalActualCost;
    const totalSavingsPercentage = (totalSavings / totalActualCost) * 100;
    const totalCarbonSavings = totalCurrentTariffCarbon - totalSimpleTariffCarbon;

    return {
        rate,
        currentTariffCarbonIntensity: CURRENT_TARIFF_CARBON_INTENSITY,
        simpleTariffCarbonIntensity: SIMPLE_TARIFF_CARBON_INTENSITY,
        comparisons,
        totalActualCost,
        totalCalculatedCost,
        totalSavings,
        totalSavingsPercentage,
        totalCurrentTariffCarbon,
        totalSimpleTariffCarbon,
        totalCarbonSavings,
    };
};
