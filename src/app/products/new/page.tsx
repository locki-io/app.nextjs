'use client';

import { Label, Textarea, TextInput, Button } from 'flowbite-react';
import { useGeneratePreview } from '@/hooks/useGeneratePreview';
import { useEffect, useRef, useState } from 'react';
import { useWebsocketConnection } from '@/hooks/useWebsocketConnection';
import LoaderCanvas from '@/components/DataNfts/LoaderCanvas';
import { Canvas } from '@react-three/fiber';
import { useDataNftMint } from '@/hooks';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Bounds, PerspectiveCamera } from '@react-three/drei';
import Image from 'next/image';

export default function NewProduct() {
  const { generatePreview } = useGeneratePreview();
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [processedId, setProcessedId] = useState(null);
  const currentProcessId = useRef(processedId);
  const [isConnected, setIsConnected] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const currentPreviewUrl = useRef('previewUrl');
  const scriptUrl = useRef(null);
  const mintActionSection = useRef(null);

  const accountInfo = useGetAccountInfo();
  const { mint } = useDataNftMint(accountInfo?.address);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    currentProcessId.current = processedId;
  }, [processedId]);

  const handleWebsocketMessage = (message: any) => {
    if (message.data) {
      console.log('received socket message', message.data);
      const processMsg = JSON.parse(message.data);
      if (
        processMsg.processingStatus === 'Success' &&
        processMsg.processedId === currentProcessId.current
      ) {
        setIsGeneratingPreview(false);
        setPreviewUrl(processMsg?.previewUrl || '');
        currentPreviewUrl.current = processMsg?.previewUrl;
        // setTimeout(() => {
        //   if (mintActionSection.current) {
        //     mintActionSection.current?.scrollIntoView({ behavior: 'smooth' });
        //   }
        // }, 1000);
      }
    }
  };

  const { connect, disconnect } = useWebsocketConnection(
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || '',
    handleWebsocketMessage,
    (error) => {
      console.log('error', error);
    }
  );

  useEffect(() => {
    if (!isConnected) {
      setIsConnected(true);
      connect();
    }

    return () => {
      disconnect();
    };
  }, []);

  const handleGeneratePreview = async () => {
    try {
      setIsGeneratingPreview(true);
      const generatePreviewResponse = await generatePreview(name, script);
      if (
        generatePreviewResponse.status === 'Queued' &&
        generatePreviewResponse.processedId
      ) {
        setProcessedId(generatePreviewResponse.processedId);
        scriptUrl.current = generatePreviewResponse?.scriptUrl;
      } else {
        setIsGeneratingPreview(false);
      }
    } catch (error) {
      console.error('error', error);
      setIsGeneratingPreview(false);
    }
  };

  const handleMintProduct = async () => {
    setIsMinting(true);
    await mint(
      `Locki${currentProcessId.current}`,
      scriptUrl.current || '',
      currentPreviewUrl.current || '',
      10,
      name,
      name,
      `Transaction pending to mint ${name}`,
      `Error in minting ${name}`,
      `Successfully minted ${name} in Locki. Please go to Library page and view it.`
    );
  };
  return (
    <div className='flex flex-row w-full p-5 text-white'>
      <div className='flex flex-col w-1/2 pr-2'>
        <h1 className='mb-5'>Create New Product</h1>
        <Label htmlFor='filename' className='text-white mb-2'>
          Name
        </Label>
        <TextInput
          type='text'
          id='filename'
          placeholder='Enter the name of the NFT'
          className='mb-5'
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <div className='mb-2'>
          <Label htmlFor='script' value='Script' className='text-white' />
        </div>
        <Textarea
          id='script'
          placeholder='paste your script to generate preview and mint as DataNft'
          required
          rows={20}
          value={script}
          onChange={(e: any) => setScript(e.target.value)}
        />
        <div className='justify-end mt-5'>
          <Button
            gradientDuoTone='purpleToBlue'
            onClick={handleGeneratePreview}
            isProcessing={isGeneratingPreview}
            disabled={isGeneratingPreview}
          >
            Generate Preview
          </Button>
        </div>
      </div>
      <div ref={mintActionSection} className='w-1/2 pl-2 flex flex-col'>
        <div className='mt-10 flex-grow flex items-center'>
          {previewUrl ? (
            <Canvas>
              <PerspectiveCamera makeDefault fov={50} position={[10, 10, 16]} />
              <ambientLight intensity={2} />
              <pointLight position={[10, 10, 10]} />
              <Bounds clip fit observe margin={1.2}>
                <LoaderCanvas
                  index={1}
                  dataNftRef={'1'}
                  glbFileLink={previewUrl}
                  maxBoundSize={0}
                  updateDataNftSelected={() => {
                    console.log('updated preview');
                  }}
                />
              </Bounds>
            </Canvas>
          ) : (
            <div className='w-full'>
              <Image
                alt={'generate preview'}
                src={'/assets/img/171.-3D-Modelling.png'}
                className='m-auto'
                width={200}
                height={200}
              />
              <p className='text-center'>
                Paste your script and generate preview to preview your 3D Models
              </p>
            </div>
          )}
        </div>
        <div className='flex justify-end mt-5 pr-5' ref={mintActionSection}>
          <Button
            gradientDuoTone='greenToBlue'
            onClick={handleMintProduct}
            isProcessing={false}
            disabled={isMinting || !previewUrl}
          >
            Mint to Locki Cloud
          </Button>
        </div>
      </div>
    </div>
  );
}
