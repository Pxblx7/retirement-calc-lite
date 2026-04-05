import React from "react"
import Link from "next/link"

export type BlogPost = {
  slug: string
  date: string
  author: string
  readTime: string
  es: {
    title: string
    description: string
    content: React.ReactNode
    bibliography: string[]
  }
  en: {
    title: string
    description: string
    content: React.ReactNode
    bibliography: string[]
  }
}

export const blogData: BlogPost[] = [
  {
    slug: "el-futuro-del-retiro-en-mexico",
    date: "2026-04-05",
    author: "Pablo Arroyo",
    readTime: "4 min",
    es: {
      title: "El Estado Actual del Retiro en México: Por qué tu AFORE no será suficiente",
      description: "Análisis de las reformas de la Ley 97, la tasa de reemplazo en México, y por qué depender únicamente de la AFORE podría comprometer tu futuro financiero.",
      content: (
        <>
          <p>
            El sistema de pensiones en México ha experimentado cambios drásticos en las últimas décadas. Para los que comenzamos a trabajar después del 1 de julio de 1997, el panorama de la jubilación cambió para siempre: <strong>la pensión vitalicia garantizada por el Estado desapareció.</strong>
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">La Realidad de la Ley 97</h2>
          <p>
            Bajo el régimen de la Ley 97, tu pensión dependerá <strong>exclusivamente</strong> del dinero que logres acumular en tu cuenta individual de AFORE a lo largo de tu vida laboral, más los rendimientos que esta genere. Según estimaciones de la OCDE y la CONSAR, la <em>tasa de reemplazo</em> (el porcentaje de tu último sueldo que recibirás como pensión) en México ronda apenas el <strong>30% al 40%</strong>.
          </p>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl my-6">
            <strong>¿Qué significa esto en la práctica?</strong> Si ganas $20,000 MXN mensuales en la cima de tu carrera, tu pensión proyectada podría ser de apenas $6,000 a $8,000 MXN mensuales.
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">El Efecto de la Inflación</h2>
          <p>
            Otro enemigo silencioso es la inflación. El costo de vida, la salud y la vivienda están aumentando aceleradamente. Depender de una tasa de reemplazo del 30% en un entorno inflacionario es una receta para la pobreza en la vejez. Para mantener tu estilo de vida actual, necesitarás fuentes de ingresos adicionales que superen la inflación históricamente proyectada.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">¿Cuál es la solución?</h2>
          <p>
            La respuesta matemáticamente comprobada es el <strong>Ahorro Voluntario</strong> temprano y la <strong>Diversificación</strong>. Instrumentos como los Planes Personales de Retiro (PPR) no solo ofrecen mejores horizontes de inversión que las AFOREs conservadoras, sino que permiten deducir impuestos cada año (amparados en el Artículo 151 de la LISR).
          </p>
          <p className="mt-4">
            Empezar hoy es la decisión más rentable que puedes tomar gracias al <Link href="/glosario/interes-compuesto" className="text-primary font-medium hover:underline">interés compuesto</Link>. Utiliza nuestro simulador para enfrentarte a los números reales y construye un plan que te dé tranquilidad.
          </p>
        </>
      ),
      bibliography: [
        "CONSAR. (2023). Informe trimestral al H. Congreso de la Unión sobre la situación de los Sistemas de Ahorro para el Retiro.",
        "OCDE. (2021). Pensions at a Glance 2021: OECD and G20 Indicators."
      ]
    },
    en: {
      title: "The Current State of Retirement in Mexico: Why Your AFORE Won't Be Enough",
      description: "An analysis of the 1997 Law reforms, the replacement rate in Mexico, and why relying solely on your AFORE could compromise your financial future.",
      content: (
        <>
          <p>
            The pension system in Mexico has undergone drastic changes in recent decades. For those who started working after July 1, 1997, the retirement landscape changed forever: <strong>the state-guaranteed lifetime pension disappeared.</strong>
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">The Reality of Law 97</h2>
          <p>
            Under the 1997 Law regime, your pension will depend <strong>exclusively</strong> on the money you manage to accumulate in your individual AFORE account throughout your working life, plus the returns it generates. According to estimates by the OECD and CONSAR, the <em>replacement rate</em> (the percentage of your last salary that you will receive as a pension) in Mexico hovers at just <strong>30% to 40%</strong>.
          </p>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl my-6">
            <strong>What does this mean in practice?</strong> If you earn $20,000 MXN a month at the peak of your career, your projected pension could be just $6,000 to $8,000 MXN a month.
          </div>
          <h2 className="text-2xl font-bold mt-8 mb-4">The Effect of Inflation</h2>
          <p>
            Another silent enemy is inflation. The cost of living, healthcare, and housing are rising rapidly. Relying on a 30% replacement rate in an inflationary environment is a recipe for poverty in old age. To maintain your current lifestyle, you will need additional streams of income that beat historically projected inflation.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">What is the solution?</h2>
          <p>
            The mathematically proven answer is early <strong>Voluntary Savings</strong> and <strong>Diversification</strong>. Instruments like Personal Retirement Plans (PPR) not only offer better investment horizons than conservative AFOREs, but they also allow for annual tax deductions (covered under Article 151 of the LISR).
          </p>
          <p className="mt-4">
            Starting today is the most profitable decision you can make thanks to <Link href="/glosario/interes-compuesto" className="text-primary font-medium hover:underline">compound interest</Link>. Use our simulator to face the real numbers and build a plan that grants you peace of mind.
          </p>
        </>
      ),
      bibliography: [
        "CONSAR. (2023). Quarterly report to the H. Congress of the Union on the situation of Retirement Savings Systems.",
        "OECD. (2021). Pensions at a Glance 2021: OECD and G20 Indicators."
      ]
    }
  },
  {
    slug: "afore-vs-ppr-guia-definitiva",
    date: "2026-04-05",
    author: "Pablo Arroyo",
    readTime: "5 min",
    es: {
      title: "AFORE vs PPR: La guía definitiva para decidir tu estrategia fiscal",
      description: "Descubre las diferencias fundamentales entre una AFORE y un PPR, sus ventajas fiscales y cómo elegir la mejor alternativa para tu perfil de inversión.",
      content: (
        <>
          <p>
            Al adentrarnos en la planificación del retiro, inevitablemente surge la gran pregunta: <strong>¿Debería hacer aportaciones voluntarias a mi AFORE o contratar un Plan Personal de Retiro (PPR)?</strong> Ambas son herramientas valiosas, pero tienen naturalezas y beneficios muy distintos que se adaptan a diferentes tipos de perfiles.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">¿Qué es la AFORE?</h2>
          <p>
            La <Link href="/glosario/afore" className="text-primary font-medium hover:underline">AFORE</Link> es obligatoria si trabajas en el sector formal en México. Históricamente, las AFOREs estandarizan su inversión basándose en tu bloque de edad (las famosas SIEFORES), siendo extremadamente conservadoras a medida que te acercas al retiro. 
            Las comisiones suelen ser bajas y los retiros anticipados, aunque posibles por desempleo o matrimonio, conllevan una dura penalización: la pérdida de semanas cotizadas.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">¿Qué es el PPR?</h2>
          <p>
            El <Link href="/glosario/ppr" className="text-primary font-medium hover:underline">PPR</Link> es un vehículo de inversión privado voluntario. La mayor ventaja del PPR es su flexibilidad y control de inversión: tú decides qué tanta exposición al mercado de valores internacional deseas tener. Plataformas modernas (como Fintual o GBM) permiten diversificar en acciones globales (como el S&P 500), resultando en rendimientos netos históricos muy superiores al de la AFORE promedio en el largo plazo.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Beneficios Fiscales y Estrategia</h2>
          <p>
            Tanto el PPR como las aportaciones complementarias a la AFORE son deducibles de impuestos bajo el Artículo 151, hasta por el 10% de tus ingresos o 5 UMAS anuales. La estrategia "inteligente" moderna recomienda:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2 text-muted-foreground">
            <li>Mantén tu AFORE activa para las aportaciones patronales y gubernamentales obligatorias.</li>
            <li>Canaliza tus aportaciones <strong>voluntarias</strong> hacia un PPR de bajo costo para ganar exposición a mejores rendimientos bursátiles internacionales.</li>
            <li>¡Reinserte la devolución del SAT (el retorno fiscal) directo al PPR para potenciar el interés compuesto!</li>
          </ul>
        </>
      ),
      bibliography: [
        "Ley del Impuesto sobre la Renta. (2024). Título IV, Capítulo XI, Artículo 151.",
        "Asociación Mexicana de Instituciones Bursátiles (AMIB). Comparativo de vehículos de inversión a largo plazo."
      ]
    },
    en: {
      title: "AFORE vs PPR: The Definitive Guide to Deciding Your Tax Strategy",
      description: "Discover the fundamental differences between an AFORE and a PPR, their tax advantages, and how to choose the best alternative for your investment profile.",
      content: (
        <>
          <p>
            When diving into retirement planning, the big question inevitably arises: <strong>Should I make voluntary contributions to my AFORE or open a Personal Retirement Plan (PPR)?</strong> Both are valuable tools, but they have distinct natures and benefits tailored to different profiles.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">What is an AFORE?</h2>
          <p>
            The <Link href="/glosario/afore" className="text-primary font-medium hover:underline">AFORE</Link> is mandatory if you are formally employed in Mexico. Historically, AFOREs standardize their investments based on your age bracket (SIEFORES), becoming extremely conservative as you approach retirement. Fees are usually low, and early withdrawals, though possible for unemployment or marriage, come with a severe penalty: the loss of contribution weeks.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">What is a PPR?</h2>
          <p>
            The <Link href="/glosario/ppr" className="text-primary font-medium hover:underline">PPR</Link> is a private, voluntary investment vehicle. The greatest advantage of a PPR is its flexibility and investment control: you decide how much exposure to the international stock market you want. Modern platforms allow for broad diversification in global equities (like the S&P 500), historically yielding much higher net returns than the average AFORE over the long run.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Tax Benefits and Strategy</h2>
          <p>
            Both the PPR and supplementary contributions to the AFORE are tax-deductible under Article 151, up to 10% of your income or 5 annual UMAs. The modern "smart" strategy recommends:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2 text-muted-foreground">
            <li>Keep your AFORE active for mandatory employer and government contributions.</li>
            <li>Channel your <strong>voluntary</strong> contributions into a low-cost PPR to gain exposure to better international stock yields.</li>
            <li>Reinvest your SAT tax refund straight back into the PPR to supercharge compound interest!</li>
          </ul>
        </>
      ),
      bibliography: [
        "Income Tax Law. (2024). Title IV, Chapter XI, Article 151.",
        "Mexican Association of Brokerage Firms (AMIB). Long-term investment vehicle comparison."
      ]
    }
  },
  {
    slug: "como-utilizar-mi-retiro-mx",
    date: "2026-04-05",
    author: "Pablo Arroyo",
    readTime: "6 min",
    es: {
      title: "Cómo utilizar Mi Retiro MX para simular tu pensión real y alcanzar tus metas",
      description: "Tutorial exhaustivo de nuestras funciones: desde configurar la inflación hasta entender el Valor Presente Neto (VPN) y activar el Goal Tracker.",
      content: (
        <>
          <p>
            Creé <strong>Mi Retiro MX</strong> en 2026 con un objetivo en mente: desmentir las proyecciones irreales y arrojar luz sobre las verdaderas matemáticas del retiro en México usando una herramienta accesible, profesional y contundente.
          </p>
          <p>
            Al contrario de muchas calculadoras institucionales que asumen panoramas perfectos, nuestro simulador te permite estresar tu proyección financiera bajo distintos escenarios reales. Aquí te explicamos cómo sacarle el máximo provecho a todas las funcionalidades clave.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Paso 1: El Diagnóstico Actual</h2>
          <p>
            El primer bloque de la calculadora establece tu línea de partida. Es fundamental ingresar con precisión tu edad, la edad en que planeas retirarte y el saldo que ya posees en tu <Link href="/glosario/afore" className="text-primary font-medium hover:underline">AFORE</Link> u otros instrumentos. Adicionalmente, el aporte mensual que ingreses será la base recurrente (la semilla) que nutrirá tu capital a lo largo del tiempo.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Paso 2: Supuestos Avanzados (Inflación y Rendimiento)</h2>
          <p>
            Donde Mi Retiro MX realmente brilla es en nuestro <strong>Panel de Supuestos</strong>. No te obligamos a aceptar una tasa genérica. Si tienes un <Link href="/glosario/ppr" className="text-primary font-medium hover:underline">PPR</Link> en el S&P 500, puedes ajustar el rendimiento esperado a un histórico 10%. Por otro lado, si prefieres simular un escenario pesimista donde las comisiones de administración devoran tus ganancias, puedes ajustar los cobros anuales para ver su impacto destructivo a 30 años.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Paso 3: El Poder del VPN (Valor Presente Neto)</h2>
          <p>
            ¿Alguna vez te han prometido que tendrás $15 millones de pesos a tus 65 años y pensaste que serías rico? <strong>El problema es que $15 millones en 30 años no comprarán lo mismo que compran hoy.</strong>
          </p>
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl my-6">
            Para solucionar la ilusión inflacionaria, la herramienta implementa el cálculo de <strong>Valor Presente Neto (VPN)</strong>. De manera completamente automática, descontamos el impacto de la inflación de tus resultados finales, traduciendo esos "Pesos Futuros" engañosos, en <strong>"Pesos de Hoy"</strong>. Así, la mensualidad proyectada que ves en pantalla representa tu poder adquisitivo real contemporáneo.
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Paso 4: El Rastreador de Metas (Goal Tracker)</h2>
          <p>
            Imagina que has determinado que necesitas $35,000 MXN mensuales (a valor de hoy) para retirarte dignamente. En lugar de adivinar y ajustar aportaciones a ciegas, puedes hacer clic en nuestro <strong>Goal Tracker</strong>. 
          </p>
          <p>
            Simplemente ingresa tu meta de "pensión deseada" y oprime <em>"Calcular"</em>. El simulador determinará matemáticamente cuánto necesitas aportar al mes para llegar ahí. Si hay un déficit patrimonial, desglosará la aportación adicional requerida en tus cuentas configuradas (PPR o Ahorro Privado). Después, simplemente haz clic en <strong>"Aplicar a mi simulador"</strong>; automáticamente rellenaremos tus campos de aportación para que solo tengas que oprimir <em>"Simular mi retiro"</em> y veas tu gráfica llegar mágicamente a la meta deseada.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusión: Juega con Diferentes Escenarios</h2>
          <p>
            La mejor forma de utilizar esta herramienta es para comparar estrategias: un escenario conservador de AFORE con alto impacto de comisiones frente a una estrategia agresiva indexada a bolsa de bajo costo. Utiliza las visualizaciones dinámicas de <Link href="/glosario/interes-compuesto" className="text-primary font-medium hover:underline">interés compuesto</Link> y toma el control matemático de tu futuro.
          </p>
        </>
      ),
      bibliography: [
        "Mi Retiro MX. (2026). Arquitectura del cálculo de Valor Presente Neto (VPN)."
      ]
    },
    en: {
      title: "How to Use Mi Retiro MX to Project Your Real Pension and Hit Your Goals",
      description: "An exhaustive tutorial of our features: from adjusting inflation to understanding Net Present Value (NPV) and enabling the Goal Tracker.",
      content: (
        <>
          <p>
            I created <strong>Mi Retiro MX</strong> in 2026 with one goal in mind: to debunk unrealistic projections and shed light on the true mathematics of retirement in Mexico using an accessible, professional, and forceful tool.
          </p>
          <p>
            Unlike many institutional calculators that assume perfect panoramas, our simulator allows you to stress-test your financial standing under various real-world scenarios. Here is how to get the maximum value out of all key features.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: The Current Diagnosis</h2>
          <p>
            The first block of the calculator establishes your starting line. It is crucial to accurately input your age, the age you plan to retire, and your existing balance in your <Link href="/glosario/afore" className="text-primary font-medium hover:underline">AFORE</Link> or other private instruments. Additionally, your monthly contribution acts as the recurring baseline (the seed) that will nourish your capital over time.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Advanced Assumptions (Inflation and Yields)</h2>
          <p>
            Where Mi Retiro MX truly shines is in our <strong>Assumptions Panel</strong>. We do not force a generic performance rate on you. If you hold a <Link href="/glosario/ppr" className="text-primary font-medium hover:underline">PPR</Link> mirroring the S&P 500, you can crank the expected yield to a historical 10%. Conversely, if you want to simulate a pessimistic scenario where management fees devour your gains, you can adjust the annual fees to observe their destructive impact over 30 years.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: The Power of NPV (Net Present Value)</h2>
          <p>
            Have you ever been promised that you will hold $15 million pesos by age 65 and thought you would be rich? <strong>The problem is that $15 million in 30 years won't buy the same lifestyle it buys today.</strong>
          </p>
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-xl my-6">
            To solve the inflation illusion, the tool implements a <strong>Net Present Value (NPV)</strong> calculation. Automatically, we discount the impact of inflation from your end-results, translating those deceptive "Future Pesos" into <strong>"Today's Pesos / Current Value"</strong>. Thus, the projected monthly outcome you see on screen represents your actual contemporary purchasing power.
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 4: The Goal Tracker</h2>
          <p>
            Imagine you have determined that you need $35,000 MXN per month at today's value to retire comfortably. Instead of blindly adjusting inputs in the calculator to guess how to get there, you can open our <strong>Goal Tracker</strong>.
          </p>
          <p>
            Simply enter your "desired pension" target and hit <em>"Compute"</em>. The simulator will mathematically calculate how much you need to contribute monthly to get there. If there is a shortfall, it breaks down the exact additional monthly contribution required across your configured accounts (PPR or Private Savings). Then, just click <strong>"Apply to my simulator"</strong>; we will automatically populate your contribution fields so you can simply hit <em>"Simulate my retirement"</em> and watch your chart magically hit the desired goal.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion: Play with Scenarios</h2>
          <p>
            The best way to leverage this tool is not by checking it once, but by comparing strategies: a conservative AFORE scenario hindered by high fees versus an aggressive, low-cost index strategy. Use our dynamic <Link href="/glosario/interes-compuesto" className="text-primary font-medium hover:underline">compound interest</Link> visualizers and take mathematical control of your future.
          </p>
        </>
      ),
      bibliography: [
        "Mi Retiro MX. (2026). Net Present Value (NPV) calculation architecture."
      ]
    }
  }
]
