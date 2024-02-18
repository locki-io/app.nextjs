'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { ExtendedDataNft } from "../context/store";

import { Loader } from "components";
import { HeaderComponent} from "../../components/Layout/HeaderComponent";
import { DataNftCard } from "@/components/DataNfts";
import SelectedDataPreview from "@/components/DataNfts/SelectedDataPreview";

import { useGetAccount, useGetLoginInfo, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { decodeNativeAuthToken, toastError } from "libs/utils";

import { DataNftsContext } from "../context/store";


interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

const SUPPORTED_COLLECTIONS = ["DATANFTFT-e0b917", "I3TICKER-03e5c2", "COLNAMA-539838"]

const DataNfts = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const [ dataNftCount, setDataNftCount ] = useState<number>(0);
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ dataNfts, setDataNfts ] = useState<ExtendedDataNft[]>([]);
  const [ viewDataRes, setViewDataRes ] = useState<ExtendedViewDataReturnType>();
  const [ isFetchingDataMarshal, setIsFetchingDataMarshal ] = useState<boolean>(true);
  
  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchData();
    }
  }, [hasPendingTransactions]);

  async function fetchData() {
    DataNft.setNetworkConfig('devnet');
    setIsLoading(true);

    const _dataNfts = [];
    const nfts = await DataNft.ownedByAddress(address, SUPPORTED_COLLECTIONS);

    _dataNfts.push(
      ...nfts.map((nft: any) => ({
          ...nft,
          dataNftSelected: false, // Set dataNftSelected to false initially
      }))
  );
    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }
  
  if (isLoading) {
    return <Loader />;
  }
  const updateDataNftSelected = (nonce: number, selected: boolean) => {
    setDataNfts((prevDataNfts: ExtendedDataNft[]) => {
      return prevDataNfts.map(item => {
        if (item.nonce === nonce) {
          return { ...item, dataNftSelected: selected };
        }
        return item;
      }) as ExtendedDataNft[];
    });
  };
  return (
    <DataNftsContext.Provider value={dataNfts}>
      <SelectedDataPreview />
      <HeaderComponent pageTitle={"Display Data NFT's"} hasImage={false} pageSubtitle={"Data NFTs Count:"} dataNftCount={dataNftCount}>
        {dataNfts.length > 0 ? (
          dataNfts.map((dataNft, index) => (
            <DataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              nonce={dataNft.nonce}
              isLoading={isLoading}
              owned={true}
              isWallet={true}
              updateDataNftSelected={updateDataNftSelected}
              /> /*end of datanft card*/
          ))
        ) : (
          <h4 className="no-items">
            <div>
              You do not own any Data NFTs yet. Browse and you can mint NFT on the page...
            </div>
          </h4>
        )}
      </HeaderComponent> 
      
 
    </DataNftsContext.Provider>
  );
}
export default DataNfts;


