import React, { useEffect, useState, useRef } from 'react';
import { useDataNfts } from '@/app/context/store'; // Import the context hook
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy } from '@fortawesome/free-solid-svg-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Props = {
  selectedNonces: number[];
};

const ScriptComponent: React.FC<Props> = ({ selectedNonces }) => {
  // Access the dataNfts array from the context
  const dataNfts = useDataNfts();
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftScript, setDataNftScript] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);
  const codeRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    async function fetchNftView() {
      if (selectedNonces.length > 0)  {
        DataNft.setNetworkConfig('devnet');      
        const decodedNft: DataNft = await DataNft.createFromApi({
          nonce: Number(selectedNonces)
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

          // const blobUrl = URL.createObjectURL(message.data);
          setDataNftScript(resDataNft);
        }
        setDataNftLoading(false);
      }
    }

    fetchNftView();
  }, [selectedNonces, tokenLogin?.nativeAuthToken]);
  
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(dataNftScript);
  };

  // Render the content based on the selectedNonces array
  return (
    <ul>
      {dataNfts.map(dataNft => (
        selectedNonces.includes(dataNft.nonce) && (
          <li key={dataNft.nonce}>
            <p>Script (nonce: {dataNft.nonce}):</p>
            <div
              className={selectedNonces.includes(dataNft.nonce) ? 'h-64 overflow-y-auto' : 'h-0'}
              style={{ whiteSpace: 'pre-line', position: 'relative'  }}
            >
              {dataNftLoading ? (
                <div className='text-gray-200 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className='text-muted fa-spin-pulse text-4xl'
                  />
                </div>
              ) : (
                <div ref={codeRef}>
                  <SyntaxHighlighter language='python' style={arta} >
                    {dataNftScript}
                  </SyntaxHighlighter>
                  <button onClick={copyCodeToClipboard} className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-200">
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
              )}
            </div>
          </li>
        )
      ))}
    </ul>
  );
};

export default ScriptComponent;
