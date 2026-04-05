"use client"

import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import type { GlossaryTerm } from "@/lib/glossary-data"
import { useI18n } from "@/lib/i18n"

export function GlossaryGridClient({ glossaryData }: { glossaryData: GlossaryTerm[] }) {
  const { locale } = useI18n()
  
  // Sort alphabetically by current locale's term
  const sortedTerms = [...glossaryData].sort((a, b) => {
    const termA = locale === 'en' ? a.en.term : a.es.term
    const termB = locale === 'en' ? b.en.term : b.es.term
    return termA.localeCompare(termB)
  })

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-12 flex-grow w-full">
      <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="bg-primary/10 size-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="size-8 text-primary" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          {locale === 'en' ? 'Financial Glossary' : 'Glosario Financiero'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === 'en' 
            ? 'Understand the key terms about AFOREs, SAT, and investments to plan your retirement in Mexico informedly.' 
            : 'Comprende los términos clave sobre las AFOREs, el SAT y las inversiones para planear tu retiro en México de forma informada.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTerms.map((item) => {
          const content = locale === 'en' ? item.en : item.es
          return (
            <Link 
              key={item.slug} 
              href={`/glosario/${item.slug}`}
              className="group flex flex-col justify-between p-6 rounded-2xl border bg-card hover:border-primary/50 transition-all hover:shadow-sm"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {content.term}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {content.shortDefinition}
                </p>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-primary">
                {locale === 'en' ? 'Read definition' : 'Leer definición'} <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
