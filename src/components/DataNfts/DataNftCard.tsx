'use client';

import React, { createContext, useContext, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { Card, CardTitle, CardContent, CardDescription, CardFooter } from "./Card";
import ScriptComponent from "@/components/DataNfts/ScriptComponent";

import LoaderCanvas from "./LoaderCanvas";
import { Canvas } from '@react-three/fiber';

export function DataNftCard({
  index,
  dataNft,
  isLoading,
  nonce,
  owned,
  isWallet,
}: {
  index: number;
  dataNft: DataNft;
  isLoading: boolean;
  nonce: number;  
  owned: boolean;
  isWallet: boolean;
}) {
  
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();

  const [selectedNonces, setSelectedNonces] = useState<number[]>([]);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);

  const handleCardClick = () => {
    // Update the selected state in the context
    //   setDataNfts(prevDataNfts => {
    //   return prevDataNfts.map((item, i) => {
    //     if (i === index) {
    //       return { ...item, selected: !item.selected } as SelectedDataNft;
    //     }
    //     return item;
    //   });
    // });
    if (selectedNonces.includes(nonce)) {
      setSelectedNonces((prevNonces) => prevNonces.filter((n) => n !== nonce));
    } else {
      setSelectedNonces((prevNonces) => [...prevNonces, nonce]);
    }
  };

  return (
  <>
    <div
      className={`mb-3 flex text-white ${
        selectedNonces.includes(nonce) ? "border-4 border-green-500" : ""
      }`}
      onClick={handleCardClick}
    >
      <Card className="flex-1 p-1 border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-black rounded-[2.37rem] base:w-[18.5rem] md:w-[23.6rem]">
        <CardContent className="flex flex-col p-3">
          <CardTitle className="grid grid-cols-8 mb-1">
            <span className="col-span-8 text-center base:text-sm md:text-base">Title : {dataNft.title}</span>
          </CardTitle>
            <div >
              <Canvas camera={{ position: [1, 1, 10] }}>
                <ambientLight intensity={0.3} />
                <directionalLight color="white" position={[0, 0, 5]} />
                <LoaderCanvas glbFileLink={dataNft.dataPreview}/>
              </Canvas>
            </div>

            <CardDescription className="grid grid-cols-8 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Description:</span>
            <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.description}</span>
          </CardDescription>
          <div className="grid grid-cols-12 mb-1">
            <span className="col-span-4 opacity-6 base:text-sm md:text-base">Balance:</span>
            <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.balance.toString()}</span>
          </div>

          <div className="">
            {isWallet ? (
              <div className="pt-5 pb-3 text-center">
                <h6 className="base:!text-sm md:!text-base" style={{ visibility: owned ? "visible" : "hidden" }}>
                  You have this Data NFT
                </h6>
              </div>
            ) : (
              <div>
                <h6 className="base:!text-sm md:!text-base" style={{ visibility: owned ? "visible" : "hidden" }}>
                You don&apos;t have this Data NFT
                </h6>
              </div>
            )}

            <CardFooter className="flex w-full justify-center py-2 text-center">
              <h6>Footer</h6>
            </CardFooter>
          </div>
          <ScriptComponent selectedNonces={selectedNonces} />
        </CardContent>
        
      </Card>
      
    </div>    
  </>
  
  );
}
