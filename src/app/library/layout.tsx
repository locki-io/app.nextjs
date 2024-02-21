// 
import { Inter } from 'next/font/google';
import Chat from "@/components/Chat/Chat";
const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: 'DATANFT Library',
  description: 'My Nft Library',
}

export default function Layout({
  children,
}:{
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <Chat />
      {children}
    </div>
  )
}