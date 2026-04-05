export interface Release {
  version: string
  date: string
  title: string
  features: string[]
}

export const releases: Release[] = [
  {
    version: "1.1.0",
    date: "Abril 2026",
    title: "Hub de Contenido, SEO y Novedades 📚",
    features: [
      "Blog bilingüe (ES/EN) con artículos escritos por Pablo Arroyo — optimizados para SEO y AEO.",
      "Glosario financiero con 10+ términos clave (AFORE, PPR, VPN, Interés Compuesto, etc.).",
      "Páginas comparativas (AFORE vs PPR) con structured data / JSON-LD para motores de búsqueda.",
      "Modal de Novedades: al actualizar la app verás automáticamente las últimas mejoras.",
    ],
  },
  {
  version: "1.0.0",
  date: "Abril 2026",
  title: "Primer Lanzamiento Oficial 🎉",
  features: [
    "Simulador completo para planear tu retiro en México.",
    "Calcula tu pensión mínima garantizada del AFORE.",
    "Agrega y compara múltiples cuentas y estrategias de PPR.",
    "Recomendaciones personalizadas mediante Inteligencia Artificial impulsada por Gemini.",
    "Soporte para Guardar y Comparar escenarios en tiempo real.",
  ],
  },
]

