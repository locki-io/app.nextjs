'use client';

import { NativeAuthClient } from '@/components/nativeAuthClient';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { useState } from 'react';
import { signMessage } from '@multiversx/sdk-dapp/utils';
import axios from 'axios';

export default function Profile() {
  const { address } = useGetAccount();
  const [apiKey, setApiKey] = useState('');

  const getApiKey = async () => {
    try {
      const client = new NativeAuthClient({
        apiUrl: 'https://devnet-api.multiversx.com',
        expirySeconds: 60 * 60 * 24,
        blockHashShard: 0
      });
      const init = await client.initialize();

      const signableMessage = await signMessage({
        message: `${address}${init}`
      });
      const signatureJson: any = signableMessage?.toJSON();
      const nativeAuthToken = client.getToken(
        address,
        init,
        signatureJson?.signature
      );
      console.log('nativeAuthToken', nativeAuthToken);

      const apiKeyResponse = await axios.get(
        'https://o9rbpcvsw0.execute-api.eu-central-1.amazonaws.com/Prod/token',
        {
          headers: {
            Authorization: nativeAuthToken
          }
        }
      );
      console.log('apiKeyResponse', apiKeyResponse);
      setApiKey(apiKeyResponse?.data?.apiKey);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className='bg-white w-4/5 mx-auto mt-5 p-5 rounded'>
      <div className='info-container'>
        <p className='label'>Address</p>
        <p className='info-value'>{address}</p>
      </div>
      <div className='info-container'>
        <p className='label'>API Key</p>
        <p className='info-value'>{apiKey}</p>
        <button className='bg-gray-300 p-2.5 rounded' onClick={getApiKey}>
          Get Api Key
        </button>
      </div>
    </div>
  );
}
