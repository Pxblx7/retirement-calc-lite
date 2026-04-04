'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Optional: Refresh or handle migration clearing?
  }

  if (loading) return <div className="w-8 h-8 rounded animate-pulse bg-slate-200 dark:bg-slate-800" />

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <UserIcon className="w-4 h-4" />
          <span className="truncate max-w-[120px]">{user.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('auth.logout')}</span>
        </Button>
      </div>
    )
  }

  return (
    <Link href="/login">
      <Button variant="default" size="sm">
        <LogIn className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">{t('auth.login')}</span>
      </Button>
    </Link>
  )
}
