'use client'

import { useState, useEffect } from 'react'
import { X, Edit3, Trash2, Save, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNotesStore } from '../store/notesStore'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

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
  const { updateNote } = useNotesStore()
  
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <input
                {...register('title', {
                  required: 'El título es requerido',
                  maxLength: {
                    value: 200,
                    message: 'El título es muy largo'
                  }
                })}
                className="text-xl font-semibold text-gray-900 w-full border-none outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
                placeholder="Título de la nota..."
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
            )}
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Editar nota"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={onDelete}
                  className="btn-danger flex items-center space-x-1"
                  title="Eliminar nota"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <div>
              <textarea
                {...register('content', {
                  required: 'El contenido es requerido',
                  maxLength: {
                    value: 10000,
                    message: 'El contenido es muy largo'
                  }
                })}
                rows={12}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Escribe el contenido de tu nota aquí..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              Última actualización: {formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
                locale: es
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}