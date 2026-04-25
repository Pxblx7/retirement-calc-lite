import type { Metadata } from 'next'
import { Suspense } from "react"
import { SimulatorCore } from "@/components/simulator/simulator-core"

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Mirrors the Spanish faq.q1–q5 / faq.a1–a5 entries in lib/i18n.tsx.
// Keep in sync — Google requires schema content to match the visible FAQ section.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es un Plan Personal de Retiro (PPR)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un PPR (Plan Personal de Retiro) es una cuenta de inversión a largo plazo diseñada para tu jubilación. En México, las aportaciones pueden ser deducibles de impuestos (Artículo 151) o tener beneficios de exención en el retiro (Artículo 93)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la edad de retiro en México?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En México, la edad estándar de retiro para acceder a los fondos de la AFORE o exenciones fiscales en un PPR es a los 65 años. Sin embargo, puedes solicitar un retiro anticipado o cesantía a partir de los 60 años bajo ciertas condiciones."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es suficiente mi AFORE para jubilarme?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Depende de tus aportaciones y salario. Históricamente, la tasa de reemplazo (porcentaje de tu último sueldo que recibirás como pensión) de la AFORE es baja (alrededor del 30-40%). Por eso es altamente recomendable complementar con un PPR o ahorro privado."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo deducir impuestos con mi PPR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Si contratas un PPR bajo el Artículo 151 de la Ley del ISR, puedes deducir tus aportaciones hasta el 10% de tus ingresos anuales o 5 UMA anualizadas (lo que resulte menor). Esto puede generar un saldo a favor en tu declaración anual del SAT."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo retirar dinero de mi PPR antes de los 65 años?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, pero si tu PPR es bajo el Artículo 151 y retiras antes de los 65 o para un fin distinto al retiro, te retendrán un 20% de ISR sobre el monto retirado. Con el Artículo 93, podrías no tener multas directas del SAT, pero pagarías impuestos ordinarios sobre los rendimientos."
      }
    }
  ]
}

export default function SimulatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Suspense>
        <SimulatorCore />
      </Suspense>
    </>
  )
}
