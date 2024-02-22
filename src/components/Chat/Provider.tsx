'use client'

import { MessagesProvider } from '@/app/context/store'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({children}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}><MessagesProvider>{children}</MessagesProvider></QueryClientProvider>
  )
}

export default Providers