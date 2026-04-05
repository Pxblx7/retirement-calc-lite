export interface GlossaryTerm {
  slug: string;
  es: {
    term: string;
    shortDefinition: string;
    detailedExplanation: string;
  };
  en: {
    term: string;
    shortDefinition: string;
    detailedExplanation: string;
  };
}

export const glossaryData: GlossaryTerm[] = [
  {
    slug: "afore",
    es: {
      term: "AFORE",
      shortDefinition: "Administradora de Fondos para el Retiro. Institución financiera privada que administra los fondos de ahorro para el retiro de los trabajadores en México.",
      detailedExplanation: "Las AFOREs son instituciones financieras en México reguladas por la CONSAR. Su propósito es administrar, invertir y proteger los ahorros que los trabajadores, sus empleadores y el gobierno aportan a sus cuentas individuales durante su vida laboral. Al llegar a la edad de retiro, los fondos acumulados se utilizan para pagar una pensión o se entregan en una sola exhibición."
    },
    en: {
      term: "AFORE (Retirement Funds Administrator)",
      shortDefinition: "A private financial institution in Mexico that manages retirement savings funds for workers.",
      detailedExplanation: "AFOREs are financial institutions in Mexico regulated by CONSAR. Their purpose is to manage, invest, and protect the savings contributed by workers, employers, and the government to individual accounts throughout a person's working life. Upon reaching retirement age, the accumulated funds are used to pay a pension or are disbursed as a lump sum."
    }
  },
  {
    slug: "ppr",
    es: {
      term: "PPR (Plan Personal de Retiro)",
      shortDefinition: "Un producto de inversión privado a largo plazo diseñado para complementar o sustituir a la AFORE, con importantes beneficios fiscales.",
      detailedExplanation: "El Plan Personal de Retiro (PPR) es una herramienta de inversión ofrecida por aseguradoras, bancos y casas de bolsa. A diferencia del ahorro voluntario tradicional, las aportaciones al PPR son deducibles de impuestos (hasta ciertos límites legales), lo que permite al inversionista recuperar un porcentaje de lo invertido en su declaración anual ante el SAT."
    },
    en: {
      term: "PPR (Personal Retirement Plan)",
      shortDefinition: "A long-term private investment product designed to supplement or substitute the AFORE, featuring significant tax benefits.",
      detailedExplanation: "The Personal Retirement Plan (PPR) is an investment tool offered by insurance companies, banks, and brokerages. Unlike traditional voluntary savings, contributions to a PPR are tax-deductible (up to certain legal limits). This allows investors to recover a percentage of their invested capital during their annual tax return with the SAT (Mexican IRS)."
    }
  },
  {
    slug: "uma",
    es: {
      term: "UMA (Unidad de Medida y Actualización)",
      shortDefinition: "Referencia económica en pesos usada para determinar la cuantía del pago de obligaciones y supuestos previstos en las leyes federales de México.",
      detailedExplanation: "Creada para desindexar el salario mínimo, la UMA es el valor base con el que se calculan multas, impuestos y los topes de deducción para productos financieros como los PPRs. El INEGI actualiza su valor anualmente conforme a la inflación. Por ejemplo, el tope de deducción del Artículo 151 equivale a 5 UMAs anualizadas."
    },
    en: {
      term: "UMA (Unit of Measurement and Update)",
      shortDefinition: "An economic reference in Mexican pesos used to determine the amount of payment obligations and thresholds stipulated in federal laws.",
      detailedExplanation: "Created to replace the minimum wage as an index, the UMA is the base value used to calculate fines, taxes, and deduction limits for financial products like PPRs. INEGI updates its value annually based on inflation. For example, the deduction limit under Article 151 is equivalent to 5 annualized UMAs."
    }
  },
  {
    slug: "articulo-151",
    es: {
      term: "Artículo 151 LISR",
      shortDefinition: "Artículo de la Ley del Impuesto Sobre la Renta que permite deducir impuestos por aportaciones voluntarias al retiro.",
      detailedExplanation: "Este artículo permite a las personas físicas deducir en su declaración anual las aportaciones realizadas a sus cuentas de PPR, hasta el 10% de sus ingresos anuales acumulables o el equivalente a 5 UMAs anualizadas (lo que resulte menor). Es la base del beneficio fiscal más importante para el ahorro en México."
    },
    en: {
      term: "Article 151 LISR",
      shortDefinition: "Article of the Mexican Income Tax Law that allows tax deductions for voluntary retirement contributions.",
      detailedExplanation: "This article allows individuals to deduct contributions made to their PPR accounts on their annual tax return, up to 10% of their accumulated annual income or the equivalent of 5 annualized UMAs (whichever is less). This is the foundation of the most significant tax benefit for savings in Mexico."
    }
  },
  {
    slug: "articulo-93",
    es: {
      term: "Artículo 93 LISR",
      shortDefinition: "Artículo que establece los ingresos que están exentos del pago del Impuesto Sobre la Renta (ISR) al momento del retiro.",
      detailedExplanation: "El Artículo 93 estipula, entre otras cosas, que si el inversionista retira sus fondos de ahorro para el retiro (como los de un PPR) después de cumplir 60 años de edad, los rendimientos obtenidos y el capital estarán libres del pago de impuestos, respetando ciertos límites."
    },
    en: {
      term: "Article 93 LISR",
      shortDefinition: "Article that establishes which income is exempt from Income Tax (ISR) payments upon retirement.",
      detailedExplanation: "Article 93 stipulates, among other things, that if an investor withdraws their retirement savings (such as from a PPR) after reaching the age of 60, the returns generated and the capital will be tax-free, subject to certain limits."
    }
  },
  {
    slug: "interes-compuesto",
    es: {
      term: "Interés Compuesto",
      shortDefinition: "El proceso mediante el cual los intereses generados por una inversión se reinvierten para generar aún más intereses.",
      detailedExplanation: "El interés compuesto es la 'magia' detrás del crecimiento acelerado en el ahorro para el retiro a largo plazo. A diferencia del interés simple, donde el capital genera rendimientos fijos, en el interés compuesto los rendimientos de hoy se suman a tu capital de mañana, generando un crecimiento exponencial a lo largo del tiempo."
    },
    en: {
      term: "Compound Interest",
      shortDefinition: "The process through which interest generated by an investment is reinvested to generate even more interest.",
      detailedExplanation: "Compound interest is the 'magic' behind accelerated growth in long-term retirement savings. Unlike simple interest, where capital generates a fixed return, compound interest adds today's returns to tomorrow's principal, creating exponential growth over time."
    }
  },
  {
    slug: "modalidad-40",
    es: {
      term: "Modalidad 40",
      shortDefinition: "Continuación Voluntaria al Régimen Obligatorio del IMSS. Permite a trabajadores inactivos seguir aportando para mejorar su pensión.",
      detailedExplanation: "Es un esquema del Instituto Mexicano del Seguro Social destinado a trabajadores que pertenecen a la Ley 73. Permite realizar aportaciones voluntarias con un salario superior al último cotizado, con el objetivo de incrementar el promedio salarial de los últimos 5 años y, consecuentemente, asegurar una pensión mensual vitalicia significativamente mayor."
    },
    en: {
      term: "Modalidad 40 (IMSS)",
      shortDefinition: "Voluntary Continuation in the IMSS Mandatory Regime. Allows inactive workers to continue contributing to improve their pension.",
      detailedExplanation: "This is an IMSS scheme aimed at workers belonging to the 1973 Law. It allows making voluntary contributions with a salary higher than their last quoted salary, to increase the salary average of the last 5 years and, consequently, secure a significantly higher lifelong monthly pension."
    }
  },
  {
    slug: "renta-vitalicia",
    es: {
      term: "Renta Vitalicia",
      shortDefinition: "Una modalidad de pensión que garantiza un pago mensual de por vida, independientemente de cuánto tiempo viva el contratante.",
      detailedExplanation: "Es un contrato con una aseguradora o institución en el que, a cambio de una suma global (tu fondo de ahorro), la empresa se compromete a pagarte una cantidad mensual predeterminada hasta tu fallecimiento. Protege contra el riesgo de longevidad (el riesgo de quedarte sin dinero antes de fallecer)."
    },
    en: {
      term: "Lifetime Annuity (Renta Vitalicia)",
      shortDefinition: "A pension modality that guarantees a monthly payment for life, regardless of how long the contractor lives.",
      detailedExplanation: "It is a contract with an insurance company where, in exchange for a lump sum (your savings fund), the company commits to paying you a predetermined monthly amount until your passing. It protects against longevity risk (the risk of outliving your money)."
    }
  },
  {
    slug: "rendimiento-neto",
    es: {
      term: "Rendimiento Neto",
      shortDefinition: "La ganancia real de una inversión después de descontar comisiones e inflación.",
      detailedExplanation: "Para las calculadoras de retiro, el rendimiento neto es el dato más crucial. Si tu portafolio genera un 10% anual, pero tienes un 2% en comisiones y la inflación anual es del 4%, tu rendimiento real/neto será de aproximadamente 4%. Este crecimiento es el aumento real en tu poder adquisitivo."
    },
    en: {
      term: "Net Yield / Real Return",
      shortDefinition: "The actual gain of an investment after deducting commissions and inflation.",
      detailedExplanation: "For retirement calculators, net yield is the most crucial figure. If your portfolio generates a 10% annual return, but you have 2% in commissions and annual inflation is 4%, your real/net return will be approximately 4%. This growth represents the true increase in your purchasing power."
    }
  },
  {
    slug: "beneficio-fiscal",
    es: {
      term: "Deducibilidad / Beneficio Fiscal",
      shortDefinition: "La ventaja proporcionada por la ley para reducir la base sobre la cual se calculan los impuestos a pagar.",
      detailedExplanation: "En el contexto de un sistema para el retiro, los gobiernos incentivan el ahorro permitiendo que el dinero aportado no pague impuestos hoy (deducibilidad en el año en curso), o no pague impuestos en el futuro sobre las ganancias. Esto acelera dramáticamente el crecimiento del portafolio gracias al capital extra invertido."
    },
    en: {
      term: "Tax Deductibility",
      shortDefinition: "The legal advantage provided to reduce the base upon which taxes are calculated.",
      detailedExplanation: "In the context of retirement savings, governments incentivize saving by allowing contributed money to either bypass taxes today (current year deductibility) or bypass taxes on future gains. This dramatically accelerates the portfolio's growth due to the extra capital invested."
    }
  }
];
