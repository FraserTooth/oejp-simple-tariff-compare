export type BillComparison = {
    billId: string;
    fromDate: string;
    toDate: string;
    totalKwh: number;
    actualPreTaxCost: number;
    calculatedCost: number;
    savings: number;
    savingsPercentage: number;
    isOverpaying: boolean;
    currentTariffCarbon: number;
    simpleTariffCarbon: number;
    carbonSavings: number;
};

export type BillComparisonResult = {
    rate: number;
    currentTariffCarbonIntensity: number;
    simpleTariffCarbonIntensity: number;
    comparisons: BillComparison[];
    totalActualCost: number;
    totalCalculatedCost: number;
    totalSavings: number;
    totalSavingsPercentage: number;
    totalCurrentTariffCarbon: number;
    totalSimpleTariffCarbon: number;
    totalCarbonSavings: number;
};
