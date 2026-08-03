import { memo } from 'react'
import { CheckIcon } from './Icons'

const ResultCard = ({ result }) => {
  if (!result) {
    return null
  }

  return (
    <section className="panel result-card" aria-live="polite">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Prediction result</p>
          <h2>Estimated price range</h2>
        </div>
        <span className="status-pill">
          <CheckIcon />
          Ready
        </span>
      </div>

      <div className="result-card__price">
        <strong>
          {result.low} - {result.high} {result.unit}
        </strong>
        <p>Property type: {result.property_type}</p>
      </div>

      <div className="result-card__grid">
        <article>
          <span>Base price</span>
          <strong>{result.base_price}</strong>
        </article>
        <article>
          <span>Low estimate</span>
          <strong>{result.low} {result.unit}</strong>
        </article>
        <article>
          <span>High estimate</span>
          <strong>{result.high} {result.unit}</strong>
        </article>
      </div>
    </section>
  )
}

export default memo(ResultCard)