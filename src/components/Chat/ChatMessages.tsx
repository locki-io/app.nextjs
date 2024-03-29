import { FC, HTMLAttributes, useContext } from 'react';
import MarkdownLite from '../MarkdownLite';
import { MessagesContext } from '@/app/context/store';
import { cn } from '@/lib/utils';

type ChatMessagesProps = HTMLAttributes<HTMLDivElement>;

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...props }) => {
  const { messages } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();

  return (
    <div>
      <div
        {...props}
        className={cn(
          'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scroll-track-blue-lighter scrollbar-w-2 scrolling-touch',
          className
        )}
      >
        <div className='flex-1 flex-grow' />
        {inverseMessages.map((message) => (
          <div key={message.id} className='chat-message'>
            <div
              className={cn('flex items-end', {
                'justify-end': message.isUserMessage
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-2xl mx-2 overflow-x-hidden',
                  {
                    'order-1 items-end': message.isUserMessage,
                    'max-w-4xl order-2 items-start': !message.isUserMessage
                  }
                )}
              >
                <p
                  className={cn('px-4 py-2 rounded-lg', {
                    'bg-blue-600 text-white': message.isUserMessage,
                    'bg-gray-200 text-gray-900': !message.isUserMessage
                  })}
                >
                  <MarkdownLite text={message.text} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
