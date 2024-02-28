'use client';

import { Label, Textarea, TextInput, Button } from 'flowbite-react';
import { useGeneratePreview } from '@/hooks/useGeneratePreview';
import { useEffect, useRef, useState } from 'react';
import { useWebsocketConnection } from '@/hooks/useWebsocketConnection';
import LoaderCanvas from '@/components/DataNfts/LoaderCanvas';
import { Canvas } from '@react-three/fiber';

export default function NewProduct() {
  const { generatePreview } = useGeneratePreview();
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [processedId, setProcessedId] = useState(null);
  const currentProcessId = useRef(processedId);
  const [isConnected, setIsConnected] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    currentProcessId.current = processedId;
  }, [processedId]);

  const handleWebsocketMessage = (message: any) => {
    if (message.data) {
      const processMsg = JSON.parse(message.data);
      if (
        processMsg.processingStatus === 'Success' &&
        processMsg.processedId === currentProcessId.current
      ) {
        setIsGeneratingPreview(false);
        setPreviewUrl(processMsg?.previewUrl || '');
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
      } else {
        setIsGeneratingPreview(false);
      }
    } catch (error) {
      console.error('error', error);
      setIsGeneratingPreview(false);
    }
  };

  const handleMintProduct = async () => {
    console.log('Mint the product');
  }
  return (
    <div className='w-full p-5 text-white'>
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
      <div className='mb-2 block'>
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
      <div className='flex justify-end mt-5'>
        <Button
          gradientDuoTone='purpleToBlue'
          onClick={handleGeneratePreview}
          isProcessing={isGeneratingPreview}
          disabled={isGeneratingPreview}
        >
          Generate Preview
        </Button>
      </div>
      {previewUrl !== null && (
        <>
          <div className='w-full mt-10'>
            <Canvas camera={{ position: [2, 3, 10] }}>
              <ambientLight intensity={2} />
              <directionalLight color='white' position={[0, 0, 5]} />
              <LoaderCanvas
                index={1}
                dataNftRef={'1'}
                glbFileLink={previewUrl}
                handleSelectionChange={() => {
                  console.log('Preview Selected.');
                }}
              />
            </Canvas>
          </div>
          <div className='flex justify-end mt-5'>
          <Button
              gradientDuoTone='pinkToOrange'
              onClick={handleMintProduct}
              isProcessing={false}
              disabled={false}
              className='mr-4'
            >
              Review your script and Regenerate
            </Button>
            <Button
              gradientDuoTone='greenToBlue'
              onClick={handleMintProduct}
              isProcessing={false}
              disabled={false}
            >
              Mint to Locki Cloud
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
