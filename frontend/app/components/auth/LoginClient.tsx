'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Card from '@/app/components/ui/Card'

interface LoginForm {
  email: string
  password: string
}

type FieldConfig = {
  name: keyof LoginForm
  label: string
  type: string
  placeholder: string
  validation: any
  isPassword?: boolean
  toggle?: () => void
  showValue?: boolean
}

export default function LoginClient() {
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const fields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'tu@email.com',
      validation: {
        required: 'El correo es requerido',
        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Correo inválido' }
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

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      if (res?.error) toast.error('Credenciales inválidas')
      else {
        toast.success('¡Bienvenido de vuelta!')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Error al iniciar sesión')
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
      toast.error('Error al iniciar sesión con Google')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?...&auto=format&fit=crop&w=2070&q=80)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Organiza tus ideas</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Gestiona tus notas de forma inteligente y mantén tus pensamientos organizados en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Accede a tus notas personales</p>
          </div>

          <Card variant="elevated" padding="lg" className="animate-in slide-in-from-bottom-4 duration-500">
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
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onClick={field.toggle}>
                        {field.showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <Button type="submit" loading={isLoading} className="w-full" size="lg">Iniciar Sesión</Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O continúa con</span></div>
              </div>

              <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading} className="w-full" size="lg">
                <FcGoogle className="h-5 w-5 mr-2" /> Continuar con Google
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">Registrarse aquí</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
