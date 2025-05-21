import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactNode } from "react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VPN Service', // Changed from default
  description: 'Your secure VPN solution', // Updated description
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      {/* Added inter font to body */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}