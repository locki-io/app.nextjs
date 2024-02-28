'use client'

import { MessagesContext } from '@/app/context/store'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import TextAreaAutosize from 'react-textarea-autosize'
import { nanoid } from 'nanoid'
import { Message } from 'lib/validators/message'
import { toast } from 'react-hot-toast'

type ChatInputProps = HTMLAttributes<HTMLDivElement>

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
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
      console.log(response.body)
      return response.body
    },
    onMutate(message) {
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

  return (
  <div {...props} className={cn('border-t border-zinc-300', className)}>
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
        //disabled={isPending}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Write a message...'
        className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6'
      />
    </div>
  </div>
)}

export default ChatInput


