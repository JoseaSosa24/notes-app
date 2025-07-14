// frontend/hooks/useRegister.ts
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<RegisterForm>({
    mode: 'onChange' // Validación en tiempo real
  })
  const { register, handleSubmit, watch, formState: { errors } } = form

  // ✅ Lógica de negocio: Registro + Auto-login
  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setIsLoading(true)
    try {
      // 1. Crear usuario en backend
      await axios.post(`${API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password
      })
      
      // 2. Login automático con NextAuth
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (res?.error) {
        toast.error('Error al crear la cuenta')
      } else {
        toast.success('¡Cuenta creada exitosamente!')
        router.push('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Lógica de negocio: Login con Google
  const handleGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard', redirect: true })
    } catch {
      setIsLoading(false)
      toast.error('Error al registrarse con Google')
    }
  }

  return {
    // Estado
    isLoading,
    errors,
    
    // Métodos del formulario
    register,
    handleSubmit,
    watch,
    
    // Actions
    onSubmit,
    handleGoogle
  }
}