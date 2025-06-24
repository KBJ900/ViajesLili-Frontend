"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { createMovie, updateMovie } from "@/store/slices/moviesSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MovieFormProps {
  movie?: any
  categories: any[]
  onSuccess: () => void
}

export function MovieForm({ movie, categories, onSuccess }: MovieFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    releaseYear: new Date().getFullYear(),
    categoryIds: [] as number[],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        synopsis: movie.synopsis,
        releaseYear: movie.releaseYear,
        categoryIds: movie.Categories?.map((cat: any) => cat.id) || [],
      })
    }
  }, [movie])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (movie) {
        await dispatch(updateMovie({ id: movie.id, ...formData })).unwrap()
      } else {
        await dispatch(createMovie(formData)).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: checked ? [...prev.categoryIds, categoryId] : prev.categoryIds.filter((id) => id !== categoryId),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="synopsis">Sinopsis *</Label>
          <Textarea
            id="synopsis"
            value={formData.synopsis}
            onChange={(e) => setFormData((prev) => ({ ...prev, synopsis: e.target.value }))}
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="releaseYear">Año de Lanzamiento *</Label>
          <Input
            id="releaseYear"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 5}
            value={formData.releaseYear}
            onChange={(e) => setFormData((prev) => ({ ...prev, releaseYear: Number.parseInt(e.target.value) }))}
            required
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorías</CardTitle>
            <CardDescription>Selecciona las categorías que corresponden a esta película</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={formData.categoryIds.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No hay categorías disponibles. Crea algunas categorías primero.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : movie ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
