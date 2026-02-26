// Auth types
export type ObtainTokenResponse = {
    data?: {
        obtainKrakenToken?: {
            token: string;
        }
    };
    errors?: any[];
};

// Bill types
export type BillInformation = {
    billId: string;
    fromDate: string;
    toDate: string;
    issuedDate: string;
    totalKwh: number;
    preTaxCost: number;
    taxAmount: number;
    totalCost: number;
};

export type GetBillInformationResponse = {
    data?: {
        account?: {
            ledgers?: Array<{
                number: string;
                statements?: {
                    edges?: Array<{
                        node: {
                            id: string;
                            identifier: string;
                            startAt: string;
                            endAt: string;
                            firstIssuedAt: string;
                            totalCharges?: {
                                netTotal: number;
                                taxTotal: number;
                                grossTotal: number;
                            };
                            transactions?: {
                                edges?: Array<{
                                    node: {
                                        __typename?: 'BillCharge' | 'BillCredit';
                                        id?: string;
                                        postedDate?: string;
                                        title?: string;
                                        note?: string;
                                        reasonCode?: string;
                                        consumption?: {
                                            startDate: string;
                                            endDate: string;
                                            quantity: string;
                                            unit: string;
                                        };
                                        amounts?: {
                                            net: number;
                                            tax: number;
                                            gross: number;
                                        };
                                    };
                                }>;
                            };
                        };
                    }>;
                };
            }>;
        };
    };
    errors?: any[];
};

// Charges types
export type LineItem = {
    supplyType?: string;
    periodStartAt?: string;
    periodEndAt?: string;
    numberOfUnits?: string;
    netAmount?: string;
    grossAmount?: string;
    currency?: string;
    productCode?: string;
    contractedCapacityUnit?: string;
    contractedCapacityValue?: string;
};

export type GetChargesResponse = {
    data?: {
        charges?: Array<{
            grossAmount: string;
            salesTaxAmount: string;
            lineItems: LineItem[];
        }>;
    };
    errors?: any[];
};
