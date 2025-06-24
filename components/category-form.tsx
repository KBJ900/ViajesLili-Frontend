"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { createCategory, updateCategory } from "@/store/slices/categoriesSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryFormProps {
  category?: any
  movies: any[]
  onSuccess: () => void
}

export function CategoryForm({ category, movies, onSuccess }: CategoryFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    movieIds: [] as number[],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        movieIds: category.Movies?.map((movie: any) => movie.id) || [],
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        await dispatch(updateCategory({ id: category.id, ...formData })).unwrap()
      } else {
        await dispatch(createCategory(formData)).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovieChange = (movieId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      movieIds: checked ? [...prev.movieIds, movieId] : prev.movieIds.filter((id) => id !== movieId),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Películas</CardTitle>
            <CardDescription>Selecciona las películas que pertenecen a esta categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 max-h-48 overflow-y-auto">
              {movies.map((movie) => (
                <div key={movie.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`movie-${movie.id}`}
                    checked={formData.movieIds.includes(movie.id)}
                    onCheckedChange={(checked) => handleMovieChange(movie.id, checked as boolean)}
                  />
                  <Label htmlFor={`movie-${movie.id}`} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-sm text-gray-500">
                        {movie.releaseYear} • {movie.synopsis.substring(0, 60)}...
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            {movies.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No hay películas disponibles. Crea algunas películas primero.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : category ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
