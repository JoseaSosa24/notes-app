// frontend/app/components/auth/RegisterClient.tsx (Versión alternativa más limpia)
'use client'
import AuthHero from './AuthHero'
import RegisterForm from '@/app/components/auth/forms/RegisterForm'


export default function RegisterClient() {
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
        <RegisterForm />
      </div>
    </div>
  )
}