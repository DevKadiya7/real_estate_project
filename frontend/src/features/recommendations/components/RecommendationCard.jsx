import { useState } from 'react'
import { Building2, Home, Landmark, MapPin } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'

// No property photos exist in the dataset — this picks a deterministic
// icon/gradient per property (from its name) instead of a fabricated image.
const PLACEHOLDER_STYLES = [
  { icon: Building2, gradient: 'from-brand-500 to-brand-700' },
  { icon: Home, gradient: 'from-violet-500 to-violet-700' },
  { icon: Landmark, gradient: 'from-emerald-500 to-emerald-700' },
]

function placeholderFor(name) {
  const hash = [...(name || '')].reduce((total, char) => total + char.charCodeAt(0), 0)
  return PLACEHOLDER_STYLES[hash % PLACEHOLDER_STYLES.length]
}

export function RecommendationCard({ result }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { icon: Icon, gradient } = placeholderFor(result.PropertyName)
  const amenities = result.amenities || []

  return (
    <Card className="flex flex-col gap-3">
      <div className={`flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
        <Icon className="h-9 w-9 opacity-90" />
      </div>

      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-900 dark:text-white">{result.PropertyName}</p>
        <Badge variant="brand">{Number(result.SimilarityScore).toFixed(2)} match</Badge>
      </div>

      {amenities.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
          {amenities.length > 3 ? <Badge>+{amenities.length - 3} more</Badge> : null}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No amenity data available.</p>
      )}

      <Button variant="secondary" size="sm" className="mt-auto" onClick={() => setDetailsOpen(true)}>
        View Details
      </Button>

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title={result.PropertyName}>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-4 w-4" />
          Gurgaon
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          Similarity score: {Number(result.SimilarityScore).toFixed(3)}
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Amenities</p>
        {amenities.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {amenities.map((amenity) => (
              <Badge key={amenity}>{amenity}</Badge>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No amenity data available for this property.</p>
        )}
      </Modal>
    </Card>
  )
}
