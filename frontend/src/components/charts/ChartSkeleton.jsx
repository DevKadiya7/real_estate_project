import { Skeleton } from '../ui/Skeleton'

export function ChartSkeleton({ height = 360 }) {
  return (
    <div className="flex flex-col gap-3" style={{ height }}>
      <Skeleton className="h-full w-full" />
    </div>
  )
}
