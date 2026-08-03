import { useCallback, useEffect, useMemo, useState } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { ErrorMessage } from './components/ErrorMessage'
import AnalyticsPage from './pages/AnalyticsPage'
import HomePage from './pages/HomePage'
import PredictorPage from './pages/PredictorPage'
import RecommendationsPage from './pages/RecommendationsPage'
import { getAreaVsPrice, getBedroomPie, getFeatureText, getNearbyProperties, getRecommendations, getSectorStats, predictPrice } from './services/api'
import { useMetadata } from './hooks/useMetadata'
import { validateNearbySearch, validatePredictionForm, validateRecommendationForm } from './utils/validation'

const initialPredictionForm = {
  property_type: 'flat',
  sector: '',
  bedRoom: 1,
  bathroom: 1,
  balcony: 1,
  agePossession: '',
  built_up_area: 1000,
  servant_room: 0,
  store_room: 0,
  furnishing_type: 0,
  luxury_category: '',
  floor_category: '',
}

const initialRecommendationForm = {
  location: '',
  radius_km: 5,
  apartment: '',
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [predictionForm, setPredictionForm] = useState(initialPredictionForm)
  const [predictionResult, setPredictionResult] = useState(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [predictionError, setPredictionError] = useState('')

  const [analytics, setAnalytics] = useState({ sectorStats: [], featureText: '', areaData: [], bedroomPie: null })
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')
  const [analyticsFilters, setAnalyticsFilters] = useState({ property_type: 'flat', sector: 'overall' })

  const [recommendationForm, setRecommendationForm] = useState(initialRecommendationForm)
  const [nearbyProperties, setNearbyProperties] = useState([])
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [nearbyError, setNearbyError] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')

  const { options, loading: metadataLoading, error: metadataError } = useMetadata()

  useEffect(() => {
    if (!options) {
      return
    }

    setPredictionForm((current) => ({
      ...current,
      sector: current.sector || options.sectors?.[0] || '',
      agePossession: current.agePossession || options.ages?.[0] || '',
      luxury_category: current.luxury_category || options.luxury_categories?.[0] || '',
      floor_category: current.floor_category || options.floor_categories?.[0] || '',
    }))

    setRecommendationForm((current) => ({
      ...current,
      location: current.location || options.locations?.[0] || '',
      apartment: current.apartment || options.apartments?.[0] || '',
    }))
  }, [options])

  useEffect(() => {
    if (activePage !== 'analysis') {
      return undefined
    }

    let cancelled = false

    const loadAnalytics = async () => {
      setAnalyticsLoading(true)
      setAnalyticsError('')

      try {
        const [sectorStats, featureText, areaData, bedroomPie] = await Promise.all([
          getSectorStats(),
          getFeatureText(),
          getAreaVsPrice(analyticsFilters.property_type),
          getBedroomPie(analyticsFilters.sector),
        ])

        if (!cancelled) {
          setAnalytics({
            sectorStats,
            featureText: featureText.text,
            areaData,
            bedroomPie,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setAnalyticsError(error.message)
        }
      } finally {
        if (!cancelled) {
          setAnalyticsLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      cancelled = true
    }
  }, [activePage, analyticsFilters.property_type, analyticsFilters.sector])

  const menuItems = useMemo(
    () => [
      { id: 'home', label: 'Dashboard' },
      { id: 'predictor', label: 'Valuation' },
      { id: 'analysis', label: 'Analytics' },
      { id: 'recommend', label: 'Recommendations' },
    ],
    [],
  )

  const metrics = useMemo(
    () => [
      { label: 'Active sectors', value: '32' },
      { label: 'Available listings', value: '1,840' },
      { label: 'Avg. price / sqft', value: '₹ 12,450' },
      { label: 'Model confidence', value: '89.7%' },
    ],
    [],
  )

  const featureCards = useMemo(
    () => [
      {
        title: 'Price Forecasting',
        description: 'Generate reliable valuation estimates for flats and houses across Gurgaon sectors.',
      },
      {
        title: 'Market Analytics',
        description: 'Review sector performance, price trends, and portfolio insights in one place.',
      },
      {
        title: 'Portfolio Recommendations',
        description: 'Discover nearby assets and high-similarity listings for strategic investment.',
      },
    ],
    [],
  )

  const heroActions = useMemo(
    () => [
      { label: 'Run valuation', page: 'predictor', variant: 'primary' },
      { label: 'Open analytics', page: 'analysis', variant: 'secondary' },
    ],
    [],
  )

  const handlePageChange = useCallback((page) => {
    setActivePage(page)
  }, [])

  const handlePredictionChange = useCallback((field, value) => {
    setPredictionForm((current) => ({ ...current, [field]: value }))
    setPredictionError('')
    setPredictionResult(null)
  }, [])

  const handlePredictionSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const validationErrors = validatePredictionForm(predictionForm)
      if (validationErrors.length > 0) {
        setPredictionError(validationErrors.join(' '))
        return
      }

      setPredictionLoading(true)
      setPredictionError('')
      setPredictionResult(null)

      try {
        const result = await predictPrice(predictionForm)
        setPredictionResult(result)
      } catch (error) {
        setPredictionError(error.message)
      } finally {
        setPredictionLoading(false)
      }
    },
    [predictionForm],
  )

  const handleAnalyticsPropertyChange = useCallback((propertyType) => {
    setAnalyticsFilters((current) => ({ ...current, property_type: propertyType }))
  }, [])

  const handleAnalyticsSectorChange = useCallback((sector) => {
    setAnalyticsFilters((current) => ({ ...current, sector }))
  }, [])

  const handleRecommendationChange = useCallback((field, value) => {
    setRecommendationForm((current) => ({ ...current, [field]: value }))
    setNearbyError('')
    setRecommendationError('')
  }, [])

  const handleNearbySubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const validationErrors = validateNearbySearch(recommendationForm.location, recommendationForm.radius_km)
      if (validationErrors.length > 0) {
        setNearbyError(validationErrors.join(' '))
        return
      }

      setNearbyLoading(true)
      setNearbyError('')

      try {
        const result = await getNearbyProperties(recommendationForm.location, recommendationForm.radius_km)
        setNearbyProperties(result)
      } catch (error) {
        setNearbyError(error.message)
      } finally {
        setNearbyLoading(false)
      }
    },
    [recommendationForm.location, recommendationForm.radius_km],
  )

  const handleRecommendationSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      const validationErrors = validateRecommendationForm(recommendationForm.apartment)
      if (validationErrors.length > 0) {
        setRecommendationError(validationErrors.join(' '))
        return
      }

      setRecommendationLoading(true)
      setRecommendationError('')

      try {
        const result = await getRecommendations(recommendationForm.apartment, 5)
        setRecommendations(result)
      } catch (error) {
        setRecommendationError(error.message)
      } finally {
        setRecommendationLoading(false)
      }
    },
    [recommendationForm.apartment],
  )

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} menuItems={menuItems} onNavigate={handlePageChange} />

      <main className="app-main">
        {metadataError ? <ErrorMessage message={metadataError} /> : null}

        {activePage === 'home' ? (
          <HomePage metrics={metrics} featureCards={featureCards} heroActions={heroActions} onNavigate={handlePageChange} />
        ) : null}

        {activePage === 'predictor' ? (
          <PredictorPage
            form={predictionForm}
            options={options}
            loading={metadataLoading || predictionLoading}
            result={predictionResult}
            error={predictionError}
            onChange={handlePredictionChange}
            onSubmit={handlePredictionSubmit}
            onNavigate={handlePageChange}
          />
        ) : null}

        {activePage === 'analysis' ? (
          <AnalyticsPage
            options={options}
            loading={metadataLoading || analyticsLoading}
            error={analyticsError}
            analytics={analytics}
            filters={analyticsFilters}
            onPropertyTypeChange={handleAnalyticsPropertyChange}
            onSectorChange={handleAnalyticsSectorChange}
            onNavigate={handlePageChange}
          />
        ) : null}

        {activePage === 'recommend' ? (
          <RecommendationsPage
            options={options}
            loading={metadataLoading || nearbyLoading || recommendationLoading}
            nearbyProperties={nearbyProperties}
            recommendations={recommendations}
            form={recommendationForm}
            nearbyError={nearbyError}
            recommendationError={recommendationError}
            onChange={handleRecommendationChange}
            onNearbySubmit={handleNearbySubmit}
            onRecommendationSubmit={handleRecommendationSubmit}
            onNavigate={handlePageChange}
          />
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default App