import React, { useEffect, useState, useRef, HTMLAttributes } from 'react';
import { useGetLoginInfo } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy } from '@fortawesome/free-solid-svg-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arta } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getStreamWithNonce } from '@/hooks/getStreamWithNonce';
import { cn } from '@/lib/utils';
import { useDatastreamStore } from '@/app/context/store';

type ScriptComponentProps = {
  nonce: number;
  className: HTMLAttributes<HTMLDivElement>;
};

const ScriptComponent: React.FC<ScriptComponentProps> = ({
  nonce,
  className,
  ...props
}) => {
  // Access the dataNfts array from the context
  const { tokenLogin } = useGetLoginInfo();
  const setDatastream = useDatastreamStore((state) => state.setDatastream);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const content = await getStreamWithNonce(
        nonce,
        tokenLogin?.nativeAuthToken
      );
      if (content !== null) {
        const contentType = '';
        setDatastream(nonce, false, content, contentType);
      }
    }

    if (nonce) {
      fetchData();
    }
  }, [nonce, tokenLogin?.nativeAuthToken, setDatastream]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(dataNftScript);
  };

  // Render the content based on the selectedNonces array
  return (
    <div key={nonce} {...props} className={cn('flex ', className)}>
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
    </div>
  );
};

export default ScriptComponent;
