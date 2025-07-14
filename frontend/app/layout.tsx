import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import NextAuthSessionProvider from './components/auth/SessionProvider'
import { ThemeProvider } from './components/ui/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gestor de Notas Personal',
  description: 'Gestiona tus notas personales de forma fácil y segura',
  icons: {
   icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='%233b82f6'/><rect x='6' y='4' width='20' height='24' rx='2' fill='white'/><line x1='9' y1='10' x2='23' y2='10' stroke='%233b82f6' stroke-width='1'/><line x1='9' y1='14' x2='23' y2='14' stroke='%233b82f6' stroke-width='1'/><line x1='9' y1='18' x2='20' y2='18' stroke='%233b82f6' stroke-width='1'/></svg>",
      type: 'image/svg+xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <NextAuthSessionProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}