// Open-Meteo Weather API Integration

/**
 * Get weather conditions for a specific location and date
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Weather conditions data
 */
async function getWeatherConditions(lat, lon, date) {
    // Check cache first
    const cacheKey = `weather_${lat}_${lon}_${date}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Using cached weather data');
        return cached;
    }

    try {
        // Build URL with parameters
        const params = new URLSearchParams({
            latitude: lat.toFixed(4),
            longitude: lon.toFixed(4),
            start_date: date,
            end_date: date,
            hourly: CONFIG.OPEN_METEO_WEATHER.params.hourly,
            current: CONFIG.OPEN_METEO_WEATHER.params.current,
            timezone: 'Europe/London',
            windspeed_unit: 'kn' // Get wind speed in knots directly
        });

        const url = `${CONFIG.OPEN_METEO_WEATHER.baseUrl}?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        // Process weather data
        const weatherData = processWeatherData(data);

        // Cache the result
        cacheData(cacheKey, weatherData, CONFIG.CACHE.weatherTTL);

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather conditions:', error);
        throw new Error('Failed to fetch weather conditions. Please try again.');
    }
}

/**
 * Process raw weather API data
 * @param {Object} data - Raw API response
 * @returns {Object} Processed weather data
 */
function processWeatherData(data) {
    if (!data.hourly) {
        throw new Error('Invalid weather data received');
    }

    const hourly = data.hourly;
    const current = data.current || {};

    // Get daytime hours (6 AM to 8 PM) for better averages
    const daytimeIndices = hourly.time
        .map((time, index) => {
            const hour = new Date(time).getHours();
            return hour >= 6 && hour <= 20 ? index : null;
        })
        .filter(index => index !== null);

    // Calculate averages and get relevant data
    const temperatures = daytimeIndices.map(i => hourly.temperature_2m[i]).filter(v => v !== null);
    const windSpeeds = daytimeIndices.map(i => hourly.windspeed_10m[i]).filter(v => v !== null);
    const windDirections = daytimeIndices.map(i => hourly.winddirection_10m[i]).filter(v => v !== null);
    const precipProbs = daytimeIndices.map(i => hourly.precipitation_probability[i]).filter(v => v !== null);
    const visibilities = daytimeIndices.map(i => hourly.visibility[i]).filter(v => v !== null);

    return {
        current: {
            temperature: current.temperature_2m || null,
            windSpeed: current.windspeed_10m || null,
            windDirection: current.winddirection_10m || null
        },
        temperature: {
            avg: calculateAverage(temperatures),
            max: Math.max(...temperatures),
            min: Math.min(...temperatures),
            unit: data.hourly_units.temperature_2m
        },
        windSpeed: {
            avg: calculateAverage(windSpeeds),
            max: Math.max(...windSpeeds),
            min: Math.min(...windSpeeds),
            unit: data.hourly_units.windspeed_10m
        },
        windDirection: {
            avg: calculateCircularAverage(windDirections),
            values: windDirections,
            unit: data.hourly_units.winddirection_10m
        },
        precipitation: {
            probability: Math.max(...precipProbs),
            unit: data.hourly_units.precipitation_probability
        },
        visibility: {
            avg: calculateAverage(visibilities),
            min: Math.min(...visibilities),
            unit: data.hourly_units.visibility
        },
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
    return Number((sum / values.length).toFixed(1));
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
 * Get weather at specific time
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} datetime - Date and time in ISO format
 * @returns {Promise<Object>} Weather data for specific time
 */
async function getWeatherAtTime(lat, lon, datetime) {
    try {
        const date = new Date(datetime);
        const dateStr = date.toISOString().split('T')[0];

        const weatherData = await getWeatherConditions(lat, lon, dateStr);

        // Find closest hour in the data
        const targetHour = date.getHours();
        const hourlyTimes = weatherData.hourlyData.time;

        const closestIndex = hourlyTimes.findIndex(time => {
            const hour = new Date(time).getHours();
            return hour === targetHour;
        });

        if (closestIndex === -1) {
            throw new Error('No data available for specified time');
        }

        return {
            temperature: weatherData.hourlyData.temperature_2m[closestIndex],
            windSpeed: weatherData.hourlyData.windspeed_10m[closestIndex],
            windDirection: weatherData.hourlyData.winddirection_10m[closestIndex],
            precipitationProbability: weatherData.hourlyData.precipitation_probability[closestIndex],
            visibility: weatherData.hourlyData.visibility[closestIndex],
            time: hourlyTimes[closestIndex]
        };
    } catch (error) {
        console.error('Error getting weather at time:', error);
        throw error;
    }
}

/**
 * Get beaufort scale description from wind speed
 * @param {number} speedKnots - Wind speed in knots
 * @returns {Object} Beaufort scale info
 */
function getBeaufortScale(speedKnots) {
    if (speedKnots < 1) return { force: 0, description: 'Calm' };
    if (speedKnots < 4) return { force: 1, description: 'Light air' };
    if (speedKnots < 7) return { force: 2, description: 'Light breeze' };
    if (speedKnots < 11) return { force: 3, description: 'Gentle breeze' };
    if (speedKnots < 16) return { force: 4, description: 'Moderate breeze' };
    if (speedKnots < 22) return { force: 5, description: 'Fresh breeze' };
    if (speedKnots < 28) return { force: 6, description: 'Strong breeze' };
    if (speedKnots < 34) return { force: 7, description: 'Near gale' };
    if (speedKnots < 41) return { force: 8, description: 'Gale' };
    if (speedKnots < 48) return { force: 9, description: 'Strong gale' };
    if (speedKnots < 56) return { force: 10, description: 'Storm' };
    if (speedKnots < 64) return { force: 11, description: 'Violent storm' };
    return { force: 12, description: 'Hurricane' };
}
