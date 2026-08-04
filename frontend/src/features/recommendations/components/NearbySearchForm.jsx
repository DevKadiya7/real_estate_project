import { Field } from '../../../components/ui/Input'
import { Input } from '../../../components/ui/Input'
import { SearchableSelect } from '../../../components/ui/SearchableSelect'
import { Button } from '../../../components/ui/Button'

export function NearbySearchForm({ locations, location, radiusKm, onLocationChange, onRadiusChange, onSubmit, isLoading }) {
  return (
    <form
      className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Field label="Location">
        <SearchableSelect value={location} onChange={onLocationChange} options={locations} placeholder="Choose a location" />
      </Field>
      <Field label="Radius (km)">
        <Input type="number" step="0.5" min="0" value={radiusKm} onChange={(e) => onRadiusChange(Number(e.target.value))} className="sm:w-32" />
      </Field>
      <div className="flex items-end">
        <Button type="submit" disabled={!location || isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching…' : 'Search'}
        </Button>
      </div>
    </form>
  )
}
