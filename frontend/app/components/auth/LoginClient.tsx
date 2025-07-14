// frontend/app/components/auth/LoginClient.tsx (Versión alternativa más limpia)
'use client'
import AuthHero from './AuthHero'
import LoginForm from '@/app/components/auth/forms/LoginForm'

export default function LoginClient() {
  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <AuthHero 
        title="Organiza tus ideas"
        description="Gestiona tus notas de forma inteligente y mantén tus pensamientos organizados en un solo lugar."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <LoginForm />
      </div>
    </div>
  )
}