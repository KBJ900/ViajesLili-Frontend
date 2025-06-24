import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Movie {
  id: number
  title: string
  synopsis: string
  releaseYear: number
  createdAt: string
  updatedAt: string
  Categories?: Category[]
}

export interface Category {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  MovieCategory?: {
    movieId: number
    categoryId: number
  }
}

interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
  meta: {
    total: number
    page: number
    lastPage: number
  }
  searchTerm: string
}

const initialState: MoviesState = {
  movies: [],
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

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page = 1, title = "" }: { page?: number; title?: string }) => {
    const params = new URLSearchParams()
    if (title) params.append("title", title)
    if (page > 1) params.append("page", page.toString())

    const response = await fetch(`${API_BASE}/movies?${params}`)
    if (!response.ok) throw new Error("Error al cargar películas")
    return response.json()
  },
)

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (movieData: { title: string; synopsis: string; releaseYear: number; categoryIds: number[] }) => {
    const response = await fetch(`${API_BASE}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    })
    if (!response.ok) throw new Error("Error al crear película")
    return response.json()
  },
)

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({
    id,
    ...movieData
  }: { id: number; title: string; synopsis: string; releaseYear: number; categoryIds: number[] }) => {
    const response = await fetch(`${API_BASE}/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    })
    if (!response.ok) throw new Error("Error al actualizar película")
    return response.json()
  },
)

export const deleteMovie = createAsyncThunk("movies/deleteMovie", async (id: number) => {
  const response = await fetch(`${API_BASE}/movies/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Error al eliminar película")
  return id
})

const moviesSlice = createSlice({
  name: "movies",
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
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error desconocido"
      })
      .addCase(createMovie.fulfilled, (state) => {
        // Refetch will be handled by component
      })
      .addCase(updateMovie.fulfilled, (state) => {
        // Refetch will be handled by component
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((movie) => movie.id !== action.payload)
      })
  },
})

export const { setSearchTerm, clearError } = moviesSlice.actions
export default moviesSlice.reducer
