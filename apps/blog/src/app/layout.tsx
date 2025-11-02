import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlogSpace',
  description: 'A modern blogging platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isAuthRoute = pathname.startsWith('/posts')

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAuthRoute && <Navbar />}
        <main className={isAuthRoute ? 'pt-0' : ''}>
          {children}
        </main>
      </body>
    </html>
  )
}
