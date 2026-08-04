import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useChartTheme } from '../../../../components/charts/useChartTheme'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'

export function BedroomsDistributionBar({ data }) {
  const { gridProps, axisProps } = useChartTheme()
  const { isDark } = useTheme()
  const color = (isDark ? CATEGORICAL.dark : CATEGORICAL.light)[2]

  return (
    <ChartCard eyebrow="Mix" title="Bedrooms Distribution" description="Listing counts by bedroom count.">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} {...gridProps} />
        <XAxis dataKey="bedrooms" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip content={<ChartTooltip formatter={(item) => `${item.value} listings`} />} />
        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  )
}
