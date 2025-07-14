'use client'

import { FileText, Search, LogOut, User, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/app/components/ui/Button'
import ThemeToggle from '@/app/components/ui/ThemeToggle'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: '/login'
    })
    router.push('/login')
    toast.success('Sesión cerrada correctamente')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b ...">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-primary-600" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Mis Notas</h1>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{session?.user?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Cerrar Sesión
          </Button>
        </div>

        {/* Móvil: botón + toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{session?.user?.name}</span>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
            </Button>
          </div>
        </nav>
      )}
    </header>

  )
}