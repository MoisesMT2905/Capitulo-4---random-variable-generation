"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InverseTransformScreenProps {
  onBack: () => void
}

interface Step {
  numero: number
  paso: string
}

export default function InverseTransformScreen({ onBack }: InverseTransformScreenProps) {
  const [screen, setScreen] = useState<"input" | "output">("input")
  const [lambda, setLambda] = useState("2")
  const [steps, setSteps] = useState<Step[]>([])

  const handleCalculate = () => {
    const lambdaVal = Number.parseFloat(lambda)
    const U = Math.random()
    const x = -Math.log(1 - U) / lambdaVal

    const newSteps: Step[] = [
      {
        numero: 1,
        paso: `Paso 1: Generamos aleatorio U entre 0 y 1: ${U.toFixed(6)}`,
      },
      {
        numero: 2,
        paso: `Paso 2: Evaluar la fórmula con U = ${U.toFixed(6)} y lambda = ${lambdaVal}.`,
      },
      {
        numero: 3,
        paso: `Resultado de la FDA: ${U.toFixed(6)}`,
      },
      {
        numero: 4,
        paso: `Paso 3: Aplicar la transformada inversa para obtener X.`,
      },
      {
        numero: 5,
        paso: `Resultado de X (variable aleatoria generada): ${x.toFixed(6)}`,
      },
      {
        numero: 6,
        paso: `Paso 4: Mostrar el valor generado de la variable aleatoria.`,
      },
      {
        numero: 7,
        paso: `Valor final de la variable aleatoria: ${x.toFixed(6)}`,
      },
      {
        numero: 8,
        paso: `Paso 5: Finalización del cálculo de la transformada inversa.`,
      },
    ]

    setSteps(newSteps)
    setScreen("output")
  }

  if (screen === "input") {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Método Transformada Inversa</h2>

        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2">Ingrese el valor de lambda (λ):</Label>
          <Input
            type="number"
            value={lambda}
            onChange={(e) => setLambda(e.target.value)}
            className="mt-2 text-lg py-3"
            step="0.1"
            min="0.1"
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 font-bold"
          >
            Calcular
          </Button>
          <Button onClick={onBack} variant="outline" className="flex-1 text-lg py-3 font-bold bg-transparent">
            Atrás
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Pasos del Algoritmo</h2>

      <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-6 h-96 overflow-y-auto font-mono text-sm">
        {steps.map((step) => (
          <div key={step.numero} className="mb-2 text-gray-800">
            {step.paso}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => setScreen("input")}
          className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-lg py-3 font-bold"
        >
          Calcular Otro
        </Button>
        <Button onClick={onBack} variant="outline" className="flex-1 text-lg py-3 font-bold bg-transparent">
          Atrás
        </Button>
      </div>
    </div>
  )
}
