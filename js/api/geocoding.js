// Geocoding API - Nominatim (OpenStreetMap)

/**
 * Search for locations using Nominatim geocoding API
 * @param {string} query - Location search query
 * @returns {Promise<Array>} Array of location results
 */
async function searchLocation(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    // Check cache first
    const cacheKey = `geocode_${query.toLowerCase()}`;
    const cached = getCachedData(cacheKey, true);
    if (cached) {
        console.log('Using cached location data for:', query);
        return cached;
    }

    try {
        // Build URL with parameters
        const params = new URLSearchParams({
            q: query,
            format: CONFIG.NOMINATIM.params.format,
            countrycodes: CONFIG.NOMINATIM.params.countrycodes,
            limit: CONFIG.NOMINATIM.params.limit,
            addressdetails: 1 // Get detailed address information
        });

        const url = `${CONFIG.NOMINATIM.baseUrl}?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': CONFIG.NOMINATIM.headers['User-Agent']
            }
        });

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform results to simplified format
        const results = data.map(location => ({
            name: location.display_name,
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon),
            type: location.type,
            address: location.address
        }));

        // Cache results
        if (results.length > 0) {
            cacheData(cacheKey, results, CONFIG.CACHE.locationTTL, true);
        }

        return results;
    } catch (error) {
        console.error('Error searching location:', error);
        throw new Error('Failed to search location. Please try again.');
    }
}

/**
 * Get coordinates for a specific location name
 * @param {string} locationName - Full location name
 * @returns {Promise<Object>} Coordinates {lat, lon}
 */
async function getCoordinates(locationName) {
    const results = await searchLocation(locationName);

    if (results.length === 0) {
        throw new Error('Location not found');
    }

    return {
        lat: results[0].lat,
        lon: results[0].lon,
        name: results[0].name
    };
}

/**
 * Reverse geocoding - get location name from coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} Location name
 */
async function reverseGeocode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': CONFIG.NOMINATIM.headers['User-Agent']
            }
        });

        if (!response.ok) {
            throw new Error(`Reverse geocoding error: ${response.status}`);
        }

        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
}
