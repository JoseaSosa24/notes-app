// frontend/hooks/useAuth.ts
import { authService } from '@/app/services/authService'
import { LoginCredentials, RegisterData, AuthResult } from '@/types/auth'
import { signIn, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export const useAuth = () => {
  const router = useRouter()

  // ✅ Lógica de negocio: Login con credenciales
  const loginWithCredentials = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      // NextAuth manejará internamente la llamada al authService
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Credenciales inválidas')
        return { success: false, error: result.error }
      }

      toast.success('¡Bienvenido de vuelta!')
      return { success: true }
    } catch (error: any) {
      console.error('Error en login:', error)
      toast.error('Error al iniciar sesión')
      return { success: false, error: error.message }
    }
  }

  // ✅ Lógica de negocio: Login con Google
  const loginWithGoogle = async (): Promise<AuthResult> => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error en Google login:', error)
      toast.error('Error al iniciar sesión con Google')
      return { success: false, error: error.message }
    }
  }

  // ✅ Lógica de negocio: Registro + Auto-login
  const registerAndLogin = async (data: RegisterData): Promise<AuthResult> => {
    try {
      // 1. Crear usuario en backend
      await authService.register(data)

      // 2. Hacer login automático con NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Error al crear la cuenta')
        return { success: false, error: result.error }
      }

      toast.success('¡Cuenta creada exitosamente!')
      return { success: true }
    } catch (error: any) {
      console.error('Error en registro:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // ✅ Lógica de negocio: Logout completo
  const logout = async (): Promise<AuthResult> => {
    try {
      // Limpiar token de axios
      delete axios.defaults.headers.common['Authorization']
      
      // Cerrar sesión en NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/login'
      })
      
      toast.success('Sesión cerrada correctamente')
      router.push('/login')
      return { success: true }
    } catch (error: any) {
      console.error('Error en logout:', error)
      toast.error('Error al cerrar sesión')
      return { success: false, error: error.message }
    }
  }

  // ✅ Lógica de negocio: Configurar token en axios
  const configureAxiosToken = (token: string) => {
    if (token && token !== 'google-temp') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return true
    }
    return false
  }

  // ✅ Lógica de negocio: Limpiar configuración
  const clearAuthConfig = () => {
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    // Auth actions
    loginWithCredentials,
    loginWithGoogle,
    registerAndLogin,
    logout,
    
    // Config helpers
    configureAxiosToken,
    clearAuthConfig
  }
}