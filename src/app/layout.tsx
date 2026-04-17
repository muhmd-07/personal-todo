import type { Metadata, Viewport } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Nudge',
  description: 'Personal task manager',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Nudge' },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
