import { EmptyState } from '../../../components/common/EmptyState'
import { RecommendationCard } from './RecommendationCard'

export function RecommendationsTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <EmptyState message="Pick an apartment to see similar recommendations." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <RecommendationCard key={row.PropertyName} result={row} />
      ))}
    </div>
  )
}
