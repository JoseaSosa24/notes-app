// frontend/app/components/auth/RegisterClient.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Card from '@/app/components/ui/Card'
import AuthHero from '@/app/components/auth/AuthHero'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FieldConfig = {
  name: keyof RegisterForm
  label: string
  type: string
  placeholder: string
  validation: any
  isPassword?: boolean
  toggle?: () => void
  showValue?: boolean
}

export default function RegisterClient() {
  const [showPass, setShowPass] = useState({ password: false, confirm: false })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const passwordValue = watch('password')

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

  const onSubmit: SubmitHandler<RegisterForm> = async data => {
    setIsLoading(true)
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password
      })
      
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

  const handleGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard', redirect: true })
    } catch {
      setIsLoading(false)
      toast.error('Error al registrarse con Google')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <AuthHero 
        title="Comienza tu viaje"
        description="Únete a miles de usuarios que ya organizan sus ideas de manera eficiente con nuestra plataforma."
        backgroundImage="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
      />

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Únete y comienza a gestionar tus notas</p>
          </div>

          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {fields.map(field => (
                <div key={field.name} className={field.isPassword ? 'space-y-1' : undefined}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <div className={field.isPassword ? 'relative' : undefined}>
                    <Input
                      {...register(field.name, field.validation)}
                      type={field.type}
                      placeholder={field.placeholder}
                      error={errors[field.name]?.message as string | undefined}
                      className={field.isPassword ? 'pr-10' : undefined}
                    />
                    {field.isPassword && field.toggle && (
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
                        onClick={field.toggle}
                      >
                        {field.showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <Button type="submit" loading={isLoading} className="w-full" size="lg">
                Crear Cuenta
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O continúa con</span>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading} className="w-full" size="lg">
                <FcGoogle className="h-5 w-5 mr-2" /> Continuar con Google
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Iniciar sesión aquí
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}