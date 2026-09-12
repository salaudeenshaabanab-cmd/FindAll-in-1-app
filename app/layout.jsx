import './globals.css'

export const metadata = {
  title: 'FindAll-in-1 Store',
  description: 'E-commerce Admin Dashboard & Storefront',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
