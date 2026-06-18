import React, { useEffect, useMemo, useState } from 'react'
import Plot from 'react-plotly.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const fetchJson = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}

const emptyPredictForm = {
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

const SectionShell = ({ eyebrow, title, description, children, action }) => (
  <section className="panel">
    <div className="panel-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
)

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
)

function App() {
  const [page, setPage] = useState('home')
  const [options, setOptions] = useState(null)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [predictForm, setPredictForm] = useState(emptyPredictForm)
  const [predictResult, setPredictResult] = useState(null)
  const [predictError, setPredictError] = useState('')
  const [analysis, setAnalysis] = useState({ sectorStats: [], featureText: '', areaData: [], bedroomPie: null })
  const [analysisFilters, setAnalysisFilters] = useState({ property_type: 'flat', sector: 'overall' })
  const [recommendation, setRecommendation] = useState({ location: '', radius_km: 5, apartment: '' })
  const [nearby, setNearby] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetchJson('/api/metadata/options')
      .then((data) => {
        setOptions(data)
        setPredictForm((current) => ({
          ...current,
          sector: data.sectors?.[0] || '',
          agePossession: data.ages?.[0] || '',
          luxury_category: data.luxury_categories?.[0] || '',
          floor_category: data.floor_categories?.[0] || '',
        }))
        setRecommendation((current) => ({
          ...current,
          location: data.locations?.[0] || '',
          apartment: data.apartments?.[0] || '',
        }))
      })
      .catch((error) => setNotice(error.message))
      .finally(() => setLoadingOptions(false))
  }, [])

  useEffect(() => {
    if (page !== 'analysis') return

    Promise.all([
      fetchJson('/api/analytics/sector-stats'),
      fetchJson('/api/analytics/feature-text'),
      fetchJson(`/api/analytics/area-vs-price?property_type=${analysisFilters.property_type}`),
      fetchJson(`/api/analytics/bedroom-pie?sector=${encodeURIComponent(analysisFilters.sector)}`),
    ])
      .then(([sectorStats, featureText, areaData, bedroomPie]) => {
        setAnalysis({ sectorStats, featureText: featureText.text, areaData, bedroomPie })
      })
      .catch((error) => setNotice(error.message))
  }, [page, analysisFilters])

  const homeCards = useMemo(
    () => [
      {
        title: 'Price Predictor',
        text: 'Estimate the expected property range from the trained pipeline.',
        key: 'predictor',
      },
      {
        title: 'Analysis App',
        text: 'Inspect sector pricing, area trends, word frequency, and price distributions.',
        key: 'analysis',
      },
      {
        title: 'Recommend Appartments',
        text: 'Search nearby apartments and retrieve similarity-based recommendations.',
        key: 'recommend',
      },
    ],
    [],
  )

  const renderNav = () => (
    <aside className="sidebar">
      <div>
        <h1 className="brand">Gurgaon Real Estate</h1>
      </div>
      <nav className="nav-list">
        <button className={page === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('home')}>Home</button>
        <button className={page === 'predictor' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('predictor')}>Price Predictor</button>
        <button className={page === 'analysis' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('analysis')}>Analysis</button>
        <button className={page === 'recommend' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('recommend')}>Recommend</button>
      </nav>
    </aside>
  )

  const renderHome = () => (
    <div className="hero-grid">
      <div className="hero-copy panel">
        <p className="eyebrow">Migration target</p>
        <h2>Interactive property intelligence, rebuilt for the browser</h2>
        <p className="muted">
          The backend owns model inference and data aggregation. The React UI keeps the experience fast and clearer than the original Streamlit shell.
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setPage('predictor')}>Open predictor</button>
          <button className="secondary" onClick={() => setPage('analysis')}>View analysis</button>
        </div>
      </div>
      <div className="stack">
        {homeCards.map((card) => (
          <div className="panel card" key={card.key}>
            <p className="eyebrow">Module</p>
            <h3>{card.title}</h3>
            <p className="muted">{card.text}</p>
            <button className="linkish" onClick={() => setPage(card.key)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPredictor = () => {
    const submit = async (event) => {
      event.preventDefault()
      setPredictError('')
      setPredictResult(null)

      try {
        const result = await fetchJson('/api/predict', {
          method: 'POST',
          body: JSON.stringify(predictForm),
        })
        setPredictResult(result)
      } catch (error) {
        setPredictError(error.message)
      }
    }

    const updateField = (name, value) => setPredictForm((current) => ({ ...current, [name]: value }))

    return (
      <SectionShell
        eyebrow="Prediction"
        title="Price Predictor"
        description="Fill in the property details and get the estimated range from the backend pipeline."
      >
        {loadingOptions ? <p className="muted">Loading form options...</p> : null}
        <form className="form-grid" onSubmit={submit}>
          <label><span>Property Type</span><select value={predictForm.property_type} onChange={(e) => updateField('property_type', e.target.value)}><option value="flat">flat</option><option value="house">house</option></select></label>
          <label><span>Sector</span><select value={predictForm.sector} onChange={(e) => updateField('sector', e.target.value)}>{options?.sectors?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>Bedrooms</span><input type="number" step="0.5" value={predictForm.bedRoom} onChange={(e) => updateField('bedRoom', Number(e.target.value))} /></label>
          <label><span>Bathrooms</span><input type="number" step="0.5" value={predictForm.bathroom} onChange={(e) => updateField('bathroom', Number(e.target.value))} /></label>
          <label><span>Balconies</span><input type="number" step="1" value={predictForm.balcony} onChange={(e) => updateField('balcony', Number(e.target.value))} /></label>
          <label><span>Age Possession</span><select value={predictForm.agePossession} onChange={(e) => updateField('agePossession', e.target.value)}>{options?.ages?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>Built Up Area</span><input type="number" step="1" value={predictForm.built_up_area} onChange={(e) => updateField('built_up_area', Number(e.target.value))} /></label>
          <label><span>Servant Room</span><input type="number" step="1" value={predictForm.servant_room} onChange={(e) => updateField('servant_room', Number(e.target.value))} /></label>
          <label><span>Store Room</span><input type="number" step="1" value={predictForm.store_room} onChange={(e) => updateField('store_room', Number(e.target.value))} /></label>
          <label><span>Furnishing Type</span><select value={predictForm.furnishing_type} onChange={(e) => updateField('furnishing_type', Number(e.target.value))}>{options?.furnishing_types?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>Luxury Category</span><select value={predictForm.luxury_category} onChange={(e) => updateField('luxury_category', e.target.value)}>{options?.luxury_categories?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span>Floor Category</span><select value={predictForm.floor_category} onChange={(e) => updateField('floor_category', e.target.value)}>{options?.floor_categories?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div className="form-actions"><button className="primary" type="submit">Predict</button></div>
        </form>
        {predictError ? <p className="error-box">{predictError}</p> : null}
        {predictResult ? (
          <div className="result-grid">
            <StatCard label="Property Type" value={predictResult.property_type} />
            <StatCard label="Estimated Low" value={`${predictResult.low} ${predictResult.unit}`} />
            <StatCard label="Estimated High" value={`${predictResult.high} ${predictResult.unit}`} />
          </div>
        ) : null}
      </SectionShell>
    )
  }

  const renderAnalysis = () => {
    const sectorStats = analysis.sectorStats || []
    const scatterData = [
      {
        x: analysis.areaData.map((item) => item.built_up_area),
        y: analysis.areaData.map((item) => item.price),
        mode: 'markers',
        type: 'scatter',
        marker: { color: '#e85d75', size: 9, opacity: 0.75 },
        text: analysis.areaData.map((item) => `BHK: ${item.bedRoom}`),
        name: analysisFilters.property_type,
      },
    ]

    const pieData = analysis.bedroomPie
      ? [{ values: analysis.bedroomPie.values, labels: analysis.bedroomPie.labels, type: 'pie', hole: 0.4, marker: { colors: ['#ffb703', '#e85d75', '#6d597a', '#8ecae6'] } }]
      : []

    const mapData = [{
      type: 'scattergeo',
      mode: 'markers',
      lat: sectorStats.map((item) => item.latitude),
      lon: sectorStats.map((item) => item.longitude),
      text: sectorStats.map((item) => item.sector),
      marker: {
        size: sectorStats.map((item) => Math.max(8, Math.min(24, (item.built_up_area || 0) / 100))),
        color: sectorStats.map((item) => item.price_per_sqft),
        colorscale: 'Portland',
        showscale: true,
        colorbar: { title: 'Price / sqft' },
      },
    }]

    return (
      <div className="analysis-grid">
        <SectionShell eyebrow="Analytics" title="Sector Pricing Map" description="Aggregated averages by sector.">
          <Plot data={mapData} layout={{ height: 420, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', geo: { scope: 'asia', resolution: 50, showland: true, landcolor: '#f5f1ea', showcountries: true, countrycolor: '#cccccc' }, margin: { l: 0, r: 0, t: 0, b: 0 } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%' }} />
        </SectionShell>

        <div className="analysis-row">
          <SectionShell eyebrow="Text" title="Feature Word Cloud" description="The backend returns the source text; you can render a word cloud client-side later.">
            <div className="wordcloud-box">{analysis.featureText ? analysis.featureText.slice(0, 1200) + (analysis.featureText.length > 1200 ? '...' : '') : 'Loading wordcloud text...'}</div>
          </SectionShell>

          <SectionShell eyebrow="Trends" title="Area vs Price" description="Switch between flat and house data.">
            <div className="chip-row">
              <button className={analysisFilters.property_type === 'flat' ? 'chip active' : 'chip'} onClick={() => setAnalysisFilters((current) => ({ ...current, property_type: 'flat' }))}>Flat</button>
              <button className={analysisFilters.property_type === 'house' ? 'chip active' : 'chip'} onClick={() => setAnalysisFilters((current) => ({ ...current, property_type: 'house' }))}>House</button>
            </div>
            <Plot data={scatterData} layout={{ height: 360, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', margin: { l: 40, r: 20, t: 20, b: 40 }, xaxis: { title: 'Built Up Area' }, yaxis: { title: 'Price' } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%' }} />
          </SectionShell>
        </div>

        <div className="analysis-row">
          <SectionShell eyebrow="Mix" title="BHK Distribution" description="Counts grouped by bedroom count.">
            <div className="chip-row">
              <button className={analysisFilters.sector === 'overall' ? 'chip active' : 'chip'} onClick={() => setAnalysisFilters((current) => ({ ...current, sector: 'overall' }))}>Overall</button>
              {(options?.sectors || []).slice(0, 6).map((sector) => (
                <button key={sector} className={analysisFilters.sector === sector ? 'chip active' : 'chip'} onClick={() => setAnalysisFilters((current) => ({ ...current, sector }))}>{sector}</button>
              ))}
            </div>
            <Plot data={pieData} layout={{ height: 360, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', margin: { l: 20, r: 20, t: 20, b: 20 } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%' }} />
          </SectionShell>

          <SectionShell eyebrow="Spread" title="BHK Price Comparison" description="A box plot-style view built from the aggregated dataset.">
            <Plot data={[{ x: sectorStats.slice(0, 15).map((item) => item.sector), y: sectorStats.slice(0, 15).map((item) => item.price), type: 'box', marker: { color: '#6d597a' } }]} layout={{ height: 360, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', margin: { l: 40, r: 20, t: 20, b: 40 }, yaxis: { title: 'Price' } }} config={{ displayModeBar: false, responsive: true }} style={{ width: '100%' }} />
          </SectionShell>
        </div>
      </div>
    )
  }

  const renderRecommend = () => {
    const submitNearby = async (event) => {
      event.preventDefault()
      const result = await fetchJson(`/api/recommend/nearby?location=${encodeURIComponent(recommendation.location)}&radius_km=${recommendation.radius_km}`)
      setNearby(result)
    }

    const submitRecommend = async (event) => {
      event.preventDefault()
      const result = await fetchJson('/api/recommend', {
        method: 'POST',
        body: JSON.stringify({ property_name: recommendation.apartment, top_n: 5 }),
      })
      setRecommendations(result)
    }

    return (
      <div className="recommend-grid">
        <SectionShell eyebrow="Search" title="Nearby Properties" description="Filter by location and radius in kilometers.">
          <form className="form-grid compact" onSubmit={submitNearby}>
            <label><span>Location</span><select value={recommendation.location} onChange={(e) => setRecommendation((current) => ({ ...current, location: e.target.value }))}>{options?.locations?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label><span>Radius in Kms</span><input type="number" step="0.5" value={recommendation.radius_km} onChange={(e) => setRecommendation((current) => ({ ...current, radius_km: Number(e.target.value) }))} /></label>
            <div className="form-actions"><button className="primary" type="submit">Search</button></div>
          </form>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Property</th><th>Distance (km)</th></tr></thead>
              <tbody>{nearby.map((item) => <tr key={item.property_name}><td>{item.property_name}</td><td>{item.distance_km}</td></tr>)}</tbody>
            </table>
          </div>
        </SectionShell>

        <SectionShell eyebrow="Similarity" title="Apartment Recommendations" description="Return the most similar apartments from the backend recommender.">
          <form className="form-grid compact" onSubmit={submitRecommend}>
            <label><span>Apartment</span><select value={recommendation.apartment} onChange={(e) => setRecommendation((current) => ({ ...current, apartment: e.target.value }))}>{options?.apartments?.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <div className="form-actions"><button className="primary" type="submit">Recommend</button></div>
          </form>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Property</th><th>Similarity Score</th></tr></thead>
              <tbody>{recommendations.map((item) => <tr key={item.PropertyName}><td>{item.PropertyName}</td><td>{Number(item.SimilarityScore).toFixed(3)}</td></tr>)}</tbody>
            </table>
          </div>
        </SectionShell>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {renderNav()}
      <main className="content-area">
        {notice ? <div className="notice">{notice}</div> : null}
        {page === 'home' ? renderHome() : null}
        {page === 'predictor' ? renderPredictor() : null}
        {page === 'analysis' ? renderAnalysis() : null}
        {page === 'recommend' ? renderRecommend() : null}
      </main>
    </div>
  )
}

export default App
