'use client';

import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useState } from 'react';

export default function Profile() {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const [copied, setCopied] = useState(false);

  const copyToClipBoard = async () => {
    navigator.clipboard.writeText(tokenLogin?.nativeAuthToken || '');
    setCopied(true);
  };

  return (
    <div className='w-4/5 mx-auto mt-5 p-5 rounded'>
      <div className='info-container'>
        <p className='label'>Address</p>
        <p className='info-value text-blue-200'>{address}</p>
      </div>
      <div className='info-container'>
        <p className='label'>Native Auth Token</p>
        <p className='info-value text-blue-200 text-ellipsis overflow-hidden'>{tokenLogin?.nativeAuthToken || ''}</p>
        <button
          className='bg-gray-300 p-2.5 rounded min-w-[100px]'
          onClick={copyToClipBoard}
        >
          Copy to the ClipBoard
        </button>
        {copied ? <p className='text-sm text-green-600'>Copied to ClipBoard</p> : <></>}
      </div>
    </div>
  );
}
