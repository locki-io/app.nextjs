'use client';

import {
  DataNftsContext,
  ExtendedDataNft,
  MessagesContext
} from '@/app/context/store';
import { cn } from '@/lib/utils';
import {
  FC,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useMutation } from '@tanstack/react-query';
import TextAreaAutosize from 'react-textarea-autosize';
import { nanoid } from 'nanoid';
import { Message } from 'lib/validators/message';
import { toast } from 'react-hot-toast';
import { Button } from 'flowbite-react';
import ScriptTextComponent from '../DataNfts/ScriptTextComponent';

type ChatInputProps = HTMLAttributes<HTMLDivElement>;

interface ChatOption {
  label: string;
  value: string;
}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scriptRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>('');
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating
  } = useContext(MessagesContext);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (_messages: Message) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ messages })
      });
      console.log(messages);
      return response.body;
    },
    onMutate(message) {
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error('No stream found');

      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: ''
      };

      addMessage(responseMessage);

      setIsMessageUpdating(true);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }
      //clean up
      setIsMessageUpdating(false);
      setInput('');

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      toast.error('Something went wrong. Please try again.');
      removeMessage(message.id);
      textareaRef.current?.focus();
    }
  });

  const selectedNFTs: ExtendedDataNft[] | undefined = useContext(
    DataNftsContext
  )?.filter((nft) => nft.dataNftSelected);
  const [clicked, setClicked] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(true);

  const handleScriptLoadingChange = (loading: boolean) => {
    setScriptLoading(loading);
  };

  const chatOptions: ChatOption[] = [
    { label: 'Describe', value: 'describe' },
    { label: 'Transform', value: 'transform' }
  ];

  const combineOptions: ChatOption[] = [
    { label: 'Combine mesh with texture', value: 'Combine12' }
    // Add more combine options if needed
  ];

  let introText = '';
  let options: ChatOption[] = [];

  if (selectedNFTs && selectedNFTs.length === 0) {
    introText =
      'I am a 3D asset assistant, I use the default knowledge of locki to help me start with making 3D dataNFTs';
  } else if (selectedNFTs && selectedNFTs.length === 1) {
    introText = `Describe ${selectedNFTs[0].tokenIdentifier} using`;
    options = chatOptions;
  } else if (selectedNFTs && selectedNFTs.length >= 2) {
    introText = `Combine ${selectedNFTs
      .map((nft) => nft.tokenIdentifier)
      .join(' and ')} using`;
    options = combineOptions;
  }

  const presetMessage = (optionValue: string): Message => {
    // Define the logic to generate the preset message based on the option value
    switch (optionValue) {
      case 'describe':
        return {
          id: nanoid(),
          isUserMessage: true,
          text: scriptRef.current?.innerText || ''
        };
      case 'transform':
        return {
          id: nanoid(),
          isUserMessage: true,
          text: 'Can you transform ' + `\{${scriptRef.current?.id}\}` + ' into'
        };
      case 'Combine12':
        return {
          id: nanoid(),
          isUserMessage: true,
          text: 'Preset message for Combine12 option'
        };
      case 'Combine21':
        return {
          id: nanoid(),
          isUserMessage: true,
          text: 'Preset message for Combine21 option'
        };
      default:
        return { id: nanoid(), isUserMessage: true, text: '' };
    }
  };

  useEffect(() => {
    const updateFirstMessage = () => {
      // updating the system message -> JNTODO issue is not revealing on display
      updateMessage(messages[0].id, () => introText);
    };
    updateFirstMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to execute once on mount

  return (
    <div {...props} className={cn('border-t border-zinc-300', className)}>
      {options.length > 0 && (
        <div className='flex gap-1.5 items-center'>
          {options.map((option, index) => (
            <Button
              key={index}
              gradientDuoTone={clicked ? 'limeToTeal' : 'BlueToLime'}
              onClick={() => {
                const message = presetMessage(option.value);
                setClicked(true);
                if (option.value == 'describe') sendMessage(message);
                else setInput(message.text);

                setScriptLoading(true);
              }}
              className='mb-4'
              disabled={scriptLoading && clicked}
            >
              {option.label}
            </Button>
          ))}
          {selectedNFTs && (
            <ScriptTextComponent
              scriptRefs={[scriptRef]} // Pass an array with single ref
              selectedNFTs={selectedNFTs}
              onScriptLoadingChange={handleScriptLoadingChange}
            />
          )}
        </div>
      )}
      {/* <span className='text-ms bold'>{introText}</span> */}
      <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
        <TextAreaAutosize
          ref={textareaRef}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();

              let modifiedInput = input;
              // Define the regex pattern
              const regexPattern =
                /\{DATANFTFT-[A-Za-z0-9]{6}-[A-Za-z0-9]{2}\}/g;

              if (input.match(regexPattern)) {
                modifiedInput = input.replace(regexPattern, () => {
                  const innerText = scriptRef.current?.innerText || '';
                  return innerText;
                });
              }

              const message: Message = {
                id: nanoid(),
                isUserMessage: true,
                text: modifiedInput
              };
              console.log('message being sent:');
              console.log(message);
              sendMessage(message);
            }
          }}
          maxRows={4}
          autoFocus
          disabled={isPending}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Write a message...'
          className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
        />
      </div>
    </div>
  );
};

export default ChatInput;
