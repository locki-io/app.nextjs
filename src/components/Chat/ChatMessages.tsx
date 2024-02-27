import { FC, HTMLAttributes, useContext, useState } from 'react';
import MarkdownLite from '../MarkdownLite';
import { Button } from 'flowbite-react';
import { DataNftsContext, ExtendedDataNft, MessagesContext } from '@/app/context/store';
import { cn } from '@/lib/utils';

type ChatMessagesProps = HTMLAttributes<HTMLDivElement>;

interface ChatOption {
  label: string;
  value: string;
}

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props}) => {
  const { messages } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();

  const selectedNFTs: ExtendedDataNft[] | undefined = useContext(DataNftsContext)?.filter(nft => nft.dataNftSelected);
  const [clicked, setClicked] = useState(false);

  const toProcess = async () => {
    console.log('process');
    setClicked(true);
  };

  const chatOptions: ChatOption[] = [
    { label: 'Describe', value: 'describe' },
    { label: 'Transform', value: 'transform' },
    { label: 'Edit', value: 'edit' }
  ];

  const combineOptions: ChatOption[] = [
    { label: 'Combine mesh with texture', value: 'Combine12' },
    { label: 'Combine texture with mesh', value: 'Combine21' },
    // Add more combine options if needed
  ];

  let chatText: string = '';
  let options: ChatOption[] = [];

  if (selectedNFTs && selectedNFTs.length === 0) {
    chatText = 'Chat with';
  } else if (selectedNFTs && selectedNFTs.length === 1) {
    chatText = `Describe ${selectedNFTs[0].tokenIdentifier} using`;
    options = chatOptions;
  } else if (selectedNFTs && selectedNFTs.length >= 2) {
    chatText = `Combine ${selectedNFTs.map(nft => nft.tokenIdentifier).join(' and ')} using`;
    options = combineOptions;
  }
  
  return (
    <div>
      
      {options.length > 0 && (
        <div className='flex gap-1.5 items-center'>
          {options.map((option, index) => (
            <Button
              key={index}
              gradientDuoTone={clicked ? 'limeToTeal' : 'BlueToLime'}
              onClick={toProcess}
              className='mb-4'
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
      <span className='text-ms bold'>{chatText}</span>
      <div 
        {...props}
        className={cn(
          'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scroll-track-blue-lighter scrollbar-w-2 scrolling-touch',  className
      )}>
        <div className='flex-1 flex-grow' />
        {inverseMessages.map((message) => (
          <div key={message.id} className='chat-message'>
            <div className={cn('flex items-end', { 
              'justify-end': message.isUserMessage,            
            })}>
              <div
                className={cn('flex flex-col space-y-2 text-sm max-w-2xl mx-2 overflow-x-hidden', {
                  'order-1 items-end': message.isUserMessage,
                  'order-2 items-start': !message.isUserMessage,
                })}>
                <p
                  className={cn('px-4 py-2 rounded-lg', {
                    'bg-blue-600 text-white': message.isUserMessage,
                    'bg-gray-200 text-gray-900': !message.isUserMessage,
                  })}>
                  <MarkdownLite text={message.text} />
                </p>
              </div> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatMessages;
