'use client';

import {
  Label,
  Textarea,
  TextInput,
  Button,
  Select,
  FileInput
} from 'flowbite-react';
import { useGeneratePreview } from '@/hooks/useGeneratePreview';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useWebsocketConnection } from '@/hooks/useWebsocketConnection';
import LoaderCanvas from '@/components/DataNfts/LoaderCanvas';
import { Canvas } from '@react-three/fiber';
import { useDataNftMint } from '@/hooks';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Bounds, PerspectiveCamera } from '@react-three/drei';
import Image from 'next/image';
import { Progress } from 'flowbite-react';

const STATUS_PROGRESS_MAP: any = {
  Queue: {
    progress: 10,
    color: 'red',
    msg: 'Preview generation process is in Queue'
  },
  Pending: {
    progress: 30,
    color: 'yellow',
    msg: 'Preview generation process is pending'
  },
  Processing: {
    progress: 50,
    color: 'lime',
    msg: 'Preview generation process is processing'
  },
  Success: {
    progress: 100,
    color: 'green',
    msg: 'Preview generation process is finished'
  }
};

const INPUT_OPTIONS: {
  label: string;
  value: string;
  fileTypes?: string;
  placeholder: string;
}[] = [
  {
    label: 'Blender python script as text input',
    value: 'blenderPyInput',
    placeholder: 'Enter or paste your python script here'
  },
  {
    label: 'Blender python script as a python file',
    value: 'blenderPyFile',
    fileTypes: 'py',
    placeholder: 'Upload the python script file'
  },
  {
    label: 'Blend file upload',
    value: 'blendFile',
    fileTypes: 'blend',
    placeholder: 'Upload the blend file'
  }
];

const PREVIEW_OPTIONS: { label: string; value: string }[] = [
  {
    label: 'Export as glb',
    value: 'glb'
  },
  {
    label: 'Export as gltf',
    value: 'gltf'
  }
];

export default function NewProduct() {
  const { generatePreview } = useGeneratePreview();
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [processedId, setProcessedId] = useState(null);
  const currentProcessId = useRef(processedId);
  const [isConnected, setIsConnected] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const currentPreviewUrl = useRef(previewUrl);
  const scriptUrl = useRef(null);
  const mintActionSection = useRef(null);
  const [inputOptionVal, setInputOptionVal] = useState(0);
  const [previewOptionVal, setPreviewOptionVal] = useState(0);
  const [previewGenerationStatus, setPreviewGenerationStatus] =
    useState<string>('Queue');

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
      if (processMsg.processedId == currentProcessId.current) {
        setPreviewGenerationStatus(processMsg.processingStatus);
      }
      if (
        processMsg.processingStatus === 'Success' &&
        processMsg.processedId === currentProcessId.current
      ) {
        setIsGeneratingPreview(false);
        setPreviewUrl(processMsg?.previewUrl || '');
        currentPreviewUrl.current = processMsg?.previewUrl;
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
      const generatePreviewResponse = await generatePreview(
        name,
        script,
        INPUT_OPTIONS[inputOptionVal].value,
        PREVIEW_OPTIONS[previewOptionVal].value
      );
      if (
        generatePreviewResponse.status === 'Queued' &&
        generatePreviewResponse.processedId
      ) {
        setProcessedId(generatePreviewResponse.processedId);
        scriptUrl.current = generatePreviewResponse?.scriptUrl;
        setPreviewGenerationStatus('Queue');
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
      <form className='flex flex-col w-1/2 pr-2'>
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
        <div className='max-w-md mb-5'>
          <div className='mb-2'>
            <Label htmlFor='input' value='Input' className='text-white' />
          </div>
          <Select
            id='category'
            required
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setInputOptionVal(Number(e.target.value));
            }}
            value={inputOptionVal}
          >
            {INPUT_OPTIONS.map((inputOption, optionIndex) => (
              <option key={inputOption.value} value={optionIndex}>
                {inputOption.label}
              </option>
            ))}
          </Select>
        </div>
        {INPUT_OPTIONS[inputOptionVal].fileTypes ? (
          <div id='fileUpload' className='max-w-md mb-5'>
            <div className='mb-2 block'>
              <Label
                htmlFor='scriptFile'
                value='Upload input file'
                className='text-white'
              />
            </div>
            <FileInput
              id='scriptFile'
              helperText={INPUT_OPTIONS[inputOptionVal].placeholder}
            />
          </div>
        ) : (
          <div className='max-w-md mb-5'>
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
          </div>
        )}
        <div className='mb-2'>
          <Label
            htmlFor='previewOption'
            value='Export Option'
            className='text-white'
          />
        </div>
        <Select
          id='previewOption'
          required
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setPreviewOptionVal(Number(e.target.value))
          }
          className='mb-5'
          value={previewOptionVal}
        >
          {PREVIEW_OPTIONS.map((previewOption, optionIndex) => (
            <option key={previewOption.value} value={optionIndex}>
              {previewOption.label}
            </option>
          ))}
        </Select>
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
      </form>
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
              {isGeneratingPreview && (
                <div className='mt-2.5'>
                  <div className='font-medium'>
                    {STATUS_PROGRESS_MAP[String(previewGenerationStatus)].msg}
                  </div>
                  <Progress
                    progress={
                      STATUS_PROGRESS_MAP[String(previewGenerationStatus)]
                        .progress
                    }
                    color={
                      STATUS_PROGRESS_MAP[String(previewGenerationStatus)].color
                    }
                    size='lg'
                  />
                </div>
              )}
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
