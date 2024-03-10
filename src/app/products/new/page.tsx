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
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { Bounds, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Image from 'next/image';
import { Progress } from 'flowbite-react';
import Chat from '@/components/Chat/Chat';
import { DataNftsContext, ExtendedDataNft } from '@/app/context/store';
import Providers from '@/components/Chat/Provider';
import {
  INPUT_OPTIONS,
  PREVIEW_OPTIONS,
  STATUS_PROGRESS_MAP
} from '@/constants/products';
import { useSearchParams } from 'next/navigation';
import { cleanExtensionFromName } from '@/libs/utils';

const getInputOptionValByType = (type: string) => {
  return INPUT_OPTIONS.findIndex((option) => option.value === type);
};

const getPreviewOptionValByVal = (val: string) => {
  return PREVIEW_OPTIONS.findIndex((option) => option.value === val);
};

const getPreviewUrl = (
  processedId: string,
  filename: string,
  extension = 'glb'
) => {
  return `https://s3.eu-central-1.amazonaws.com/${
    process.env.NEXT_PUBLIC_DATASTREAM_BUCKET
  }/processData/${processedId}/${cleanExtensionFromName(
    filename
  )}.${extension}`;
};

const getScriptUrl = (processedId: string, filename: string) => {
  return `https://s3.eu-central-1.amazonaws.com/${process.env.NEXT_PUBLIC_DATASTREAM_BUCKET}/processData/${processedId}/${filename}`;
};

export default function NewProduct() {
  const searchParams = useSearchParams();
  const preProcessedId = searchParams?.get('processedId');
  const preFilename = searchParams?.get('filename');
  const preType = searchParams?.get('type');
  const preInputOptionVal = getInputOptionValByType(preType || '');
  const preExportOption = searchParams?.get('exportOption');
  const preProcessingStatus = searchParams?.get('status');
  const prePreviewOptionVal = getPreviewOptionValByVal(preExportOption || '');
  const [name, setName] = useState(
    preFilename ? cleanExtensionFromName(preFilename) : ''
  );
  const [script, setScript] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [processedId, setProcessedId] = useState(
    preProcessedId ? Number(preProcessedId) : null
  );
  const currentProcessId = useRef(processedId);
  const [isConnected, setIsConnected] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    preProcessingStatus === 'ProcessingSuccess'
      ? getPreviewUrl(
          preProcessedId || '',
          preFilename || '',
          preExportOption || 'glb'
        )
      : null
  );
  const currentPreviewUrl = useRef(previewUrl);
  const scriptUrl = useRef<string | null>(
    preProcessingStatus === 'ProcessingSuccess'
      ? getScriptUrl(preProcessedId || '', preFilename || '')
      : null
  );
  const mintActionSection = useRef(null);
  const [inputOptionVal, setInputOptionVal] = useState(
    preInputOptionVal !== -1 ? preInputOptionVal : 0
  );
  const [previewOptionVal, setPreviewOptionVal] = useState(
    prePreviewOptionVal !== -1 ? prePreviewOptionVal : 0
  );
  const [uploadedScriptFile, setUploadedScriptFile] = useState<any>(null);
  const [previewGenerationStatus, setPreviewGenerationStatus] =
    useState<string>(preProcessingStatus || 'ProcessingQueue');
  const [dataNfts, setDataNfts] = useState<ExtendedDataNft[]>([]);
  const accountInfo = useGetAccountInfo();
  const { tokenLogin } = useGetLoginInfo();
  const { mint } = useDataNftMint(accountInfo?.address);
  const [isMinting, setIsMinting] = useState(false);
  const {
    generatePreview,
    getSignedUrl,
    uploadFileWithLink,
    updateProcessingStatus
  } = useGeneratePreview(tokenLogin?.nativeAuthToken || '');

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
        processMsg.processingStatus === 'ProcessingSuccess' &&
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
      console.error('error', error);
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
      let uploadFileUploadResponse;
      if (INPUT_OPTIONS[inputOptionVal].fileTypes) {
        const signedUrlResponse: any = await getSignedUrl(
          uploadedScriptFile.name
        );
        const { processedId, preSignedUrl } = signedUrlResponse?.data;
        uploadFileUploadResponse = await uploadFileWithLink(
          preSignedUrl,
          uploadedScriptFile
        );
        if (uploadFileUploadResponse.status === 200) {
          setProcessedId(processedId);
          currentProcessId.current = processedId;
          const signedUrlObject = new URL(preSignedUrl);
          scriptUrl.current = `${signedUrlObject.origin}${signedUrlObject.pathname}`;
        }
      }
      const generatePreviewResponse = await generatePreview(
        name,
        INPUT_OPTIONS[inputOptionVal].fileTypes && scriptUrl.current
          ? scriptUrl.current
          : script,
        INPUT_OPTIONS[inputOptionVal].value,
        PREVIEW_OPTIONS[previewOptionVal].value,
        currentProcessId.current
      );
      if (
        generatePreviewResponse.status === 'ProcessingQueued' &&
        generatePreviewResponse.processedId
      ) {
        setProcessedId(generatePreviewResponse.processedId);
        currentProcessId.current = generatePreviewResponse.processedId;
        scriptUrl.current = generatePreviewResponse?.scriptUrl;
        setPreviewGenerationStatus('ProcessingQueue');
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
    mint(
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

    updateProcessingStatus(
      currentProcessId.current || 0,
      INPUT_OPTIONS[inputOptionVal].value,
      'MintingStarted'
    );
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file?.name) {
      setUploadedScriptFile(file);
      setName(cleanExtensionFromName(file?.name).replaceAll(' ', ''));
    }
  };

  return (
    <Providers>
      <DataNftsContext.Provider value={dataNfts}>
        <Chat />
        <div className='flex flex-row w-full p-2.5 text-white'>
          <form
            className='flex flex-col w-1/2 pr-2 overflow-scroll no-scroll'
            style={{ maxHeight: 'calc(100vh - 170px)' }}
          >
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
              disabled={!!INPUT_OPTIONS[inputOptionVal].fileTypes}
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
              <div
                className='flex items-center mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
                role='alert'
              >
                <svg
                  className='flex-shrink-0 inline w-4 h-4 me-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
                </svg>
                <span className='sr-only'>Info</span>
                <div>
                  We recommend to test the python code in blender before
                </div>
              </div>
            </div>
            {preProcessingStatus && (
              <div className='max-w-md mb-5'>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='scriptLink'
                    value='Saved Script Link'
                    className='text-white'
                  />
                </div>
                <a
                  id='scriptLink'
                  href={scriptUrl.current || ''}
                  target='_blank'
                >
                  {preFilename}
                </a>
              </div>
            )}
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
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className='max-w-md mb-5'>
                <div className='mb-2'>
                  <Label
                    htmlFor='script'
                    value='Script'
                    className='text-white'
                  />
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
          <div
            className='w-1/2 pl-2 flex flex-col  overflow-scroll no-scroll'
            style={{ maxHeight: 'calc(100vh - 170px)' }}
          >
            <div className='mt-10 flex-grow flex items-center'>
              {!isGeneratingPreview && previewUrl ? (
                <Canvas>
                  <PerspectiveCamera
                    makeDefault
                    fov={50}
                    position={[10, 10, 16]}
                  />
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
                  <OrbitControls />
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
                    Paste your script and generate preview to preview your 3D
                    Models
                  </p>
                  {isGeneratingPreview && (
                    <div className='mt-2.5'>
                      <div className='font-medium'>
                        {
                          STATUS_PROGRESS_MAP[String(previewGenerationStatus)]
                            .msg
                        }
                      </div>
                      <Progress
                        progress={
                          STATUS_PROGRESS_MAP[String(previewGenerationStatus)]
                            .progress
                        }
                        color={
                          STATUS_PROGRESS_MAP[String(previewGenerationStatus)]
                            .color
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
      </DataNftsContext.Provider>
    </Providers>
  );
}
