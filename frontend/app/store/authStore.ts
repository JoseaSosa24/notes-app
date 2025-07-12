// frontend/app/store/authStore.ts
import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface User {
  id: string
  name: string
  email: string
  isGoogleUser?: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  initAuth: () => void
  setGoogleUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({ user, token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({ user, token, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Error al crear la cuenta')
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },

  setGoogleUser: (user: User) => {
    //console.log('✅ Configurando usuario de Google:', user)
    // No necesitamos token dummy aqui, el AuthProvider ya manejó el token real
    set({ 
      user: { ...user, isGoogleUser: true }, 
      token: localStorage.getItem('token') || 'google-session',
      loading: false,
      isInitialized: true 
    })
  },

  initAuth: () => {
    //console.log('🔍 Iniciando autenticación...')
    
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        //console.log('✅ Usuario recuperado del localStorage:', user.name)
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token, isInitialized: true })
      } catch (error) {
        console.error('❌ Error parseando usuario:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ isInitialized: true })
      }
    } else {
      //('❌ No hay datos guardados')
      set({ isInitialized: true })
    }
  }
}))