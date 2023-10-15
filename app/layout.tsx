
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import ToastProvider from '@/providers/toast-provider'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

const urbanist = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audit Tool',
  description: 'Audit Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ToastProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
