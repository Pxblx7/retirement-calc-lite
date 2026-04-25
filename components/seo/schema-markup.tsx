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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
    />
  )
}
