// frontend/app/components/auth/forms/RegisterForm.tsx
'use client'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import PasswordInput from '@/app/components/ui/PasswordInput'
import Card from '@/app/components/ui/Card'
import { useRegister } from '@/hooks/useRegister'

export default function RegisterForm() {
  const {
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
  } = useRegister()

  // Observar el valor de password para validar confirmPassword
  const passwordValue = watch('password')

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Únete y comienza a gestionar tus notas</p>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Campo de Nombre */}
          <Input
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Al menos 2 caracteres' }
            })}
            label="Nombre Completo"
            type="text"
            placeholder="Tu nombre completo"
            error={errors.name?.message}
            autoComplete="name"
          />

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
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'Al menos 6 caracteres' }
            })}
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="new-password"
            showToggle={true}
          />

          {/* Campo de Confirmar Contraseña */}
          <PasswordInput
            {...register('confirmPassword', {
              required: 'Confirma tu contraseña',
              validate: (val) => val === passwordValue || 'Las contraseñas no coinciden'
            })}
            label="Confirmar Contraseña"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            showToggle={true}
          />

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
  )
}