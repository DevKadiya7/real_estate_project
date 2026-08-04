import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Home, LineChart, Search } from 'lucide-react'
import { NAV_ITEMS, ROUTES } from '../../constants/routes'
import { cn } from '../../utils/cn'

const ICONS = {
  [ROUTES.home]: Home,
  [ROUTES.predictor]: Building2,
  [ROUTES.analysis]: LineChart,
  [ROUTES.recommend]: Search,
}

export function Sidebar({ className }) {
  const { pathname } = useLocation()

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/80 px-4 py-6 backdrop-blur-xl lg:flex',
        'dark:border-slate-800/70 dark:bg-slate-950/80',
        className,
      )}
    >
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Gurgaon Real Estate</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Property Intelligence</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.path]
          const isActive = item.path === ROUTES.home ? pathname === ROUTES.home : pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.home}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                !isActive && 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-brand-50 dark:bg-brand-500/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              ) : null}
              <Icon
                className={cn(
                  'relative z-10 h-4 w-4',
                  isActive ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 group-hover:text-slate-600',
                )}
              />
              <span
                className={cn(
                  'relative z-10',
                  isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300',
                )}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
