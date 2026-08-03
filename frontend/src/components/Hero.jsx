import { memo } from 'react'
import { ArrowRightIcon, ChartIcon, SparkIcon, TrendIcon } from './Icons'

const Hero = ({ title, description, actions, metrics, onAction }) => {
  return (
    <section className="hero panel">
      <div className="hero__content">
        <span className="hero__badge">
          <SparkIcon />
          Premium Gurgaon property insights
        </span>
        <h2>{title}</h2>
        <p className="hero__description">{description}</p>

        <div className="hero__actions">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={action.variant === 'secondary' ? 'button button--secondary' : 'button button--primary'}
              onClick={() => onAction(action.page)}
            >
              {action.label}
              <ArrowRightIcon />
            </button>
          ))}
        </div>
      </div>

      <div className="hero__metrics" aria-label="Project highlights">
        <div className="metric-grid">
          {metrics.map((metric, index) => (
            <article className="metric-card" key={metric.label} style={{ animationDelay: `${index * 90}ms` }}>
              <span className="metric-card__icon" aria-hidden="true">
                {index === 0 ? <ChartIcon /> : <TrendIcon />}
              </span>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Hero)