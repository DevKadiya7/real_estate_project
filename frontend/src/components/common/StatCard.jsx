import { cn } from '../../utils/cn'

export function StatCard({ label, value, icon: Icon, className }) {
  return (
    <div className={cn('glass-panel flex items-center gap-4 p-4', className)}>
      {Icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
