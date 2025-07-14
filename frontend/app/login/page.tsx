// frontend/app/login/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import LoginClient from '@/app/components/auth/LoginClient'

export default async function LoginPage() {
  // ✅ SSR: Si ya está autenticado, redirigir al dashboard
  const session = await auth()
  
  if (session?.user) {
    redirect('/dashboard')
  }

  return <LoginClient />
}