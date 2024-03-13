import { useState } from 'react';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

const ChatHeader: FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(-1); // Index of the hovered gem

  return (
    <>
      <p className='flex text-xs text-zinc-800 mb-1 justify-content'>
        Chat with
      </p>
      <div className='flex gap-1.5 items-center'>
        <div className='font-medium text-xl flex flex-grow items-center'>
          <div className='w-2 h-2 rounded-full bg-green-500' />
          <div className='ml-2'>Locki companion</div>
          <div className='flex'>
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                onMouseEnter={() => {
                  setShowTooltip(true);
                  setTooltipIndex(index);
                }}
                onMouseLeave={() => setShowTooltip(false)}
                className='relative text-grey-500 '
              >
                <FontAwesomeIcon icon={faGem} className='text-gray-400' />
                {showTooltip && tooltipIndex === index && (
                  <div className='absolute bg-gray-500 text-white text-sm px-2 py-1 rounded-md whitespace-nowrap'>
                    <span>Coming soon</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
