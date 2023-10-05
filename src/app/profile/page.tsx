'use client';

import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoding] = useState(false);

  const getApiKey = async () => {
    try {
      setLoding(true);
      if (tokenLogin?.nativeAuthToken) {
        const apiKeyResponse = await axios.get(
          'https://2rkm8gkhk7.execute-api.eu-central-1.amazonaws.com/Prod/apiKey',
          {
            headers: {
              Authorization: tokenLogin.nativeAuthToken
            }
          }
        );
        setApiKey(apiKeyResponse?.data?.apiKey);
      }
      setLoding(false);
    } catch (error) {
      console.log('error', error);
      setLoding(false);
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
        <button
          disabled={loading}
          className='bg-gray-300 p-2.5 rounded min-w-[100px]'
          onClick={getApiKey}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className='text-muted fa-spin-pulse' />
          ) : (
            'Get Api Key'
          )}
        </button>
      </div>
    </div>
  );
}
