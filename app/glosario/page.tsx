import { glossaryData } from "@/lib/glossary-data"
import { MainHeader, MainFooter } from "@/components/layout/main-header"
import { GlossaryGridClient } from "./glossary-grid-client"

export const metadata = {
  title: "Glosario de Retiro y AFOREs en México | Mi Retiro MX",
  description: "Diccionario financiero sobre el retiro en México. Aprende los conceptos clave como AFORE, PPR, UMA, Modalidad 40, Artículo 151 y más.",
  openGraph: {
    title: "Glosario de Retiro y AFOREs en México",
    description: "Diccionario financiero sobre el retiro en México. Aprende los conceptos clave como AFORE, PPR, UMA, Modalidad 40, Artículo 151 y más.",
    type: "website",
  }
}

export default function GlossaryIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <GlossaryGridClient glossaryData={glossaryData} />
      <MainFooter />
    </div>
  )
}
