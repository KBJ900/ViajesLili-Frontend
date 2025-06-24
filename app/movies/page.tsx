"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMovies, deleteMovie, setSearchTerm } from "@/store/slices/moviesSlice"
import { fetchAllCategories } from "@/store/slices/categoriesSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Calendar, FileText, Film } from "lucide-react"
import { MovieForm } from "@/components/movie-form"
import { Pagination } from "@/components/pagination"
import { useToast } from "@/hooks/use-toast"

export default function MoviesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { movies, loading, error, meta, searchTerm } = useSelector((state: RootState) => state.movies)
  const { allCategories } = useSelector((state: RootState) => state.categories)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchMovies({ page: currentPage, title: searchTerm }))
    dispatch(fetchAllCategories())
  }, [dispatch, currentPage, searchTerm])

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value))
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteMovie(id)).unwrap()
      toast({
        title: "Película eliminada",
        description: "La película se eliminó correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la película",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando películas...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Películas</h1>
          <p className="text-gray-600 mt-2">Gestiona tu catálogo de películas</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Película</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Película</DialogTitle>
              <DialogDescription>Completa los datos para crear una nueva película</DialogDescription>
            </DialogHeader>
            <MovieForm
              categories={allCategories}
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                dispatch(fetchMovies({ page: currentPage, title: searchTerm }))
                toast({
                  title: "Película creada",
                  description: "La película se creó correctamente",
                })
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar películas por título..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <Card key={movie.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{movie.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {movie.releaseYear}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMovie(movie)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar película?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La película "{movie.title}" será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(movie.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-4">
                <FileText className="w-4 h-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <CardDescription className="text-sm leading-relaxed">{movie.synopsis}</CardDescription>
              </div>

              {movie.Categories && movie.Categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Categorías:</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.Categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de edición única */}
      <Dialog open={!!editingMovie} onOpenChange={(open) => !open && setEditingMovie(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Película</DialogTitle>
            <DialogDescription>Modifica los datos de la película</DialogDescription>
          </DialogHeader>
          {editingMovie && (
            <MovieForm
              movie={editingMovie}
              categories={allCategories}
              onSuccess={() => {
                setEditingMovie(null)
                dispatch(fetchMovies({ page: currentPage, title: searchTerm }))
                toast({
                  title: "Película actualizada",
                  description: "La película se actualizó correctamente",
                })
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {movies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay películas</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "No se encontraron películas con ese título" : "Comienza creando tu primera película"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Película
            </Button>
          )}
        </div>
      )}

      {meta.lastPage > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={meta.lastPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
