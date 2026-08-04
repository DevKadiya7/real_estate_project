import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { StatCard } from '../../../components/common/StatCard'
import { Badge } from '../../../components/ui/Badge'
import { formatCrore } from '../../../utils/formatters'

export function PredictionResult({ result }) {
  if (!result) return null

  return (
    <div className="mt-6 animate-fade-in-up">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="brand">{result.property_type}</Badge>
        {result.note ? <Badge>{result.note}</Badge> : null}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Estimated Price" value={formatCrore(result.base_price, result.unit)} />
        <StatCard icon={TrendingDown} label="Estimated Low" value={formatCrore(result.low, result.unit)} />
        <StatCard icon={TrendingUp} label="Estimated High" value={formatCrore(result.high, result.unit)} />
      </div>
    </div>
  )
}
