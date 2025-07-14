// app/hooks/useNotes.ts 
import { notesService } from '@/app/services/notesService'
import { useNotesStore } from '@/app/store/notesStore'
import { CreateNoteData, Note, UpdateNoteData } from '@/types/notes'
import toast from 'react-hot-toast'

export const useNotes = () => {
  const {
    notes,
    loading,
    selectedNote,
    setNotes,
    addNote,
    updateNoteInStore,
    removeNote,
    setLoading,
    setSelectedNote,
    clearNotes
  } = useNotesStore()

  // ✅ Lógica de negocio: obtener notas
  const fetchNotes = async () => {
    setLoading(true)
    try {
      const notes = await notesService.getAllNotes()
      setNotes(notes)
      //toast.success('Notas cargadas correctamente')
    } catch (error: any) {
      console.error('Error fetching notes:', error)
      toast.error('Error al cargar las notas')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ✅ Lógica de negocio: crear nota
  const createNote = async (data: CreateNoteData) => {
    try {
      const newNote = await notesService.createNote(data)
      addNote(newNote)
      //toast.success('Nota creada correctamente')
      return newNote
    } catch (error: any) {
      console.error('Error creating note:', error)
      //toast.error('Error al crear la nota')
      throw error
    }
  }

  // ✅ Lógica de negocio: actualizar nota
  const updateNote = async (id: string, data: UpdateNoteData) => {
    try {
      const updatedNote = await notesService.updateNote(id, data)
      updateNoteInStore(id, updatedNote)
      
      // Si es la nota seleccionada, actualizarla también
      if (selectedNote?._id === id) {
        setSelectedNote(updatedNote)
      }
      
      //toast.success('Nota actualizada correctamente')
      return updatedNote
    } catch (error: any) {
      console.error('Error updating note:', error)
      toast.error('Error al actualizar la nota')
      throw error
    }
  }

  // ✅ Lógica de negocio: eliminar nota
  const deleteNote = async (id: string) => {
    try {
      await notesService.deleteNote(id)
      removeNote(id)
      toast.success('Nota eliminada correctamente')
    } catch (error: any) {
      console.error('Error deleting note:', error)
      toast.error('Error al eliminar la nota')
      throw error
    }
  }

  // ✅ Lógica de negocio: buscar notas
  const searchNotes = (searchTerm: string) => {
    if (!searchTerm.trim()) return notes
    
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // ✅ Lógica de negocio: logout cleanup
  const cleanup = () => {
    clearNotes()
  }

  // ✅ Método para inicializar con notas del servidor (SSR)
  const initializeNotes = (initialNotes: Note[]) => {
    if (initialNotes.length > 0) {
      setNotes(initialNotes)
      //toast.success(`${initialNotes.length} notas cargadas`)
    }
  }

  return {
    // Estado
    notes,
    loading,
    selectedNote,
    
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    setSelectedNote,
    initializeNotes,
    cleanup
  }
}