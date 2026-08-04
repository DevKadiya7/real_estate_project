import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useChartTheme } from '../../../../components/charts/useChartTheme'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'
import { formatCrore } from '../../../../utils/formatters'

/** @param {{ sectorInsights: import('../../../../types/property').SectorInsight[] }} props */
export function Top15ExpensiveSectors({ sectorInsights }) {
  const { gridProps, axisProps } = useChartTheme()
  const { isDark } = useTheme()
  const color = (isDark ? CATEGORICAL.dark : CATEGORICAL.light)[1]

  const data = [...sectorInsights]
    .sort((a, b) => b.averagePrice - a.averagePrice)
    .slice(0, 15)
    .sort((a, b) => a.averagePrice - b.averagePrice)

  return (
    <ChartCard eyebrow="Ranked" title="Top 15 Expensive Sectors" description="By average listing price." height={420}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} {...gridProps} />
        <XAxis type="number" {...axisProps} />
        <YAxis dataKey="sector" type="category" width={80} {...axisProps} />
        <Tooltip content={<ChartTooltip formatter={(item) => formatCrore(item.value)} />} />
        <Bar dataKey="averagePrice" fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartCard>
  )
}
