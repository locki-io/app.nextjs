'use client';

import { useGetAccount, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';

export default function Profile() {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();

  const copyToClipBoard = async () => {
    navigator.clipboard.writeText(tokenLogin?.nativeAuthToken || '');
  };

  return (
    <div className='bg-white w-4/5 mx-auto mt-5 p-5 rounded'>
      <div className='info-container'>
        <p className='label'>Address</p>
        <p className='info-value'>{address}</p>
      </div>
      <div className='info-container'>
        <p className='label'>Native Auth Token</p>
        <p className='info-value'>{tokenLogin?.nativeAuthToken || ''}</p>
        <button
          className='bg-gray-300 p-2.5 rounded min-w-[100px]'
          onClick={copyToClipBoard}
        >
          Copy to the ClipBoard
        </button>
      </div>
    </div>
  );
}
