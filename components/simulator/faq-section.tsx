"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FaqSection() {
  const { t } = useI18n()

  const faqs = [
    { q: "faq.q1", a: "faq.a1" },
    { q: "faq.q2", a: "faq.a2" },
    { q: "faq.q3", a: "faq.a3" },
    { q: "faq.q4", a: "faq.a4" },
    { q: "faq.q5", a: "faq.a5" },
  ] as const

  return (
    <Card className="w-full max-w-4xl mx-auto mt-12 bg-card border-border/40 shadow-xl shadow-black/5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          {t("faq.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/40">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                {t(faq.q)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {t(faq.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
