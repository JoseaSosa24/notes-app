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

export type FieldConfig = {
  name: keyof LoginForm
  label: string
  type: string
  placeholder: string
  validation: any
  isPassword?: boolean
  toggle?: () => void
  showValue?: boolean
}

export const useLogin = () => {
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<LoginForm>()
  const { register, handleSubmit, formState: { errors } } = form

  // ✅ Configuración de campos del formulario
  const fields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'tu@email.com',
      validation: {
        required: 'El correo es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Correo inválido'
        }
      }
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: showPass ? 'text' : 'password',
      placeholder: '••••••••',
      validation: { required: 'La contraseña es requerida' },
      isPassword: true,
      toggle: () => setShowPass(v => !v),
      showValue: showPass
    }
  ]

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
    showPass,
    isLoading,
    errors,
    fields,
    
    // Métodos del formulario
    register,
    handleSubmit,
    
    // Actions
    onSubmit,
    handleGoogle
  }
}