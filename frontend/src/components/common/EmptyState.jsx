import { Inbox } from 'lucide-react'

export function EmptyState({ message = 'Nothing here yet.', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
      <Icon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
