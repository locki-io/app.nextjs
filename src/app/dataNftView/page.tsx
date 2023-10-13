'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataNft } from '@itheum/sdk-mx-data-nft';

export default function DataNftView() {
  const searchParams = useSearchParams();
  const [dataNftView, setDataNftView] = useState('');

  const nonce: string = searchParams?.get('nonce') || '0';
  const nativeAuthToken = searchParams?.get('nativeAuthToken');

  useEffect(() => {
    async function fetchNftView() {
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
          authorization: `Bearer ${nativeAuthToken}`
        }
      });

      if (!res?.error) {
        const resDataNft = await (res.data as Blob).text();

        // const blobUrl = URL.createObjectURL(message.data);
        setDataNftView(resDataNft);
      }
    }

    fetchNftView();
  }, []);

  return (
    <div>
      <pre>{dataNftView}</pre>
    </div>
  );
}
