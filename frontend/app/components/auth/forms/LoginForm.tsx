// frontend/app/components/auth/forms/LoginForm.tsx
'use client'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import PasswordInput from '@/app/components/ui/PasswordInput'
import Card from '@/app/components/ui/Card'
import { useLogin } from '@/hooks/useLogin'

export default function LoginForm() {
  const {
    // Estado
    isLoading,
    errors,
    
    // Métodos del formulario
    register,
    handleSubmit,
    
    // Actions
    onSubmit,
    handleGoogle
  } = useLogin()

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Accede a tus notas personales</p>
      </div>

      <Card variant="elevated" padding="lg" className="animate-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Campo de Email */}
          <Input
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo inválido'
              }
            })}
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            autoComplete="email"
          />

          {/* Campo de Contraseña */}
          <PasswordInput
            {...register('password', {
              required: 'La contraseña es requerida'
            })}
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            showToggle={true}
          />

          <Button type="submit" loading={isLoading} className="w-full" size="lg">
            Iniciar Sesión
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
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Registrarse aquí
          </Link>
        </p>
      </Card>
    </div>
  )
}