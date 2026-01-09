// Open-Meteo Marine API Integration

/**
 * Get marine conditions for a specific location and date
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Marine conditions data
 */
async function getMarineConditions(lat, lon, date) {
    // Check cache first
    const cacheKey = `marine_${lat}_${lon}_${date}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Using cached marine data');
        return cached;
    }

    try {
        // Build URL with parameters
        const params = new URLSearchParams({
            latitude: lat.toFixed(4),
            longitude: lon.toFixed(4),
            start_date: date,
            end_date: date,
            hourly: CONFIG.OPEN_METEO_MARINE.params.hourly,
            timezone: 'Europe/London'
        });

        const url = `${CONFIG.OPEN_METEO_MARINE.baseUrl}?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Marine API error: ${response.status}`);
        }

        const data = await response.json();

        // Process hourly data to get relevant values for the day
        const marineData = processMarineData(data);

        // Cache the result
        cacheData(cacheKey, marineData, CONFIG.CACHE.marineTTL);

        return marineData;
    } catch (error) {
        console.error('Error fetching marine conditions:', error);
        throw new Error('Failed to fetch marine conditions. Please try again.');
    }
}

/**
 * Process raw marine API data
 * @param {Object} data - Raw API response
 * @returns {Object} Processed marine data
 */
function processMarineData(data) {
    if (!data.hourly) {
        throw new Error('Invalid marine data received');
    }

    const hourly = data.hourly;

    // Get daytime hours (6 AM to 8 PM) for better averages
    const daytimeIndices = hourly.time
        .map((time, index) => {
            const hour = new Date(time).getHours();
            return hour >= 6 && hour <= 20 ? index : null;
        })
        .filter(index => index !== null);

    // Calculate averages and get relevant data
    const waveHeights = daytimeIndices.map(i => hourly.wave_height[i]).filter(v => v !== null);
    const wavePeriods = daytimeIndices.map(i => hourly.wave_period[i]).filter(v => v !== null);
    const waveDirections = daytimeIndices.map(i => hourly.wave_direction[i]).filter(v => v !== null);
    const swellHeights = daytimeIndices.map(i => hourly.swell_wave_height[i]).filter(v => v !== null);
    const swellDirections = daytimeIndices.map(i => hourly.swell_wave_direction[i]).filter(v => v !== null);
    const currentVelocities = daytimeIndices.map(i => hourly.ocean_current_velocity[i]).filter(v => v !== null);
    const currentDirections = daytimeIndices.map(i => hourly.ocean_current_direction[i]).filter(v => v !== null);

    return {
        waveHeight: {
            avg: calculateAverage(waveHeights),
            max: Math.max(...waveHeights),
            min: Math.min(...waveHeights)
        },
        wavePeriod: {
            avg: calculateAverage(wavePeriods),
            max: Math.max(...wavePeriods),
            min: Math.min(...wavePeriods)
        },
        waveDirection: {
            avg: calculateCircularAverage(waveDirections),
            values: waveDirections
        },
        swellHeight: {
            avg: calculateAverage(swellHeights),
            max: Math.max(...swellHeights)
        },
        swellDirection: {
            avg: calculateCircularAverage(swellDirections),
            values: swellDirections
        },
        currentVelocity: {
            avg: calculateAverage(currentVelocities),
            max: Math.max(...currentVelocities)
        },
        currentDirection: {
            avg: calculateCircularAverage(currentDirections),
            values: currentDirections
        },
        seaTemperature: null, // Now fetched from Stormglass API separately
        hourlyData: hourly,
        timestamp: new Date().toISOString(),
        source: 'open-meteo'
    };
}

/**
 * Calculate average of an array of numbers
 * @param {Array<number>} values - Array of numbers
 * @returns {number} Average value
 */
function calculateAverage(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
}

/**
 * Calculate circular average for directional data (0-360 degrees)
 * @param {Array<number>} directions - Array of directions in degrees
 * @returns {number} Average direction in degrees
 */
function calculateCircularAverage(directions) {
    if (directions.length === 0) return 0;

    let sumSin = 0;
    let sumCos = 0;

    directions.forEach(dir => {
        const radians = dir * (Math.PI / 180);
        sumSin += Math.sin(radians);
        sumCos += Math.cos(radians);
    });

    const avgSin = sumSin / directions.length;
    const avgCos = sumCos / directions.length;

    let avgDirection = Math.atan2(avgSin, avgCos) * (180 / Math.PI);

    // Normalize to 0-360
    if (avgDirection < 0) {
        avgDirection += 360;
    }

    return Math.round(avgDirection);
}

/**
 * Get specific time marine data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} datetime - Date and time in ISO format
 * @returns {Promise<Object>} Marine data for specific time
 */
async function getMarineDataAtTime(lat, lon, datetime) {
    try {
        const date = new Date(datetime);
        const dateStr = date.toISOString().split('T')[0];

        const marineData = await getMarineConditions(lat, lon, dateStr);

        // Find closest hour in the data
        const targetHour = date.getHours();
        const hourlyTimes = marineData.hourlyData.time;

        const closestIndex = hourlyTimes.findIndex(time => {
            const hour = new Date(time).getHours();
            return hour === targetHour;
        });

        if (closestIndex === -1) {
            throw new Error('No data available for specified time');
        }

        return {
            waveHeight: marineData.hourlyData.wave_height[closestIndex],
            wavePeriod: marineData.hourlyData.wave_period[closestIndex],
            waveDirection: marineData.hourlyData.wave_direction[closestIndex],
            swellHeight: marineData.hourlyData.swell_wave_height[closestIndex],
            currentVelocity: marineData.hourlyData.ocean_current_velocity[closestIndex],
            currentDirection: marineData.hourlyData.ocean_current_direction[closestIndex],
            time: hourlyTimes[closestIndex]
        };
    } catch (error) {
        console.error('Error getting marine data at time:', error);
        throw error;
    }
}
