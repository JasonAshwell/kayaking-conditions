// WorldTides API Integration (CORS-enabled for browser use)

/**
 * Get tidal data for a specific location and date
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Complete tide data
 */
async function getTideData(lat, lon, date) {
    // Check cache first
    const cacheKey = `tides_${lat.toFixed(4)}_${lon.toFixed(4)}_${date}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Using cached tide data');
        return cached;
    }

    try {
        // Calculate start and end timestamps for the requested date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const startTimestamp = Math.floor(startDate.getTime() / 1000);

        // Build API URL for extremes (high/low tides)
        const params = new URLSearchParams({
            lat: lat.toFixed(6),
            lon: lon.toFixed(6),
            start: startTimestamp,
            length: 86400, // 24 hours in seconds
            extremes: true, // Get high and low tides
            heights: true, // Also get tide heights at intervals
            step: 1800, // 30 minutes in seconds
            datum: 'LAT' // Lowest Astronomical Tide (Chart Datum equivalent)
        });

        // Add API key if configured
        if (CONFIG.WORLDTIDES.apiKey && !CONFIG.WORLDTIDES.useFreeMode) {
            params.append('key', CONFIG.WORLDTIDES.apiKey);
        }

        const url = `${CONFIG.WORLDTIDES.baseUrl}?${params.toString()}`;

        console.log('Fetching tide data from WorldTides...');

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('WorldTides API key required. Please register for a FREE API key (takes 2 minutes):\n\n1. Visit: https://www.worldtides.info/register\n2. Verify your email\n3. Get your API key from your account\n4. Add it to js/utils/config.js\n\nSee GET-API-KEY.md for detailed instructions.');
            }
            if (response.status === 402) {
                throw new Error('WorldTides API quota exceeded. Your free tier resets next month, or upgrade for more requests.');
            }
            throw new Error(`Tide API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.extremes || data.extremes.length === 0) {
            throw new Error('No tide data available for this location');
        }

        // Process the tide data
        const processedData = processTideData(data, date);

        // Cache the processed data
        cacheData(cacheKey, processedData, CONFIG.CACHE.tidesTTL);

        return processedData;
    } catch (error) {
        console.error('Error getting tide data:', error);
        throw error;
    }
}

/**
 * Process raw WorldTides API response
 * @param {Object} data - Raw API response
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Object} Processed tide data
 */
function processTideData(data, date) {
    const extremes = data.extremes;

    // Separate high and low tides
    const highTides = [];
    const lowTides = [];
    const allEvents = [];

    extremes.forEach(extreme => {
        const eventDate = new Date(extreme.dt * 1000); // Convert Unix timestamp to Date
        const eventDateStr = eventDate.toISOString().split('T')[0];

        // Only include events for the requested date
        if (eventDateStr === date) {
            const tideEvent = {
                DateTime: eventDate.toISOString(),
                EventType: extreme.type === 'High' ? 'HighWater' : 'LowWater',
                Height: extreme.height,
                timestamp: extreme.dt
            };

            allEvents.push(tideEvent);

            if (extreme.type === 'High') {
                highTides.push(tideEvent);
            } else {
                lowTides.push(tideEvent);
            }
        }
    });

    // Sort by time
    allEvents.sort((a, b) => a.timestamp - b.timestamp);
    highTides.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
    lowTides.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));

    // Process heights array (30-minute intervals)
    const heightsData = [];
    if (data.heights && data.heights.length > 0) {
        data.heights.forEach(height => {
            const heightDate = new Date(height.dt * 1000);
            const heightDateStr = heightDate.toISOString().split('T')[0];

            // Only include heights for the requested date
            if (heightDateStr === date) {
                heightsData.push({
                    DateTime: heightDate.toISOString(),
                    Height: height.height,
                    timestamp: height.dt
                });
            }
        });
    }

    // Calculate tidal range
    const allHeights = allEvents.map(e => e.Height);
    const tidalRange = allHeights.length > 0
        ? (Math.max(...allHeights) - Math.min(...allHeights)).toFixed(2)
        : 0;

    return {
        station: {
            name: data.stationName || 'Nearest Tide Point',
            lat: data.responseLat || lat,
            lon: data.responseLon || lon,
            distance: data.stationDistance ? (data.stationDistance / 1000).toFixed(1) : null
        },
        events: allEvents,
        highTides: highTides,
        lowTides: lowTides,
        heights: heightsData, // 30-minute interval heights for smooth curve
        tidalRange: tidalRange,
        date: date,
        copyright: data.copyright || 'WorldTides',
        datum: data.datum || 'LAT',
        source: 'worldtides'
    };
}

/**
 * Get tidal height at a specific time (interpolated)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} datetime - ISO datetime string
 * @returns {Promise<number>} Tide height in meters
 */
async function getTideHeightAtTime(lat, lon, datetime) {
    try {
        const targetDate = new Date(datetime);
        const dateStr = targetDate.toISOString().split('T')[0];

        const tideData = await getTideData(lat, lon, dateStr);

        // Interpolate height at target time
        const height = interpolateTideHeight(tideData.events, targetDate);

        return height;
    } catch (error) {
        console.error('Error getting tide height:', error);
        throw error;
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
