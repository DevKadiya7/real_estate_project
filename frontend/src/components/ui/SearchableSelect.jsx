import { useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useDebounce } from '../../hooks/useDebounce'

/**
 * A searchable dropdown for long option lists (sectors, apartments, locations).
 * Native <select> is used elsewhere for short lists; this one adds a filter
 * box since some of these lists run into the hundreds of entries.
 */
export function SearchableSelect({ value, onChange, options, placeholder = 'Select...', className }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 150)
  const containerRef = useRef(null)

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return options
    const needle = debouncedQuery.trim().toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, debouncedQuery])

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        )}
      >
        <span className={cn(!value && 'text-slate-400')}>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto scrollbar-thin py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-slate-400">No matches</li>
              ) : (
                filtered.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option)
                        close()
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {option}
                      {option === value ? <Check className="h-4 w-4 text-brand-500" /> : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}
