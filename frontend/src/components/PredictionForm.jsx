import { memo } from 'react'
import Loader from './Loader'

const PredictionForm = ({ form, options, loading, onChange, onSubmit }) => {
  const sectors = options?.sectors ?? []
  const ages = options?.ages ?? []
  const furnishingTypes = options?.furnishing_types ?? []
  const luxuryCategories = options?.luxury_categories ?? []
  const floorCategories = options?.floor_categories ?? []

  return (
    <form className="form panel" onSubmit={onSubmit} aria-busy={loading}>
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Prediction</p>
          <h2>Property valuation form</h2>
        </div>
        {loading ? <Loader label="Generating prediction" compact /> : null}
      </div>

      <fieldset className="field-group">
        <legend>Property basics</legend>
        <div className="field-grid">
          <label className="field">
            <span>Property type</span>
            <select value={form.property_type} onChange={(e) => onChange('property_type', e.target.value)}>
              <option value="flat">Flat</option>
              <option value="house">House</option>
            </select>
          </label>

          <label className="field">
            <span>Sector</span>
            <select value={form.sector} onChange={(e) => onChange('sector', e.target.value)}>
              {sectors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Age possession</span>
            <select value={form.agePossession} onChange={(e) => onChange('agePossession', e.target.value)}>
              {ages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Furnishing type</span>
            <select value={form.furnishing_type} onChange={(e) => onChange('furnishing_type', Number(e.target.value))}>
              {furnishingTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>Space and layout</legend>
        <div className="field-grid">
          <label className="field">
            <span>Bedrooms</span>
            <input type="number" min="0" step="0.5" value={form.bedRoom} onChange={(e) => onChange('bedRoom', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Bathrooms</span>
            <input type="number" min="0" step="0.5" value={form.bathroom} onChange={(e) => onChange('bathroom', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Balconies</span>
            <input type="number" min="0" step="1" value={form.balcony} onChange={(e) => onChange('balcony', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Built-up area</span>
            <input type="number" min="1" step="1" value={form.built_up_area} onChange={(e) => onChange('built_up_area', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Servant room</span>
            <input type="number" min="0" step="1" value={form.servant_room} onChange={(e) => onChange('servant_room', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Store room</span>
            <input type="number" min="0" step="1" value={form.store_room} onChange={(e) => onChange('store_room', Number(e.target.value))} />
          </label>

          <label className="field">
            <span>Luxury category</span>
            <select value={form.luxury_category} onChange={(e) => onChange('luxury_category', e.target.value)}>
              {luxuryCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Floor category</span>
            <select value={form.floor_category} onChange={(e) => onChange('floor_category', e.target.value)}>
              {floorCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <div className="form__actions">
        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict price'}
        </button>
      </div>
    </form>
  )
}

export default memo(PredictionForm)