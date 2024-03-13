import { DataNft } from '@itheum/sdk-mx-data-nft';

export async function getStreamWithNonce(
  nonce: number,
  tokenLoginNativeAuthToken: string | undefined
) {
  if (nonce) {
    DataNft.setNetworkConfig('devnet');
    const decodedNft: DataNft = await DataNft.createFromApi({
      nonce: Number(nonce)
    });

    const res = await decodedNft.viewDataViaMVXNativeAuth({
      mvxNativeAuthOrigins: [
        'localhost',
        'http://localhost:3000',
        'https://app.locki.io',
        'https://2rkm8gkhk7.execute-api.eu-central-1.amazonaws.com'
      ],
      mvxNativeAuthMaxExpirySeconds: 86400,
      fwdHeaderMapLookup: {
        authorization: `Bearer ${tokenLoginNativeAuthToken}`
      }
    });

    if (!res?.error) {
      const contentType = res.contentType || ''; // Make sure contentType is not null or undefined
      if (contentType.startsWith('text/plain')) {
        return await (res.data as Blob).text();
      } else {
        return 'Binary data';
      }
    }
  }
  return null;
}
