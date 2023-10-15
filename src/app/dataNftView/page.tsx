'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataNft } from '@itheum/sdk-mx-data-nft';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function DataNftView() {
  const searchParams = useSearchParams();
  const [dataNftView, setDataNftView] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);

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
      setDataNftLoading(false);
    }

    fetchNftView();
  }, [nonce, nativeAuthToken]);

  const generateDescription = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setGenerating(true);
    setResponse('');
    try {
      const hello = await axios('/api/hello');
      console.log('hello', hello);
      const res = await axios('/api/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify({ dataStream: dataNftView }),
        responseType: 'stream'
      });

      const responseData = res.data;
      setResponse(responseData);
      setGenerating(false);
    } catch (error) {
      console.log('error while generating description', error);
      setGenerating(false);
    }
  };

  return (
    <div>
      <pre className='max-h-[60vh] p-10 border-b border-gray-600'>
        {dataNftLoading ? (
          <div className='text-center w-full'><FontAwesomeIcon
          icon={faSpinner}
          className='text-muted fa-spin-pulse text-4xl'
        /></div>
        ) : (
          <div></div>
        )}
        {dataNftView}
      </pre>
      <button
        disabled={dataNftLoading && generating}
        className='my-1 mx-5 bg-blue-600 text-white p-2.5 rounded min-w-[150px]'
        onClick={generateDescription}
        style={{
          opacity: dataNftLoading ? 0.4 : 1
        }}
      >
        {generating ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className='text-muted fa-spin-pulse text-white'
          />
        ) : (
          'Generate AI Description'
        )}
      </button>
      <p className='p-10'>{response}</p>
    </div>
  );
}
