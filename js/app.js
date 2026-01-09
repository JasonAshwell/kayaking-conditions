// Main Application Controller

class KayakingConditionsApp {
    constructor() {
        this.searchButton = null;
        this.currentLocation = null;
        this.currentDate = null;
        this.currentTime = null;

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Get search button
        this.searchButton = document.getElementById('search-btn');

        // Event listeners
        this.searchButton.addEventListener('click', () => this.handleSearch());

        // Listen for location selection
        document.addEventListener('locationSelected', (e) => {
            this.currentLocation = e.detail;
            clearError();
        });

        // Enter key support for search
        document.getElementById('location-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        document.getElementById('date-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        document.getElementById('time-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        console.log('Sea Kayaking Conditions App initialized');
    }

    async handleSearch() {
        try {
            // Clear any previous errors
            clearError();

            // Validate inputs
            if (!this.validateInputs()) {
                return;
            }

            // Get date and time from date picker
            this.currentDate = datePicker.getSelectedDate();
            this.currentTime = datePicker.getSelectedTime();

            // Show loading state
            showLoading();
            this.searchButton.disabled = true;

            // Try to fetch comprehensive data from Stormglass first
            console.log('Attempting to fetch Stormglass data...');
            const stormglassData = await getStormglassData(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.currentDate
            );

            if (stormglassData) {
                console.log('Stormglass data received:', {
                    hasWeather: !!stormglassData.weather,
                    hasMarine: !!stormglassData.marine
                });
            } else {
                console.warn('Stormglass data not available, using fallback APIs');
            }

            // Fetch data (use Stormglass where available, fallback to other APIs)
            const [tides, marine, weather, coastlineBearing] = await Promise.all([
                this.fetchTideData(stormglassData),
                this.fetchMarineData(stormglassData),
                this.fetchWeatherData(stormglassData),
                getCoastlineBearing(this.currentLocation.lat, this.currentLocation.lon)
            ]);

            // Hide loading
            hideLoading();

            // Combine data
            const combinedData = {
                location: this.currentLocation,
                date: this.currentDate,
                time: this.currentTime,
                tides: tides,
                marine: marine,
                weather: weather,
                coastlineBearing: coastlineBearing,
                rawStormglassData: stormglassData?.rawData || null
            };

            // Display results
            resultsDisplay.display(combinedData);

        } catch (error) {
            console.error('Search error:', error);
            showError(error.message || 'An error occurred while fetching conditions. Please try again.');
        } finally {
            hideLoading();
            this.searchButton.disabled = false;
        }
    }

    validateInputs() {
        // Check if location is selected
        if (!this.currentLocation) {
            showError('Please select a location from the search results');
            return false;
        }

        // Check if date is valid
        const date = datePicker.getSelectedDate();
        if (!date || !isValidDate(date)) {
            showError('Please select a valid date within the next 7 days');
            return false;
        }

        return true;
    }

    async fetchTideData(stormglassData) {
        try {
            // Always use WorldTides API for tide data
            console.log('Using WorldTides API for tide data');
            const tideData = await getTideData(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.currentDate
            );

            return tideData;
        } catch (error) {
            console.error('Tide data error:', error);

            // Check if it's a quota error
            if (error.message.includes('quota exceeded')) {
                throw new Error('Free API quota reached. The app will work again after some time, or register for a free WorldTides API key for unlimited use.');
            }

            throw new Error(`Failed to fetch tide data: ${error.message}`);
        }
    }

    async fetchMarineData(stormglassData) {
        try {
            // Use Stormglass marine data if available
            if (stormglassData && stormglassData.marine) {
                console.log('Using Stormglass marine data');
                return stormglassData.marine;
            }

            // Fallback to Open-Meteo (less accurate but always available)
            console.log('Using Open-Meteo marine data (fallback)');
            const marineData = await getMarineConditions(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.currentDate
            );

            marineData.source = 'open-meteo';
            return marineData;
        } catch (error) {
            console.error('Marine data error:', error);
            throw new Error(`Failed to fetch marine conditions: ${error.message}`);
        }
    }

    async fetchWeatherData(stormglassData) {
        try {
            // Use Stormglass weather data if available
            if (stormglassData && stormglassData.weather) {
                console.log('Using Stormglass weather data');
                return stormglassData.weather;
            }

            // Fallback to Open-Meteo Weather
            console.log('Using Open-Meteo weather data (fallback)');
            const weatherData = await getWeatherConditions(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.currentDate
            );

            return weatherData;
        } catch (error) {
            console.error('Weather data error:', error);
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }

    reset() {
        // Reset location search
        if (typeof locationSearch !== 'undefined') {
            locationSearch.reset();
        }

        // Reset date picker
        if (typeof datePicker !== 'undefined') {
            datePicker.reset();
        }

        // Hide results
        if (typeof resultsDisplay !== 'undefined') {
            resultsDisplay.hide();
        }

        // Clear errors
        clearError();

        // Reset current state
        this.currentLocation = null;
        this.currentDate = null;
        this.currentTime = null;
    }
}

// Initialize the app
const app = new KayakingConditionsApp();
