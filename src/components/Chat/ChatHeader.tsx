import { FC } from 'react';

const ChatHeader: FC = () => {
  return (
    <>
      <p className='text-xs text-zinc-800 mb-1'>Chat with </p>
      <div className='flex gap-1.5 items-center'>
        <p className='w-2 h-2 rounded-full bg-green-500' />
        <p className='font-medium text-sm'>Locki companion</p>
      </div>
    </>
  );
};

export default ChatHeader;
