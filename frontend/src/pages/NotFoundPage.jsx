import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ROUTES } from '../constants/routes'

export function NotFoundPage() {
  return (
    <Card className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">404</p>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
      <Button as={Link} to={ROUTES.home} className="mt-2">
        Back to home
      </Button>
    </Card>
  )
}
