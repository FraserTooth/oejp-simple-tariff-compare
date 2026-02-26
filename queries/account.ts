import ora from 'ora';
import { callGraphQL } from './index';

export const GET_ACCOUNT_BODY = `
  query accountViewer {
    viewer {
      accounts {
        number
      }
    }
  }
`;

export const getAccountNumber = async (token: string): Promise<string> => {
    const spinner = ora('Retrieving account number...').start();
    try {
        const responseData = await callGraphQL<{ viewer: { accounts: { number: string }[] } }>(token, {
            query: GET_ACCOUNT_BODY,
        });

        if (!responseData.data?.viewer?.accounts?.[0]?.number) {
            spinner.fail('❌ Could not retrieve account number');
            throw new Error('Could not retrieve account number from API response');
        }

        const accountNumber = responseData.data.viewer.accounts[0].number;
        spinner.succeed(`✓ Successfully retrieved account number: ${accountNumber}`);
        return accountNumber;
    } catch (error) {
        spinner.stop();
        throw error;
    }
};
