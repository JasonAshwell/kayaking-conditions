// Kayaking Routes Database
// Add your favorite kayaking routes from Strava, Outdoor Active, or other platforms
// Format: { name, lat, lon, url, type, description (optional), distance (optional), difficulty (optional) }

const KAYAKING_ROUTES = [
    // Example format - add your own routes below:
    // {
    //     name: "Dartmouth to Dittisham",
    //     lat: 50.3515,
    //     lon: -3.5794,
    //     url: "https://www.strava.com/routes/123456789",
    //     type: "strava", // "strava", "outdooractive", "other"
    //     description: "Beautiful upstream paddle along River Dart. Best at high tide.",
    //     distance: "8km",
    //     difficulty: "Easy"
    // },

    // ==========================================
    // ADD YOUR ROUTES HERE
    // ==========================================


];

/**
 * Get all kayaking routes
 * @returns {Array} All routes
 */
function getKayakingRoutes() {
    return KAYAKING_ROUTES;
}

/**
 * Find routes near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Routes within radius
 */
function findRoutesNear(lat, lon, radiusKm = 10) {
    return KAYAKING_ROUTES.filter(route => {
        const distance = calculateDistance(lat, lon, route.lat, route.lon);
        return distance <= radiusKm;
    }).sort((a, b) => {
        const distA = calculateDistance(lat, lon, a.lat, a.lon);
        const distB = calculateDistance(lat, lon, b.lat, b.lon);
        return distA - distB;
    });
}

/**
 * Get route icon based on platform
 * @param {string} type - Route type (strava, outdooractive, other)
 * @returns {string} Icon HTML
 */
function getRouteIcon(type) {
    const icons = {
        'strava': '🏃',
        'outdooractive': '🥾',
        'other': '🗺️'
    };
    return icons[type.toLowerCase()] || icons['other'];
}

/**
 * Get route platform name
 * @param {string} type - Route type
 * @returns {string} Platform name
 */
function getRoutePlatform(type) {
    const platforms = {
        'strava': 'Strava',
        'outdooractive': 'Outdoor Active',
        'other': 'External'
    };
    return platforms[type.toLowerCase()] || 'External';
}
