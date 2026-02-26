import prompts from 'prompts';

export const getCredentials = async (): Promise<{ email: string; password: string }> => {
    // Check environment variables first (for development/automation)
    const envEmail = process.env.OEJP_EMAIL;
    const envPassword = process.env.OEJP_PASSWORD;

    if (envEmail && envPassword) {
        console.log('✓ Using credentials from environment variables');
        return { email: envEmail, password: envPassword };
    }

    // Fall back to interactive prompts
    console.log('🔐 Credentials needed for OEJP authentication\n');

    const response = await prompts([
        {
            type: 'text',
            name: 'email',
            message: 'Email:',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:',
        },
    ]);

    if (!response.email || !response.password) {
        throw new Error('Email and password are required');
    }

    return { email: response.email, password: response.password };
};
