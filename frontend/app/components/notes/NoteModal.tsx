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
  const { updateNote } = useNotes()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteForm>({
    defaultValues: {
      title: note.title,
      content: note.content
    }
  })

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
    } catch (error) {
      toast.error('Error al actualizar la nota')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset({
      title: note.title,
      content: note.content
    })
    setIsEditing(false)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
    >

      {/* Header */}
      <div className="relative flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 mr-4 min-w-0">
          {isEditing ? (
            <Input
              {...register('title', {
                required: 'El título es requerido',
                maxLength: { value: 200, message: 'El título es muy largo' }
              })}
              placeholder="Título de la nota..."
              error={errors.title?.message}
              className="text-xl font-semibold"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {note.title}
            </h2>
          )}
        </div>

        {/* Botón de cierre siempre al tope-derecha */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-6 right-6 p-2"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </Button>
      </div>



      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <Textarea
            {...register('content', {
              required: 'El contenido es requerido',
              maxLength: {
                value: 10000,
                message: 'El contenido es muy largo'
              }
            })}
            rows={12}
            placeholder="Escribe el contenido de tu nota aquí..."
            error={errors.content?.message}
          />
        ) : (
          <div className="prose max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              Última actualización: {formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
                locale: es
              })}
            </span>
          </div>

          <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button onClick={handleSubmit(onSubmit)} loading={isLoading} size="sm">
                  <Save className="h-4 w-4 mr-1" /> Guardar
                </Button>
                <Button variant="secondary" onClick={handleCancel} size="sm">
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(true)} size="sm">
                  <Edit3 className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="danger" onClick={onDelete} size="sm">
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </>
            )}

          </div>
        </div>
      </div>

    </Modal>
  )
}