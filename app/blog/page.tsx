import { blogData } from "@/lib/blog-data"
import { MainHeader, MainFooter } from "@/components/layout/main-header"
import { BlogGridClient } from "./blog-grid-client"

export const metadata = {
  title: "Blog de Retiro y Finanzas Personales | Mi Retiro MX",
  description: "Estrategias, análisis y guías para maximizar tu pensión y asegurar un retiro digno en México. AFOREs, PPRs, y optimización fiscal.",
  openGraph: {
    title: "Blog de Retiro y Finanzas | Mi Retiro MX",
    description: "Estrategias, análisis y guías para maximizar tu pensión y asegurar un retiro digno en México.",
    type: "website",
  }
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <BlogGridClient blogData={blogData} />
      <MainFooter />
    </div>
  )
}
