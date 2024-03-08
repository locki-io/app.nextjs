import React, { useEffect, useState } from 'react';

import { DataNft } from '@itheum/sdk-mx-data-nft';
import { useGetLoginInfo } from 'hooks';

import 'prismjs/themes/prism-okaidia.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedDataNft } from '@/app/context/store';

type Props = {
  selectedNFTs: ExtendedDataNft[];
  scriptRefs: React.RefObject<HTMLDivElement>[];
  onScriptLoadingChange: (loading: boolean) => void;
};

const ScriptTextComponent: React.FC<Props> = ({
  selectedNFTs,
  scriptRefs,
  onScriptLoadingChange
}) => {
  // Access the dataNfts array from the context

  const { tokenLogin } = useGetLoginInfo();
  const [dataNftScripts, setDataNftScripts] = useState<string[]>(
    Array(selectedNFTs.length).fill('')
  );
  const [dataNftRef, setDataNftRef] = useState<string[]>(
    Array(selectedNFTs.length).fill('')
  );
  const [scriptLoading, setScriptLoading] = useState(true);

  useEffect(() => {
    async function fetchNftView(nonce: number, index: number) {
      DataNft.setNetworkConfig('devnet');
      const decodedNft: DataNft = await DataNft.createFromApi({
        nonce: Number(nonce)
      });

      const res = await decodedNft.viewDataViaMVXNativeAuth({
        mvxNativeAuthOrigins: [
          'localhost',
          'http://localhost:3000',
          'https://app.locki.io',
          'https://2rkm8gkhk7.execute-api.eu-central-1.amazonaws.com'
        ],
        mvxNativeAuthMaxExpirySeconds: 86400,
        fwdHeaderMapLookup: {
          authorization: `Bearer ${tokenLogin?.nativeAuthToken}`
        }
      });

      if (!res?.error) {
        const resDataNft = await (res.data as Blob).text();
        setDataNftRef((prevNft) => {
          const newNft = [...prevNft];
          newNft[index] = decodedNft.tokenIdentifier;
          return newNft;
        });

        setDataNftScripts((prevScript) => {
          const newScript = [...prevScript];
          const formattedScript = `\`\`\`python\n${resDataNft}\`\`\``;
          newScript[index] = formattedScript;
          return newScript;
        });
      }

      onScriptLoadingChange(false);
      setScriptLoading(false);
    }
    // Iterate over selectedNFTs and fetch the scripts for each
    selectedNFTs.forEach((dataNft, index) => {
      fetchNftView(dataNft.nonce, index);
    });
  }, [
    selectedNFTs,
    tokenLogin?.nativeAuthToken,
    scriptRefs,
    onScriptLoadingChange
  ]);

  // Render the content based on the isLoading flag
  return scriptLoading ? (
    <span className=''>
      <FontAwesomeIcon
        icon={faSpinner}
        className='text-muted fa-spin-pulse text-4xl'
      />
    </span>
  ) : (
    <div
      className='flex items-center p-1 mb-2 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800'
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
        {selectedNFTs.map((dataNft, index) => (
          <span key={index}>
            Script of {dataNft.tokenName} loaded{' '}
            {'(' + `${dataNftRef[index]}` + ')'}
            <code
              hidden
              className='language-python'
              id={dataNftRef[index]}
              ref={scriptRefs[index]}
            >
              {dataNftScripts[index]}
            </code>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScriptTextComponent;
