import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Category {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  Movies?: Movie[]
}

export interface Movie {
  id: number
  title: string
  synopsis: string
  releaseYear: number
  createdAt: string
  updatedAt: string
  MovieCategory?: {
    movieId: number
    categoryId: number
  }
}

interface CategoriesState {
  categories: Category[]
  allCategories: Category[]
  loading: boolean
  error: string | null
  meta: {
    total: number
    page: number
    lastPage: number
  }
  searchTerm: string
}

const initialState: CategoriesState = {
  categories: [],
  allCategories: [],
  loading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    lastPage: 1,
  },
  searchTerm: "",
}

const API_BASE = "http://localhost:5000/api"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ page = 1, name = "" }: { page?: number; name?: string }) => {
    const params = new URLSearchParams()
    if (name) params.append("name", name)
    if (page > 1) params.append("page", page.toString())

    const response = await fetch(`${API_BASE}/categories?${params}`)
    if (!response.ok) throw new Error("Error al cargar categorías")
    return response.json()
  },
)

export const fetchAllCategories = createAsyncThunk("categories/fetchAllCategories", async () => {
  const response = await fetch(`${API_BASE}/categories`)
  if (!response.ok) throw new Error("Error al cargar todas las categorías")
  return response.json()
})

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: { name: string; description: string; movieIds: number[] }) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) throw new Error("Error al crear categoría")
    return response.json()
  },
)

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, ...categoryData }: { id: number; name: string; description: string; movieIds: number[] }) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) throw new Error("Error al actualizar categoría")
    return response.json()
  },
)

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id: number) => {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Error al eliminar categoría")
  return id
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error desconocido"
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.allCategories = action.payload.data
      })
      .addCase(createCategory.fulfilled, (state) => {
        // Refetch will be handled by component
      })
      .addCase(updateCategory.fulfilled, (state) => {
        // Refetch will be handled by component
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload)
      })
  },
})

export const { setSearchTerm, clearError } = categoriesSlice.actions
export default categoriesSlice.reducer
