import Plot from 'react-plotly.js'
import Loader from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'

const AnalyticsPage = ({ options, loading, error, analytics, filters, onPropertyTypeChange, onSectorChange, onNavigate }) => {
  const sectorStats = analytics.sectorStats || []
  const areaData = analytics.areaData || []
  const bedroomPie = analytics.bedroomPie

  const mapData = [
    {
      type: 'scattergeo',
      mode: 'markers',
      lat: sectorStats.map((item) => item.latitude),
      lon: sectorStats.map((item) => item.longitude),
      text: sectorStats.map((item) => item.sector),
      marker: {
        size: sectorStats.map((item) => Math.max(8, Math.min(24, (item.built_up_area || 0) / 100))),
        color: sectorStats.map((item) => item.price_per_sqft),
        colorscale: 'Blues',
        showscale: true,
        colorbar: { title: 'Price / sqft' },
      },
    },
  ]

  const scatterData = [
    {
      x: areaData.map((item) => item.built_up_area),
      y: areaData.map((item) => item.price),
      mode: 'markers',
      type: 'scatter',
      marker: { color: '#2563EB', size: 9, opacity: 0.72 },
      text: areaData.map((item) => `BHK: ${item.bedRoom}`),
      name: filters.property_type,
    },
  ]

  const pieData = bedroomPie
    ? [
        {
          values: bedroomPie.values,
          labels: bedroomPie.labels,
          type: 'pie',
          hole: 0.45,
          marker: { colors: ['#2563EB', '#60A5FA', '#93C5FD', '#1D4ED8'] },
        },
      ]
    : []

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Analytics</p>
            <h2>Market insight dashboard</h2>
          </div>
          <button type="button" className="button button--secondary" onClick={() => onNavigate('recommend')}>
            View recommendations
          </button>
        </div>

        {error ? <ErrorMessage message={error} /> : null}
        {loading ? <Loader label="Loading analytics" /> : null}

        <div className="chart-panel chart-panel--full">
          <Plot
            data={mapData}
            layout={{
              height: 420,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              geo: { scope: 'asia', resolution: 50, showland: true, landcolor: '#F8FAFC', showcountries: true, countrycolor: '#CBD5E1' },
              margin: { l: 0, r: 0, t: 0, b: 0 },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </div>
      </section>

      <div className="analytics-grid">
        <section className="panel chart-panel">
          <div className="section-heading section-heading--stacked">
            <div>
              <p className="section-heading__eyebrow">Text analysis</p>
              <h3>Feature word cloud source</h3>
            </div>
          </div>
          <div className="text-box">{analytics.featureText ? `${analytics.featureText.slice(0, 1200)}${analytics.featureText.length > 1200 ? '...' : ''}` : 'Loading wordcloud text...'}</div>
        </section>

        <section className="panel chart-panel">
          <div className="section-heading section-heading--stacked">
            <div>
              <p className="section-heading__eyebrow">Trend analysis</p>
              <h3>Area vs price</h3>
            </div>
          </div>

          <div className="chip-row" role="tablist" aria-label="Property type filter">
            <button className={filters.property_type === 'flat' ? 'chip chip--active' : 'chip'} type="button" onClick={() => onPropertyTypeChange('flat')}>
              Flat
            </button>
            <button className={filters.property_type === 'house' ? 'chip chip--active' : 'chip'} type="button" onClick={() => onPropertyTypeChange('house')}>
              House
            </button>
          </div>

          <Plot
            data={scatterData}
            layout={{
              height: 320,
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              margin: { l: 44, r: 20, t: 20, b: 42 },
              xaxis: { title: 'Built-up area' },
              yaxis: { title: 'Price' },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </section>

        <section className="panel chart-panel">
          <div className="section-heading section-heading--stacked">
            <div>
              <p className="section-heading__eyebrow">Distribution</p>
              <h3>BHK mix</h3>
            </div>
          </div>

          <div className="chip-row">
            <button className={filters.sector === 'overall' ? 'chip chip--active' : 'chip'} type="button" onClick={() => onSectorChange('overall')}>
              Overall
            </button>
            {(options?.sectors || []).slice(0, 6).map((sector) => (
              <button className={filters.sector === sector ? 'chip chip--active' : 'chip'} type="button" key={sector} onClick={() => onSectorChange(sector)}>
                {sector}
              </button>
            ))}
          </div>

          <Plot
            data={pieData}
            layout={{ height: 320, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', margin: { l: 20, r: 20, t: 20, b: 20 } }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </section>

        <section className="panel chart-panel">
          <div className="section-heading section-heading--stacked">
            <div>
              <p className="section-heading__eyebrow">Price spread</p>
              <h3>BHK price comparison</h3>
            </div>
          </div>

          <Plot
            data={[
              {
                x: sectorStats.slice(0, 15).map((item) => item.sector),
                y: sectorStats.slice(0, 15).map((item) => item.price),
                type: 'box',
                marker: { color: '#1D4ED8' },
              },
            ]}
            layout={{ height: 320, paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', margin: { l: 44, r: 20, t: 20, b: 42 }, yaxis: { title: 'Price' } }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
        </section>
      </div>
    </div>
  )
}

export default AnalyticsPage