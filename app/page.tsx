import type { Metadata } from 'next'
import { Suspense } from "react"
import { SimulatorCore } from "@/components/simulator/simulator-core"

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function SimulatorPage() {
  return (
    <Suspense>
      <SimulatorCore />
    </Suspense>
  )
}
