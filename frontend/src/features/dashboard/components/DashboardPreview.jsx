import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const BARS = [38, 62, 45, 78, 55, 90, 70]

/**
 * A built, animated mockup of the dashboard — not a sourced illustration
 * (no image-asset pipeline exists in this project). Purely decorative.
 */
export function DashboardPreview() {
  return (
    <div className="relative hidden aspect-[4/3] w-full max-w-md items-center justify-center lg:flex">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 via-brand-400/10 to-transparent blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel relative w-full p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            Live
          </span>
        </div>

        <div className="mb-4 flex items-end gap-2">
          {BARS.map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
              className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Avg. Price', value: '₹1.9 Cr' },
            { label: 'Sectors', value: '101' },
            { label: 'Listings', value: '3.3k' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-100/80 p-2.5 text-center dark:bg-slate-800/60">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10, y: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel absolute -left-6 -top-6 flex items-center gap-2 px-3 py-2"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Sector 56 · ₹2.4 Cr</span>
      </motion.div>
    </div>
  )
}
