export const PROPERTY_TYPES = [
  'Apartment',
  'Bungalow',
  'Villa',
  'Penthouse',
  'Studio'
];

export const LISTING_TYPES = [
  'sale',
  'rent',
];

export const CACHE_KEYS = {
  PROPERTIES_LIST: 'properties:list',
  PROPERTY_DETAIL: 'property:detail',
  USER_FAVORITES: 'user:favorites',
  SEARCH_FILTERS: 'search:filters',
  PROPERTY_COUNT: 'property:count'
};

export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 3600,  // 1 hour
  LONG: 86400    // 24 hours
};
