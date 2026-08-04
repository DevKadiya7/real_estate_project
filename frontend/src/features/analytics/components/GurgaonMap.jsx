import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useTheme } from '../../../context/ThemeContext'
import { formatCrore, formatNumber } from '../../../utils/formatters'
import { getMapCenter, markerColor, markerRadius, buildHeatmapPoints, computeLuxurySectors } from '../utils/mapHelpers'
import { HeatmapLayer } from './HeatmapLayer'
import { MapLayerControls } from './MapLayerControls'

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
}

const luxuryStarIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:16px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4))">⭐</div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

/** @param {{ sectorInsights: import('../../../types/property').SectorInsight[], properties: import('../../../types/property').PropertyRecord[], onSelectSector: (sector: string) => void }} props */
export function GurgaonMap({ sectorInsights, properties, onSelectSector }) {
  const { isDark } = useTheme()
  const [baseLayer, setBaseLayer] = useState('street')
  const [layers, setLayers] = useState({ markers: true, heatmap: false, luxury: false })

  const center = useMemo(() => getMapCenter(sectorInsights), [sectorInsights])
  const heatmapPoints = useMemo(() => buildHeatmapPoints(sectorInsights), [sectorInsights])
  const luxurySectors = useMemo(() => computeLuxurySectors(properties), [properties])

  const prices = sectorInsights.map((s) => s.averagePrice)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const maxListingCount = sectorInsights.length ? Math.max(...sectorInsights.map((s) => s.listingCount)) : 0

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5 sm:p-6 sm:pb-0">
        <CardHeader
          eyebrow="Map"
          title="Interactive Gurgaon Map"
          description="Sector markers sized by listing count, colored by average price. Data is aggregated at the sector level (see README for why)."
        />
      </div>
      <div className="relative h-[480px] w-full">
        <div className="pointer-events-none absolute right-3 top-3 z-[1000]">
          <MapLayerControls baseLayer={baseLayer} onBaseLayerChange={setBaseLayer} layers={layers} onLayersChange={setLayers} />
        </div>

        <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
          <TileLayer url={TILE_LAYERS[baseLayer].url} attribution={TILE_LAYERS[baseLayer].attribution} />

          {layers.heatmap ? <HeatmapLayer points={heatmapPoints} /> : null}

          {layers.markers
            ? sectorInsights
                .filter((s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude))
                .map((s) => (
                  <CircleMarker
                    key={s.sector}
                    center={[s.latitude, s.longitude]}
                    radius={markerRadius(s.listingCount, maxListingCount)}
                    pathOptions={{
                      color: markerColor(s.averagePrice, minPrice, maxPrice, isDark),
                      fillColor: markerColor(s.averagePrice, minPrice, maxPrice, isDark),
                      fillOpacity: 0.6,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[180px] space-y-1 text-sm">
                        <p className="font-semibold capitalize">{s.sector}</p>
                        <p>Avg. price: {formatCrore(s.averagePrice)}</p>
                        <p>Avg. area: {formatNumber(s.averageArea, { maximumFractionDigits: 0 })} sqft</p>
                        <p>Listings: {s.listingCount}</p>
                        <p>Price/sqft: ₹{formatNumber(s.pricePerSqft, { maximumFractionDigits: 0 })}</p>
                        <Button size="sm" className="mt-2 w-full" onClick={() => onSelectSector(s.sector)}>
                          View sector
                        </Button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))
            : null}

          {layers.luxury
            ? luxurySectors
                .filter((s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude))
                .map((s) => (
                  <Marker key={s.sector} position={[s.latitude, s.longitude]} icon={luxuryStarIcon}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold capitalize">{s.sector}</p>
                        <p>{s.luxuryCount} luxury listings ({Math.round(s.share * 100)}% of sector)</p>
                      </div>
                    </Popup>
                  </Marker>
                ))
            : null}
        </MapContainer>
      </div>
    </Card>
  )
}
