'use client'

import { useEffect, useState } from 'react'
import { Plus, FileText, Search, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotesStore } from '../store/notesStore'
import { useRouter } from 'next/navigation'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import CreateNoteModal from '../components/CreateNoteModal'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const { notes, loading, fetchNotes, deleteNote } = useNotesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchNotes()
  }, [user, fetchNotes, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
    toast.success('Sesión cerrada correctamente')
  }

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete._id)
        toast.success('Nota eliminada correctamente')
        setNoteToDelete(null)
        if (selectedNote?._id === noteToDelete._id) {
          setSelectedNote(null)
        }
      } catch (error) {
        toast.error('Error al eliminar la nota')
      }
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Mis Notas
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Nota</span>
          </button>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="note-card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No se encontraron notas' : 'No tienes notas aún'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primera nota'
              }
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Primera Nota</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={() => setSelectedNote(note)}
                onDelete={() => setNoteToDelete(note)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onDelete={() => setNoteToDelete(selectedNote)}
        />
      )}

      {isCreateModalOpen && (
        <CreateNoteModal
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {noteToDelete && (
        <ConfirmModal
          title="Eliminar Nota"
          message={`¿Estás seguro que deseas eliminar la nota "${noteToDelete.title}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteNote}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </div>
  )
}