// Utility Helper Functions

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const d = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-GB', options);
}

/**
 * Format time from ISO string to HH:MM format
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted time (HH:MM)
 */
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Get maximum selectable date (today + n days)
 * @param {number} days - Number of days from today
 * @returns {string} Maximum date in YYYY-MM-DD format
 */
function getMaxDate(days = 6) {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + days);
    return maxDate.toISOString().split('T')[0];
}

/**
 * Convert degrees to compass direction
 * @param {number} degrees - Direction in degrees (0-360)
 * @returns {string} Compass direction (N, NE, E, etc.)
 */
function degreesToCompass(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * Calculate bearing between two points
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {number} Bearing in degrees (0-360)
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;

    return bearing;
}

/**
 * Determine if wind is onshore or offshore
 * @param {number} windDirection - Wind direction in degrees (where it's coming FROM)
 * @param {number} coastBearing - Bearing to the coast in degrees
 * @returns {string} 'onshore', 'offshore', or 'parallel'
 */
function getWindShoreDirection(windDirection, coastBearing) {
    // Normalize directions
    windDirection = ((windDirection % 360) + 360) % 360;
    coastBearing = ((coastBearing % 360) + 360) % 360;

    // Calculate the difference between wind and coast bearing
    let diff = Math.abs(windDirection - coastBearing);
    if (diff > 180) diff = 360 - diff;

    // Onshore: wind blowing from sea towards land (wind direction is roughly same as coast bearing ±45°)
    // Offshore: wind blowing from land towards sea (wind direction is opposite to coast bearing ±45°)

    if (diff <= 45) {
        return 'onshore';
    } else if (diff >= 135) {
        return 'offshore';
    } else {
        return 'parallel';
    }
}

/**
 * Convert degrees to arrow Unicode character
 * @param {number} degrees - Direction in degrees (0-360)
 * @returns {string} Arrow character
 */
function degreesToArrow(degrees) {
    // Normalize degrees to 0-360
    degrees = ((degrees % 360) + 360) % 360;

    // Create rotation style for arrow
    return `<span style="display: inline-block; transform: rotate(${degrees}deg);">↓</span>`;
}

/**
 * Convert meters per second to knots
 * @param {number} mps - Speed in meters per second
 * @returns {number} Speed in knots
 */
function mpsToKnots(mps) {
    return (mps * 1.94384).toFixed(1);
}

/**
 * Convert meters per second to miles per hour
 * @param {number} mps - Speed in meters per second
 * @returns {number} Speed in mph
 */
function mpsToMph(mps) {
    return (mps * 2.23694).toFixed(1);
}

/**
 * Convert meters to feet
 * @param {number} meters - Distance in meters
 * @returns {number} Distance in feet
 */
function metersToFeet(meters) {
    return (meters * 3.28084).toFixed(1);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if wind is against tide (dangerous condition)
 * @param {number} windDirection - Wind direction in degrees
 * @param {number} tideDirection - Tide/current direction in degrees
 * @returns {boolean} True if wind is opposing tide
 */
function isWindAgainstTide(windDirection, tideDirection) {
    // Calculate difference in degrees
    const diff = Math.abs(windDirection - tideDirection);
    // Wind against tide if difference is between 135 and 225 degrees
    return (diff >= 135 && diff <= 225) || (360 - diff >= 135 && 360 - diff <= 225);
}

/**
 * Calculate safety rating based on conditions
 * @param {Object} conditions - Weather and sea conditions
 * @returns {Object} Safety rating and warnings
 */
function calculateSafetyRating(conditions) {
    let score = 100;
    const warnings = [];

    // Wind speed check
    if (conditions.windSpeed >= CONFIG.SAFETY_THRESHOLDS.wind.warning) {
        score -= 30;
        warnings.push('Strong winds - kayaking not recommended');
    } else if (conditions.windSpeed >= CONFIG.SAFETY_THRESHOLDS.wind.caution) {
        score -= 15;
        warnings.push('Moderate winds - suitable for experienced kayakers only');
    }

    // Wave height check
    if (conditions.waveHeight >= CONFIG.SAFETY_THRESHOLDS.waves.poor) {
        score -= 40;
        warnings.push('High wave height - experienced kayakers only');
    } else if (conditions.waveHeight >= CONFIG.SAFETY_THRESHOLDS.waves.moderate) {
        score -= 20;
        warnings.push('Moderate wave height - exercise caution');
    }

    // Wind against tide check
    if (conditions.windDirection && conditions.currentDirection) {
        if (isWindAgainstTide(conditions.windDirection, conditions.currentDirection)) {
            score -= 25;
            warnings.push('Wind against tide - expect rough and choppy conditions');
        }
    }

    // Visibility check
    if (conditions.visibility && conditions.visibility < CONFIG.SAFETY_THRESHOLDS.visibility.warning) {
        score -= 20;
        warnings.push('Limited visibility - navigation may be difficult');
    }

    // Temperature check (hypothermia risk)
    if (conditions.temperature && conditions.temperature < CONFIG.SAFETY_THRESHOLDS.waterTemp.cold) {
        score -= 10;
        warnings.push('Cold water temperature - wear appropriate thermal protection');
    }

    // Determine overall rating
    let rating;
    if (score >= 70) {
        rating = 'good';
    } else if (score >= 40) {
        rating = 'moderate';
    } else {
        rating = 'poor';
    }

    return {
        score: Math.max(0, score),
        rating: rating,
        warnings: warnings
    };
}

/**
 * Cache data in storage
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 * @param {boolean} useLocal - Use localStorage instead of sessionStorage
 */
function cacheData(key, data, ttl, useLocal = false) {
    const storage = useLocal ? localStorage : sessionStorage;
    const item = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl
    };
    storage.setItem(key, JSON.stringify(item));
}

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @param {boolean} useLocal - Use localStorage instead of sessionStorage
 * @returns {*} Cached data or null if expired/not found
 */
function getCachedData(key, useLocal = false) {
    const storage = useLocal ? localStorage : sessionStorage;
    const itemStr = storage.getItem(key);

    if (!itemStr) {
        return null;
    }

    try {
        const item = JSON.parse(itemStr);
        const now = Date.now();

        // Check if expired
        if (now - item.timestamp > item.ttl) {
            storage.removeItem(key);
            return null;
        }

        return item.data;
    } catch (e) {
        console.error('Error parsing cached data:', e);
        storage.removeItem(key);
        return null;
    }
}

/**
 * Clear all cached data
 * @param {boolean} includeLocal - Also clear localStorage
 */
function clearCache(includeLocal = false) {
    sessionStorage.clear();
    if (includeLocal) {
        localStorage.clear();
    }
}

/**
 * Show element
 * @param {HTMLElement|string} element - Element or element ID
 */
function showElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) el.style.display = 'block';
}

/**
 * Hide element
 * @param {HTMLElement|string} element - Element or element ID
 */
function hideElement(element) {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (el) el.style.display = 'none';
}

/**
 * Show loading spinner
 */
function showLoading() {
    showElement('loading');
    hideElement('error-message');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    hideElement('loading');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        showElement(errorEl);
    }
    hideLoading();
}

/**
 * Clear error message
 */
function clearError() {
    hideElement('error-message');
}

/**
 * Validate date is within allowed range
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean} True if valid
 */
function isValidDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + CONFIG.UI.maxForecastDays);
    maxDate.setHours(23, 59, 59, 999);

    return date >= today && date <= maxDate;
}

/**
 * Calculate tidal range from tide events
 * @param {Array} tideEvents - Array of tide events with height property
 * @returns {number} Tidal range in meters
 */
function calculateTidalRange(tideEvents) {
    if (!tideEvents || tideEvents.length < 2) return 0;

    const heights = tideEvents.map(event => event.height);
    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);

    return (maxHeight - minHeight).toFixed(2);
}

/**
 * Interpolate tide height at specific time
 * @param {Array} tideEvents - Array of tide events with DateTime and Height
 * @param {Date} targetTime - Time to interpolate for
 * @returns {number} Interpolated height in meters
 */
function interpolateTideHeight(tideEvents, targetTime) {
    if (!tideEvents || tideEvents.length < 2) return 0;

    // Find surrounding tide events
    let before = null;
    let after = null;

    for (let i = 0; i < tideEvents.length - 1; i++) {
        const eventTime = new Date(tideEvents[i].DateTime);
        const nextTime = new Date(tideEvents[i + 1].DateTime);

        if (targetTime >= eventTime && targetTime <= nextTime) {
            before = tideEvents[i];
            after = tideEvents[i + 1];
            break;
        }
    }

    if (!before || !after) return 0;

    // Simple linear interpolation
    const beforeTime = new Date(before.DateTime).getTime();
    const afterTime = new Date(after.DateTime).getTime();
    const targetTimeMs = targetTime.getTime();

    const ratio = (targetTimeMs - beforeTime) / (afterTime - beforeTime);
    const interpolatedHeight = before.Height + (after.Height - before.Height) * ratio;

    return interpolatedHeight;
}

/**
 * Get weather icon and description from WMO weather code
 * @param {number} code - WMO weather code
 * @param {boolean} isDay - Whether it's daytime
 * @returns {Object} Icon and description
 */
function getWeatherIcon(code, isDay = true) {
    // WMO Weather interpretation codes
    const weatherCodes = {
        0: { icon: isDay ? '☀️' : '🌙', desc: 'Clear sky' },
        1: { icon: isDay ? '🌤️' : '🌙', desc: 'Mainly clear' },
        2: { icon: '⛅', desc: 'Partly cloudy' },
        3: { icon: '☁️', desc: 'Overcast' },
        45: { icon: '🌫️', desc: 'Foggy' },
        48: { icon: '🌫️', desc: 'Rime fog' },
        51: { icon: '🌦️', desc: 'Light drizzle' },
        53: { icon: '🌧️', desc: 'Moderate drizzle' },
        55: { icon: '🌧️', desc: 'Dense drizzle' },
        56: { icon: '🌧️', desc: 'Light freezing drizzle' },
        57: { icon: '🌧️', desc: 'Dense freezing drizzle' },
        61: { icon: '🌦️', desc: 'Slight rain' },
        63: { icon: '🌧️', desc: 'Moderate rain' },
        65: { icon: '🌧️', desc: 'Heavy rain' },
        66: { icon: '🌧️', desc: 'Light freezing rain' },
        67: { icon: '🌧️', desc: 'Heavy freezing rain' },
        71: { icon: '🌨️', desc: 'Slight snow' },
        73: { icon: '🌨️', desc: 'Moderate snow' },
        75: { icon: '🌨️', desc: 'Heavy snow' },
        77: { icon: '🌨️', desc: 'Snow grains' },
        80: { icon: '🌦️', desc: 'Slight rain showers' },
        81: { icon: '🌧️', desc: 'Moderate rain showers' },
        82: { icon: '⛈️', desc: 'Violent rain showers' },
        85: { icon: '🌨️', desc: 'Slight snow showers' },
        86: { icon: '🌨️', desc: 'Heavy snow showers' },
        95: { icon: '⛈️', desc: 'Thunderstorm' },
        96: { icon: '⛈️', desc: 'Thunderstorm with slight hail' },
        99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
    };

    return weatherCodes[code] || { icon: '❓', desc: 'Unknown' };
}

/**
 * Format hour for display (12h format with AM/PM or 24h)
 * @param {string} isoString - ISO datetime string
 * @param {boolean} use24h - Use 24-hour format
 * @returns {string} Formatted hour
 */
function formatHour(isoString, use24h = false) {
    const date = new Date(isoString);
    if (use24h) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00', '');
}

/**
 * Check if a time is during day or night
 * @param {string} isoString - ISO datetime string
 * @param {number} lat - Latitude (for sunrise/sunset calculation)
 * @returns {boolean} True if daytime
 */
function isDaytime(isoString, lat = 50) {
    const date = new Date(isoString);
    const hour = date.getHours();

    // Simplified: 6 AM to 8 PM is day
    // For more accuracy, we could calculate actual sunrise/sunset
    return hour >= 6 && hour < 20;
}

/**
 * Convert wind speed in knots to Beaufort scale
 * @param {number} knots - Wind speed in knots
 * @returns {Object} Beaufort force number and description
 */
function getBeaufortScale(knots) {
    const scale = [
        { force: 0, min: 0, max: 1, description: 'Calm' },
        { force: 1, min: 1, max: 3, description: 'Light air' },
        { force: 2, min: 4, max: 6, description: 'Light breeze' },
        { force: 3, min: 7, max: 10, description: 'Gentle breeze' },
        { force: 4, min: 11, max: 16, description: 'Moderate breeze' },
        { force: 5, min: 17, max: 21, description: 'Fresh breeze' },
        { force: 6, min: 22, max: 27, description: 'Strong breeze' },
        { force: 7, min: 28, max: 33, description: 'Near gale' },
        { force: 8, min: 34, max: 40, description: 'Gale' },
        { force: 9, min: 41, max: 47, description: 'Severe gale' },
        { force: 10, min: 48, max: 55, description: 'Storm' },
        { force: 11, min: 56, max: 63, description: 'Violent storm' },
        { force: 12, min: 64, max: 999, description: 'Hurricane' }
    ];

    for (let i = 0; i < scale.length; i++) {
        if (knots >= scale[i].min && knots <= scale[i].max) {
            return scale[i];
        }
    }

    return scale[0]; // Default to calm
}

/**
 * Get recommended paddler level for wind conditions
 * @param {number} windSpeedKnots - Wind speed in knots
 * @returns {Object} Paddler level info (level, description, color, etc.)
 */
function getPaddlerLevelForWind(windSpeedKnots) {
    const levels = CONFIG.WIND_SAFETY_LEVELS;

    for (let i = 0; i < levels.length; i++) {
        if (windSpeedKnots <= levels[i].maxWindKnots) {
            return levels[i];
        }
    }

    // Return Expert level for extreme winds
    return levels[levels.length - 1];
}

/**
 * Open image in a modal viewer
 * @param {string} imagePath - Path to the image
 * @param {string} locationName - Name of the location
 */
function openImageModal(imagePath, locationName) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('image-modal');

    if (!modal) {
        const modalHTML = `
            <div id="image-modal" class="image-modal" onclick="closeImageModal()">
                <span class="image-modal-close">&times;</span>
                <img class="image-modal-content" id="modal-image">
                <div class="image-modal-caption" id="modal-caption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('image-modal');
    }

    // Display the image
    const modalImg = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');

    modal.style.display = 'block';
    modalImg.src = imagePath;
    caption.textContent = locationName;
    document.body.style.overflow = 'hidden';
}

/**
 * Close the image modal
 */
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Add keyboard support for closing modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});
