import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://science-roadmap.vercel.app'), // Use production URL
  title: {
    default: 'Science Roadmap - Master Science from K-12 to College',
    template: '%s | Science Roadmap'
  },
  description: 'Comprehensive science learning platform with 90 free courses, interactive diagnostics, and community forum. 100% free and open source.',
  keywords: ['science', 'education', 'K-12', 'college', 'chemistry', 'physics', 'biology', 'curriculum', 'learning'],
  authors: [{ name: 'Science Roadmap Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://science-roadmap.vercel.app', // Placeholder URL
    siteName: 'Science Roadmap',
    title: 'Science Roadmap - Master Science Education',
    description: 'Access 90 free science courses from K-12 to College level.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Science Roadmap Background'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Roadmap',
    description: 'The complete journey from curiosity to discovery.',
    images: ['/og-image.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <CookieConsent />
        <Footer />
      </body>
    </html>
  )
}
