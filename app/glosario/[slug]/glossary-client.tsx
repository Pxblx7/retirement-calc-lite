"use client"

import { useI18n } from "@/lib/i18n"
import { type GlossaryTerm } from "@/lib/glossary-data"
import Link from "next/link"
import { ArrowLeft, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GlossaryClient({ termData }: { termData: GlossaryTerm }) {
  const { locale } = useI18n()
  
  // Use either the EN or ES object based on context
  const content = locale === 'en' ? termData.en : termData.es

  return (
    <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <Link 
          href="/glosario" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="mr-1 size-4" />
          {locale === 'en' ? 'Back to Glossary' : 'Volver al Glosario'}
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {content.term}
        </h1>
        <p className="text-xl text-muted-foreground font-medium pt-2">
          {content.shortDefinition}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="leading-relaxed">
          {content.detailedExplanation}
        </p>
      </div>

      <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center max-w-2xl mx-auto">
        <div className="bg-primary/20 size-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="size-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          {locale === 'en' 
            ? 'Put this knowledge into practice' 
            : 'Pon este conocimiento en práctica'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {locale === 'en'
            ? `Discover the real impact of concepts like ${content.term} on your money and future using our retirement simulator.`
            : `Descubre el impacto real de conceptos como ${content.term} en tu dinero y futuro usando nuestro simulador de retiro.`}
        </p>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
            {locale === 'en' ? 'Calculate my Retirement' : 'Calcular mi Retiro'}
          </Button>
        </Link>
      </div>
    </article>
  )
}
