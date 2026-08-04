import { useState } from 'react'
import { Card, CardHeader } from '../components/ui/Card'
import { useRecommendOptions } from '../features/recommendations/hooks/useRecommendOptions'
import { useNearbyProperties } from '../features/recommendations/hooks/useNearbyProperties'
import { useRecommendMutation } from '../features/recommendations/hooks/useRecommendMutation'
import { NearbySearchForm } from '../features/recommendations/components/NearbySearchForm'
import { NearbyResultsTable } from '../features/recommendations/components/NearbyResultsTable'
import { RecommendForm } from '../features/recommendations/components/RecommendForm'
import { RecommendationsTable } from '../features/recommendations/components/RecommendationsTable'

export function RecommendPage() {
  const { data: options } = useRecommendOptions()

  const [location, setLocation] = useState('')
  const [radiusKm, setRadiusKm] = useState(5)
  const [submittedSearch, setSubmittedSearch] = useState(null)
  const nearbyQuery = useNearbyProperties(submittedSearch?.location, submittedSearch?.radiusKm, Boolean(submittedSearch))

  const [apartment, setApartment] = useState('')
  const recommendMutation = useRecommendMutation()

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader eyebrow="Search" title="Nearby Properties" description="Filter by location and radius in kilometers." />
        <NearbySearchForm
          locations={options?.locations || []}
          location={location}
          radiusKm={radiusKm}
          onLocationChange={setLocation}
          onRadiusChange={setRadiusKm}
          onSubmit={() => setSubmittedSearch({ location, radiusKm })}
          isLoading={nearbyQuery.isFetching}
        />
        <div className="mt-4">
          <NearbyResultsTable rows={nearbyQuery.data || []} />
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Similarity" title="Apartment Recommendations" description="Return the most similar apartments." />
        <RecommendForm
          apartments={options?.apartments || []}
          apartment={apartment}
          onApartmentChange={setApartment}
          onSubmit={() => recommendMutation.mutate({ propertyName: apartment, topN: 5 })}
          isLoading={recommendMutation.isPending}
        />
        <div className="mt-4">
          <RecommendationsTable rows={recommendMutation.data || []} />
        </div>
      </Card>
    </div>
  )
}
