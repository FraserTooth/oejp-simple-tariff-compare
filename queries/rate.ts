import prompts from 'prompts';

export const getQuotedRate = async (): Promise<number> => {
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
