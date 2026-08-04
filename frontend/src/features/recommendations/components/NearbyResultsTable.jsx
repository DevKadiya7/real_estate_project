import { Table } from '../../../components/ui/Table'
import { formatDistanceKm } from '../../../utils/formatters'

const COLUMNS = [
  { key: 'property_name', label: 'Property', sortable: true },
  { key: 'distance_km', label: 'Distance', sortable: true, render: (row) => formatDistanceKm(row.distance_km) },
]

export function NearbyResultsTable({ rows }) {
  return <Table columns={COLUMNS} rows={rows} rowKey={(row) => row.property_name} emptyMessage="Search a location to see nearby properties." />
}
