"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RejectionScreenProps {
  onBack: () => void
}

interface Step {
  numero: number
  paso: string
}

export default function RejectionScreen({ onBack }: RejectionScreenProps) {
  const [screen, setScreen] = useState<"input" | "output">("input")
  const [M, setM] = useState("1")
  const [steps, setSteps] = useState<Step[]>([])

  const handleCalculate = () => {
    const M_value = Number.parseFloat(M)
    const newSteps: Step[] = []
    let paso = 1
    let aceptado = false

    while (!aceptado) {
      const x = -Math.log(Math.random())
      newSteps.push({
        numero: paso++,
        paso: `Paso ${paso - 1}: Generar x' de la función de referencia g(x) = e^(-x).`,
      })
      newSteps.push({
        numero: paso++,
        paso: `x' generado: ${x.toFixed(6)}`,
      })

      const u = Math.random()
      newSteps.push({
        numero: paso++,
        paso: `Paso ${paso - 1}: Generar un número uniforme u entre 0 y 1.`,
      })
      newSteps.push({
        numero: paso++,
        paso: `Número u generado: ${u.toFixed(6)}`,
      })

      const f_x = Math.exp(-x)
      const g_x = Math.exp(-x)

      newSteps.push({
        numero: paso++,
        paso: `Paso ${paso - 1}: Verificar la condición de aceptación u <= f(x') / (M * g(x')).`,
      })
      newSteps.push({
        numero: paso++,
        paso: `f(x') = ${f_x.toFixed(6)}, g(x') = ${g_x.toFixed(6)}`,
      })

      if (u <= f_x / (M_value * g_x)) {
        aceptado = true
        newSteps.push({
          numero: paso++,
          paso: `Paso ${paso - 1}: Aceptamos x' ya que u <= f(x') / (M * g(x')).`,
        })
        newSteps.push({
          numero: paso++,
          paso: `Variable aleatoria generada: ${x.toFixed(6)}`,
        })
      } else {
        newSteps.push({
          numero: paso++,
          paso: `Paso ${paso - 1}: Rechazamos x' y generamos otro valor.`,
        })
      }
    }

    newSteps.push({
      numero: paso++,
      paso: `Paso 4: Fin del proceso de aceptación/rechazo.`,
    })
    newSteps.push({
      numero: paso++,
      paso: `Paso 5: Variable aleatoria generada correctamente.`,
    })

    setSteps(newSteps)
    setScreen("output")
  }

  if (screen === "input") {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Método del Rechazo</h2>

        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2">
            Ingrese el valor de M para el método de rechazo:
          </Label>
          <Input
            type="number"
            value={M}
            onChange={(e) => setM(e.target.value)}
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
