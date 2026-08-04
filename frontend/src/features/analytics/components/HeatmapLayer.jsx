import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

/** Wraps the leaflet.heat plugin (no React binding of its own) as a proper
 * react-leaflet layer, added/removed on the underlying map instance. */
export function HeatmapLayer({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!points.length) return undefined

    const layer = L.heatLayer(points, { radius: 32, blur: 24, maxZoom: 14 })
    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [map, points])

  return null
}
