import React, { createContext, useContext } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";

export interface ExtendedDataNft extends DataNft {
  dataNftSelected: boolean;
}

export const DataNftsContext = createContext<ExtendedDataNft[]>([]);

export const useDataNfts = () => useContext(DataNftsContext);