"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Film, FolderOpen, Home } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-blue-600" />
          </Link>

          <div className="flex space-x-4">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Button>
            </Link>

            <Link href="/movies">
              <Button
                variant={pathname.startsWith("/movies") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Film className="w-4 h-4" />
                <span>Películas</span>
              </Button>
            </Link>

            <Link href="/categories">
              <Button
                variant={pathname.startsWith("/categories") ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Categorías</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
