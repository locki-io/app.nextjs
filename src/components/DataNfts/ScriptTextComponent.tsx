import React, { useEffect, useState } from 'react';

import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "hooks";


import "prismjs/themes/prism-okaidia.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ExtendedDataNft } from '@/app/context/store';

type Props = {
  selectedNFTs: ExtendedDataNft[];
  scriptRefs: React.RefObject<HTMLDivElement>[];
  onScriptLoadingChange: (loading: boolean) => void
};

const ScriptTextComponent: React.FC<Props> = ({ selectedNFTs, scriptRefs, onScriptLoadingChange}) => {
  // Access the dataNfts array from the context
  
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftScripts, setDataNftScripts] = useState<string[]>(Array(selectedNFTs.length).fill(''));
  const [dataNftRef, setDataNftRef] = useState<string[]>(Array(selectedNFTs.length).fill(''));
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
        setDataNftRef(prevNft => {
          const newNft = [...prevNft];
          newNft[index] = decodedNft.tokenIdentifier;
          return newNft
        });
        
        setDataNftScripts(prevScript => {
          const newScript = [...prevScript];
          const formattedScript = `\`\`\`python\n${resDataNft}\`\`\``;
          newScript[index] = formattedScript;
          return newScript;
        });

        // if (scriptRefs[index]?.current) {
        //   scriptRefs[index].current.innerHTML = `<code hidden className="language-python">\`\`\`python\\n${resDataNft}\`\`\`</code>`;
        // }
      }      

      onScriptLoadingChange(false);
      setScriptLoading(false);
    }
    // Iterate over selectedNFTs and fetch the scripts for each
    selectedNFTs.forEach((dataNft, index) => {
      fetchNftView(dataNft.nonce, index);
    });
  }, [selectedNFTs, tokenLogin?.nativeAuthToken, scriptRefs, onScriptLoadingChange]);
  
  // Render the content based on the isLoading flag
  return (
    scriptLoading ? (
      <span className=''>
        <FontAwesomeIcon
          icon={faSpinner}
          className='text-muted fa-spin-pulse text-4xl'
        />
      </span>
    ) : (
      <React.Fragment>
        {selectedNFTs.map((dataNft, index) => (
          <span key={index}>
            The loaded script of {dataNftRef[index]}:
            <code hidden className="language-python" ref={scriptRefs[index]}>
              {dataNftScripts[index]}
            </code>
          </span>
        ))}
      </React.Fragment>
    )
  );
};

export default ScriptTextComponent;
