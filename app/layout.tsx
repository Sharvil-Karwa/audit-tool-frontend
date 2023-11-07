
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import ToastProvider from '@/providers/toast-provider'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { ClerkProvider, currentUser } from '@clerk/nextjs'

const urbanist = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audit Tool',
  description: 'Audit Tool',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const user = await currentUser();
  // const email = user ? user.emailAddresses[0].emailAddress : "";
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={urbanist.className}>
        <ToastProvider />
        {/* <Navbar email=''/> */}
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
