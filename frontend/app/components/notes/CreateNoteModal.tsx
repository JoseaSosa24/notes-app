'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNotesStore } from '@/app/store/notesStore'

interface CreateNoteModalProps {
  onClose: () => void
}

interface NoteForm {
  title: string
  content: string
}

export default function CreateNoteModal({ onClose }: CreateNoteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createNote } = useNotesStore()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteForm>()

  const onSubmit = async (data: NoteForm) => {
    setIsLoading(true)
    try {
      await createNote(data)
      toast.success('Nota creada correctamente')
      reset()
      onClose()
    } catch (error) {
      toast.error('Error al crear la nota')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Nota</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              {...register('title', {
                required: 'El título es requerido',
                maxLength: {
                  value: 200,
                  message: 'El título es muy largo'
                }
              })}
              type="text"
              className="input-field"
              placeholder="Título de la nota..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
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

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>
                {isLoading ? 'Guardando...' : 'Crear Nota'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}