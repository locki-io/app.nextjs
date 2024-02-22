'use client';

import React, { useState } from "react";

import { ExtendedDataNft } from "@/app/context/store";
import { Card, CardTitle, CardContent, CardDescription, CardFooter } from "./Card";
import ScriptComponent from "@/components/DataNfts/ScriptComponent";
import { Canvas } from "@react-three/fiber";
import LoaderCanvas from "./LoaderCanvas";


export function DataNftCard({
  index,
  dataNft,
  isLoading,
  nonce,
  owned,
  isWallet,
  updateDataNftSelected,
}: {
  index: number;
  dataNft: ExtendedDataNft;
  isLoading: boolean;
  nonce: number;  
  owned: boolean;
  isWallet: boolean;
  updateDataNftSelected: (nonce: number, selected: boolean) => void;
}) {

  const [selectedNonces, setSelectedNonces] = useState<number[]>([]);

  const handleCardClick = () => {
    if (selectedNonces.includes(nonce)) {
      setSelectedNonces((prevNonces) => prevNonces.filter((n) => n !== nonce));
      updateDataNftSelected(nonce, false);
    } else {
      setSelectedNonces((prevNonces) => [...prevNonces, nonce]);
      updateDataNftSelected(nonce, true);
    }
  };

  return (
  <>
    <div id={index.toString()}
      className={`mb-3 flex text-white ${
        selectedNonces.includes(nonce) ? "border-4 border-green-500" : ""
      }`}
      onClick={handleCardClick}
    >
      <Card className="flex-1 p-1 border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-black rounded-[2.37rem] base:w-[18.5rem] md:w-[23.6rem]">
        <CardContent className="flex flex-col p-3">
          <div className="mb-4 flex justify-center">
            <img className="md:w-auto base:w-[15rem]" src={!isLoading ? dataNft.nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"} />
          </div>
          <CardTitle className="grid grid-cols-8 mb-1">
            <span className="col-span-8 text-center base:text-sm md:text-base">Title : {dataNft.title} {dataNft.dataNftSelected ? "selected" : "unselected"}</span>
          </CardTitle>
           

          <CardDescription className="grid grid-cols-8 mb-1">
            <span className="col-span-4 opacity-6 base:text-sm md:text-base">Description:</span>
            <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.description}</span>
          </CardDescription>
          { !selectedNonces.includes(nonce) && ( 
           <div>
              <Canvas camera={{ position: [2, 3, 10] }}>
                <ambientLight intensity={2} />
                <directionalLight color="white" position={[0, 0, 5]} />
                <LoaderCanvas index={index} dataNftRef={nonce.toString()} glbFileLink={dataNft.dataPreview} handleSelectionChange={handleCardClick}/>
              </Canvas>
            </div>
           )}
            
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
              {/* <h6>Footer</h6> */}
            </CardFooter>
          </div>
          <ScriptComponent selectedNonces={selectedNonces} />
        </CardContent>
        
      </Card>
      
    </div>    
  </>
  
  );
}
