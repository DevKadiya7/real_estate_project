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

  useEffect(() => {
    if (!options) return
    setForm((current) => ({
      ...current,
      sector: options.sectors?.[0] || '',
      agePossession: options.ages?.[0] || '',
      furnishing_type: options.furnishing_types?.[0] ?? 0,
      luxury_category: options.luxury_categories?.[0] || '',
      floor_category: options.floor_categories?.[0] || '',
    }))
  }, [options])

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  if (isLoadingOptions) {
    return <SkeletonText lines={6} />
  }

  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Property Type">
        <Select value={form.property_type} onChange={(e) => updateField('property_type', e.target.value)}>
          <option value="flat">flat</option>
          <option value="house">house</option>
        </Select>
      </Field>

      <Field label="Sector">
        <Select value={form.sector} onChange={(e) => updateField('sector', e.target.value)}>
          {options?.sectors?.map((item) => (
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
          {options?.ages?.map((item) => (
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
        <Select value={form.furnishing_type} onChange={(e) => updateField('furnishing_type', Number(e.target.value))}>
          {options?.furnishing_types?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Luxury Category">
        <Select value={form.luxury_category} onChange={(e) => updateField('luxury_category', e.target.value)}>
          {options?.luxury_categories?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Floor Category">
        <Select value={form.floor_category} onChange={(e) => updateField('floor_category', e.target.value)}>
          {options?.floor_categories?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Predicting…' : 'Predict'}
        </Button>
      </div>
    </form>
  )
}
