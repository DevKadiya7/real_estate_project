import { Field, Label } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Switch } from '../../../components/ui/Switch'
import { Slider } from '../../../components/ui/Slider'
import { Button } from '../../../components/ui/Button'
import { formatCrore, formatNumber } from '../../../utils/formatters'

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6]

function toggleInArray(array, value) {
  return array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
}

/** @param {{ filters: import('../../../types/property').AnalyticsFilters, updateFilter: Function, reset: Function, bounds: any, sectors: string[], onApply?: () => void }} props */
export function FilterPanel({ filters, updateFilter, reset, bounds, sectors, onApply }) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Property Type">
        <Select value={filters.propertyType} onChange={(e) => updateFilter('propertyType', e.target.value)}>
          <option value="all">All types</option>
          <option value="flat">Flat</option>
          <option value="house">House</option>
        </Select>
      </Field>

      <Field label="Sector">
        <Select value={filters.sector} onChange={(e) => updateFilter('sector', e.target.value)}>
          <option value="all">All sectors</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </Select>
      </Field>

      <div>
        <Label>Bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => updateFilter('bedrooms', toggleInArray(filters.bedrooms, count))}
              className={
                filters.bedrooms.includes(count)
                  ? 'h-8 w-8 rounded-lg bg-brand-500 text-xs font-semibold text-white'
                  : 'h-8 w-8 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Bathrooms</Label>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => updateFilter('bathrooms', toggleInArray(filters.bathrooms, count))}
              className={
                filters.bathrooms.includes(count)
                  ? 'h-8 w-8 rounded-lg bg-brand-500 text-xs font-semibold text-white'
                  : 'h-8 w-8 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Price Range</Label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatCrore(filters.priceRange[0])} &ndash; {formatCrore(filters.priceRange[1])}
          </span>
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value)}
          min={bounds.priceRange[0]}
          max={bounds.priceRange[1]}
          step={0.1}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Area (sqft)</Label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatNumber(filters.areaRange[0])} &ndash; {formatNumber(filters.areaRange[1])}
          </span>
        </div>
        <Slider
          value={filters.areaRange}
          onValueChange={(value) => updateFilter('areaRange', value)}
          min={bounds.areaRange[0]}
          max={bounds.areaRange[1]}
          step={50}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
          Ready to Move
          <Switch checked={filters.readyToMove} onCheckedChange={(value) => updateFilter('readyToMove', value)} />
        </label>
        <label className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
          Furnished
          <Switch checked={filters.furnished} onCheckedChange={(value) => updateFilter('furnished', value)} />
        </label>
        <label className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
          Luxury Only
          <Switch checked={filters.luxuryOnly} onCheckedChange={(value) => updateFilter('luxuryOnly', value)} />
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={onApply}>
          Apply Filters
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
