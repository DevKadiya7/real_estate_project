const isEmpty = (value) => value === '' || value === null || value === undefined || Number.isNaN(value)

export const validatePredictionForm = (form) => {
  const errors = []

  if (isEmpty(form.property_type)) errors.push('Select a property type.')
  if (isEmpty(form.sector)) errors.push('Select a sector.')
  if (isEmpty(form.agePossession)) errors.push('Select the age possession.')
  if (isEmpty(form.luxury_category)) errors.push('Select a luxury category.')
  if (isEmpty(form.floor_category)) errors.push('Select a floor category.')
  if (Number(form.bedRoom) <= 0) errors.push('Bedrooms must be greater than zero.')
  if (Number(form.bathroom) <= 0) errors.push('Bathrooms must be greater than zero.')
  if (Number(form.balcony) < 0) errors.push('Balconies cannot be negative.')
  if (Number(form.built_up_area) <= 0) errors.push('Built-up area must be greater than zero.')
  if (Number(form.servant_room) < 0) errors.push('Servant room cannot be negative.')
  if (Number(form.store_room) < 0) errors.push('Store room cannot be negative.')

  return errors
}

export const validateNearbySearch = (location, radiusKm) => {
  const errors = []

  if (isEmpty(location)) errors.push('Select a location.')
  if (Number(radiusKm) <= 0) errors.push('Radius must be greater than zero.')

  return errors
}

export const validateRecommendationForm = (apartment) => {
  if (isEmpty(apartment)) {
    return ['Select an apartment.']
  }

  return []
}
