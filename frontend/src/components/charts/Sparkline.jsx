import { Line, LineChart, ResponsiveContainer } from 'recharts'

/** Minimal axis-free line chart for compact per-sector price-spread previews. */
export function Sparkline({ values, color, height = 36 }) {
  const data = values.map((value, index) => ({ index, value }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
