'use client';

import { Label, Textarea, TextInput, Button } from 'flowbite-react';
import { useGeneratePreview } from '@/hooks/useGeneratePreview';
import { useEffect, useState } from 'react';
import { useWebsocketConnection } from '@/hooks/useWebsocketConnection';

export default function NewProduct() {
  const { generatePreview } = useGeneratePreview();
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [processedId, setProcessedId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { connect, disconnect } = useWebsocketConnection(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '', (ev) => {
    console.log('ev', ev, typeof ev);
    if (ev.data) {
      const processMsg = JSON.parse(ev.data);
      if (processMsg.status === 'Success' && processMsg.processedId === processedId) {
        // get the preview url and display in threejs.
      }
    }
  });

  useEffect(() => {
    if (!isConnected) {
      setIsConnected(true);
      connect();
    }

    return () => {
      disconnect();
    }
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
    </div>
  );
}
