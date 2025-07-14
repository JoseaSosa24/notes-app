// frontend/app/store/notesStore.ts
import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface CreateNoteData {
  title: string
  content: string
}

interface UpdateNoteData {
  title?: string
  content?: string
}

interface NotesState {
  notes: Note[]
  loading: boolean
  fetchNotes: () => Promise<void>
  createNote: (data: CreateNoteData) => Promise<void>
  updateNote: (id: string, data: UpdateNoteData) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setInitialNotes: (notes: Note[]) => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,

  setInitialNotes: (notes: Note[]) => {
    set({ notes, loading: false })
  },

  fetchNotes: async () => {
    set({ loading: true })
    try {
      // ✅ Usa axios.defaults (configurado en DashboardClient)
      const response = await axios.get(`${API_URL}/notes`)
      set({ notes: response.data, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw new Error(error.response?.data?.message || 'Error al obtener las notas')
    }
  },

  createNote: async (data: CreateNoteData) => {
    try {
      // ✅ Usa axios.defaults (configurado en DashboardClient)
      const response = await axios.post(`${API_URL}/notes`, data)
      const newNote = response.data
      set(state => ({
        notes: [newNote, ...state.notes]
      }))
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear la nota')
    }
  },

  updateNote: async (id: string, data: UpdateNoteData) => {
    try {
      // ✅ Usa axios.defaults (configurado en DashboardClient)
      const response = await axios.put(`${API_URL}/notes/${id}`, data)
      const updatedNote = response.data
      set(state => ({
        notes: state.notes.map(note => 
          note._id === id ? updatedNote : note
        )
      }))
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la nota')
    }
  },

  deleteNote: async (id: string) => {
    try {
      // ✅ Usa axios.defaults (configurado en DashboardClient)
      await axios.delete(`${API_URL}/notes/${id}`)
      set(state => ({
        notes: state.notes.filter(note => note._id !== id)
      }))
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la nota')
    }
  }
}))