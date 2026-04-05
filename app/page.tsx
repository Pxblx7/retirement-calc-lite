"use client"

import { Suspense } from "react"
import { SimulatorCore } from "@/components/simulator/simulator-core"

export default function SimulatorPage() {
  return (
    <Suspense>
      <SimulatorCore />
    </Suspense>
  )
}

