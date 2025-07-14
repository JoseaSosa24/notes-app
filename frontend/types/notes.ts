export interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateNoteData {
  title: string
  content: string
}

export interface UpdateNoteData {
  title?: string
  content?: string
}

export interface NotesState {
  // ✅ Estado
  notes: Note[]
  loading: boolean
  selectedNote: Note | null
  
  // ✅ Actions simples
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNoteInStore: (id: string, updatedNote: Note) => void
  removeNote: (id: string) => void
  setLoading: (loading: boolean) => void
  setSelectedNote: (note: Note | null) => void
  clearNotes: () => void
}