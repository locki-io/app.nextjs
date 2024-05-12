export const dAppName = 'Locki Dapp';

// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = '9b1a9564f91cb659ffe21b73d5c4e2d8';

export const apiTimeout = 6000;
export const transactionSize = 15;
export const TOOLS_API_URL = 'https://tools.multiversx.com';
/**
 * Calls to these domains will use `nativeAuth` Baerer token
 */
export const sampleAuthenticatedDomains = [TOOLS_API_URL];

export const DATA_MARSHALL_URL: Record<string, string> = {
  devnet: 'https://api.itheumcloud-stg.com/datamarshalapi/router/v1',
  mainnet: '',
};
