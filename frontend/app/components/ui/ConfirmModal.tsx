'use client'

import { AlertTriangle, HelpCircle, Info } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'primary' | 'secondary'
  icon?: 'warning' | 'question' | 'info'
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon = 'warning'
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (icon) {
      case 'question':
        return <HelpCircle className="h-6 w-6 text-blue-600" />
      case 'info':
        return <Info className="h-6 w-6 text-blue-600" />
      case 'warning':
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />
    }
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onCancel} 
      size="sm"
      showCloseButton={false}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="order-1 sm:order-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}