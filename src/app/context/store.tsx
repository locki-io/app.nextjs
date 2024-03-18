/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, createContext, useContext, useState } from 'react';
import { DataNft } from '@itheum/sdk-mx-data-nft/out';
import { Message } from '@/lib/validators/message';
import { nanoid } from 'nanoid';
import { Vector3 } from 'three';
import { create } from 'zustand';

export interface ExtendedDataNft extends DataNft {
  index: number;
  dataNftSelected: boolean;
  position: Vector3;
  datastreamLoading: boolean;
  datastreamContent?: string;
  contentType?: string;
}

// Define the initial value for dataNfts
export const DataNfts: ExtendedDataNft[] = [];

export const DataNftsContext = createContext<ExtendedDataNft[]>(DataNfts);

export const useDataNfts = () => useContext(DataNftsContext);

interface DatastreamStore {
  dataNfts: ExtendedDataNft[];
  setDatastream: (
    nonce: number,
    loading: boolean,
    content?: string,
    contentType?: string
  ) => void;
}

export const useDatastreamStore = create<DatastreamStore>((set) => ({
  dataNfts: DataNfts,
  setDatastream: (nonce, loading, content, contentType) =>
    set((state) => ({
      dataNfts: state.dataNfts.map((dataNft) =>
        dataNft.nonce === nonce
          ? {
              ...dataNft,
              datastreamLoading: loading,
              datastreamContent: content,
              contentType: contentType
            }
          : dataNft
      )
    }))
}));

export const MessagesContext = createContext<{
  messages: Message[];
  isMessageUpdating: boolean;
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
  setIsMessageUpdating: (isUpdating: boolean) => void;
}>({
  messages: [],
  isMessageUpdating: false,
  addMessage: () => {},
  removeMessage: () => {},
  updateMessage: () => {},
  setIsMessageUpdating: () => {}
});

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      text: 'I am a 3D asset assistant, I use the default knowledge of locki to help me start with making 3D dataNFTs',
      isUserMessage: false
    }
  ]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const updateMessage = (
    id: string,
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      })
    );
  };
  return (
    <MessagesContext.Provider
      value={{
        messages,
        isMessageUpdating,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
