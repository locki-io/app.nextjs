import React, { useEffect, useState, useRef } from 'react';
import { useGetLoginInfo } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy } from '@fortawesome/free-solid-svg-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getStreamWithNonce } from '@/hooks/getStreamWithNonce';

type Props = {
  nonce: number;
};

const ScriptComponent: React.FC<Props> = ({ nonce }) => {
  // Access the dataNfts array from the context
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftScript, setDataNftScript] = useState('');
  const [dataNftLoading, setDataNftLoading] = useState(true);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const script = await getStreamWithNonce(
        nonce,
        tokenLogin?.nativeAuthToken
      );
      if (script !== null) {
        setDataNftScript(script);
      }
      setDataNftLoading(false);
    }

    fetchData();
  }, [nonce, tokenLogin?.nativeAuthToken]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(dataNftScript);
  };

  // Render the content based on the selectedNonces array
  return (
    <ul>
      <li key={nonce}>
        <p>Script :</p>
        <div
          className={nonce ? 'h-64 overflow-y-auto' : 'h-0'}
          style={{ whiteSpace: 'pre-line', position: 'relative' }}
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
              <SyntaxHighlighter language='python' style={arta}>
                {dataNftScript}
              </SyntaxHighlighter>
              <button
                onClick={copyCodeToClipboard}
                className='absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-200'
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          )}
        </div>
      </li>
    </ul>
  );
};

export default ScriptComponent;
