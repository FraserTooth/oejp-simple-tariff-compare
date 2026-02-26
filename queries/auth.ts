import ora from 'ora';
import type { ObtainTokenResponse } from './types';
import { getCredentials } from './credentials';

const API_URL = 'https://api.oejp-kraken.energy/v1/graphql/';

export const AUTH_BODY = `
  mutation obtainKrakenToken($input: ObtainJSONWebTokenInput!) {
    obtainKrakenToken(input: $input) {
      refreshToken
      refreshExpiresIn
      payload
      token
    }
  }
`;

export const getOEJPAuthToken = async (): Promise<string> => {
    const { email, password } = await getCredentials();

    const spinner = ora('Obtaining authentication token...').start();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: AUTH_BODY,
                variables: {
                    input: {
                        email,
                        password,
                    },
                },
            }),
        });

        const responseData = await response.json() as ObtainTokenResponse;

        const token = responseData?.data?.obtainKrakenToken?.token;

        if (responseData?.errors) {
            spinner.fail('❌ API returned errors');
            throw new Error('API request failed with errors');
        } else {
            if (!response.ok || !token) {
                spinner.fail(`❌ API request failed with status ${response.status}`);
                throw new Error(`API request failed with status ${response.status}`);
            }
        }

        spinner.succeed('✓ Successfully obtained authentication token.');
        return token;
    } catch (error) {
        spinner.stop();
        throw error;
    }
};
