'use client';

import { useDataNftMint } from '@/hooks';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useState } from 'react';

export default function Tradedata() {
  const [isMinting, setIsMinting] = useState(false);
  const accountInfo = useGetAccountInfo();
  const { mint } = useDataNftMint(accountInfo?.address);
  const handleMintBtnClick = async () => {
    setIsMinting(true);
    await mint(
      'Locki1001',
      'https://s3.eu-central-1.amazonaws.com/dataassets.locki.io/dataStreams/stackedCubes2.py',
      'https://s3.eu-central-1.amazonaws.com/dataassets.locki.io/dataPreviews/stackedCubes2+(1).glb',
      10,
      'Stacked Cubes',
      'Creator Description'
    );
    setIsMinting(false);
  };
  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex flex-col'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 '>
          <button
            className='bg-blue-200 text-blue-600 p-2.5 rounded min-w-[150px] mt-5 mr-5'
            onClick={handleMintBtnClick}
            style={{
              whiteSpace: 'pre-line'
            }}
          >
            {isMinting ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className='text-muted  fa-spin-pulse text-white'
              />
            ) : (
              'Mint the code as Data Nft'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
