'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataNft } from '@itheum/sdk-mx-data-nft';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useStoreCreatorsDescription } from '@/components/DataNftView/Actions/helpers/useStoreCreatorsDescription';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function DataNftView() {
  const searchParams = useSearchParams();
  const [dataNftView, setDataNftView] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const [readyToSend, setReadyToSend] = useState(false);
  const [sending, setSending] = useState(false);
  const { callContractToStoreDescription } = useStoreCreatorsDescription();

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
      const res = await axios('/api/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify({ dataStream: dataNftView })
      });

      const responseData = res.data;
      setResponse(responseData);
      setReadyToSend(true);
      setGenerating(false);
    } catch (error) {
      console.log('error while generating description', error);
      setGenerating(false);
    }
  };
  const sendingToSc = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      callContractToStoreDescription(Number(nonce), response);
    } catch (error) {
      console.log('error while sending to SC', error);
      setSending(false);
    }
  };
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(dataNftView);
  };
  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex flex-col'>
        <div
          className='flex-1 bg-code bg-cover text-gray-200 max-h-full p-10 border-b border-gray-600 relative overflow-y-auto'
          style={{ whiteSpace: 'pre-line' }}
        >
          {dataNftLoading ? (
            <div className='text-gray-200 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <FontAwesomeIcon
                icon={faSpinner}
                className='text-muted fa-spin-pulse text-4xl'
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <SyntaxHighlighter language='python' style={arta}>
                {dataNftView}
              </SyntaxHighlighter>
              <button
                onClick={copyCodeToClipboard}
                className='absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-200'
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          )}
        </div>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 '>
          <button
            disabled={dataNftLoading && generating}
            className='bg-blue-200 text-blue-600 p-2.5 rounded min-w-[150px] mt-5 mr-5'
            onClick={generateDescription}
            style={{
              whiteSpace: 'pre-line',
              opacity: dataNftLoading ? 0.4 : 1
            }}
          >
            {generating ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className='text-muted  fa-spin-pulse text-white'
              />
            ) : (
              'Generate AI Description'
            )}
          </button>
          <button
            disabled={!readyToSend}
            className='bg-blue-200 text-blue-600 p-2.5 rounded min-w-[150px] mt-5 mr-5'
            onClick={sendingToSc}
            style={{
              whiteSpace: 'pre-line',
              opacity: readyToSend && !sending ? 1 : 0.4
            }}
          >
            {sending ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className='text-muted  fa-spin-pulse text-white'
              />
            ) : (
              'Send AI description to the world (SC)'
            )}
          </button>
        </div>
      </div>
      <div
        className='flex-1 bg-description bg-cover text-blue-200 p-10'
        style={{ whiteSpace: 'pre-line' }}
      >
        {response}
        {/* <button
          hidden={!readyToSend}
          disabled={sending}
          className='absolute bottom-0 right-0 bg-blue-200 text-blue-600 p-2.5 rounded min-w-[150px] mt-5 mr-5'
          onClick={sendingToSc}
          style={{
            opacity: sending ? 0.4 : 1
          }}
        >
          {sending ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className='text-muted  fa-spin-pulse text-white'
            />
          ) : (
            'Send AI description to the world (SC)'
          )}
        </button> */}
      </div>
    </div>
  );
}
