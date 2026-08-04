import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { NAV_ITEMS, ROUTES } from '../../constants/routes'

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((item) => item.path === pathname) ?? NAV_ITEMS[0]

  const crumbs = pathname === ROUTES.home ? [current] : [NAV_ITEMS[0], current]

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      {crumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-slate-900 dark:text-white">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-slate-700 dark:hover:text-slate-200">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
