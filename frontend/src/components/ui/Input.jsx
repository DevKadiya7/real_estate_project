import { cn } from '../../utils/cn'

export function Label({ children, className }) {
  return <span className={cn('mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300', className)}>{children}</span>
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm',
        'placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
        className,
      )}
      {...props}
    />
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  )
}
