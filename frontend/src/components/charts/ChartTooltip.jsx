import { useChartTheme } from './useChartTheme'

/** Custom Recharts tooltip — default Recharts tooltips don't respect dark mode. */
export function ChartTooltip({ active, payload, label, formatter }) {
  const { chrome } = useChartTheme()
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: chrome.surface, borderColor: chrome.gridline, color: chrome.primaryInk }}
    >
      {label ? <p className="mb-1 font-semibold">{label}</p> : null}
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color || chrome.secondaryInk }}>
          {formatter ? formatter(item) : `${item.name}: ${item.value}`}
        </p>
      ))}
    </div>
  )
}
