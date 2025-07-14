// app/services/notesService.ts
import { CreateNoteData, Note, UpdateNoteData } from '@/types/notes'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ✅ SOLO API calls - Sin estado, sin lógica de negocio
export const notesService = {
  // Obtener todas las notas
  async getAllNotes(): Promise<Note[]> {
    const response = await axios.get(`${API_URL}/notes`)
    return response.data
  },

  // Crear nueva nota
  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await axios.post(`${API_URL}/notes`, data)
    return response.data
  },

  // Actualizar nota
  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const response = await axios.put(`${API_URL}/notes/${id}`, data)
    return response.data
  },

  // Eliminar nota
  async deleteNote(id: string): Promise<void> {
    await axios.delete(`${API_URL}/notes/${id}`)
  },

  // Obtener nota específica
  async getNoteById(id: string): Promise<Note> {
    const response = await axios.get(`${API_URL}/notes/${id}`)
    return response.data
  }
}