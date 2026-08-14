import { useEffect, useState } from 'react'
import { Field, Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { SkeletonText } from '../../../components/ui/Skeleton'

const EMPTY_FORM = {
  property_type: 'flat',
  sector: '',
  bedRoom: 1,
  bathroom: 1,
  balcony: 1,
  agePossession: '',
  built_up_area: 1000,
  servant_room: 0,
  store_room: 0,
  furnishing_type: 0,
  luxury_category: '',
  floor_category: '',
}

export function PredictorForm({ options, isLoadingOptions, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM)

  const propertyTypeOptions = options?.property_types || ['flat', 'house']
  const sectorOptions = options?.sectors || []
  const ageOptions = options?.ages || []
  const furnishingOptions = options?.furnishing_types || []
  const luxuryOptions = options?.luxury_categories || []
  const floorOptions = options?.floor_categories || []

  useEffect(() => {
    if (!options) return

    const pickOption = (current, values, fallback = '') => {
      if (!Array.isArray(values) || values.length === 0) return fallback
      return values.includes(current) ? current : values[0]
    }

    setForm((current) => ({
      ...current,
      property_type: pickOption(current.property_type, propertyTypeOptions, 'flat'),
      sector: pickOption(current.sector, sectorOptions),
      agePossession: pickOption(current.agePossession, ageOptions),
      furnishing_type: pickOption(current.furnishing_type, furnishingOptions, 0),
      luxury_category: pickOption(current.luxury_category, luxuryOptions),
      floor_category: pickOption(current.floor_category, floorOptions),
    }))
  }, [options, propertyTypeOptions, sectorOptions, ageOptions, furnishingOptions, luxuryOptions, floorOptions])

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const missingRequiredOptions = [
    sectorOptions.length === 0 ? 'Sector' : null,
    ageOptions.length === 0 ? 'Age Possession' : null,
    furnishingOptions.length === 0 ? 'Furnishing Type' : null,
    luxuryOptions.length === 0 ? 'Luxury Category' : null,
    floorOptions.length === 0 ? 'Floor Category' : null,
  ].filter(Boolean)

  const canSubmit = missingRequiredOptions.length === 0

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit(form)
  }

  if (isLoadingOptions) {
    return <SkeletonText lines={6} />
  }

  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Property Type">
        <Select value={form.property_type} onChange={(e) => updateField('property_type', e.target.value)}>
          {propertyTypeOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Sector">
        <Select value={form.sector} onChange={(e) => updateField('sector', e.target.value)}>
          {sectorOptions.length === 0 ? (
            <option value="" disabled>
              No options available
            </option>
          ) : null}
          {sectorOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Bedrooms">
        <Input type="number" step="0.5" value={form.bedRoom} onChange={(e) => updateField('bedRoom', Number(e.target.value))} />
      </Field>

      <Field label="Bathrooms">
        <Input type="number" step="0.5" value={form.bathroom} onChange={(e) => updateField('bathroom', Number(e.target.value))} />
      </Field>

      <Field label="Balconies">
        <Input type="number" step="1" value={form.balcony} onChange={(e) => updateField('balcony', Number(e.target.value))} />
      </Field>

      <Field label="Age Possession">
        <Select value={form.agePossession} onChange={(e) => updateField('agePossession', e.target.value)}>
          {ageOptions.length === 0 ? (
            <option value="" disabled>
              No options available
            </option>
          ) : null}
          {ageOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Built Up Area (sqft)">
        <Input
          type="number"
          step="1"
          value={form.built_up_area}
          onChange={(e) => updateField('built_up_area', Number(e.target.value))}
        />
      </Field>

      <Field label="Servant Room">
        <Select value={form.servant_room} onChange={(e) => updateField('servant_room', Number(e.target.value))}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </Select>
      </Field>

      <Field label="Store Room">
        <Select value={form.store_room} onChange={(e) => updateField('store_room', Number(e.target.value))}>
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </Select>
      </Field>

      <Field label="Furnishing Type">
        <Select
          value={furnishingOptions.length === 0 ? '' : form.furnishing_type}
          onChange={(e) => updateField('furnishing_type', Number(e.target.value))}
        >
          {furnishingOptions.length === 0 ? (
            <option value="" disabled>
              No options available
            </option>
          ) : null}
          {furnishingOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Luxury Category">
        <Select value={form.luxury_category} onChange={(e) => updateField('luxury_category', e.target.value)}>
          {luxuryOptions.length === 0 ? (
            <option value="" disabled>
              No options available
            </option>
          ) : null}
          {luxuryOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Floor Category">
        <Select value={form.floor_category} onChange={(e) => updateField('floor_category', e.target.value)}>
          {floorOptions.length === 0 ? (
            <option value="" disabled>
              No options available
            </option>
          ) : null}
          {floorOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <div className="sm:col-span-2">
        {missingRequiredOptions.length > 0 ? (
          <p className="mb-2 text-xs text-amber-500">
            Missing options for: {missingRequiredOptions.join(', ')}. Start backend API and try again.
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? 'Predicting…' : 'Predict'}
        </Button>
      </div>
    </form>
  )
}
