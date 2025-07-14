'use client'

import { Trash2, Clock, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import { truncateText } from '@/lib/utils'

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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full flex flex-col"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2 group-hover:text-primary-600 transition-colors">
          {note.title}
        </h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed flex-1">
        {truncateText(note.content, 120)}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {formatDistanceToNow(new Date(note.updatedAt), {
              addSuffix: true,
              locale: es
            })}
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit className="h-3 w-3" />
        </div>
      </div>
    </Card>
  )
}