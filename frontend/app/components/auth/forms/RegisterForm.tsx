// frontend/app/components/auth/forms/RegisterForm.tsx
'use client'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Card from '@/app/components/ui/Card'
import { useRegister } from '@/hooks/useRegister'

export default function RegisterForm() {
  const {
    // Estado
    isLoading,
    errors,
    fields,
    
    // Métodos del formulario
    register,
    handleSubmit,
    
    // Actions
    onSubmit,
    handleGoogle
  } = useRegister()

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
  )
}