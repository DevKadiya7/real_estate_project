import { cn } from '../../utils/cn'

const VARIANTS = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400',
  secondary:
    'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

export function Button({ as: Component = 'button', variant = 'primary', size = 'md', className, type, ...props }) {
  return (
    <Component
      type={Component === 'button' ? type || 'button' : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
