import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <AlertTriangle className="h-8 w-8 text-red-400" />
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
