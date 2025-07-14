'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNotes } from '@/hooks/useNotes'
import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'

interface CreateNoteModalProps {
  onClose: () => void
}

interface NoteForm {
  title: string
  content: string
}

export default function CreateNoteModal({ onClose }: CreateNoteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createNote } = useNotes()
  
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
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Nueva Nota"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <Input
          {...register('title', {
            required: 'El título es requerido',
            maxLength: {
              value: 200,
              message: 'El título es muy largo'
            }
          })}
          label="Título"
          placeholder="Título de la nota..."
          error={errors.title?.message}
        />

        <Textarea
          {...register('content', {
            required: 'El contenido es requerido',
            maxLength: {
              value: 10000,
              message: 'El contenido es muy largo'
            }
          })}
          label="Contenido"
          rows={12}
          placeholder="Escribe el contenido de tu nota aquí..."
          error={errors.content?.message}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Crear Nota
          </Button>
        </div>
      </form>
    </Modal>
  )
}