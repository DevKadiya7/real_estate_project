export function formatCrore(value, unit = 'Cr') {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `₹ ${Number(value).toFixed(2)} ${unit}`
}

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-IN', options).format(value)
}

export function formatDistanceKm(km) {
  if (km === null || km === undefined || Number.isNaN(km)) return '—'
  return `${Number(km).toFixed(2)} km`
}
