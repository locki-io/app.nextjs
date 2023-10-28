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
       <div className=' mx-auto text-center'> 
        <a 
          href='https://github.com/locki-io/locki_id_addon'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-blue-500 mx-auto text-white p-2.5 rounded mt-3 text-center'
        >
          Visit our GitHub for instruction and install the blender addon !
        </a>
        </div>
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
      {/* Add a link button to a GitHub page */}
      <div className='mt-5 mx-auto text-center'>
        <div className='mt-3 bg-white'>
        We are on devnet, testing this in alpha phase. SAFU and NFT are given for you to try.
        Your erd address and your NativeAthToken are required into Blender addon.
        This will allow to use the 3D NFT within the addon.
        </div>
        
        {/* Embed a YouTube video */}
        <div className='mt-3'>
          <iframe 
            width="560" height="315" 
            src="https://www.youtube.com/embed/wy_onMYQn3Q?si=YrOV5mrSOtPagLoW" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
