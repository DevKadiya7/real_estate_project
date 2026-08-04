import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { SkeletonText } from '../components/ui/Skeleton'
import { ROUTES } from '../constants/routes'

// Each page is its own chunk — the router only downloads the page the user
// actually navigates to.
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const PredictorPage = lazy(() => import('../pages/PredictorPage').then((m) => ({ default: m.PredictorPage })))
const AnalysisPage = lazy(() => import('../pages/AnalysisPage').then((m) => ({ default: m.AnalysisPage })))
const RecommendPage = lazy(() => import('../pages/RecommendPage').then((m) => ({ default: m.RecommendPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function PageFallback() {
  return (
    <div className="glass-panel p-6">
      <SkeletonText lines={6} />
    </div>
  )
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: ROUTES.home, element: withSuspense(HomePage) },
      { path: ROUTES.predictor, element: withSuspense(PredictorPage) },
      { path: ROUTES.analysis, element: withSuspense(AnalysisPage) },
      { path: ROUTES.recommend, element: withSuspense(RecommendPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
])
