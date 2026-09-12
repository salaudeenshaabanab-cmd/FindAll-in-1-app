import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FindAll In 1 - Official Store',
  description: 'Your trusted store catalog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
