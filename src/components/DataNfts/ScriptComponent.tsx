import React, { useEffect, useState } from 'react';
import { useDataNfts } from '@/app/context/store'; // Import the context hook
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetAccount, useGetLoginInfo, useGetPendingTransactions } from "hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type Props = {
  selectedNonces: number[];
};

const ScriptComponent: React.FC<Props> = ({ selectedNonces }) => {
  // Access the dataNfts array from the context
  const dataNfts = useDataNfts();
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftView, setDataNftView] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);

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
          setDataNftView(resDataNft);
        }
        setDataNftLoading(false);
      }
    }
    fetchNftView();
  }, [selectedNonces, tokenLogin?.nativeAuthToken]);
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
                <div></div>
              )}
              {dataNftView}
            </div>
          </li>
        )
      ))}
    </ul>
  );
};

export default ScriptComponent;
