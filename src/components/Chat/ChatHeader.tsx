import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Tooltip } from 'flowbite-react';

const ChatHeader: FC = () => {
  return (
    <>
      <p className='flex text-xs text-zinc-800 mb-1 justify-content'>
        Chat with
      </p>
      <div className='font-medium text-xl flex items-center w-full'>
        <div className='w-2 h-2 rounded-full bg-green-500' />
        <div className='ml-2 grow'>Locki companion</div>
        <Tooltip content='Locki Stones Coming Soon'>
          <div className='flex mr-4 min-w-[50px] justify-end'>
            {[...Array(1)].map((_, index) => (
              <div key={index} className='relative text-grey-500'>
                <FontAwesomeIcon icon={faGem} className='text-gray-400' />
              </div>
            ))}
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default ChatHeader;
