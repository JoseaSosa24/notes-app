'use client'

import { Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteCardProps {
  note: Note
  onClick: () => void
  onDelete: () => void
}

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="note-card group" onClick={onClick}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
          {note.title}
        </h3>
        <button
          onClick={handleDeleteClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700"
          title="Eliminar nota"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {truncateContent(note.content)}
      </p>
      
      <div className="flex items-center text-xs text-gray-500 mt-auto">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {formatDistanceToNow(new Date(note.updatedAt), {
            addSuffix: true,
            locale: es
          })}
        </span>
      </div>
    </div>
  )
}