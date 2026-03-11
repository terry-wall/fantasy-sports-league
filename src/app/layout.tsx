import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fantasy Sports League',
  description: 'Fantasy sports league application with live data updates and team management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Fantasy Sports League
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
              <Link href="/league" className="hover:text-blue-200">
                League
              </Link>
              <Link href="/team" className="hover:text-blue-200">
                My Team
              </Link>
              <Link href="/players" className="hover:text-blue-200">
                Players
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
