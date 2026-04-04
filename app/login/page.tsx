import { LoginForm } from '@/components/auth/login-form'
import React from 'react'
import { MainHeader, MainFooter } from '@/components/layout/main-header'

export const metadata = {
  title: 'Iniciar Sesión | RetiroMX',
  description: 'Accede a tus escenarios de retiro en la nube',
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const errorMessage = params.error ?? null

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-emerald-500/30">
      <MainHeader />

      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm initialError={errorMessage} />
      </main>

      <MainFooter />
    </div>
  )
}
