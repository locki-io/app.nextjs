'use client';

import React, { useEffect, useState } from 'react';
import { DataNft } from '@itheum/sdk-mx-data-nft/out';
import { ExtendedDataNft } from '../context/store';
import { useGetAccount, useGetPendingTransactions } from 'hooks';
import { DataNftsContext } from '../context/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Inter } from 'next/font/google';
import Chat from '@/components/Chat/Chat';

import { HeaderComponent } from '../../components/Layout/HeaderComponent';
import { DataNftCard } from '@/components/DataNfts';
import SelectedDataPreview from '@/components/DataNfts/SelectedDataPreview';
import Providers from '@/components/Chat/Provider';

const SUPPORTED_COLLECTIONS = [
  'DATANFTFT-e0b917',
  'I3TICKER-03e5c2',
  'COLNAMA-539838'
];

const SUPPORTED_FORMATS = ['gltf', 'glb'];

const inter = Inter({ subsets: ['latin'] });

const DataNfts = () => {
  const { address } = useGetAccount();
  const [dataNftCount, setDataNftCount] = useState<number>(0);
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [dataNfts, setDataNfts] = useState<ExtendedDataNft[]>([]);

  DataNft.setNetworkConfig('devnet');

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchData();
    }
  }, [hasPendingTransactions]);

  async function fetchData() {
    setIsLoading(true);
    const _dataNfts: ExtendedDataNft[] = [];
    const nfts = await DataNft.ownedByAddress(address, SUPPORTED_COLLECTIONS);
    let currentIndex = 0;
    _dataNfts.push(
      ...nfts
        .filter((nft: any) => {
          // Get the file extension from the dataPreview URL
          const extension = nft.dataPreview.split('.').pop()?.toLowerCase();
          // Check if the extension is included in the supported formats array
          return SUPPORTED_FORMATS.includes(extension);
        })
        .map((nft: any) => ({
          ...nft,
          index: currentIndex++, // Increment and assign the index
          dataNftSelected: false // Set dataNftSelected to false initially
        }))
    
    );

    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }

  const updateDataNftSelected = (index: number, selected: boolean) => {
    setDataNfts((prevDataNfts: ExtendedDataNft[]) => {
      return prevDataNfts.map((item) => {
        if (item.index === index) {
          return { ...item, dataNftSelected: selected };
        }
        return item;
      }) as ExtendedDataNft[];
    });
  };
  return (
    <Providers>
      <DataNftsContext.Provider value={dataNfts}>
        <div className={inter.className} id='Library'>
          <Chat />
          <div className='p-5'>
            <SelectedDataPreview />
            {isLoading ? (
              <div className='text-gray-200 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className='text-muted fa-spin-pulse text-4xl'
                />
              </div>
            ) : (
              <HeaderComponent
                pageTitle={'Your DataNFT Library'}
                hasImage={false}
                pageSubtitle={'Data NFTs Count:'}
                dataNftCount={dataNftCount}
              >
                {dataNfts.length > 0 ? (
                  dataNfts.map((dataNft, index) => (
                    <DataNftCard
                      key={index}
                      index={index}
                      isLoading={isLoading}
                      dataNft={dataNft}
                      nonce={dataNft.nonce}
                      owned={true}
                      isWallet={true}
                      updateDataNftSelected={updateDataNftSelected}
                    /> /*end of datanft card*/
                  ))
                ) : (
                  <h4 className='no-items'>
                    <div>
                      You do not own any Data NFTs yet. Browse and you can mint
                      NFT on the page...
                    </div>
                  </h4>
                )}
              </HeaderComponent>
            )}{' '}
          </div>
        </div>
      </DataNftsContext.Provider>
    </Providers>
  );
};
export default DataNfts;
