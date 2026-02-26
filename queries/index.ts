const API_URL = 'https://api.oejp-kraken.energy/v1/graphql/';

export type GraphQLRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: any[];
};

export const callGraphQL = async <T>(
  token: string,
  request: GraphQLRequest
): Promise<GraphQLResponse<T>> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `JWT ${token}`,
    },
    body: JSON.stringify(request),
  });

  const responseData = await response.json() as GraphQLResponse<T>;

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (responseData.errors) {
    console.error('❌ API returned errors:', responseData.errors);
    throw new Error('API request failed with errors');
  }

  return responseData;
};
