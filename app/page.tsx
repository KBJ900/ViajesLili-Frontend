"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, FolderOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prueba Tecnica para Viajes Lili</h1>
          <p className="text-xl text-gray-600">Realizado por: Kevin Bryan Jonathan Cobian Franco</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Film className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Películas</CardTitle>
              <CardDescription>
                Gestiona tu catálogo de películas, asigna categorías y mantén tu colección organizada
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/movies">
                <Button size="lg" className="w-full">
                  Gestionar Películas
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Categorías</CardTitle>
              <CardDescription>
                Organiza tus películas por categorías, crea nuevas clasificaciones y asigna películas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Gestionar Categorías
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
