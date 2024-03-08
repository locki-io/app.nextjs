'use client';
import {
  faMagnifyingGlassLocation,
  faStore
} from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';

import { ExtendedDataNft } from '@/app/context/store';
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from './Card';
import ScriptComponent from '@/components/DataNfts/ScriptComponent';
import { Canvas } from '@react-three/fiber';
import LoaderCanvas from './LoaderCanvas';
import { Button } from 'flowbite-react';
import { Bounds, PerspectiveCamera } from '@react-three/drei';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function DataNftCard({
  index,
  dataNft,
  isLoading,
  nonce,
  owned,
  isWallet,
  updateDataNftSelected
}: {
  index: number;
  dataNft: ExtendedDataNft;
  isLoading: boolean;
  nonce: number;
  owned: boolean;
  isWallet: boolean;
  updateDataNftSelected: (index: number, selected: boolean) => void;
}) {
  const [selectedNonces, setSelectedNonces] = useState<number[]>([]);

  const handleCardClick = () => {
    if (dataNft.dataNftSelected) {
      updateDataNftSelected(index, false);
    } else {
      updateDataNftSelected(index, true);
    }
  };

  const handleButtonClick = () => {
    if (selectedNonces.includes(nonce)) {
      setSelectedNonces((prevNonces) => prevNonces.filter((n) => n !== nonce));
    } else {
      setSelectedNonces((prevNonces) => [...prevNonces, nonce]);
    }
  };

  return (
    <>
      <div
        id={index.toString()}
        className={`mb-3 flex text-white ${
          dataNft.dataNftSelected
            ? 'border-4 border-white-100 rounded-[2.37rem]'
            : ''
        }`}
      >
        <Card className='flex-1  p-1 border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-black rounded-[2.37rem] base:w-[18.5rem] md:w-[23.6rem]'>
          <CardContent className='flex flex-col p-3'>
            <div className='mb-4 flex w-full'>
              <div className='flex w-1/4'>
                <img
                  onClick={handleCardClick}
                  className='md:w-auto base:w-[15rem]'
                  src={
                    !isLoading
                      ? dataNft.nftImgUrl
                      : 'https://media.elrond.com/nfts/thumbnail/default.png'
                  }
                  alt=''
                />
              </div>
              <CardTitle className='flex w-3/4 p-2'>
                <p className='col-span-8 text-center base:text-sm md:text-base'>
                  {dataNft.title}
                </p>
                <a
                  href={`https://test.datadex.itheum.io/datanfts/marketplace/${dataNft.tokenIdentifier}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FontAwesomeIcon
                    icon={faStore}
                    className='fa-solid ml-2 text-blue-500'
                  />
                </a>
                <a
                  href={`https://devnet-explorer.multiversx.com/nfts/${dataNft.tokenIdentifier}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlassLocation}
                    className='fa-solid ml-2 text-blue-500'
                  />
                </a>
              </CardTitle>
            </div>
            {!dataNft.dataNftSelected && (
              <div>
                <Canvas>
                  <PerspectiveCamera
                    makeDefault
                    fov={50}
                    position={[5, 5, 8]}
                  />
                  <ambientLight intensity={2} />
                  <directionalLight color='white' position={[0, 0, 5]} />
                  <Bounds clip fit observe margin={0.8}>
                    <LoaderCanvas
                      index={index}
                      dataNftRef={nonce.toString()}
                      glbFileLink={dataNft.dataPreview}
                      maxBoundSize={10}
                      updateDataNftSelected={handleCardClick}
                    />
                  </Bounds>
                </Canvas>
              </div>
            )}
            <CardDescription className='grid grid-cols-8 mb-1'>
              <span className='col-span-4 opacity-6 base:text-sm md:text-base'>
                Description:
              </span>
              <span className='col-span-8 text-left base:text-sm md:text-base'>
                {dataNft.description}
              </span>
            </CardDescription>

            <div className='grid grid-cols-12 mb-1'>
              <a href='https://test.datadex.itheum.io/datanfts/wallet/'>
                <span className='col-span-4 opacity-6 base:text-sm md:text-base'>
                  Balance:
                </span>
                <span className='col-span-8 text-left base:text-sm md:text-base'>
                  {dataNft.balance.toString()}
                </span>
              </a>
            </div>

            <div className=''>
              {isWallet ? (
                <div className='pt-5 pb-3 text-center'>
                  <h6
                    className='base:!text-sm md:!text-base'
                    style={{ visibility: owned ? 'visible' : 'hidden' }}
                  >
                    You have this Data NFT
                  </h6>
                </div>
              ) : (
                <div>
                  <h6
                    className='base:!text-sm md:!text-base'
                    style={{ visibility: owned ? 'visible' : 'hidden' }}
                  >
                    You don&apos;t have this Data NFT
                  </h6>
                </div>
              )}

              <CardFooter className='flex w-full justify-center py-2 text-center'>
                <Button onClick={handleButtonClick}>
                  {selectedNonces.includes(nonce)
                    ? 'Hide script'
                    : 'Show script'}
                </Button>
              </CardFooter>
            </div>
            <ScriptComponent selectedNonces={selectedNonces} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
