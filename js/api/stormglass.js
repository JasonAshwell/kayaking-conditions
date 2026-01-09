// Stormglass API Integration for Complete Marine and Weather Data

/**
 * Get complete marine and weather data from Stormglass API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Complete marine and weather data
 */
async function getStormglassData(lat, lon, date) {
    // Check if API key is configured
    if (!CONFIG.STORMGLASS.apiKey || CONFIG.STORMGLASS.apiKey === '') {
        console.warn('Stormglass API key not configured. Using fallback APIs.');
        return null;
    }

    console.log('Stormglass API key is configured');

    // Check cache first
    const cacheKey = `stormglass_data_${lat}_${lon}_${date}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Using cached Stormglass data');
        return cached;
    }

    try {
        // Calculate start and end times for the day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        console.log('Stormglass request:', {
            lat: lat.toFixed(4),
            lng: lon.toFixed(4),
            start: startTimestamp,
            end: endTimestamp,
            date: date
        });

        // Build URL with parameters
        const params = new URLSearchParams({
            lat: lat.toFixed(4),
            lng: lon.toFixed(4),
            params: CONFIG.STORMGLASS.weatherParams.params,
            start: startTimestamp,
            end: endTimestamp
        });

        const url = `${CONFIG.STORMGLASS.weatherUrl}?${params.toString()}`;
        console.log('Stormglass URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': CONFIG.STORMGLASS.apiKey
            }
        });

        console.log('Stormglass response status:', response.status);

        if (!response.ok) {
            if (response.status === 429) {
                console.warn('Stormglass API rate limit reached (50 requests/day). Using fallback APIs.');
                return null;
            }
            const errorText = await response.text();
            console.error('Stormglass API error response:', errorText);
            throw new Error(`Stormglass API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Stormglass data received, hours:', data.hours ? data.hours.length : 0);

        // Get preferred source from localStorage
        const preferredSource = localStorage.getItem('stormglassPreferredSource') || 'sg';

        // Process the data into marine and weather components
        const processedData = processStormglassData(data, preferredSource);

        if (!processedData) {
            console.error('Failed to process Stormglass data');
            return null;
        }

        // Store raw data for reprocessing with different sources
        processedData.rawData = data;

        // Cache the result for 6 hours (including raw data)
        cacheData(cacheKey, processedData, 6 * 60 * 60 * 1000);

        console.log('Successfully processed Stormglass data for marine and weather');
        return processedData;
    } catch (error) {
        console.error('Error fetching Stormglass data:', error);
        // Don't throw - just return null so fallback APIs work
        return null;
    }
}

/**
 * Legacy function name for backward compatibility
 */
async function getStormglassMarineData(lat, lon, date) {
    const data = await getStormglassData(lat, lon, date);
    return data ? data.marine : null;
}

/**
 * Get tide data from Stormglass API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Tide data with high/low tide times and heights
 */
async function getStormglassTideData(lat, lon, date) {
    // Check if API key is configured
    if (!CONFIG.STORMGLASS.apiKey || CONFIG.STORMGLASS.apiKey === '') {
        console.warn('Stormglass API key not configured. Using fallback tide API.');
        return null;
    }

    console.log('Attempting to fetch Stormglass tide data...');

    // Check cache first
    const cacheKey = `stormglass_tides_${lat}_${lon}_${date}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
        console.log('Using cached Stormglass tide data');
        return cached;
    }

    try {
        // Calculate start and end times for the day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        console.log('Stormglass tide request:', {
            lat: lat.toFixed(4),
            lng: lon.toFixed(4),
            start: startTimestamp,
            end: endTimestamp,
            date: date
        });

        // Build URL with parameters
        const params = new URLSearchParams({
            lat: lat.toFixed(4),
            lng: lon.toFixed(4),
            start: startTimestamp,
            end: endTimestamp
        });

        const url = `${CONFIG.STORMGLASS.tideUrl}?${params.toString()}`;
        console.log('Stormglass tide URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': CONFIG.STORMGLASS.apiKey
            }
        });

        console.log('Stormglass tide response status:', response.status);

        if (!response.ok) {
            if (response.status === 429) {
                console.warn('Stormglass API rate limit reached. Using fallback tide API.');
                return null;
            }
            const errorText = await response.text();
            console.error('Stormglass Tide API error response:', errorText);
            throw new Error(`Stormglass Tide API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Stormglass tide data received:', data.data ? data.data.length : 0, 'tide events');

        // Process the tide data
        const tideData = processStormglassTideData(data, date);

        if (!tideData) {
            console.error('Failed to process Stormglass tide data');
            return null;
        }

        // Cache the result for 6 hours
        cacheData(cacheKey, tideData, 6 * 60 * 60 * 1000);

        console.log('Successfully processed Stormglass tide data');
        return tideData;
    } catch (error) {
        console.error('Error fetching Stormglass tide data:', error);
        // Don't throw - just return null so fallback API works
        return null;
    }
}

/**
 * Process Stormglass tide API data into app format
 * @param {Object} data - Raw tide API response
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Object} Processed tide data
 */
function processStormglassTideData(data, date) {
    if (!data.data || data.data.length === 0) {
        return null;
    }

    // Transform Stormglass tide data to match WorldTides format
    const tideEvents = data.data.map(event => {
        return {
            DateTime: event.time,
            EventType: event.type === 'high' ? 'HighWater' : 'LowWater',
            Height: event.height,
            height: event.height,
            type: event.type
        };
    });

    // Separate high and low tides
    const highTides = tideEvents.filter(event => event.EventType === 'HighWater');
    const lowTides = tideEvents.filter(event => event.EventType === 'LowWater');

    // Calculate tidal range
    const allHeights = tideEvents.map(e => e.Height);
    const tidalRange = allHeights.length > 0
        ? (Math.max(...allHeights) - Math.min(...allHeights)).toFixed(2)
        : 0;

    // Get station info if available
    const stationInfo = data.meta ? {
        name: data.meta.station ? data.meta.station.name : 'Unknown Station',
        lat: data.meta.lat,
        lon: data.meta.lng,
        latitude: data.meta.lat,
        longitude: data.meta.lng
    } : {
        name: 'Nearest Tide Point',
        lat: null,
        lon: null
    };

    return {
        events: tideEvents,
        highTides: highTides,
        lowTides: lowTides,
        tidalRange: tidalRange,
        station: stationInfo,
        date: date,
        datum: 'LAT',
        source: 'stormglass'
    };
}

/**
 * Helper function to get best value from multiple sources
 * @param {Object} dataPoint - Data point with multiple source values
 * @param {string} preferredSource - Preferred source (sg, noaa, meto, smhi, fcoo)
 * @returns {number|null} Best available value
 */
function getBestValue(dataPoint, preferredSource = 'sg') {
    if (!dataPoint) return null;

    // If preferred source exists, use it
    if (dataPoint[preferredSource] !== undefined && dataPoint[preferredSource] !== null) {
        return dataPoint[preferredSource];
    }

    // Fallback order: sg (Stormglass - recommended) -> noaa -> meto -> smhi -> fcoo
    return dataPoint.sg ?? dataPoint.noaa ?? dataPoint.meto ?? dataPoint.smhi ?? dataPoint.fcoo ?? null;
}

/**
 * Process raw Stormglass API data into marine and weather formats
 * @param {Object} data - Raw API response
 * @param {string} preferredSource - Preferred data source (sg, noaa, meto, smhi, fcoo)
 * @returns {Object} Processed marine and weather data
 */
function processStormglassData(data, preferredSource = 'sg') {
    if (!data.hours || data.hours.length === 0) {
        return null;
    }

    console.log('Processing Stormglass data with preferred source:', preferredSource);
    console.log('All hourly data (weather and marine) will use:', preferredSource.toUpperCase());

    // Marine hourly data
    const marineHourlyData = {
        time: [],
        wave_height: [],
        wave_period: [],
        wave_direction: [],
        swell_wave_height: [],
        swell_wave_period: [],
        swell_wave_direction: [],
        ocean_current_velocity: [],
        ocean_current_direction: [],
        sea_surface_temperature: []
    };

    // Weather hourly data
    const weatherHourlyData = {
        time: [],
        temperature_2m: [],
        apparent_temperature: [],
        windspeed_10m: [],
        windgusts_10m: [],
        winddirection_10m: [],
        precipitation_probability: [],
        precipitation: [],
        visibility: [],
        weather_code: []
    };

    // Helper function to map cloud cover and precipitation to weather code
    function getWeatherCodeFromCloudCover(cloudCover, precipitation) {
        if (precipitation > 5) return 65; // Heavy rain
        if (precipitation > 1) return 63; // Moderate rain
        if (precipitation > 0) return 61; // Slight rain
        if (cloudCover > 75) return 3; // Overcast
        if (cloudCover > 50) return 2; // Partly cloudy
        if (cloudCover > 25) return 1; // Mainly clear
        return 0; // Clear sky
    }

    // Extract hourly data
    data.hours.forEach(hour => {
        const timeStr = hour.time;

        // Marine data
        marineHourlyData.time.push(timeStr);
        marineHourlyData.wave_height.push(getBestValue(hour.waveHeight, preferredSource));
        marineHourlyData.wave_period.push(getBestValue(hour.wavePeriod, preferredSource));
        marineHourlyData.wave_direction.push(getBestValue(hour.waveDirection, preferredSource));
        marineHourlyData.swell_wave_height.push(getBestValue(hour.swellHeight, preferredSource));
        marineHourlyData.swell_wave_period.push(getBestValue(hour.swellPeriod, preferredSource));
        marineHourlyData.swell_wave_direction.push(getBestValue(hour.swellDirection, preferredSource));
        marineHourlyData.ocean_current_velocity.push(getBestValue(hour.currentSpeed, preferredSource));
        marineHourlyData.ocean_current_direction.push(getBestValue(hour.currentDirection, preferredSource));
        marineHourlyData.sea_surface_temperature.push(getBestValue(hour.waterTemperature, preferredSource));

        // Weather data
        weatherHourlyData.time.push(timeStr);
        weatherHourlyData.temperature_2m.push(getBestValue(hour.airTemperature, preferredSource));
        // Stormglass doesn't provide apparent temperature, so use air temperature
        weatherHourlyData.apparent_temperature.push(getBestValue(hour.airTemperature, preferredSource));
        // Convert windSpeed from m/s (Stormglass) to m/s (keep as is for Open-Meteo compatibility)
        weatherHourlyData.windspeed_10m.push(getBestValue(hour.windSpeed, preferredSource));
        weatherHourlyData.windgusts_10m.push(getBestValue(hour.gust, preferredSource) || getBestValue(hour.windSpeed, preferredSource));
        weatherHourlyData.winddirection_10m.push(getBestValue(hour.windDirection, preferredSource));
        // Stormglass uses precipitation in mm/h
        weatherHourlyData.precipitation.push(getBestValue(hour.precipitation, preferredSource));
        // Estimate precipitation probability based on precipitation amount
        const precip = getBestValue(hour.precipitation, preferredSource);
        weatherHourlyData.precipitation_probability.push(precip > 0 ? Math.min(100, precip * 20) : 0);
        // Convert visibility from km to meters
        const visibilityKm = getBestValue(hour.visibility, preferredSource);
        weatherHourlyData.visibility.push(visibilityKm ? visibilityKm * 1000 : null);
        // Map cloud cover to weather code (simplified)
        const cloudCover = getBestValue(hour.cloudCover, preferredSource);
        weatherHourlyData.weather_code.push(getWeatherCodeFromCloudCover(cloudCover, precip));
    });

    // Calculate averages for daytime hours (6 AM to 8 PM)
    const daytimeIndices = marineHourlyData.time
        .map((time, index) => {
            const hour = new Date(time).getHours();
            return hour >= 6 && hour <= 20 ? index : null;
        })
        .filter(index => index !== null);

    // Helper to calculate average
    const calculateAverage = (values) => {
        const validValues = values.filter(v => v !== null && !isNaN(v));
        if (validValues.length === 0) return null;
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        return (sum / validValues.length).toFixed(2);
    };

    // Helper to calculate circular average for directions
    const calculateCircularAverage = (directions) => {
        const validDirections = directions.filter(d => d !== null && !isNaN(d));
        if (validDirections.length === 0) return null;

        let sumSin = 0;
        let sumCos = 0;

        validDirections.forEach(dir => {
            const radians = dir * (Math.PI / 180);
            sumSin += Math.sin(radians);
            sumCos += Math.cos(radians);
        });

        const avgSin = sumSin / validDirections.length;
        const avgCos = sumCos / validDirections.length;

        let avgDirection = Math.atan2(avgSin, avgCos) * (180 / Math.PI);

        if (avgDirection < 0) {
            avgDirection += 360;
        }

        return Math.round(avgDirection);
    };

    // Get daytime marine values
    const waveHeights = daytimeIndices.map(i => marineHourlyData.wave_height[i]).filter(v => v !== null);
    const wavePeriods = daytimeIndices.map(i => marineHourlyData.wave_period[i]).filter(v => v !== null);
    const waveDirections = daytimeIndices.map(i => marineHourlyData.wave_direction[i]).filter(v => v !== null);
    const swellHeights = daytimeIndices.map(i => marineHourlyData.swell_wave_height[i]).filter(v => v !== null);
    const swellDirections = daytimeIndices.map(i => marineHourlyData.swell_wave_direction[i]).filter(v => v !== null);
    const currentVelocities = daytimeIndices.map(i => marineHourlyData.ocean_current_velocity[i]).filter(v => v !== null);
    const currentDirections = daytimeIndices.map(i => marineHourlyData.ocean_current_direction[i]).filter(v => v !== null);
    const seaTemperatures = daytimeIndices.map(i => marineHourlyData.sea_surface_temperature[i]).filter(v => v !== null);

    // Get daytime weather values
    const temperatures = daytimeIndices.map(i => weatherHourlyData.temperature_2m[i]).filter(v => v !== null);
    const windSpeeds = daytimeIndices.map(i => weatherHourlyData.windspeed_10m[i]).filter(v => v !== null);
    const windDirections = daytimeIndices.map(i => weatherHourlyData.winddirection_10m[i]).filter(v => v !== null);
    const visibilities = daytimeIndices.map(i => weatherHourlyData.visibility[i]).filter(v => v !== null);
    const precipProbs = daytimeIndices.map(i => weatherHourlyData.precipitation_probability[i]).filter(v => v !== null);

    // Build marine data object
    const marineData = {
        waveHeight: {
            avg: calculateAverage(waveHeights),
            max: waveHeights.length > 0 ? Math.max(...waveHeights).toFixed(2) : null,
            min: waveHeights.length > 0 ? Math.min(...waveHeights).toFixed(2) : null
        },
        wavePeriod: {
            avg: calculateAverage(wavePeriods),
            max: wavePeriods.length > 0 ? Math.max(...wavePeriods).toFixed(2) : null,
            min: wavePeriods.length > 0 ? Math.min(...wavePeriods).toFixed(2) : null
        },
        waveDirection: {
            avg: calculateCircularAverage(waveDirections),
            values: waveDirections
        },
        swellHeight: {
            avg: calculateAverage(swellHeights),
            max: swellHeights.length > 0 ? Math.max(...swellHeights).toFixed(2) : null
        },
        swellDirection: {
            avg: calculateCircularAverage(swellDirections),
            values: swellDirections
        },
        currentVelocity: {
            avg: calculateAverage(currentVelocities),
            max: currentVelocities.length > 0 ? Math.max(...currentVelocities).toFixed(2) : null
        },
        currentDirection: {
            avg: calculateCircularAverage(currentDirections),
            values: currentDirections
        },
        seaTemperature: seaTemperatures.length > 0 ? {
            avg: calculateAverage(seaTemperatures),
            max: Math.max(...seaTemperatures).toFixed(1),
            min: Math.min(...seaTemperatures).toFixed(1)
        } : null,
        hourlyData: marineHourlyData,
        timestamp: new Date().toISOString(),
        source: 'stormglass' // Mark data source
    };

    // Build weather data object
    const weatherData = {
        temperature: {
            avg: calculateAverage(temperatures),
            max: temperatures.length > 0 ? Math.max(...temperatures).toFixed(1) : null,
            min: temperatures.length > 0 ? Math.min(...temperatures).toFixed(1) : null,
            unit: '°C'
        },
        windSpeed: {
            avg: calculateAverage(windSpeeds),
            max: windSpeeds.length > 0 ? Math.max(...windSpeeds).toFixed(1) : null,
            min: windSpeeds.length > 0 ? Math.min(...windSpeeds).toFixed(1) : null,
            unit: 'm/s'
        },
        windDirection: {
            avg: calculateCircularAverage(windDirections),
            values: windDirections,
            unit: '°'
        },
        precipitation: {
            probability: precipProbs.length > 0 ? Math.max(...precipProbs) : 0,
            unit: '%'
        },
        visibility: {
            avg: calculateAverage(visibilities),
            min: visibilities.length > 0 ? Math.min(...visibilities).toFixed(0) : null,
            unit: 'm'
        },
        hourlyData: weatherHourlyData,
        timestamp: new Date().toISOString(),
        source: 'stormglass'
    };

    // Return both marine and weather data
    return {
        marine: marineData,
        weather: weatherData
    };
}

/**
 * Reprocess Stormglass data with a different source
 * This is a globally accessible function for updating the display
 * @param {Object} rawData - Raw Stormglass API response
 * @param {string} preferredSource - Preferred data source (sg, noaa, meto, smhi, fcoo)
 * @returns {Object} Processed marine and weather data
 */
function reprocessStormglassData(rawData, preferredSource) {
    if (!rawData) {
        console.error('No raw data available to reprocess');
        return null;
    }

    console.log('Reprocessing Stormglass data with source:', preferredSource);
    return processStormglassData(rawData, preferredSource);
}
