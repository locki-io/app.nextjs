'use client'

import { DataNftsContext, ExtendedDataNft, MessagesContext } from '@/app/context/store'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useContext, useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import TextAreaAutosize from 'react-textarea-autosize'
import { nanoid } from 'nanoid'
import { Message } from 'lib/validators/message'
import { toast } from 'react-hot-toast'
import { Button } from 'flowbite-react'
import ScriptTextComponent from '../DataNfts/ScriptTextComponent'

type ChatInputProps = HTMLAttributes<HTMLDivElement>

interface ChatOption {
  label: string;
  value: string;
}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const scriptRef = useRef<HTMLPreElement>(null);
  const [input, setInput] = useState<string>('')
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
} = useContext(MessagesContext) 
  
  const { mutate: sendMessage, isPending } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: async (_messages: Message ) => {      
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })
      // console.log(response.body)
      return response.body
    },
    onMutate(message) {
      console.log(message)
      addMessage(message)
    },
    onSuccess: async (stream)=> {
      if(!stream) throw new Error('No stream found')

      const id = nanoid()
      const responseMessage: Message= {
        id,
        isUserMessage: false,
        text:'',
      }

      addMessage(responseMessage)
      
      setIsMessageUpdating(true)

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const {value, done: doneReading} = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        updateMessage(id, (prev) => prev + chunkValue)
      }
      //clean up
      setIsMessageUpdating(false)
      setInput('')

      setTimeout(() => {
        textareaRef.current?.focus()
      }, 10)

    },
    onError: (_, message) => {
      toast.error('Something went wrong. Please try again.')
      removeMessage(message.id)
      textareaRef.current?.focus()
    },
  })
  
  const selectedNFTs: ExtendedDataNft[] | undefined = useContext(DataNftsContext)?.filter(nft => nft.dataNftSelected);
  const [clicked, setClicked] = useState(false);

  const toProcess = async () => {
    //console.log('process');
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

  let introText = '';
  let options: ChatOption[] = [];

  if (selectedNFTs && selectedNFTs.length === 0) {
    introText = 'Default input';
  } else if (selectedNFTs && selectedNFTs.length === 1) {
    introText = `Describe ${selectedNFTs[0].tokenIdentifier} using`; 
    options = chatOptions;
  } else if (selectedNFTs && selectedNFTs.length >= 2) {
    introText = `Combine ${selectedNFTs.map(nft => nft.tokenIdentifier).join(' and ')} using`;
    options = combineOptions;
  }
  useEffect(() => {
    const updateFirstMessage = () => {
        // console.log(messages[1].text)
        updateMessage(messages[0].id, (prev) => prev + introText);
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
              const message: Message = {
                id: nanoid(),
                isUserMessage: true,
                text: scriptRef.current.innerText,
              }
              sendMessage(message)
            }}
            className='mb-4'
          >
            {option.label}
          </Button>

        ))}
        {selectedNFTs[0]?.nonce && (
          <ScriptTextComponent selectedNonce={selectedNFTs[0].nonce} scriptRef={scriptRef}/>
        )}
      </div>
    )}
    <span className='text-ms bold'>{introText}</span>
    <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
      <TextAreaAutosize 
        ref={textareaRef}
        rows={2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()

            const message: Message = {
              id: nanoid(),
              isUserMessage: true,
              text: input,
            }
            console.log('message being sent:')
            console.log(message)
            sendMessage(message)
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
)}

export default ChatInput


