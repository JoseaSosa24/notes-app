'use client'

import { useState, useEffect } from 'react'
import { Edit3, Trash2, Save, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { useNotes } from '@/hooks/useNotes'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'
import ConfirmModal from '@/app/components/ui/ConfirmModal'

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteModalProps {
  note: Note
  onClose: () => void
  onDelete: () => void
}

interface NoteForm {
  title: string
  content: string
}

export default function NoteModal({ note, onClose, onDelete }: NoteModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const { updateNote } = useNotes()

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm<NoteForm>({
    defaultValues: {
      title: note.title,
      content: note.content
    }
  })

  // Observar cambios en el formulario
  const currentTitle = watch('title')
  const currentContent = watch('content')
  
  // Verificar si hay cambios reales comparando con los valores originales
  const hasChanges = currentTitle !== note.title || currentContent !== note.content

  useEffect(() => {
    reset({
      title: note.title,
      content: note.content
    })
  }, [note, reset])

  const onSubmit = async (data: NoteForm) => {
    setIsLoading(true)
    try {
      await updateNote(note._id, data)
      toast.success('Nota actualizada correctamente')
      setIsEditing(false)
      setShowSaveConfirm(false)
    } catch (error) {
      toast.error('Error al actualizar la nota')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClick = () => {
    setShowSaveConfirm(true)
  }

  const confirmSave = () => {
    const formData = {
      title: currentTitle,
      content: currentContent
    }
    onSubmit(formData)
  }

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true)
    } else {
      cancelEdit()
    }
  }

  const cancelEdit = () => {
    reset({
      title: note.title,
      content: note.content
    })
    setIsEditing(false)
    setShowCancelConfirm(false)
  }

  const handleEditClick = () => {
    setShowEditConfirm(true)
  }

  const confirmEdit = () => {
    setIsEditing(true)
    setShowEditConfirm(false)
  }

  // Función para generar un resumen de los cambios
  const getChangesSummary = () => {
    const changes = []
    if (currentTitle !== note.title) {
      changes.push(`Título: "${note.title}" → "${currentTitle}"`)
    }
    if (currentContent !== note.content) {
      const originalPreview = note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '')
      const newPreview = currentContent.substring(0, 50) + (currentContent.length > 50 ? '...' : '')
      changes.push(`Contenido: "${originalPreview}" → "${newPreview}"`)
    }
    return changes.join('\n')
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
    >
      {/* Header - Optimizado para responsive */}
      <div className="relative flex items-start sm:items-center gap-3 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 min-w-0 pr-8 sm:pr-12">
          {isEditing ? (
            <Input
              {...register('title', {
                required: 'El título es requerido',
                maxLength: { value: 200, message: 'El título es muy largo' }
              })}
              placeholder="Título de la nota..."
              error={errors.title?.message}
              className="text-lg sm:text-xl font-semibold w-full"
            />
          ) : (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words hyphens-auto">
              {note.title}
            </h2>
          )}
        </div>

        {/* Botón de cierre - Posicionado de forma responsive */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 flex-shrink-0"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <span className="text-lg sm:text-xl">✕</span>
        </Button>
      </div>

      {/* Content - Optimizado para responsive */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        {isEditing ? (
          <Textarea
            {...register('content', {
              required: 'El contenido es requerido',
              maxLength: {
                value: 10000,
                message: 'El contenido es muy largo'
              }
            })}
            rows={8}
            className="sm:rows-12 min-h-[200px] sm:min-h-[300px] resize-none"
            placeholder="Escribe el contenido de tu nota aquí..."
            error={errors.content?.message}
          />
        ) : (
          <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words hyphens-auto">
              {note.content}
            </p>
          </div>
        )}
      </div>

      {/* Footer - Completamente responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Fecha - Siempre visible */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="truncate">
              Última actualización: {formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
                locale: es
              })}
            </span>
          </div>

          {/* Botones - Layout responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSaveClick} 
                  loading={isLoading} 
                  disabled={!hasChanges || isLoading}
                  size="sm"
                  className="flex-1 sm:flex-none order-2 sm:order-1"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="text-sm sm:text-base">Guardar</span>
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleCancel} 
                  size="sm"
                  className="flex-1 sm:flex-none order-1 sm:order-2"
                >
                  <span className="text-sm sm:text-base">Cancelar</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handleEditClick} 
                  size="sm"
                  className="flex-1 sm:flex-none order-2 sm:order-1"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="text-sm sm:text-base">Editar</span>
                </Button>
                <Button 
                  variant="danger" 
                  onClick={onDelete} 
                  size="sm"
                  className="flex-1 sm:flex-none order-1 sm:order-2"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="text-sm sm:text-base">Eliminar</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modales de confirmación */}
      {showEditConfirm && (
        <ConfirmModal
          title="Activar modo edición"
          message="¿Estás seguro que deseas editar esta nota? Podrás modificar su contenido."
          onConfirm={confirmEdit}
          onCancel={() => setShowEditConfirm(false)}
          confirmText="Sí, editar"
          cancelText="Cancelar"
          variant="info"
          icon="question"
        />
      )}

      {showSaveConfirm && (
        <ConfirmModal
          title="Guardar cambios"
          message={`¿Estás seguro que deseas actualizar el contenido de la nota?\n\nCambios realizados:\n${getChangesSummary()}`}
          onConfirm={confirmSave}
          onCancel={() => setShowSaveConfirm(false)}
          confirmText="Sí, guardar"
          cancelText="Cancelar"
          variant="primary"
          icon="info"
        />
      )}

      {showCancelConfirm && (
        <ConfirmModal
          title="Cancelar edición"
          message="Tienes cambios sin guardar. ¿Estás seguro que deseas cancelar? Se perderán todos los cambios."
          onConfirm={cancelEdit}
          onCancel={() => setShowCancelConfirm(false)}
          confirmText="Sí, cancelar"
          cancelText="Continuar editando"
          variant="warning"
          icon="warning"
        />
      )}
    </Modal>
  )
}