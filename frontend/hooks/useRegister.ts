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

export type FieldConfig = {
  name: keyof RegisterForm
  label: string
  type: string
  placeholder: string
  validation: any
  isPassword?: boolean
  toggle?: () => void
  showValue?: boolean
}

export const useRegister = () => {
  const [showPass, setShowPass] = useState({ password: false, confirm: false })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<RegisterForm>()
  const { register, handleSubmit, watch, formState: { errors } } = form
  const passwordValue = watch('password')

  // ✅ Configuración de campos del formulario
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      placeholder: 'Tu nombre completo',
      validation: {
        required: 'El nombre es requerido',
        minLength: { value: 2, message: 'Al menos 2 caracteres' }
      }
    },
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
      type: showPass.password ? 'text' : 'password',
      placeholder: '••••••••',
      validation: {
        required: 'La contraseña es requerida',
        minLength: { value: 6, message: 'Al menos 6 caracteres' }
      },
      isPassword: true,
      toggle: () => setShowPass(s => ({ ...s, password: !s.password })),
      showValue: showPass.password
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: showPass.confirm ? 'text' : 'password',
      placeholder: '••••••••',
      validation: {
        required: 'Confirma tu contraseña',
        validate: (val: string) => val === passwordValue || 'Las contraseñas no coinciden'
      },
      isPassword: true,
      toggle: () => setShowPass(s => ({ ...s, confirm: !s.confirm })),
      showValue: showPass.confirm
    }
  ]

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