import { lazy, Suspense, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useProperties } from '../hooks/useProperties'
import { useAnalyticsFilters } from '../features/analytics/hooks/useAnalyticsFilters'
import {
  computeAreaPriceBubble,
  computeBedroomDistribution,
  computeMarketSummary,
  computePossessionBreakdown,
  computePriceHistogram,
  computePropertyTypePie,
  computeSectorInsights,
} from '../features/analytics/utils/aggregate'
import { GurgaonMap } from '../features/analytics/components/GurgaonMap'
import { MarketSummaryCards } from '../features/analytics/components/MarketSummaryCards'
import { FilterPanel } from '../features/analytics/components/FilterPanel'
import { SectorInsights } from '../features/analytics/components/SectorInsights'
import { Sheet } from '../components/ui/Sheet'
import { Button } from '../components/ui/Button'
import { ChartSkeleton } from '../components/charts/ChartSkeleton'
import { Card } from '../components/ui/Card'
import { SkeletonText } from '../components/ui/Skeleton'
import { ErrorState } from '../components/common/ErrorState'

const PriceDistributionHistogram = lazy(() =>
  import('../features/analytics/components/charts/PriceDistributionHistogram').then((m) => ({ default: m.PriceDistributionHistogram })),
)
const SectorAvgPriceBar = lazy(() =>
  import('../features/analytics/components/charts/SectorAvgPriceBar').then((m) => ({ default: m.SectorAvgPriceBar })),
)
const Top15ExpensiveSectors = lazy(() =>
  import('../features/analytics/components/charts/Top15ExpensiveSectors').then((m) => ({ default: m.Top15ExpensiveSectors })),
)
const PropertyTypePie = lazy(() =>
  import('../features/analytics/components/charts/PropertyTypePie').then((m) => ({ default: m.PropertyTypePie })),
)
const AreaPriceScatter = lazy(() =>
  import('../features/analytics/components/charts/AreaPriceScatter').then((m) => ({ default: m.AreaPriceScatter })),
)
const BedroomsDistributionBar = lazy(() =>
  import('../features/analytics/components/charts/BedroomsDistributionBar').then((m) => ({ default: m.BedroomsDistributionBar })),
)
const PriceAreaBubble = lazy(() =>
  import('../features/analytics/components/charts/PriceAreaBubble').then((m) => ({ default: m.PriceAreaBubble })),
)
const PossessionBreakdown = lazy(() =>
  import('../features/analytics/components/charts/PossessionBreakdown').then((m) => ({ default: m.PossessionBreakdown })),
)

function LazyChart({ children }) {
  return <Suspense fallback={<Card><ChartSkeleton /></Card>}>{children}</Suspense>
}

export function AnalysisPage() {
  const { data: properties, isLoading, error, refetch } = useProperties()
  const { filters, updateFilter, reset, filtered, bounds } = useAnalyticsFilters(properties)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const sectors = useMemo(
    () => [...new Set((properties || []).map((p) => p.sector).filter(Boolean))].sort(),
    [properties],
  )

  const summary = useMemo(() => computeMarketSummary(filtered), [filtered])
  const sectorInsights = useMemo(() => computeSectorInsights(filtered), [filtered])
  const histogramData = useMemo(() => computePriceHistogram(filtered), [filtered])
  const propertyTypeData = useMemo(() => computePropertyTypePie(filtered), [filtered])
  const bedroomData = useMemo(() => computeBedroomDistribution(filtered), [filtered])
  const bubbleData = useMemo(() => computeAreaPriceBubble(filtered), [filtered])
  const possessionData = useMemo(() => computePossessionBreakdown(filtered), [filtered])

  if (isLoading) {
    return (
      <Card>
        <SkeletonText lines={8} />
      </Card>
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  const filterPanelProps = { filters, updateFilter, reset, bounds, sectors, onApply: () => setMobileFiltersOpen(false) }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <Card className="sticky top-20">
          <FilterPanel {...filterPanelProps} />
        </Card>
      </aside>

      <div className="lg:hidden">
        <Button variant="secondary" onClick={() => setMobileFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen} title="Filters">
          <FilterPanel {...filterPanelProps} />
        </Sheet>
      </div>

      <div className="flex flex-col gap-6">
        <GurgaonMap sectorInsights={sectorInsights} properties={filtered} onSelectSector={(sector) => updateFilter('sector', sector)} />

        <MarketSummaryCards summary={summary} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LazyChart><PriceDistributionHistogram data={histogramData} /></LazyChart>
          <LazyChart><PropertyTypePie data={propertyTypeData} /></LazyChart>
          <LazyChart><SectorAvgPriceBar sectorInsights={sectorInsights} /></LazyChart>
          <LazyChart><Top15ExpensiveSectors sectorInsights={sectorInsights} /></LazyChart>
          <LazyChart><AreaPriceScatter data={filtered.filter((p) => p.built_up_area && p.price).map((p) => ({ area: p.built_up_area, price: p.price }))} /></LazyChart>
          <LazyChart><BedroomsDistributionBar data={bedroomData} /></LazyChart>
          <LazyChart><PriceAreaBubble data={bubbleData} /></LazyChart>
          <LazyChart><PossessionBreakdown data={possessionData} /></LazyChart>
        </div>

        <SectorInsights sectorInsights={sectorInsights} onSelectSector={(sector) => updateFilter('sector', sector)} />
      </div>
    </div>
  )
}
