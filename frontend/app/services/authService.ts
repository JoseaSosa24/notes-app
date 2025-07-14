// frontend/app/services/authService.ts
import axios from 'axios'
import { 
  LoginCredentials, 
  RegisterData, 
  GoogleAuthData, 
  AuthResponse 
} from '@/types/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ✅ SOLO API calls - Sin estado, sin lógica de negocio
export const authService = {
  // Login con email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials)
    return response.data
  },

  // Registro de usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data)
    return response.data
  },

  // Autenticación con Google
  async authenticateWithGoogle(data: GoogleAuthData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/google`, data)
    return response.data
  },

  // Verificar token (opcional)
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}