"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL = exports.CACHE_KEYS = exports.LISTING_TYPES = exports.PROPERTY_TYPES = void 0;
exports.PROPERTY_TYPES = [
    'Apartment',
    'Bungalow',
    'Villa',
    'Penthouse',
    'Studio'
];
exports.LISTING_TYPES = [
    'sale',
    'rent',
];
exports.CACHE_KEYS = {
    PROPERTIES_LIST: 'properties:list',
    PROPERTY_DETAIL: 'property:detail',
    USER_FAVORITES: 'user:favorites',
    SEARCH_FILTERS: 'search:filters',
    PROPERTY_COUNT: 'property:count'
};
exports.CACHE_TTL = {
    SHORT: 300, // 5 minutes
    MEDIUM: 3600, // 1 hour
    LONG: 86400 // 24 hours
};
//# sourceMappingURL=constants.js.map