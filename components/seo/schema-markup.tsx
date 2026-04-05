export function SchemaMarkup() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mi Retiro MX",
    "url": "https://miretiromx.pxblx.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Simulador de retiro personal y calculadora de pensión para México. Descubre cuánto dinero necesitas para tu jubilación.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "MXN"
    }
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es un PPR corto?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Un Plan Personal de Retiro (PPR) es una cuenta especial administrada por una entidad financiera enfocada en la inversión a largo plazo para asegurar tu nivel de vida post-laboral."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuál es la diferencia entre un AFORE y un PPR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El AFORE es obligatorio y depende comúnmente de las cuotas patronales. Un PPR es un esfuerzo de inversión privado, voluntario y con beneficios fiscales que usualmente requiere montos mínimos de apertura pero otorga libertad de elección a las estrategias de inversión."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuáles son los beneficios fiscales de un PPR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De acuerdo a la ley del Impuesto Sobre la Renta (ISR) en México, los planes están regulados bajo el artículo 151 y permiten deducir aportaciones anuales topadas al 10% de ingresos o 5 UMAs, lo que ocurra primero, recibiendo una devolución de saldo a favor cada mes de Abril."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  )
}
