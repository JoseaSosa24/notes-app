'use client'

import { FileText, Search, LogOut, User, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <FileText className="h-6 w-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Mis Notas</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {session?.user?.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                <LogOut className="h-4 w-4 mr-1" /> 
                Cerrar Sesión
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header del panel */}
        <div className="flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido del panel */}
        <div className="p-4 space-y-6">
          {/* User Profile */}
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-4 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl" 
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Cerrar Sesión</div>
                <div className="text-xs opacity-70">Salir de la aplicación</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}