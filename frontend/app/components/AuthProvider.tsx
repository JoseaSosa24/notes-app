// frontend/app/components/AuthProvider.tsx
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const { initAuth, setGoogleUser, user } = useAuthStore()

  useEffect(() => {
    // Si NextAuth está cargando, esperar
    if (status === 'loading') return

    // Si hay sesión de Google pero no usuario en store
    if (session?.user && !user) {
      //console.log('✅ Usuario de Google detectado, autenticando con backend...')
      
      const authenticateGoogleUser = async () => {
        try {
          const response = await axios.post(`${API_URL}/auth/google`, {
            name: session.user.name,
            email: session.user.email,
            googleId: session.user.id
          })
          
          const { token, user: backendUser } = response.data
          
          // Guardar token en localStorage para futuras requests
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(backendUser))
          
          // Configurar header de axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          //console.log('✅ Usuario de Google autenticado con backend:', backendUser.name)
          
          // Actualizar store
          setGoogleUser({
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            isGoogleUser: true
          })
        } catch (error: any) {
          //console.error('❌ Error autenticando usuario de Google:', error)
          // Si falla, al menos configurar usuario local
          setGoogleUser({
            id: session.user.id || session.user.email!,
            name: session.user.name || '',
            email: session.user.email || '',
            isGoogleUser: true
          })
        }
      }
      
      authenticateGoogleUser()
    } 
    // Si no hay sesión de Google, intentar cargar desde localStorage
    else if (!session && !user) {
      initAuth()
    }
  }, [session, status, initAuth, setGoogleUser, user])

  return <>{children}</>
}