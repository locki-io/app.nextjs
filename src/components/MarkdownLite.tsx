import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import 'prismjs/themes/prism-okaidia.css';

const MarkdownLite = ({ text }: { text: string }) => {
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  const codeBlockRegex = /```python([\s\S]*?)```/gs;
  const parts = [];

  let linkIndex = 0;

  let linkMatch = linkRegex.exec(text);
  let codeBlockMatch = codeBlockRegex.exec(text);

  while (linkMatch !== null || codeBlockMatch !== null) {
    // If both matches exist, choose the one that occurs first
    if (linkMatch && codeBlockMatch) {
      if (linkMatch.index < codeBlockMatch.index) {
        processLink();
      } else {
        processCodeBlock();
      }
    } else if (linkMatch) {
      processLink();
    } else {
      processCodeBlock();
    }
  }

  // Push the remaining text after the last match
  if (linkIndex < text.length) {
    parts.push(text.slice(linkIndex));
  }

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </>
  );

  function processLink() {
    const [fullMatch, linkText, linkUrl] = linkMatch ?? [];
    const matchStart = linkMatch?.index ?? text.length;
    const matchEnd = matchStart + (fullMatch?.length ?? 0);

    if (linkIndex < matchStart) {
      parts.push(text.slice(linkIndex, matchStart));
    }

    parts.push(
      <Link
        target='_blank'
        rel='noopener noreferrer'
        className='break-words underline underline-offset-2 text-blue-600'
        key={linkUrl}
        href={linkUrl}
      >
        {linkText}
      </Link>
    );

    linkIndex = matchEnd;
    linkMatch = linkRegex.exec(text);
  }

  function processCodeBlock() {
    const [fullMatch, codeContent] = codeBlockMatch ?? [];
    const matchStart = codeBlockMatch?.index ?? text.length;
    const matchEnd = matchStart + (fullMatch?.length ?? 0);

    if (linkIndex < matchStart) {
      parts.push(text.slice(linkIndex, matchStart));
    }

    const copyCodeToClipboard = () => {
      navigator.clipboard.writeText(codeContent);
    };

    parts.push(
      <div>
        <textarea
          key={`code-block-${matchStart}`}
          value={codeContent}
          rows={4}
          className='border border-gray-300 p-2 mt-2 w-full text-gray-600'
          readOnly
        />
        <button
          onClick={copyCodeToClipboard}
          className='relative top-0 right-0 m-2 text-gray-800 hover:text-gray-200'
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
    );

    linkIndex = matchEnd;
    codeBlockMatch = codeBlockRegex.exec(text);
  }
};

export default MarkdownLite;
