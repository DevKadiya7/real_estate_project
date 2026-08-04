import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { useTheme } from '../../context/ThemeContext'

export function AppShell() {
  const { isDark } = useTheme()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopNav />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <Toaster theme={isDark ? 'dark' : 'light'} position="top-right" richColors closeButton />
    </div>
  )
}
