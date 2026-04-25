import type { Metadata } from 'next'
import { CompararClient } from './comparar-client'

export const metadata: Metadata = {
  title: 'Comparar Escenarios | Mi Retiro MX',
  robots: { index: false, follow: false },
}

export default function CompararPage() {
  return <CompararClient />
}
