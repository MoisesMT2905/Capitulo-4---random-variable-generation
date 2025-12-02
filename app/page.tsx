"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InverseTransformTab from "@/components/InverseTransformTab"
import RejectionMethodTab from "@/components/RejectionMethodTab"
import CompositionMethodTab from "@/components/CompositionMethodTab"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Generador de Variables Aleatorias No-Uniformes</h1>
          <p className="text-lg text-muted-foreground">
            Implementación de métodos de simulación según Capítulo 4 - Simulación: Un enfoque práctico
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Métodos de Generación</CardTitle>
            <CardDescription>Selecciona un método para generar variables aleatorias no-uniformes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inverse" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="inverse">Transformada Inversa</TabsTrigger>
                <TabsTrigger value="rejection">Método de Rechazo</TabsTrigger>
                <TabsTrigger value="composition">Método de Composición</TabsTrigger>
              </TabsList>

              <TabsContent value="inverse" className="space-y-4">
                <InverseTransformTab />
              </TabsContent>

              <TabsContent value="rejection" className="space-y-4">
                <RejectionMethodTab />
              </TabsContent>

              <TabsContent value="composition" className="space-y-4">
                <CompositionMethodTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
