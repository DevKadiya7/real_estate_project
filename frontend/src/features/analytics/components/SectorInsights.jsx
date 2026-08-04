import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Sparkline } from '../../../components/charts/Sparkline'
import { useTheme } from '../../../context/ThemeContext'
import { CATEGORICAL } from '../../../constants/chartPalette'
import { formatCrore, formatNumber } from '../../../utils/formatters'

const INITIAL_COUNT = 9
const PAGE_SIZE = 9

/** @param {{ sectorInsights: import('../../../types/property').SectorInsight[], onSelectSector: (sector: string) => void }} props */
export function SectorInsights({ sectorInsights, onSelectSector }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const { isDark } = useTheme()
  const color = (isDark ? CATEGORICAL.dark : CATEGORICAL.light)[0]

  const visible = sectorInsights.slice(0, visibleCount)

  return (
    <Card>
      <CardHeader eyebrow="Sectors" title="Sector Insights" description="Click a sector card to filter the whole dashboard." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((sector) => {
          const isUp = sector.vsCityAvgPct >= 0
          return (
            <motion.button
              key={sector.sector}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => onSelectSector(sector.sector)}
              className="rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold capitalize text-slate-900 dark:text-white">{sector.sector}</p>
                <span
                  className={
                    isUp
                      ? 'flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'
                      : 'flex items-center gap-0.5 text-xs font-medium text-red-500'
                  }
                >
                  {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(sector.vsCityAvgPct).toFixed(0)}%
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {formatCrore(sector.averagePrice)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatNumber(sector.averageArea, { maximumFractionDigits: 0 })} sqft avg · {sector.listingCount} listings
              </p>
              <Sparkline values={sector.priceSparkline} color={color} />
            </motion.button>
          )
        })}
      </div>

      {visibleCount < sectorInsights.length ? (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Show more sectors
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
