import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useChartTheme } from '../../../../components/charts/useChartTheme'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'
import { formatCrore } from '../../../../utils/formatters'

const MAX_SECTORS = 20

/** @param {{ sectorInsights: import('../../../../types/property').SectorInsight[] }} props */
export function SectorAvgPriceBar({ sectorInsights }) {
  const { gridProps, axisProps } = useChartTheme()
  const { isDark } = useTheme()
  const color = (isDark ? CATEGORICAL.dark : CATEGORICAL.light)[0]

  const data = [...sectorInsights]
    .sort((a, b) => b.listingCount - a.listingCount)
    .slice(0, MAX_SECTORS)
    .sort((a, b) => a.averagePrice - b.averagePrice)

  return (
    <ChartCard
      eyebrow="By sector"
      title="Sector-wise Average Price"
      description="The 20 most-active sectors by listing count."
      height={420}
    >
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
