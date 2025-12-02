"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CompositionStep {
  step: number
  R1: number
  chosenComponent: number
  R2: number
  result: number
}

export default function CompositionMethodTab() {
  const [distribution, setDistribution] = useState("triangular")
  const [numSamples, setNumSamples] = useState("10")
  const [results, setResults] = useState<CompositionStep[]>([])
  const [statistics, setStatistics] = useState({
    mean: 0,
    min: 0,
    max: 0,
    component1Freq: 0,
    component2Freq: 0,
  })

  const generateVariables = () => {
    const n = Number.parseInt(numSamples)
    const steps: CompositionStep[] = []
    const values: number[] = []
    let comp1Count = 0
    let comp2Count = 0

    for (let i = 0; i < n; i++) {
      const R1 = Math.random()
      const R2 = Math.random()

      let chosenComponent = 1
      let result = 0

      if (distribution === "triangular") {
        // Example 4.7: Triangular mixture
        // Component 1 (0 ≤ x ≤ 0.5): f₁(x) = 2x * 2 = 4x, so x = √R
        // Component 2 (0.5 < x ≤ 1): f₂(x) = 2(1-x) * 2 = 4(1-x), so x = 1 - √R
        if (R1 <= 0.5) {
          chosenComponent = 1
          result = Math.sqrt(R2) * 0.5
          comp1Count++
        } else {
          chosenComponent = 2
          result = 0.5 + Math.sqrt(R2) * 0.5
          comp2Count++
        }
      } else if (distribution === "exponential-mix") {
        // Mixture of two exponentials
        if (R1 <= 0.7) {
          chosenComponent = 1
          result = -Math.log(1 - R2) / 2 // λ = 2
          comp1Count++
        } else {
          chosenComponent = 2
          result = -Math.log(1 - R2) / 0.5 // λ = 0.5
          comp2Count++
        }
      }

      steps.push({
        step: i + 1,
        R1: Number.parseFloat(R1.toFixed(4)),
        chosenComponent,
        R2: Number.parseFloat(R2.toFixed(4)),
        result: Number.parseFloat(result.toFixed(4)),
      })
      values.push(result)
    }

    setResults(steps)

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    setStatistics({
      mean: Number.parseFloat(mean.toFixed(4)),
      min: Number.parseFloat(Math.min(...values).toFixed(4)),
      max: Number.parseFloat(Math.max(...values).toFixed(4)),
      component1Freq: Number.parseFloat(((comp1Count / n) * 100).toFixed(2)),
      component2Freq: Number.parseFloat(((comp2Count / n) * 100).toFixed(2)),
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración</CardTitle>
          <CardDescription>Selecciona una distribución compuesta (Example 4.7)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comp-dist">Distribución Compuesta</Label>
              <Select value={distribution} onValueChange={setDistribution}>
                <SelectTrigger id="comp-dist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="triangular">Triangular (Example 4.7)</SelectItem>
                  <SelectItem value="exponential-mix">Mezcla de Exponenciales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp-samples">Número de Muestras</Label>
              <Input
                id="comp-samples"
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Media</p>
                  <p className="text-lg font-bold">{statistics.mean}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Mínimo</p>
                  <p className="text-lg font-bold">{statistics.min}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Máximo</p>
                  <p className="text-lg font-bold">{statistics.max}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Comp. 1</p>
                  <p className="text-lg font-bold">{statistics.component1Freq}%</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Comp. 2</p>
                  <p className="text-lg font-bold">{statistics.component2Freq}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles de Generación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paso</TableHead>
                      <TableHead>R₁</TableHead>
                      <TableHead>Componente</TableHead>
                      <TableHead>R₂</TableHead>
                      <TableHead>Valor X</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.slice(0, 15).map((row) => (
                      <TableRow key={row.step}>
                        <TableCell>{row.step}</TableCell>
                        <TableCell>{row.R1}</TableCell>
                        <TableCell>
                          <span className="font-semibold">f{row.chosenComponent}</span>
                        </TableCell>
                        <TableCell>{row.R2}</TableCell>
                        <TableCell className="font-bold">{row.result}</TableCell>
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
