'use client'

import { useEffect, useState } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import NoteCard from '@/app/components/notes/NoteCard'
import NoteModal from '@/app/components/notes/NoteModal'
import CreateNoteModal from '@/app/components/notes/CreateNoteModal'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Card from '@/app/components/ui/Card'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNotes } from '@/hooks/useNotes'
import Header from '../header/Header'

interface DashboardClientProps {
  initialNotes: any[]
}

export default function DashboardClient({ initialNotes }: DashboardClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const {
    notes,
    loading,
    selectedNote,
    fetchNotes,
    deleteNote,
    searchNotes,
    setSelectedNote,
    initializeNotes,
    cleanup
  } = useNotes()

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<any>(null)
  const [tokenConfigured, setTokenConfigured] = useState(false)
  const [initialNotesLoaded, setInitialNotesLoaded] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.accessToken && !tokenConfigured) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
      setTokenConfigured(true)
    }
  }, [session, status, tokenConfigured, router])

  useEffect(() => {
    if (!tokenConfigured || !session) return

    if (initialNotes.length > 0 && !initialNotesLoaded) {
      initializeNotes(initialNotes)
      setInitialNotesLoaded(true)
    } else if (initialNotes.length === 0 && !initialNotesLoaded) {
      setInitialNotesLoaded(true)
      fetchNotes().catch(error => {
        console.error('Error cargando notas:', error)
        toast.error('Error al cargar las notas')
      })
    }
  }, [tokenConfigured, session, initialNotes, initialNotesLoaded, fetchNotes])

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete._id)
        setNoteToDelete(null)
        if (selectedNote?._id === noteToDelete._id) {
          setSelectedNote(null)
        }
      } catch (error) {
        console.error('Error eliminando nota:', error)
      }
    }
  }

  if (status === 'loading' || !tokenConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {status === 'loading' ? 'Verificando sesión...' : 'Configurando autenticación...'}
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const filteredNotes = searchNotes(searchTerm)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-48">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No se encontraron notas' : 'No tienes notas aún'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primera nota'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Nota
              </Button>
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