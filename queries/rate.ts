import prompts from 'prompts';
import { DateTime } from 'luxon';

/**
 * Renewable energy surcharge data
 * Source: https://pps-net.org/statistics/renewable
 */
export interface RenewableEnergySurcharge {
    fiscalYear: number; // Fiscal year (e.g., 2021 for 2021年度)
    startDate: DateTime; // Start date at midnight JST (inclusive)
    endDate: DateTime; // End date at midnight JST (exclusive)
    rateYenPerKwh: number; // Surcharge rate in yen/kWh
}

/**
 * Renewable energy surcharge table by fiscal year
 * Reference: https://pps-net.org/statistics/renewable
 */
export const renewableEnergySurchargeTable: RenewableEnergySurcharge[] = [
    {
        fiscalYear: 2021,
        startDate: DateTime.fromISO('2021-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        endDate: DateTime.fromISO('2022-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        rateYenPerKwh: 3.36,
    },
    {
        fiscalYear: 2022,
        startDate: DateTime.fromISO('2022-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        endDate: DateTime.fromISO('2023-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        rateYenPerKwh: 3.45,
    },
    {
        fiscalYear: 2023,
        startDate: DateTime.fromISO('2023-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        endDate: DateTime.fromISO('2024-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        rateYenPerKwh: 1.40,
    },
    {
        fiscalYear: 2024,
        startDate: DateTime.fromISO('2024-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        endDate: DateTime.fromISO('2025-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        rateYenPerKwh: 3.49,
    },
    {
        fiscalYear: 2025,
        startDate: DateTime.fromISO('2025-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        endDate: DateTime.fromISO('2026-05-01T00:00:00', { zone: 'Asia/Tokyo' }),
        rateYenPerKwh: 3.98,
    },
];

export const getSimpleTariffRate = async (): Promise<number> => {
    // Check environment variable first (for development/automation)
    const envRate = process.env.SIMPLE_RATE;

    if (envRate) {
        const rate = parseFloat(envRate);
        if (!isNaN(rate) && rate > 0) {
            console.log(`✓ Using quoted rate from environment variable: ¥${rate.toFixed(2)}/kWh`);
            return rate;
        }
    }

    // Fall back to interactive prompt
    console.log('💰 Enter your quoted simple tariff rate\n');

    const response = await prompts({
        type: 'text',
        name: 'rate',
        message: 'Rate (¥/kWh):',
        validate: (value: string) => {
            const num = parseFloat(value);
            if (isNaN(num) || num <= 0) {
                return 'Rate must be a valid number greater than 0';
            }
            return true;
        },
    });

    if (!response.rate) {
        throw new Error('A valid rate is required');
    }

    const rate = parseFloat(response.rate);
    if (isNaN(rate) || rate <= 0) {
        throw new Error('A valid rate is required');
    }

    return rate;
};

export const getRenewableSurcharge = (billReadingEndDate: DateTime): number => {
    // Look up renewable energy surcharge for this reading end date
    const surcharge = renewableEnergySurchargeTable.find(
        (entry) => billReadingEndDate >= entry.startDate && billReadingEndDate < entry.endDate
    );

    if (surcharge) {
        return surcharge.rateYenPerKwh;
    } else {
        throw new Error(`No renewable energy surcharge data found for reading end date ${billReadingEndDate.toISO()}`);
    }
};
