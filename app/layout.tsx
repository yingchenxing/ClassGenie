import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ProjectEnvContextProvider } from '../contexts/ProjectEnvContextProvider'
import { OpenAIKeyProvider } from '../contexts/OpenAIContextProvider'
import { DeepgramContextProvider } from '../contexts/DeepgramContextProvider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/auth/protected-route'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'ClassGenie',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'ClassGenie'}`,
  },
  description: 'AI-powered learning assistant for everyone',
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/images/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/images/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#D4AF37' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' }
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ProjectEnvContextProvider>
            <OpenAIKeyProvider>
              <DeepgramContextProvider>
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
                <Toaster />
              </DeepgramContextProvider>
            </OpenAIKeyProvider>
          </ProjectEnvContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
