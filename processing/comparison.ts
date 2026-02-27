import type { BillInformation } from '../queries/types';
import type { BillComparison, BillComparisonResult } from './types';
import { calculateCurrentTariffCarbonIntensity, calculateSimpleTariffCarbonIntensity } from './carbon';
import { getRenewableSurcharge } from '../queries/rate';
import { DateTime } from 'luxon';

// Carbon intensity in gCO2/kWh
// Both current and simple tariffs are calculated from breakdown by energy source
// TODO - Aquire automatically, in case it changes over time, or varies by region
const CURRENT_TARIFF_CARBON_INTENSITY = calculateCurrentTariffCarbonIntensity();
const SIMPLE_TARIFF_CARBON_INTENSITY = calculateSimpleTariffCarbonIntensity();

export const calculateBillComparison = (bills: BillInformation[], simpleRate: number): BillComparisonResult => {
    const comparisons: BillComparison[] = [];
    let totalActualCost = 0;
    let totalCalculatedCost = 0;
    let totalCurrentTariffCarbon = 0;
    let totalSimpleTariffCarbon = 0;

    for (const bill of bills) {
        // Parse bill reading end date in JST
        const billReadingEndDate = DateTime.fromISO(bill.toDate, { zone: 'Asia/Tokyo' });

        // Get renewable surcharge for this bill
        const renewableSurchargeRate = getRenewableSurcharge(billReadingEndDate);
        const renewableSurchargeCost = bill.totalKwh * renewableSurchargeRate;

        // Calculate total cost: base rate + renewable surcharge
        const calculatedCost = (bill.totalKwh * simpleRate) + renewableSurchargeCost;
        const savings = bill.preTaxCost - calculatedCost;
        const savingsPercentage = (savings / bill.preTaxCost) * 100;
        const isOverpaying = bill.preTaxCost > calculatedCost;

        // Calculate carbon emissions
        const currentTariffCarbon = bill.totalKwh * CURRENT_TARIFF_CARBON_INTENSITY;
        const simpleTariffCarbon = bill.totalKwh * SIMPLE_TARIFF_CARBON_INTENSITY;
        const carbonSavings = currentTariffCarbon - simpleTariffCarbon;

        const comparison: BillComparison = {
            billId: bill.billId,
            fromDate: bill.fromDate,
            toDate: bill.toDate,
            totalKwh: bill.totalKwh,
            actualPreTaxCost: bill.preTaxCost,
            renewableSurchargeRateYenPerKwh: renewableSurchargeRate,
            renewableSurchargeCost,
            calculatedCost,
            savings,
            savingsPercentage,
            isOverpaying,
            currentTariffCarbon,
            simpleTariffCarbon,
            carbonSavings,
        }

        // console.debug(comparison);

        comparisons.push(comparison);

        totalActualCost += bill.preTaxCost;
        totalCalculatedCost += calculatedCost;
        totalCurrentTariffCarbon += currentTariffCarbon;
        totalSimpleTariffCarbon += simpleTariffCarbon;
    }

    const totalSavings = totalCalculatedCost - totalActualCost;
    const totalSavingsPercentage = (totalSavings / totalActualCost) * 100;
    const totalCarbonSavings = totalCurrentTariffCarbon - totalSimpleTariffCarbon;

    return {
        rate: simpleRate,
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
