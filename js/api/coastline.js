// Coastline API - Fetch nearest coastline data

/**
 * Get bearing to nearest coastline point
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<number|null>} Bearing to coastline in degrees, or null if not found
 */
async function getCoastlineBearing(lat, lon) {
    // Check cache first
    const cacheKey = `coastline_${lat.toFixed(4)}_${lon.toFixed(4)}`;
    const cached = getCachedData(cacheKey);
    if (cached !== null) {
        console.log('Using cached coastline bearing');
        return cached;
    }

    try {
        // Overpass API query to find nearest coastline within 50km
        const overpassQuery = `
            [out:json][timeout:25];
            (
              way["natural"="coastline"](around:50000,${lat},${lon});
            );
            out geom;
        `;

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        const response = await fetch(overpassUrl);

        if (!response.ok) {
            console.warn('Overpass API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (!data.elements || data.elements.length === 0) {
            console.warn('No coastline found near location');
            return null;
        }

        // Find the nearest coastline point
        let nearestPoint = null;
        let minDistance = Infinity;

        data.elements.forEach(way => {
            if (way.geometry) {
                way.geometry.forEach(node => {
                    const distance = calculateDistance(lat, lon, node.lat, node.lon);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestPoint = node;
                    }
                });
            }
        });

        if (!nearestPoint) {
            return null;
        }

        // Calculate bearing from location to nearest coastline point
        const bearing = calculateBearing(lat, lon, nearestPoint.lat, nearestPoint.lon);

        // Cache the result (24 hours - coastlines don't move!)
        cacheData(cacheKey, bearing, 24 * 60 * 60 * 1000);

        console.log('Coastline bearing calculated:', bearing, '° (distance:', minDistance.toFixed(2), 'km)');

        return bearing;

    } catch (error) {
        console.error('Error fetching coastline data:', error);
        return null;
    }
}

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
