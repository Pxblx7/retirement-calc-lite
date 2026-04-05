import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/lib/i18n'
import { ScenariosProvider } from '@/hooks/use-scenarios'
import { SchemaMarkup } from '@/components/seo/schema-markup'
import { ReleaseModal } from '@/components/novedades/release-modal'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mi Retiro MX | Simulador de Jubilación y PPR',
  description: 'Simulador de retiro personal y calculadora de pensión para México. Compara tu AFORE, planea tu PPR (Plan Personal de Retiro) y asegura tu futuro financiero.',
  keywords: ['retiro méxico', 'simulador de retiro', 'ppr', 'afore', 'jubilación', 'plan personal de retiro', 'calculadora ppr', 'finanzas personales en méxico'],
  authors: [{ name: 'Mi Retiro MX' }],
  openGraph: {
    title: 'Mi Retiro MX | Simulador de Jubilación y PPR',
    description: 'Descubre cuánto dinero necesitas para tu jubilación en México. Compara tu AFORE y evalúa el impacto de un PPR.',
    url: 'https://miretiromx.pxblx.com',
    type: 'website',
    locale: 'es_MX',
    siteName: 'Mi Retiro MX'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Retiro MX | Simulador de Jubilación y PPR',
    description: 'Calcula tu pensión AFORE y evalúa el impacto de un PPR en tu jubilación.'
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SchemaMarkup />
        <ReleaseModal />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <ScenariosProvider>
              {children}
            </ScenariosProvider>
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
