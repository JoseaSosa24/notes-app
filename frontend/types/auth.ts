// frontend/types/auth.ts
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface GoogleAuthData {
  name: string
  email: string
  googleId: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    isGoogleUser?: boolean
  }
  token: string
  message: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  isGoogleUser?: boolean
}

export interface AuthResult {
  success: boolean
  error?: string
}