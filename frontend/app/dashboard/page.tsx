// frontend/app/dashboard/page.tsx 
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import DashboardClient from '@/app/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  // ✅ SSR: Verificar autenticación en el servidor
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <DashboardClient 
      initialNotes={[]}
    />
  )
}