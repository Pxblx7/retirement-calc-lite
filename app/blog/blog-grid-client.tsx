"use client"

import Link from "next/link"
import { ArrowRight, Newspaper, Clock, User } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"
import { useI18n } from "@/lib/i18n"

export function BlogGridClient({ blogData }: { blogData: BlogPost[] }) {
  const { locale } = useI18n()
  
  // Sort by date (descending)
  const sortedArticles = [...blogData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-12 flex-grow w-full">
      <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="bg-primary/10 size-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Newspaper className="size-8 text-primary" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          {locale === 'en' ? 'The Retirement Blog' : 'Blog de Retiro'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === 'en' 
            ? 'Strategies, analyses, and guides to maximize your pension and ensure a dignified retirement in Mexico.' 
            : 'Estrategias, análisis y guías para maximizar tu pensión y asegurar un retiro digno en México.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedArticles.map((article) => {
          const content = locale === 'en' ? article.en : article.es
          
          // Format date based on locale natively
          const formattedDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(article.date))

          return (
            <Link 
              key={article.slug} 
              href={`/blog/${article.slug}`}
              className="group flex flex-col justify-between p-6 rounded-2xl border bg-card hover:border-primary/50 transition-all hover:shadow-sm"
            >
              <div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {content.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {content.description}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {article.readTime}
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-primary border-t border-border/50 pt-4">
                  {locale === 'en' ? 'Read article' : 'Leer artículo'} <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
