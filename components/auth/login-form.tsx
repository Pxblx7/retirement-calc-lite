'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/lib/i18n'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface LoginFormProps {
  initialError?: string | null
}

export function LoginForm({ initialError }: LoginFormProps = {}) {
  const { locale } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    initialError ? 'error' : 'idle'
  )
  const [errorMessage, setErrorMessage] = useState(initialError ?? '')
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })

      if (error) throw error
      setStatus('success')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Error occurred')
      setStatus('error')
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {locale === 'es' ? 'Inicia Sesión' : 'Login'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === 'es' ? 'Ingresa tu email para recibir un enlace mágico (no necesitas contraseña).' : 'Enter your email to receive a magic link (no password required).'}
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-xl text-center border border-green-200 dark:border-green-800/50">
             <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
             <h3 className="font-semibold mb-1">{locale === 'es' ? '¡Revisa tu correo!' : 'Check your email!'}</h3>
             <p className="text-sm">
               {locale === 'es' ? 'Te enviamos un enlace de un solo uso para acceder a tu cuenta.' : 'We sent you a one-time link to access your account.'}
             </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                {locale === 'es' ? 'Correo Electrónico' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  placeholder={locale === 'es' ? 'ejemplo@correo.com' : 'example@email.com'}
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-start bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800/50">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {locale === 'es' ? 'Enviando enlace...' : 'Sending link...'}
                </>
              ) : (
                locale === 'es' ? 'Recibir enlace mágico' : 'Receive magic link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
