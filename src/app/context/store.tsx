/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, createContext, useContext, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";

export interface ExtendedDataNft extends DataNft {
  dataNftSelected: boolean;
}

export const DataNftsContext = createContext<ExtendedDataNft[]>([]);

export const useDataNfts = () => useContext(DataNftsContext);

export const MessagesContext = createContext<{
  messages: Message[]
  isMessageUpdating: boolean
  addMessage: (message: Message) => void
  removeMessage: (id: string) => void
  updateMessage: (id:string, updateFn: (prevText: string) => string) => void
  setIsMessageUpdating: (isUpdating: boolean) => void
}>({
  messages : [],
  isMessageUpdating: false,
  addMessage: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {},
})

export function MessagesProvider({children}: {children: ReactNode}) {
  const [isMessageUpdating, setIsMessageUpdating ] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      text:'Select a DataNft and paste the code here, please I will describe it',
      isUserMessage: false,
    },
  ])

  const addMessage =(message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id ))
  }

  const updateMessage = (
    id: string,
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) }
        }
        return message
      })
    )
  }
  return (
    <MessagesContext.Provider value={{
      messages, 
      isMessageUpdating,
      addMessage,
      removeMessage,
      updateMessage,
      setIsMessageUpdating

  }}>
    {children}
  </MessagesContext.Provider>
  )
}