import React, { useEffect, useState } from 'react';

import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "hooks";


import "prismjs/themes/prism-okaidia.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type Props = {
  selectedNonce: number;
  scriptRef: React.RefObject<HTMLPreElement>;
};

const ScriptTextComponent: React.FC<Props> = ({ selectedNonce, scriptRef }) => {
  // Access the dataNfts array from the context
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftScript, setDataNftScript] = useState('');
  const [dataNftRef, setDataNftRef] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);
 
  useEffect(() => {
    async function fetchNftView() {
      DataNft.setNetworkConfig('devnet');      
      const decodedNft: DataNft = await DataNft.createFromApi({
        nonce: Number(selectedNonce)
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
        setDataNftRef(decodedNft.tokenIdentifier)
        setDataNftScript(resDataNft);
      }
      setDataNftLoading(false);
    }

    fetchNftView();
  }, [selectedNonce, tokenLogin?.nativeAuthToken]);
  
  // Render the content based on the isLoading flag
  return (
    dataNftLoading ? (
      <span className=''>
        <FontAwesomeIcon
          icon={faSpinner}
          className='text-muted fa-spin-pulse text-4xl'
        />
      </span>
    ) : (
      <span> {dataNftRef} Script loaded
        <code hidden className="language-python" ref={scriptRef}>```python {dataNftScript}```</code>
      </span>
    )
  );
};

export default ScriptTextComponent;
