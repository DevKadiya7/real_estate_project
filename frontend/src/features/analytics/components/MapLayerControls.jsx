import { Layers, Map as MapIcon, Satellite } from 'lucide-react'
import { Checkbox } from '../../../components/ui/Checkbox'

export function MapLayerControls({ baseLayer, onBaseLayerChange, layers, onLayersChange }) {
  const toggleLayer = (key) => onLayersChange({ ...layers, [key]: !layers[key] })

  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/95 p-2.5 text-xs shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => onBaseLayerChange('street')}
          className={
            baseLayer === 'street'
              ? 'flex items-center gap-1 rounded-md bg-white px-2 py-1 font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 dark:text-slate-400'
          }
        >
          <MapIcon className="h-3.5 w-3.5" />
          Street
        </button>
        <button
          type="button"
          onClick={() => onBaseLayerChange('satellite')}
          className={
            baseLayer === 'satellite'
              ? 'flex items-center gap-1 rounded-md bg-white px-2 py-1 font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 dark:text-slate-400'
          }
        >
          <Satellite className="h-3.5 w-3.5" />
          Satellite
        </button>
      </div>

      <div className="mt-1 flex items-center gap-1.5 px-1 text-slate-400">
        <Layers className="h-3.5 w-3.5" />
        <span className="font-medium uppercase tracking-wide">Layers</span>
      </div>
      {[
        { key: 'markers', label: 'Property Markers' },
        { key: 'heatmap', label: 'Price Heatmap' },
        { key: 'luxury', label: 'Luxury Properties' },
      ].map((layer) => (
        <label key={layer.key} className="flex items-center gap-2 px-1 py-0.5 text-slate-700 dark:text-slate-200">
          <Checkbox checked={layers[layer.key]} onCheckedChange={() => toggleLayer(layer.key)} />
          {layer.label}
        </label>
      ))}
    </div>
  )
}
