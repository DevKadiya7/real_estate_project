import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useChartTheme } from '../../../../components/charts/useChartTheme'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'

export function AreaPriceScatter({ data }) {
  const { gridProps, axisProps } = useChartTheme()
  const { isDark } = useTheme()
  const color = (isDark ? CATEGORICAL.dark : CATEGORICAL.light)[0]

  return (
    <ChartCard eyebrow="Trends" title="Area vs Price" description="Built-up area against price, across all listings.">
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="area" name="Area" unit=" sqft" {...axisProps} />
        <YAxis dataKey="price" name="Price" unit=" Cr" {...axisProps} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={<ChartTooltip formatter={(item) => `${item.name}: ${item.value}`} />}
        />
        <Scatter data={data} fill={color} fillOpacity={0.6} />
      </ScatterChart>
    </ChartCard>
  )
}
