import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Pagination } from './Pagination'
import { EmptyState } from '../common/EmptyState'

const PAGE_SIZE = 8

/**
 * Client-side sortable + paginated table. Data volumes here (apartment/nearby
 * result lists) are small enough that virtualization isn't warranted — see
 * the refactor plan's data-size scoping note.
 */
export function Table({ columns, rows, rowKey, emptyMessage = 'No results yet.' }) {
  const [sort, setSort] = useState({ key: null, direction: 'asc' })
  const [page, setPage] = useState(1)

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      if (typeof aVal === 'number' && typeof bVal === 'number') return aVal - bVal
      return String(aVal).localeCompare(String(bVal))
    })
    return sort.direction === 'asc' ? sorted : sorted.reverse()
  }, [rows, sort])

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageRows = sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const toggleSort = (key) => {
    setPage(1)
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  if (rows.length === 0) return <EmptyState message={emptyMessage} />

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-2.5 font-medium">
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {column.label}
                      {sort.key === column.key ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pageRows.map((row) => (
              <tr key={rowKey(row)} className="text-slate-700 dark:text-slate-200">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-2.5', column.className)}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
