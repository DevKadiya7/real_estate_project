import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'
import { ChartCard } from '../../../../components/charts/ChartCard'
import { ChartTooltip } from '../../../../components/charts/ChartTooltip'
import { useTheme } from '../../../../context/ThemeContext'
import { CATEGORICAL } from '../../../../constants/chartPalette'

export function PropertyTypePie({ data }) {
  const { isDark } = useTheme()
  const palette = isDark ? CATEGORICAL.dark : CATEGORICAL.light

  return (
    <ChartCard eyebrow="Mix" title="Property Type" description="Share of listings by property type.">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={(item) => `${item.name}: ${item.value}`} />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ChartCard>
  )
}
