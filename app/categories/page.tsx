"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchCategories, deleteCategory, setSearchTerm } from "@/store/slices/categoriesSlice"
import { fetchMovies } from "@/store/slices/moviesSlice"
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
import { Plus, Search, Edit, Trash2, FolderOpen, FileText } from "lucide-react"
import { CategoryForm } from "@/components/category-form"
import { Pagination } from "@/components/pagination"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, loading, error, meta, searchTerm } = useSelector((state: RootState) => state.categories)
  const { movies } = useSelector((state: RootState) => state.movies)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)


  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, name: searchTerm }))
    dispatch(fetchMovies({ page: 1, title: "" }))
  }, [dispatch, currentPage, searchTerm])

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value))
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap()
      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando categorías...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-2">Organiza tus películas por categorías</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>Completa los datos para crear una nueva categoría</DialogDescription>
            </DialogHeader>
            <CategoryForm
              movies={movies}
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                dispatch(fetchCategories({ page: currentPage, name: searchTerm }))
                toast({
                  title: "Categoría creada",
                  description: "La categoría se creó correctamente",
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
            placeholder="Buscar categorías por nombre..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                    {category.name}
                  </CardTitle>
                </div>
                <div className="flex space-x-2">
                <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
  setIsEditDialogOpen(open)
  if (!open) setEditingCategory(null)
}}>
  <DialogTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setEditingCategory(category)
        setIsEditDialogOpen(true)
      }}
    >
      <Edit className="w-4 h-4" />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Editar Categoría</DialogTitle>
      <DialogDescription>Modifica los datos de la categoría</DialogDescription>
    </DialogHeader>
    {editingCategory && (
      <CategoryForm
        category={editingCategory}
        movies={movies}
        onSuccess={() => {
          setIsEditDialogOpen(false)
          setEditingCategory(null)
          dispatch(fetchCategories({ page: currentPage, name: searchTerm }))
          toast({
            title: "Categoría actualizada",
            description: "La categoría se actualizó correctamente",
          })
        }}
      />
    )}
  </DialogContent>
</Dialog>


                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La categoría "{category.name}" será eliminada
                          permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
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
                <CardDescription className="text-sm leading-relaxed">{category.description}</CardDescription>
              </div>

              {category.Movies && category.Movies.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Películas ({category.Movies.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {category.Movies.slice(0, 3).map((movie) => (
                      <Badge key={movie.id} variant="outline">
                        {movie.title}
                      </Badge>
                    ))}
                    {category.Movies.length > 3 && <Badge variant="outline">+{category.Movies.length - 3} más</Badge>}
                  </div>
                </div>
              )}

              {(!category.Movies || category.Movies.length === 0) && (
                <div className="text-sm text-gray-500 italic">Sin películas asignadas</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "No se encontraron categorías con ese nombre" : "Comienza creando tu primera categoría"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Categoría
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
