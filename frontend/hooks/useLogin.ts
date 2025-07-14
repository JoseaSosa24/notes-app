// frontend/hooks/useLogin.ts
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export interface LoginForm {
  email: string
  password: string
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<LoginForm>({
    mode: 'onChange' // Validación en tiempo real
  })
  const { register, handleSubmit, formState: { errors } } = form

  // ✅ Lógica de negocio: Login con credenciales
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (res?.error) {
        toast.error('Credenciales inválidas')
      } else {
        toast.success('¡Bienvenido de vuelta!')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Error al iniciar sesión')
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
      toast.error('Error al iniciar sesión con Google')
    }
  }

  return {
    // Estado
    isLoading,
    errors,
    
    // Métodos del formulario
    register,
    handleSubmit,
    
    // Actions
    onSubmit,
    handleGoogle
  }
}