"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GenerationStep {
  step: number
  R: number
  formula: string
  result: number
}

export default function InverseTransformTab() {
  const [distribution, setDistribution] = useState("exponential")
  const [lambda, setLambda] = useState("2")
  const [numSamples, setNumSamples] = useState("10")
  const [results, setResults] = useState<GenerationStep[]>([])
  const [statistics, setStatistics] = useState({ mean: 0, min: 0, max: 0, variance: 0 })

  // Inverse transform methods based on Capítulo 4 examples
  const inverseTransforms = {
    exponential: (R: number, lambda: number) => {
      return -Math.log(1 - R) / lambda
    },
    uniform: (R: number, a = 0, b = 1) => {
      return a + (b - a) * R
    },
    weibull: (R: number, alpha = 2, beta = 1) => {
      return beta * Math.pow(-Math.log(1 - R), 1 / alpha)
    },
  }

  const generateVariables = () => {
    const n = Number.parseInt(numSamples)
    const steps: GenerationStep[] = []
    const values: number[] = []

    for (let i = 0; i < n; i++) {
      const R = Math.random()
      let result = 0
      let formula = ""

      if (distribution === "exponential") {
        result = inverseTransforms.exponential(R, Number.parseFloat(lambda))
        formula = `x = -ln(1-${R.toFixed(4)})/${lambda}`
      } else if (distribution === "uniform") {
        result = inverseTransforms.uniform(R, 0, 10)
        formula = `x = 0 + (10-0) × ${R.toFixed(4)}`
      } else if (distribution === "weibull") {
        result = inverseTransforms.weibull(R, 2, 1)
        formula = `x = 1 × (-ln(1-${R.toFixed(4)}))^(1/2)`
      }

      steps.push({
        step: i + 1,
        R: Number.parseFloat(R.toFixed(4)),
        formula,
        result: Number.parseFloat(result.toFixed(4)),
      })
      values.push(result)
    }

    setResults(steps)

    // Calculate statistics
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    setStatistics({
      mean: Number.parseFloat(mean.toFixed(4)),
      min: Number.parseFloat(Math.min(...values).toFixed(4)),
      max: Number.parseFloat(Math.max(...values).toFixed(4)),
      variance: Number.parseFloat(variance.toFixed(4)),
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración</CardTitle>
          <CardDescription>Selecciona una distribución y configura sus parámetros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distribution">Distribución</Label>
              <Select value={distribution} onValueChange={setDistribution}>
                <SelectTrigger id="distribution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exponential">Exponencial</SelectItem>
                  <SelectItem value="uniform">Uniforme</SelectItem>
                  <SelectItem value="weibull">Weibull</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {distribution === "exponential" && (
              <div className="space-y-2">
                <Label htmlFor="lambda">Parámetro λ (lambda)</Label>
                <Input
                  id="lambda"
                  type="number"
                  value={lambda}
                  onChange={(e) => setLambda(e.target.value)}
                  step="0.1"
                  min="0.1"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="samples">Número de Muestras</Label>
              <Input
                id="samples"
                type="number"
                value={numSamples}
                onChange={(e) => setNumSamples(e.target.value)}
                min="1"
                max="1000"
              />
            </div>
          </div>

          <Button onClick={generateVariables} className="w-full">
            Generar Variables
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Media</p>
                  <p className="text-xl font-bold">{statistics.mean}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Mínimo</p>
                  <p className="text-xl font-bold">{statistics.min}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Máximo</p>
                  <p className="text-xl font-bold">{statistics.max}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Varianza</p>
                  <p className="text-xl font-bold">{statistics.variance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados Detallados</CardTitle>
              <CardDescription>Primeras {Math.min(15, results.length)} muestras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paso</TableHead>
                      <TableHead>R (aleatorio)</TableHead>
                      <TableHead>Fórmula</TableHead>
                      <TableHead>Resultado X</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.slice(0, 15).map((row) => (
                      <TableRow key={row.step}>
                        <TableCell>{row.step}</TableCell>
                        <TableCell>{row.R}</TableCell>
                        <TableCell className="text-xs">{row.formula}</TableCell>
                        <TableCell className="font-semibold">{row.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
