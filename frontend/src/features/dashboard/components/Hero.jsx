import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LineChart } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { ROUTES } from '../../../constants/routes'
import { DashboardPreview } from './DashboardPreview'

export function Hero() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Property intelligence
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            AI-Powered Gurgaon Property Intelligence
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-500 dark:text-slate-400">
            Explore Gurgaon properties, predict prices, analyze market trends, and discover the best locations
            using interactive visualizations and machine learning.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button as={Link} to={ROUTES.predictor} size="lg">
              Open Predictor
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} to={ROUTES.analysis} variant="secondary" size="lg">
              <LineChart className="h-4 w-4" />
              Explore Analysis
            </Button>
          </div>
        </motion.div>

        <DashboardPreview />
      </div>
    </Card>
  )
}
