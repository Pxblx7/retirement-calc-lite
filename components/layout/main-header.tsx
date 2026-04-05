'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, BarChart3, Sun, Moon, Monitor, Globe, Coffee, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n, type Locale } from '@/lib/i18n'
import { useTheme } from 'next-themes'
import { AuthStatus } from '@/components/auth/auth-status'
import { useScenarios } from '@/hooks/use-scenarios'
import { releases } from '@/lib/releases'

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
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

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
          {mounted && scenarios.length > 0 && (
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

import { seoComparisons } from '@/lib/seo-comparisons'

export function MainFooter() {
  const { t, locale } = useI18n()

  return (
    <footer className="border-t border-border/40 bg-card/30 py-8 mt-12 w-full">
      <div className="mx-auto max-w-[1440px] px-4 flex flex-col items-center gap-4 text-center">
        
        {/* Directorio SEO (Comparativas, Glosario, Blog) */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 w-full">
          {seoComparisons.map((c) => (
            <Link key={c.slug} href={`/comparativas/${c.slug}`} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              {locale === 'en' ? c.enH1 : c.h1}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-2 border-l border-border/50 pl-4">
            <Link href="/blog" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
              <BookOpen className="size-3" />
              {locale === 'en' ? 'Blog' : 'Blog'}
            </Link>
            <Link href="/glosario" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
              <BookOpen className="size-3" />
              {locale === 'en' ? 'Glossary' : 'Glosario'}
            </Link>
          </div>
        </div>

        {/* Monetization / CTA Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-2">
          <a
            href="https://fintual.mx/r/pabloa7q"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <span className="text-sm font-semibold text-primary group-hover:text-primary/80 group-hover:underline transition-colors">
              {t('footer.fintualCTA')}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
              {t('footer.supportCreator')}
            </span>
          </a>

          <div className="hidden sm:block w-px h-8 bg-border/60" />

          <a
            href="https://ko-fi.com/pabloarroyo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.051-3.954-1.09-1.465-1.083-3.189.043-4.181 1.096-.948 2.85-.807 3.966.1a3.02 3.02 0 0 1 .159.13l.114.122.115-.121a2.844 2.844 0 0 1 .16-.13c1.117-.907 2.871-1.048 3.967-.1 1.125.992 1.134 2.716.044 4.181zm7.42 2.766c-1.815 0-2.846-2.028-2.846-2.028V6.637s1.396-.118 2.812-.046c.866.045 2.122.257 2.378 1.94.316 2.121-.191 4.542-2.344 4.697z"/>
              </svg>
              {t('footer.kofiCTA')}
            </Button>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              {t('footer.kofiSub')}
            </span>
          </a>
        </div>

        {/* Credits */}
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

        {/* Copyright & Version */}
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} MI RETIRO MX. {t('footer.onlyEducational')}</span>
          <span className="w-1 h-1 rounded-full bg-border/60" />
          <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">v{releases[0].version}</span>
        </p>
      </div>
    </footer>
  )
}
