import React, { createContext, useContext } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";

export const DataNftsContext = createContext<DataNft[]>([]);

export const useDataNfts = () => useContext(DataNftsContext);

interface SelectedDataNft extends DataNft {
  selected: boolean;
}

export const SelectedDataNftsContext = createContext<SelectedDataNft[]>([]);

export const useSelectedDataNfts = () => useContext(SelectedDataNftsContext);