import { memo } from 'react'

const Loader = ({ label = 'Loading', compact = false }) => {
  return (
    <div className={compact ? 'loader loader--compact' : 'loader'} role="status" aria-live="polite" aria-label={label}>
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default memo(Loader)