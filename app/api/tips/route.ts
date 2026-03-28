import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Using gemini-3.1-flash-lite-preview for higher quota (500 RPD)
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
});

const currentYear = new Date().getFullYear();

function getFallbackTips(hasPPRArt151: boolean) {
  return [
    {
      tip_es: hasPPRArt151
        ? "Considera aumentar tu aportación al PPR para maximizar tu devolución del SAT el próximo año."
        : "Considera aumentar tu aportación al PPR (Art. 93) para maximizar tu pensión libre de impuestos a los 65 años.",
      tip_en: hasPPRArt151
        ? "Consider increasing your PPR contribution to maximize your SAT refund next year."
        : "Consider increasing your PPR (Art. 93) contribution to maximize your tax-free pension at age 65.",
      icon: "💰",
      impact: "Alto",
    },
    {
      tip_es: "Diversifica tu ahorro privado en instrumentos que superen la inflación estimada.",
      tip_en: "Diversify your private savings into instruments that beat estimated inflation.",
      icon: "📈",
      impact: "Medio",
    },
    {
      tip_es: "Revisa tu estado de cuenta de la AFORE para asegurar que tus datos estén actualizados.",
      tip_en: "Check your AFORE statement to ensure your data is up to date.",
      icon: "📋",
      impact: "Bajo",
    },
  ];
}

export async function POST(req: Request) {
  let hasPPRArt151 = true;
  try {
    const body = await req.json();
    const {
      currentAge,
      retirementAge,
      planningHorizonAge,
      inflation,
      aforeBalance,
      aforeMonthly,
      aforeMonthlyNPV,
      pprBalance,
      pprMonthly,
      pprMonthlyNPV,
      privateBalance,
      privateMonthly,
      privateMonthlyNPV,
      totalMonthlyFuture,
      totalMonthlyNPV,
      pprTaxArticles = [],
    } = body;

    hasPPRArt151 = pprTaxArticles.length > 0 ? pprTaxArticles.some((a: string) => a === 'art151') : true;

    const prompt = `Eres un asesor financiero experto en retiro en México. El año actual es ${currentYear}.

Datos del usuario (Valores monetarios en pesos de ${currentYear} / VPN cuando se indique):
- Edad actual: ${currentAge} años. Retiro a los ${retirementAge}. Horizonte hasta los ${planningHorizonAge}.
- Inflación esperada: ${inflation}%.
- AFORE: Saldo $${aforeBalance}, Aportación mensual $${aforeMonthly}, Pensión futura (VPN): $${aforeMonthlyNPV}/mes.
- PPR: Saldo $${pprBalance}, Aportación mensual $${pprMonthly}, Pensión futura (VPN): $${pprMonthlyNPV}/mes.
  - Artículo fiscal del PPR: ${hasPPRArt151 ? 'Art. 151 (deducible, con devolución SAT)' : 'Art. 93 (exento a los 65+, sin devolución SAT)'}
- Ahorro Privado: Saldo $${privateBalance}, Aportación mensual $${privateMonthly}, Retiro futuro (VPN): $${privateMonthlyNPV}/mes.
- Pensión Total en pesos de ${currentYear} (VPN): $${totalMonthlyNPV}/mes.

Genera EXACTAMENTE 3 recomendaciones financieras NUMÉRICAS y personalizadas. 

REGLAS CRÍTICAS:
1) IMPORTANTE: Expresa SIEMPRE los montos monetarios en términos de VPN (poder adquisitivo del año ${currentYear}). Si sugieres un aumento en la pensión, calcula y menciona su equivalente en VPN.
2) Ejemplo: 'Aumentar tu PPR en $1,000 MXN podría elevar tu pensión mensual en aproximadamente $X MXN en poder adquisitivo de hoy (VPN)'.
3) Sé realista: no sugieras aumentos de ahorro desproporcionados al perfil actual.
4) Varía el enfoque: un tip sobre beneficios fiscales, otro sobre gastos hormiga o ahorro privado, y otro sobre la edad de retiro o inflación. REGLA ESPECIAL: Solo sugiere aprovechar la devolución del SAT si el usuario tiene al menos un PPR bajo Art. 151.
5) LEY 97 (MÉXICO): Si el usuario se retira antes de los 65 años, explica las penalizaciones de 'Cesantía' (ej. 75% a los 60 años, 80% a los 61, etc.) o el hecho de que los pagos de AFORE comienzan legalmente a los 65 años si dejan de trabajar antes de los 60.
6) Evita frases genéricas. Usa los números del usuario.
7) Traduce cada recomendación a inglés también.

Responde ÚNICAMENTE en este formato JSON:
[
  { 
    "tip_es": "texto con números en español (usando VPN)", 
    "tip_en": "text with numbers in English (using NPV)", 
    "icon": "emoji", 
    "impact": "Alto/Medio/Bajo" 
  },
  ...
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini text:", text.slice(0, 120));

    // Extract JSON in case Gemini wraps it in markdown
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;

    return new Response(jsonString, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Gemini API Error Details:", error);
    return new Response(JSON.stringify(getFallbackTips(hasPPRArt151)), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
