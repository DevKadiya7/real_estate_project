import { Building2, LineChart, Map, Sparkles } from 'lucide-react'
import { Hero } from '../features/dashboard/components/Hero'
import { FeatureCard } from '../features/dashboard/components/FeatureCard'
import { ROUTES } from '../constants/routes'

const FEATURES = [
  {
    icon: Building2,
    title: 'AI Price Prediction',
    description: 'Estimate the expected property price range from the trained pipeline.',
    to: ROUTES.predictor,
  },
  {
    icon: LineChart,
    title: 'Market Analysis',
    description: 'Sector pricing, price distributions, and possession-stage trends across Gurgaon.',
    to: ROUTES.analysis,
  },
  {
    icon: Map,
    title: 'Interactive Gurgaon Map',
    description: 'Real street & satellite map with sector markers, price heatmap, and luxury filter.',
    to: ROUTES.analysis,
  },
  {
    icon: Sparkles,
    title: 'Smart Property Recommendation',
    description: 'Search nearby apartments and retrieve similarity-based recommendations with amenities.',
    to: ROUTES.recommend,
  },
]

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Hero />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  )
}
