"use client"

import { Button } from "@/components/ui/button"

interface MainMenuProps {
  onSelectInverse: () => void
  onSelectRejection: () => void
  onSelectComposition: () => void
}

export default function MainMenu({ onSelectInverse, onSelectRejection, onSelectComposition }: MainMenuProps) {
  return (
    <div className="bg-blue-200 rounded-lg p-12 shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Generador de Variables Aleatorias</h1>
      <p className="text-center text-blue-800 mb-12 text-lg">
        Métodos de generación de variables aleatorias no-uniformes
      </p>

      <div className="space-y-4 flex flex-col">
        <Button onClick={onSelectInverse} className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-8 font-bold">
          Método Transformada Inversa
        </Button>

        <Button onClick={onSelectRejection} className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-8 font-bold">
          Método del Rechazo
        </Button>

        <Button
          onClick={onSelectComposition}
          className="bg-blue-700 hover:bg-blue-800 text-white text-lg py-8 font-bold"
        >
          Método de Composición
        </Button>
      </div>
    </div>
  )
}
