import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHash } from "crypto";
import { unstable_cache } from "next/cache";
import { z } from "zod";

// ─── M2: Input validation schema ─────────────────────────────────────────────
// All fields are validated for type, sign, and realistic range BEFORE being
// interpolated into the Gemini prompt, preventing prompt injection via type
// coercion (e.g. passing a script string as "currentAge").

const TipsBodySchema = z.object({
  currentAge:          z.number().int().min(18).max(80),
  retirementAge:       z.number().int().min(50).max(90),
  planningHorizonAge:  z.number().int().min(60).max(110),
  inflation:           z.number().min(0).max(50),
  aforeBalance:        z.number().min(0).max(100_000_000),
  aforeMonthly:        z.number().min(0).max(500_000),
  aforeMonthlyNPV:     z.number().min(0),
  pprBalance:          z.number().min(0).max(100_000_000),
  pprMonthly:          z.number().min(0).max(500_000),
  pprMonthlyNPV:       z.number().min(0),
  privateBalance:      z.number().min(0).max(100_000_000),
  privateMonthly:      z.number().min(0).max(500_000),
  privateMonthlyNPV:   z.number().min(0),
  totalMonthlyFuture:  z.number().min(0),
  totalMonthlyNPV:     z.number().min(0),
  pprTaxArticles:      z.array(z.enum(["art151", "art93"])).default([]),
});

type TipsBody = z.infer<typeof TipsBodySchema>;

// ─── M2: In-memory rate limiter ───────────────────────────────────────────────
// Provides best-effort protection against quota abuse within a single warm
// serverless instance. For production-grade limiting, configure Vercel Firewall:
//   Dashboard → Security → Firewall → Rule: /api/tips, max 10 req/min/IP.

const ipMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;        // requests
const RATE_LIMIT_WINDOW = 60_000; // milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false; // first request in window — allow
  }

  if (entry.count >= RATE_LIMIT_MAX) return true; // over limit

  entry.count++;
  return false;
}

// ─── Gemini setup ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// gemini-3.1-flash-lite-preview: 500 RPD free, fast and lightweight
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
});

const currentYear = new Date().getFullYear();

// ─── Fallback tips (shown when Gemini is unavailable) ─────────────────────────

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

// ─── Exact-config hash ────────────────────────────────────────────────────────
// Hash the validated body so identical inputs always return the same cache
// entry (no redundant Gemini call), while any change produces a fresh call.

function getBodyHash(body: object): string {
  return createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex")
    .slice(0, 24);
}

// ─── Cached Gemini call ───────────────────────────────────────────────────────
// revalidate: 604800 = 7 days — if inputs haven't changed, advice won't change.

function buildCachedGeminiCall(prompt: string, hash: string) {
  return unstable_cache(
    async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? jsonMatch[0] : text;
    },
    ["gemini-ai-tips", hash],
    { revalidate: 604800, tags: [`ai-tips-${hash}`] }
  );
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(data: TipsBody, hasPPRArt151: boolean): string {
  const {
    currentAge, retirementAge, planningHorizonAge, inflation,
    aforeBalance, aforeMonthly, aforeMonthlyNPV,
    pprBalance, pprMonthly, pprMonthlyNPV,
    privateBalance, privateMonthly, privateMonthlyNPV,
    totalMonthlyNPV,
  } = data;

  return `Eres un asesor financiero experto en retiro en México. El año actual es ${currentYear}.

Datos del usuario (Valores monetarios en pesos de ${currentYear} / VPN cuando se indique):
- Edad actual: ${currentAge} años. Retiro a los ${retirementAge}. Horizonte hasta los ${planningHorizonAge}.
- Inflación esperada: ${inflation}%.
- AFORE: Saldo $${aforeBalance}, Aportación mensual $${aforeMonthly}, Pensión futura (VPN): $${aforeMonthlyNPV}/mes.
- PPR: Saldo $${pprBalance}, Aportación mensual $${pprMonthly}, Pensión futura (VPN): $${pprMonthlyNPV}/mes.
  - Artículo fiscal del PPR: ${hasPPRArt151 ? "Art. 151 (deducible, con devolución SAT)" : "Art. 93 (exento a los 65+, sin devolución SAT)"}
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
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // M2: Rate limiting — checked before any compute
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute." }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
    );
  }

  let hasPPRArt151 = true;

  try {
    const rawBody = await req.json();

    // M2: Schema validation — reject malformed or out-of-range payloads
    const parsed = TipsBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = parsed.data;

    hasPPRArt151 = body.pprTaxArticles.length > 0
      ? body.pprTaxArticles.some((a) => a === "art151")
      : true;

    const prompt = buildPrompt(body, hasPPRArt151);
    const hash = getBodyHash(body);

    // N4: Dev-only cache key logging — never printed in production
    if (process.env.NODE_ENV === "development") {
      console.log(`⚡ AI Tips request — cache key: ${hash}`);
    }

    const getCachedTips = buildCachedGeminiCall(prompt, hash);
    const jsonString = await getCachedTips();

    // N4: Dev-only response logging
    if (process.env.NODE_ENV === "development") {
      console.log("✅ AI Tips response (from cache or Gemini):", jsonString.slice(0, 80));
    }

    return new Response(jsonString, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("❌ AI Tips Error:", error);
    return new Response(JSON.stringify(getFallbackTips(hasPPRArt151)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
