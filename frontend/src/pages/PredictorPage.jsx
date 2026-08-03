import Loader from '../components/Loader'
import PredictionForm from '../components/PredictionForm'
import ResultCard from '../components/ResultCard'
import { ErrorMessage } from '../components/ErrorMessage'

const PredictorPage = ({ form, options, loading, result, error, onChange, onSubmit, onNavigate }) => {
  return (
    <div className="page-grid page-grid--predictor">
      <div className="page-actions panel">
        <div>
          <p className="section-heading__eyebrow">Valuation</p>
          <h2>Predict property prices with the trained pipeline</h2>
          <p>
            Enter property details to generate a price range in crores. The backend logic remains unchanged.
          </p>
        </div>
        <button type="button" className="button button--secondary" onClick={() => onNavigate('analysis')}>
          View analytics
        </button>
      </div>

      <PredictionForm form={form} options={options} loading={loading} onChange={onChange} onSubmit={onSubmit} />

      <div className="page-grid__aside">
        {loading ? <Loader label="Preparing prediction data" /> : null}
        {error ? <ErrorMessage message={error} /> : null}
        <ResultCard result={result} />
        {!result && !loading ? (
          <section className="panel empty-state">
            <h3>Ready when you are</h3>
            <p>Submit the form to view the estimated price range in a clean summary card.</p>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default PredictorPage