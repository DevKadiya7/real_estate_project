import Loader from '../components/Loader'
import { ErrorMessage } from '../components/ErrorMessage'

const RecommendationsPage = ({ options, loading, nearbyProperties, recommendations, form, nearbyError, recommendationError, onChange, onNearbySubmit, onRecommendationSubmit, onNavigate }) => {
  return (
    <div className="page-grid page-grid--recommend">
      <section className="panel page-intro">
        <div>
          <p className="section-heading__eyebrow">Recommendations</p>
          <h2>Find nearby and similar properties</h2>
          <p>Use the location filter to discover nearby listings and the similarity engine to compare apartments.</p>
        </div>
        <button type="button" className="button button--secondary" onClick={() => onNavigate('predictor')}>
          Open valuation
        </button>
      </section>

      <section className="panel">
        <div className="section-heading section-heading--stacked">
          <div>
            <p className="section-heading__eyebrow">Nearby search</p>
            <h3>Properties within radius</h3>
          </div>
        </div>

        <form className="mini-form" onSubmit={onNearbySubmit} aria-busy={loading}>
          <label className="field">
            <span>Location</span>
            <select value={form.location} onChange={(e) => onChange('location', e.target.value)}>
              {(options?.locations || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Radius in km</span>
            <input type="number" min="0.1" step="0.5" value={form.radius_km} onChange={(e) => onChange('radius_km', Number(e.target.value))} />
          </label>

          <div className="form__actions">
            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search nearby'}
            </button>
          </div>
        </form>

        {nearbyError ? <ErrorMessage message={nearbyError} /> : null}
        {loading ? <Loader label="Loading nearby properties" /> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {nearbyProperties.map((item) => (
                <tr key={item.property_name}>
                  <td>{item.property_name}</td>
                  <td>{item.distance_km}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading section-heading--stacked">
          <div>
            <p className="section-heading__eyebrow">Similarity search</p>
            <h3>Apartment recommendations</h3>
          </div>
        </div>

        <form className="mini-form" onSubmit={onRecommendationSubmit} aria-busy={loading}>
          <label className="field">
            <span>Apartment</span>
            <select value={form.apartment} onChange={(e) => onChange('apartment', e.target.value)}>
              {(options?.apartments || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="form__actions">
            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Recommending...' : 'Recommend'}
            </button>
          </div>
        </form>

        {recommendationError ? <ErrorMessage message={recommendationError} /> : null}
        {loading ? <Loader label="Loading recommendations" /> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Similarity score</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((item) => (
                <tr key={item.PropertyName}>
                  <td>{item.PropertyName}</td>
                  <td>{Number(item.SimilarityScore).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default RecommendationsPage