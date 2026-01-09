// API Configuration
const CONFIG = {
    // WorldTides API (Free - CORS-enabled, works in browsers!)
    // UKHO API cannot be used from browsers due to CORS restrictions
    // WorldTides is permanently free with 1000 requests/month
    WORLDTIDES: {
        apiKey: '135660c8-6da3-4b8f-baf2-eb3f3c56b6c9',
        baseUrl: 'https://www.worldtides.info/api/v3',
        useFreeMode: false // Using API key for full access
    },

    // Open-Meteo Marine API (free, no API key required)
    OPEN_METEO_MARINE: {
        baseUrl: 'https://marine-api.open-meteo.com/v1/marine',
        params: {
            hourly: 'wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,ocean_current_velocity,ocean_current_direction'
        }
    },

    // Stormglass API (free tier: 50 requests/day) - Comprehensive weather, marine, and tide data
    STORMGLASS: {
        apiKey: '76b98b6a-ec32-11f0-9b8c-0242ac130003-76b98bec-ec32-11f0-9b8c-0242ac130003',
        weatherUrl: 'https://api.stormglass.io/v2/weather/point',
        tideUrl: 'https://api.stormglass.io/v2/tide/extremes/point',
        weatherParams: {
            // Marine parameters
            params: 'waterTemperature,waveHeight,wavePeriod,waveDirection,swellHeight,swellPeriod,swellDirection,currentSpeed,currentDirection,' +
                    // Weather parameters
                    'airTemperature,windSpeed,windDirection,gust,precipitation,visibility,cloudCover,humidity,pressure'
        },
        tideParams: {
            // Returns high/low tide extremes
        }
    },

    // Open-Meteo Weather API (free, no API key required)
    OPEN_METEO_WEATHER: {
        baseUrl: 'https://api.open-meteo.com/v1/forecast',
        params: {
            hourly: 'temperature_2m,apparent_temperature,windspeed_10m,windgusts_10m,winddirection_10m,precipitation_probability,precipitation,visibility,weather_code',
            current: 'temperature_2m,windspeed_10m,winddirection_10m,weather_code'
        }
    },

    // Nominatim Geocoding API (OpenStreetMap - free, no API key required)
    NOMINATIM: {
        baseUrl: 'https://nominatim.openstreetmap.org/search',
        params: {
            format: 'json',
            countrycodes: 'gb', // UK only
            limit: 5
        },
        headers: {
            'User-Agent': 'SeaKayakingConditionsApp/1.0' // Required by Nominatim usage policy
        }
    },

    // Caching configuration
    CACHE: {
        locationTTL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        weatherTTL: 60 * 60 * 1000, // 1 hour
        marineTTL: 60 * 60 * 1000, // 1 hour
        tidesTTL: 6 * 60 * 60 * 1000 // 6 hours - tides don't change frequently
    },

    // Safety thresholds for kayaking conditions
    SAFETY_THRESHOLDS: {
        wind: {
            caution: 15, // knots
            warning: 20  // knots
        },
        waves: {
            moderate: 1.0, // meters
            poor: 2.0      // meters
        },
        visibility: {
            warning: 1000 // meters
        },
        waterTemp: {
            cold: 12 // Celsius - hypothermia risk
        }
    },

    // Wind Speed Safety Guidelines by Paddler Experience Level
    WIND_SAFETY_LEVELS: [
        {
            level: 'Beginner',
            maxWindKnots: 10,
            maxWindMph: 12,
            beaufortMin: 0,
            beaufortMax: 3,
            description: 'Ideal conditions are light. Anything over 10 knots is challenging.',
            color: '#28a745' // Green
        },
        {
            level: 'Intermediate',
            maxWindKnots: 16,
            maxWindMph: 18,
            beaufortMin: 4,
            beaufortMax: 4,
            description: 'Manageable in some conditions, but caution is advised, especially in open water.',
            color: '#ffc107' // Amber
        },
        {
            level: 'Advanced',
            maxWindKnots: 27,
            maxWindMph: 31,
            beaufortMin: 5,
            beaufortMax: 6,
            description: 'Requires solid experience, proper gear, and the ability to perform self-rescues in challenging seas.',
            color: '#fd7e14' // Orange
        },
        {
            level: 'Expert',
            maxWindKnots: 999,
            maxWindMph: 999,
            beaufortMin: 7,
            beaufortMax: 12,
            description: 'Only for highly experienced paddlers; considered dangerous for most.',
            color: '#dc3545' // Red
        }
    ],

    // Grading System Configuration
    GRADING: {
        // Factor 1: Water Temperature - 2 points for each degree below 20°C
        waterTemp: {
            calculatePoints: (tempC) => {
                if (tempC >= 20) return 0;
                return Math.max(0, (20 - tempC) * 2);
            },
            getColor: (tempC) => {
                if (tempC >= 15) return 'green';
                if (tempC >= 10) return 'amber';
                return 'red';
            }
        },

        // Factor 2: Wind Speed - 1 point per knot
        windSpeed: {
            calculatePoints: (knots) => Math.round(knots),
            getColor: (knots) => {
                if (knots < 10) return 'green';
                if (knots <= 20) return 'amber';
                return 'red';
            }
        },

        // Factor 3: Wind Gust - 1 point for every 3 knots over base wind speed
        windGust: {
            calculatePoints: (gustKnots, baseWindKnots) => {
                const diff = Math.max(0, gustKnots - baseWindKnots);
                return Math.round(diff / 3);
            },
            getColor: (gustKnots) => {
                if (gustKnots < 15) return 'green';
                if (gustKnots <= 25) return 'amber';
                return 'red';
            }
        },

        // Factor 4: Wave Height - 6 points per meter
        waveHeight: {
            calculatePoints: (meters) => Math.round(meters * 6),
            getColor: (meters) => {
                if (meters < 1) return 'green';
                if (meters <= 1.5) return 'amber';
                return 'red';
            }
        },

        // Factor 5: Wave Period - No points calculation, just color
        wavePeriod: {
            calculatePoints: (seconds) => 0, // No points for wave period
            getColor: (seconds) => {
                if (seconds < 10) return 'green';
                if (seconds <= 15) return 'amber';
                return 'red';
            }
        },

        // Selectable activities
        activities: {
            rockhopping: 20,
            seaCaves: 20,
            surfing: 20,
            nightTime: 20
        }
    },

    // UI Configuration
    UI: {
        searchDebounceMs: 500,
        maxForecastDays: 6, // Today + 6 days (API limitation)
        loadingTimeout: 30000 // 30 seconds
    }
};

// Make config available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
