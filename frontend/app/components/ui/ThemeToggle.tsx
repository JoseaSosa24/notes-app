'use client'
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useRef, useState, useEffect } from 'react'

export default function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const options = [
    { value: 'light', icon: <Sun className="h-4 w-4" />, label: 'Claro' },
    { value: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Oscuro' },
    { value: 'system', icon: <Monitor className="h-4 w-4" />, label: 'Sistema' },
  ]
  const current = options.find(o => o.value === theme)!

  const handleClickOutside = (e: MouseEvent) => {
    if (open && ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(v => !v)}
        className="btn-ghost btn-sm flex items-center space-x-1 p-2"
        title={`Tema actual: ${current.label}`}
      >
        {current.icon}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {options.map(opt => (
            <button
              key={opt.value}
              className={`w-full text-left px-3 py-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === opt.value ? 'font-semibold' : ''
              }`}
              onClick={() => { setTheme(opt.value as any); setOpen(false) }}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
