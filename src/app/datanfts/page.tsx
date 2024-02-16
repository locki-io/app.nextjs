'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";

import { Loader } from "components";
import { HeaderComponent} from "../../components/Layout/HeaderComponent";
import { DataNftCard } from "@/components/DataNfts";

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
  const [ dataNfts, setDataNfts ] = useState<DataNft[]>([]);
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

    _dataNfts.push(...nfts);
    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }
  async function viewNormalData(index: number) {
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }
    // code for retrieving data
    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);

    const dataNft = dataNfts[index];
    let res: any;
    if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
      throw Error("No nativeAuth token");
    }

    const arg = {
      mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
      mvxNativeAuthMaxExpirySeconds: 36000,
      fwdHeaderMapLookup: {
        "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
      },
    };
    res = await dataNft.viewDataViaMVXNativeAuth(arg);
        
    let blobDataType = BlobDataType.TEXT;
    
    // res.data = await (res.data as Blob).text();

    // the res.error in threejs prevents this from loading
    if (!res.error) {
      // in our case is is going to be text
      res.data = await (res.data as Blob).text();
    } else {
      //alert(`res.error`);
      console.error(res.error);
      toastError(res.error);
    }
    const viewDataPayload: ExtendedViewDataReturnType = {
      ...res,
      blobDataType,
    };
    
    setViewDataRes(viewDataPayload);
    setIsFetchingDataMarshal(false);
  }
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <DataNftsContext.Provider value={dataNfts}>
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


