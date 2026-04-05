"use client"

import { useI18n } from "@/lib/i18n"
import type { BlogPost } from "@/lib/blog-data"
import Link from "next/link"
import { ArrowLeft, Calculator, User, Clock, CalendarDays, BookText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogClient({ post }: { post: BlogPost }) {
  const { locale } = useI18n()
  
  // Use either the EN or ES object based on context
  const content = locale === 'en' ? post.en : post.es

  const formattedDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(post.date))

  return (
    <article className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 border-b border-border/40 pb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="mr-1 size-4" />
          {locale === 'en' ? 'Back to Blog' : 'Volver al Blog'}
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {content.title}
        </h1>
        <p className="text-xl text-muted-foreground font-medium pt-2">
          {content.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <User className="size-4 text-primary" />
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {post.readTime} read
          </div>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-p:leading-relaxed prose-headings:text-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      ">
        {content.content}
      </div>

      <div className="mt-12 rounded-2xl bg-secondary/30 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <BookText className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-bold">
            {locale === 'en' ? 'Bibliography & Sources' : 'Bibliografía y Fuentes'}
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {content.bibliography.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary/60">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center max-w-3xl mx-auto">
        <div className="bg-primary/20 size-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="size-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          {locale === 'en' 
            ? 'Put this strategy into action' 
            : 'Pon esta estrategia en acción'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {locale === 'en'
            ? 'Stop guessing. Use our simulator to project your pension, adjust your contributions, and calculate your tax return in minutes.'
            : 'Deja de adivinar. Utiliza nuestro simulador para proyectar tu pensión, ajustar tus aportaciones y calcular tu devolución de impuestos en minutos.'}
        </p>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
            {locale === 'en' ? 'Calculate my Retirement' : 'Simular mi Retiro'}
          </Button>
        </Link>
      </div>
    </article>
  )
}
