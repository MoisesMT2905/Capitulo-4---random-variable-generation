"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RejectionStep {
  attempt: number
  x: number
  fx: number
  M: number
  R2: number
  accepted: boolean
}

export default function RejectionMethodTab() {
  const [distribution, setDistribution] = useState("triangular")
  const [M, setM] = useState("1")
  const [numSamples, setNumSamples] = useState("10")
  const [results, setResults] = useState<RejectionStep[]>([])
  const [statistics, setStatistics] = useState({
    generated: 0,
    accepted: 0,
    efficiency: 0,
  })

  const rejectionFunctions = {
    triangular: (x: number) => {
      // f(x) = 2x for 0 <= x <= 1 (Example 4.4)
      if (x < 0 || x > 1) return 0
      return 2 * x
    },
    empirical: (x: number) => {
      // f(x) = 2x for 0 <= x <= 1
      if (x < 0 || x > 1) return 0
      return 2 * x
    },
    beta: (x: number) => {
      // Approximation of Beta(2,2)
      if (x < 0 || x > 1) return 0
      return 6 * x * (1 - x)
    },
  }

  const generateVariables = () => {
    const n = Number.parseInt(numSamples)
    const M_value = Number.parseFloat(M)
    const steps: RejectionStep[] = []
    const acceptedValues: number[] = []
    let totalAttempts = 0

    while (acceptedValues.length < n) {
      totalAttempts++
      const R1 = Math.random()
      const x = R1 // For uniform domain [0,1]
      const fx = rejectionFunctions[distribution as keyof typeof rejectionFunctions](x)
      const R2 = Math.random()

      const accepted = R2 <= fx / M_value

      steps.push({
        attempt: totalAttempts,
        x: Number.parseFloat(x.toFixed(4)),
        fx: Number.parseFloat(fx.toFixed(4)),
        M: M_value,
        R2: Number.parseFloat(R2.toFixed(4)),
        accepted,
      })

      if (accepted) {
        acceptedValues.push(x)
      }
    }

    setResults(steps.slice(0, Math.min(20, steps.length)))
    setStatistics({
      generated: totalAttempts,
      accepted: acceptedValues.length,
      efficiency: Number.parseFloat(((acceptedValues.length / totalAttempts) * 100).toFixed(2)),
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración</CardTitle>
          <CardDescription>Configura el método de rechazo basado en Capítulo 4</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dist">Distribución</Label>
              <Select value={distribution} onValueChange={setDistribution}>
                <SelectTrigger id="dist">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="triangular">Triangular f(x)=2x</SelectItem>
                  <SelectItem value="empirical">Empírica</SelectItem>
                  <SelectItem value="beta">Beta(2,2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="m-value">Valor de M (cota superior)</Label>
              <Input id="m-value" type="number" value={M} onChange={(e) => setM(e.target.value)} step="0.1" min="0.1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rej-samples">Número de Muestras</Label>
              <Input
                id="rej-samples"
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
              <CardTitle className="text-lg">Estadísticas de Eficiencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Intentos Totales</p>
                  <p className="text-2xl font-bold">{statistics.generated}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Aceptados</p>
                  <p className="text-2xl font-bold">{statistics.accepted}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Eficiencia</p>
                  <p className="text-2xl font-bold">{statistics.efficiency}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primeros Intentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intento</TableHead>
                      <TableHead>x</TableHead>
                      <TableHead>f(x)</TableHead>
                      <TableHead>M</TableHead>
                      <TableHead>R₂</TableHead>
                      <TableHead>R₂ ≤ f(x)/M</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((row) => (
                      <TableRow key={row.attempt}>
                        <TableCell>{row.attempt}</TableCell>
                        <TableCell>{row.x}</TableCell>
                        <TableCell>{row.fx}</TableCell>
                        <TableCell>{row.M}</TableCell>
                        <TableCell>{row.R2}</TableCell>
                        <TableCell>{row.R2 <= row.fx / row.M ? "Sí" : "No"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              row.accepted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {row.accepted ? "Aceptado" : "Rechazado"}
                          </span>
                        </TableCell>
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
