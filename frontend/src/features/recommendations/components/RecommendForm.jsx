import { Field } from '../../../components/ui/Input'
import { SearchableSelect } from '../../../components/ui/SearchableSelect'
import { Button } from '../../../components/ui/Button'

export function RecommendForm({ apartments, apartment, onApartmentChange, onSubmit, isLoading }) {
  return (
    <form
      className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Field label="Apartment">
        <SearchableSelect value={apartment} onChange={onApartmentChange} options={apartments} placeholder="Choose an apartment" />
      </Field>
      <div className="flex items-end">
        <Button type="submit" disabled={!apartment || isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Finding…' : 'Recommend'}
        </Button>
      </div>
    </form>
  )
}
