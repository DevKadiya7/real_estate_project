import { Banknote, Building, Crown, Landmark, Ruler, Wallet } from 'lucide-react'
import { formatCrore, formatNumber } from '../../../utils/formatters'

const CARDS = [
  { key: 'averagePrice', label: 'Average Price', icon: Wallet, format: (v) => formatCrore(v) },
  { key: 'medianPrice', label: 'Median Price', icon: Banknote, format: (v) => formatCrore(v) },
  { key: 'totalListings', label: 'Total Listings', icon: Building, format: (v) => formatNumber(v) },
  {
    key: 'averagePricePerSqft',
    label: 'Avg. Price/Sqft',
    icon: Landmark,
    format: (v) => `₹${formatNumber(v, { maximumFractionDigits: 0 })}`,
  },
  { key: 'luxuryCount', label: 'Luxury Properties', icon: Crown, format: (v) => formatNumber(v) },
  {
    key: 'averageArea',
    label: 'Average Area',
    icon: Ruler,
    format: (v) => `${formatNumber(v, { maximumFractionDigits: 0 })} sqft`,
  },
]

/** @param {{ summary: import('../../../types/property').MarketSummary }} props */
export function MarketSummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {CARDS.map(({ key, label, icon: Icon, format }) => (
        <div
          key={key}
          className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white shadow-sm"
        >
          <Icon className="h-5 w-5 text-brand-200" />
          <p className="mt-3 text-xl font-semibold">{format(summary[key])}</p>
          <p className="mt-0.5 text-xs text-brand-200">{label}</p>
        </div>
      ))}
    </div>
  )
}
