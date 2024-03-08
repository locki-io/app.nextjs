import { FC } from 'react';
import { Accordion } from 'flowbite-react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';

const Chat: FC = () => {
  return (
    <div className='fixed right-8 w-1/2 bottom-2.5 bg-gray-200 border border-gray-200 rounded-md overflow:hidden z-10'>
      <div className='w-full h-100 flex flex-col'>
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>
              <ChatHeader />
            </Accordion.Title>
            <Accordion.Content className='overflow-scroll'>
              <div className='flex flex-col h-full max-h-[80vh]'>
                <ChatMessages className='px-2 py-3 flex-1' />
                <ChatInput className='px-4' />
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  );
};

export default Chat;
