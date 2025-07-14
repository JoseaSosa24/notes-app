// app/store/notesStore.ts
import { NotesState } from '@/types/notes'
import { create } from 'zustand'

export const useNotesStore = create<NotesState>((set, get) => ({
  // Estado inicial
  notes: [],
  loading: false,
  selectedNote: null,

  // Actions que solo modifican el estado
  setNotes: (notes) => set({ notes }),
  
  addNote: (note) => set(state => ({ 
    notes: [note, ...state.notes] 
  })),
  
  updateNoteInStore: (id, updatedNote) => set(state => ({
    notes: state.notes.map(note => 
      note._id === id ? updatedNote : note
    )
  })),
  
  removeNote: (id) => set(state => ({
    notes: state.notes.filter(note => note._id !== id),
    selectedNote: state.selectedNote?._id === id ? null : state.selectedNote
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setSelectedNote: (note) => set({ selectedNote: note }),
  
  clearNotes: () => set({ 
    notes: [], 
    selectedNote: null, 
    loading: false 
  })
}))