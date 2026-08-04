import { Bar, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useChartTheme } from '../../../../components/charts/useChartTheme'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'

/**
 * Substitutes for "Monthly Listing Trend" — the dataset has no listing date,
 * but `agePossession` gives 5 real, naturally-ordered lifecycle stages
 * (Under Construction -> ... -> Old Property), so this reads as a trend
 * without inventing timestamps that don't exist.
 */
export function PossessionBreakdown({ data }) {
  const { gridProps, axisProps } = useChartTheme()
  const { isDark } = useTheme()
  const palette = isDark ? CATEGORICAL.dark : CATEGORICAL.light

  return (
    <ChartCard
      eyebrow="Lifecycle"
      title="Listings by Possession Stage"
      description="Count and average price across the property lifecycle (no listing-date data exists for a literal monthly trend)."
    >
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} {...gridProps} />
        <XAxis dataKey="stage" {...axisProps} tick={{ ...axisProps.tick, fontSize: 10 }} />
        <YAxis yAxisId="count" {...axisProps} />
        <YAxis yAxisId="price" orientation="right" {...axisProps} />
        <Tooltip content={<ChartTooltip formatter={(item) => `${item.name}: ${item.value}`} />} />
        <Bar yAxisId="count" dataKey="count" name="Listings" fill={palette[0]} radius={[4, 4, 0, 0]} />
        <Line yAxisId="price" dataKey="averagePrice" name="Avg. price (Cr)" stroke={palette[1]} strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ChartCard>
  )
}
