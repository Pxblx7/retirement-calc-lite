import { type SimConfig } from "./simulation"
import { type PPRConfig, createDefaultPPR } from "./ppr-helpers"

export interface SeoComparisonTemplate {
  slug: string
  title: string
  description: string
  h1: string
  subtitle: string
  enTitle: string
  enDescription: string
  enH1: string
  enSubtitle: string
  initialConfig: Partial<SimConfig>
  initialPPRs: Partial<PPRConfig>[]
}

export const seoComparisons: SeoComparisonTemplate[] = [
  {
    slug: "afore-vs-fintual",
    title: "Calculadora de Retiro: AFORE vs Fintual PPR",
    description: "Compara el rendimiento de tu AFORE contra el Plan Personal de Retiro (PPR) de Fintual. Calcula tu pensión estimada y beneficios fiscales.",
    h1: "AFORE vs Fintual PPR",
    subtitle: "Descubre en segundos cuánto podrías ganar invirtiendo tu dinero en Fintual vs dejarlo solo en tu AFORE.",
    enTitle: "Retirement Calculator: AFORE vs Fintual PPR",
    enDescription: "Compare your AFORE's performance against Fintual's Personal Retirement Plan (PPR). Calculate your estimated pension and tax benefits.",
    enH1: "AFORE vs Fintual PPR",
    enSubtitle: "Discover in seconds how much you could earn by investing your money in Fintual vs leaving it only in your AFORE.",
    initialConfig: {
      afore: { initialBalance: 100000, monthlyContribution: 2000, annualReturn: 0.06, grossSalary: 10000, annualContributionIncrement: 0 },
    },
    initialPPRs: [
      {
        label: "PPR Fintual",
        annualReturn: 0.09,
        annualContributionIncrement: 0,
        monthlyContribution: 2000,
        taxArticle: 'art151',
        satRefund: 0,
        initialBalance: 0
      }
    ]
  },
  {
    slug: "afore-vs-gbm",
    title: "Calculadora de Retiro: AFORE vs GBM PPR",
    description: "Compara tu saldo de AFORE contra el Plan Personal de Retiro de GBM. Simula diferentes escenarios de inversión a largo plazo.",
    h1: "AFORE vs GBM PPR",
    subtitle: "Simula tus rendimientos combinando tu AFORE y un portafolio de inversión en GBM.",
    enTitle: "Retirement Calculator: AFORE vs GBM PPR",
    enDescription: "Compare your AFORE balance against GBM's Personal Retirement Plan. Simulate different long-term investing scenarios.",
    enH1: "AFORE vs GBM PPR",
    enSubtitle: "Simulate your returns by combining your AFORE and an investment portfolio in GBM.",
    initialConfig: {
      afore: { initialBalance: 100000, monthlyContribution: 0, annualReturn: 0.06, grossSalary: 10000, annualContributionIncrement: 0 },
    },
    initialPPRs: [
      {
        label: "PPR GBM",
        annualReturn: 0.085,
        annualContributionIncrement: 0,
        monthlyContribution: 2500,
        taxArticle: 'art151',
        satRefund: 0,
        initialBalance: 0
      }
    ]
  },
  {
    slug: "afore-vs-actinver",
    title: "Calculadora de Retiro: AFORE vs Actinver PPR",
    description: "Evalúa tu pensión proyectada en tu AFORE comparada con Actinver. Maximiza tus deducciones de impuestos.",
    h1: "AFORE vs Actinver PPR",
    subtitle: "Compara los beneficios fiscales del Artículo 151 y cómo impacta en tu fondo de retiro.",
    enTitle: "Retirement Calculator: AFORE vs Actinver PPR",
    enDescription: "Evaluate your projected pension in your AFORE compared to Actinver. Maximize your tax deductions.",
    enH1: "AFORE vs Actinver PPR",
    enSubtitle: "Compare the tax benefits of Article 151 and how it impacts your retirement fund.",
    initialConfig: {
      afore: { initialBalance: 200000, monthlyContribution: 1000, annualReturn: 0.06, grossSalary: 10000, annualContributionIncrement: 0 },
    },
    initialPPRs: [
      {
        label: "PPR Actinver",
        annualReturn: 0.08,
        annualContributionIncrement: 0,
        monthlyContribution: 3000,
        taxArticle: 'art151',
        satRefund: 0,
        initialBalance: 0
      }
    ]
  },
  {
    slug: "cetes-vs-ppr",
    title: "Invertir en Cetes vs PPR - Comparador de Retiro",
    description: "¿Conviene ahorrar en Cetes o en un PPR para tu retiro? Compara el pago de impuestos y el rendimiento compuesto a largo plazo.",
    h1: "CETES Directo vs PPR",
    subtitle: "Compara el rendimiento tradicional de Cetes contra las ventajas fiscales de un Plan Personal de Retiro.",
    enTitle: "Investing in Cetes vs PPR - Retirement Comparator",
    enDescription: "Is it better to save in Cetes or in a PPR for your retirement? Compare tax payments and long-term compound returns.",
    enH1: "CETES Directo vs PPR",
    enSubtitle: "Compare the traditional performance of Cetes against the tax advantages of a Personal Retirement Plan.",
    initialConfig: {
      afore: { initialBalance: 0, monthlyContribution: 0, annualReturn: 0.06, grossSalary: 10000, annualContributionIncrement: 0 },
    },
    initialPPRs: [
      {
        label: "Inversión Libre (Tipo Cetes)",
        annualReturn: 0.10,
        annualContributionIncrement: 0,
        monthlyContribution: 2000,
        taxArticle: 'art93',
        satRefund: 0,
        initialBalance: 0
      },
      {
        label: "PPR Deducible",
        annualReturn: 0.09,
        annualContributionIncrement: 0,
        monthlyContribution: 2000,
        taxArticle: 'art151',
        satRefund: 0,
        initialBalance: 0
      }
    ]
  }
]
