'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, BarChart3, Sun, Moon, Monitor, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, type Locale } from '@/lib/i18n'
import { useTheme } from 'next-themes'
import { AuthStatus } from '@/components/auth/auth-status'
import { useScenarios } from '@/hooks/use-scenarios'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const cycle = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Toggle theme" disabled>
        <Monitor className="size-5" />
      </Button>
    )
  }

  const ariaKey = theme === 'light' ? 'theme.light' : theme === 'dark' ? 'theme.dark' : 'theme.system'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="rounded-full"
      aria-label={t(ariaKey as any)}
    >
      {theme === 'light' && <Sun className="size-5" />}
      {theme === 'dark' && <Moon className="size-5" />}
      {(theme === 'system' || !theme) && <Monitor className="size-5" />}
    </Button>
  )
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()
  const toggle = () => {
    const next: Locale = locale === 'en' ? 'es' : 'en'
    setLocale(next)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-2 rounded-full px-3"
    >
      <Globe className="size-4" />
      <span className="text-xs font-bold">{locale.toUpperCase()}</span>
    </Button>
  )
}

export function MainHeader() {
  const { scenarios } = useScenarios()
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1440px] px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg">
            <Calculator className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight uppercase">
              {t('header.title')}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">
              {t('header.subtitle')}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {scenarios.length > 0 && (
            <Link href="/comparar">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <BarChart3 className="size-4" />
                <span className="hidden sm:inline">{t('nav.compareScenarios')}</span>
                <span className="text-xs font-bold">({scenarios.length})</span>
              </Button>
            </Link>
          )}
          <div className="hidden sm:block w-px h-6 bg-border/60 mx-1" />
          <AuthStatus />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export function MainFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border/40 bg-card/30 py-8 mt-12 w-full">
      <div className="mx-auto max-w-[1440px] px-4 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-muted-foreground">
          {t('footer.builtBy')}{" "}
          <a
            href="https://pxblx7.github.io/pablo-arroyo-product-manager/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            Pablo Arroyo — Product Manager
          </a>
        </p>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          © {new Date().getFullYear()} RETIRO MX. {t('footer.onlyEducational')}
        </p>
      </div>
    </footer>
  )
}
