// frontend/app/components/dashboard/DashboardClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { Plus, FileText, Search, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import NoteCard from '@/app/components/notes/NoteCard'
import NoteModal from '@/app/components/notes/NoteModal'
import CreateNoteModal from '@/app/components/notes/CreateNoteModal'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNotes } from '@/hooks/useNotes'


interface DashboardClientProps {
  initialNotes: any[]
}

export default function DashboardClient({ initialNotes }: DashboardClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // ✅ Hook que maneja todo el estado y lógica de notas
  const {
    notes,
    loading,
    selectedNote,
    fetchNotes,
    deleteNote,
    searchNotes,
    setSelectedNote,
    initializeNotes, // ✅ Método para notas iniciales
    cleanup
  } = useNotes()

  // Estado local solo para UI
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<any>(null)
  const [tokenConfigured, setTokenConfigured] = useState(false)
  const [initialNotesLoaded, setInitialNotesLoaded] = useState(false)

  // ✅ 1. Configurar token PRIMERO
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.accessToken && !tokenConfigured) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`
      setTokenConfigured(true)
      console.log('✅ Token configurado')
    }
  }, [session, status, tokenConfigured, router])

  // ✅ 2. Cargar notas DESPUÉS de configurar token
  useEffect(() => {
    if (!tokenConfigured || !session) return

    // Si hay notas iniciales y no las hemos cargado aún
    if (initialNotes.length > 0 && !initialNotesLoaded) {
      console.log('📝 Usando notas iniciales:', initialNotes.length)
      initializeNotes(initialNotes) // ✅ Usar notas del servidor
      setInitialNotesLoaded(true)
    } else if (initialNotes.length === 0 && !initialNotesLoaded) {
      console.log('🔄 Cargando notas desde API...')
      setInitialNotesLoaded(true)
      fetchNotes().catch(error => {
        console.error('❌ Error cargando notas:', error)
        toast.error('Error al cargar las notas')
      })
    }
  }, [tokenConfigured, session, initialNotes, initialNotesLoaded, fetchNotes])

  const handleLogout = async () => {
    // ✅ Limpiar estado y token
    cleanup()
    delete axios.defaults.headers.common['Authorization']
    setTokenConfigured(false)
    
    await signOut({ 
      redirect: false,
      callbackUrl: '/login'
    })
    router.push('/login')
    toast.success('Sesión cerrada correctamente')
  }

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete._id)
        setNoteToDelete(null)
        // Si era la nota seleccionada, cerrar el modal
        if (selectedNote?._id === noteToDelete._id) {
          setSelectedNote(null)
        }
      } catch (error) {
        console.error('Error eliminando nota:', error)
        // El toast ya se maneja en el hook useNotes
      }
    }
  }

  // ✅ Loading mientras verifica sesión y configura token
  if (status === 'loading' || !tokenConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {status === 'loading' ? 'Verificando sesión...' : 'Configurando autenticación...'}
          </p>
        </div>
      </div>
    )
  }

  // ✅ Si no hay sesión, no mostrar nada
  if (!session) {
    return null
  }

  // ✅ Usar el método de búsqueda del hook
  const filteredNotes = searchNotes(searchTerm)

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span>{session.user?.name}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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