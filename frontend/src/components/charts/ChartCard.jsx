import { ResponsiveContainer } from 'recharts'
import { Card, CardHeader } from '../ui/Card'
import { ChartSkeleton } from './ChartSkeleton'
import { ErrorState } from '../common/ErrorState'

/**
 * Recharts equivalent of the old PlotlyChart wrapper — every chart on the
 * Analysis page renders through this so loading/error/sizing are handled
 * once. Pass the Recharts chart element (LineChart/BarChart/...) as children.
 */
export function ChartCard({ eyebrow, title, description, action, height = 320, loading, error, children }) {
  return (
    <Card>
      <CardHeader eyebrow={eyebrow} title={title} description={description} action={action} />
      {loading ? (
        <ChartSkeleton height={height} />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
