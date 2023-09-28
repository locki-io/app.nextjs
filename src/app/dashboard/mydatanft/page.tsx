'use client';

import React, { useEffect, useState } from 'react';
import {
  useGetAccount,
  useGetActiveTransactionsStatus,
  useGetNetworkConfig
} from '@multiversx/sdk-dapp/hooks';
import { ServerTransactionType } from '@multiversx/sdk-dapp/types';
import { faBan, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { AxiosError } from 'axios';
import { apiTimeout, contractAddress, transactionSize } from '@/config';
import { DataNftCardLayout } from '@/components/DataNftCard/DataNftCardLayout';
import { DataNftBoardLayout } from '@/components/DataNftBoard/DataNftBoardLayout';
import { Loader, PageState, TransactionsTable } from '@/components';
import { DataNft, dataNftTokenIdentifier } from '@itheum/sdk-mx-data-nft';

const DataNftPage = () => {
  const {
    network: { apiAddress }
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { success, fail } = useGetActiveTransactionsStatus();

  const [dataNfts, setDataNfts] = useState<ServerTransactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchDataNfts = async () => {
    const dataNfts = [];
    try {
      setIsLoading(true);
      const dataNfts = await DataNft.ownedByAddress(address);
    } catch (err) {
      const { message } = err as AxiosError;
      setError(message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (success || fail) {
      fetchDataNfts();
    }
  }, [success, fail]);

  useEffect(() => {
    fetchDataNfts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='my-5'>
        <PageState
          icon={faBan}
          className='text-muted'
          title='Error retrieving DATANFTs.'
        />
      </div>
    );
  }

  if (dataNfts.length === 0) {
    return (
      <div className='my-5'>
        <PageState
          icon={faExchangeAlt}
          className='text-muted'
          title='No DataNFT'
        />
      </div>
    );
  }

  //JNS return <DataNftCardLayout dataNfts={dataNfts} />;

};


export default function mydatanft() {
  return (
    <DataNftBoardLayout>
      <DataNftPage />
    </DataNftBoardLayout>
  );
}
