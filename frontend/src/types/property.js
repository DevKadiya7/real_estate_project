/**
 * @typedef {Object} PropertyRecord
 * @property {number} id
 * @property {string|null} property_type
 * @property {string|null} society
 * @property {string|null} sector
 * @property {number|null} price
 * @property {number|null} price_per_sqft
 * @property {number|null} bedRoom
 * @property {number|null} bathroom
 * @property {number|null} balcony
 * @property {number|null} built_up_area
 * @property {string|null} agePossession
 * @property {number|null} furnishing_type
 * @property {number|null} luxury_score
 * @property {'Low'|'Medium'|'High'|null} luxury_category
 * @property {'Low Floor'|'Mid Floor'|'High Floor'|null} floor_category
 * @property {number|null} latitude
 * @property {number|null} longitude
 */

/**
 * @typedef {Object} AnalyticsFilters
 * @property {string} propertyType - 'all' | 'flat' | 'house'
 * @property {string} sector - 'all' | a sector name
 * @property {number[]} bedrooms - selected bedroom counts, empty = any
 * @property {number[]} bathrooms - selected bathroom counts, empty = any
 * @property {[number, number]} priceRange - [min, max] in Cr
 * @property {[number, number]} areaRange - [min, max] sqft
 * @property {boolean} readyToMove
 * @property {boolean} furnished
 * @property {boolean} luxuryOnly
 */

/**
 * @typedef {Object} MarketSummary
 * @property {number} averagePrice
 * @property {number} medianPrice
 * @property {number} totalListings
 * @property {number} averagePricePerSqft
 * @property {number} luxuryCount
 * @property {number} averageArea
 */

/**
 * @typedef {Object} SectorInsight
 * @property {string} sector
 * @property {number} averagePrice
 * @property {number} averageArea
 * @property {number} listingCount
 * @property {number} pricePerSqft
 * @property {number} vsCityAvgPct
 * @property {number[]} priceSparkline - sorted sample of prices in the sector
 * @property {number} latitude
 * @property {number} longitude
 */

export {}
