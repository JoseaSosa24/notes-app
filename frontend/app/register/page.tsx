// frontend/app/register/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import RegisterClient from '@/app/components/auth/RegisterClient'

export default async function RegisterPage() {
  // ✅ SSR: Si ya está autenticado, redirigir al dashboard
  const session = await auth()
  
  if (session?.user) {
    redirect('/dashboard')
  }

  return <RegisterClient />
}