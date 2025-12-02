"use client"

import { useState } from "react"
import MainMenu from "@/components/MainMenu"
import InverseTransformScreen from "@/components/InverseTransformScreen"
import RejectionScreen from "@/components/RejectionScreen"
import CompositionScreen from "@/components/CompositionScreen"

type Screen = "menu" | "inverse" | "rejection" | "composition"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu")

  const handleBackToMenu = () => {
    setCurrentScreen("menu")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {currentScreen === "menu" && (
          <MainMenu
            onSelectInverse={() => setCurrentScreen("inverse")}
            onSelectRejection={() => setCurrentScreen("rejection")}
            onSelectComposition={() => setCurrentScreen("composition")}
          />
        )}
        {currentScreen === "inverse" && <InverseTransformScreen onBack={handleBackToMenu} />}
        {currentScreen === "rejection" && <RejectionScreen onBack={handleBackToMenu} />}
        {currentScreen === "composition" && <CompositionScreen onBack={handleBackToMenu} />}
      </div>
    </main>
  )
}
