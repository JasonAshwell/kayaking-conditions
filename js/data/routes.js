// Kayaking Routes Database
// Add your favorite kayaking routes from Strava, Outdoor Active, or other platforms
// Format: { name, lat, lon, url, type, description (optional), distance (optional), difficulty (optional), goodConditions (optional), trickyConditions (optional) }

const KAYAKING_ROUTES = [
    // Example format - add your own routes below:
    {
    name: "Dartmouth to The Mew Stone",
    lat: 50.3515,
    lon: -3.5794,
    url: "https://www.strava.com/activities/15072625030",
    type: "strava", // "strava", "outdooractive", "other"
    description: "Beautiful coastal paddle around the Mew Stone, be careful in some winds at it can be choppy getting to and around the Mew Stone. Remember not to interfere with the wildlife!",
    distance: "12km",
    difficulty: "Moderate"
    },

    // ==========================================
    // ADD YOUR ROUTES HERE
    // ==========================================
{
    name: "Dartmouth to Blackpool Sands",
    lat: 50.3515,
    lon: -3.5794,
    url: "https://www.strava.com/activities/14714946656",
    type: "strava", // "strava", "outdooractive", "other"
    description: "Beautiful coastal paddle with lots of rock hopping, stop and land at some of the coves if you want a break or to enjoy the stunning scenary or a swim. Either finish at Blackpool Sands and get a drink from the Cafe or return back to Dartmouth",
    distance: "16km",
    difficulty: "Moderate"
    },
	
	{
    name: "Dartmouth to Dittisham",
    lat: 50.3515,
    lon: -3.5794,
    url: "https://www.strava.com/activities/14806705621",
    type: "strava", // "strava", "outdooractive", "other"
    description: "Beautiful estaury paddle. Paddle past Old Mill Creek or up it to add distance then on to Greenways the home of Agatha Christie then Dittisham. Be careful of river traffic especially if crossing the river.",
    distance: "12km",
    difficulty: "Easy"
    },

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
    // All routes are kayaking routes, so use kayak emoji
    return '🛶';
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
