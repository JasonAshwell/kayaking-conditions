// Results Display Handler

class ResultsDisplay {
    constructor() {
        this.resultsSection = document.getElementById('results-section');
        this.tideWidget = null;
        this.map = null;
    }

    /**
     * Display all conditions data
     * @param {Object} data - Combined data from all APIs
     */
    async display(data, preferredSource = null) {
        try {
            // Store current data for reprocessing
            this.currentDisplayData = data;

            // If preferred source is provided and data has raw Stormglass data, reprocess
            if (preferredSource && data.rawStormglassData) {
                console.log('Reprocessing with preferred source:', preferredSource);
                const reprocessed = reprocessStormglassData(data.rawStormglassData, preferredSource);
                if (reprocessed) {
                    data.marine = reprocessed.marine;
                    data.weather = reprocessed.weather;
                    console.log('Data reprocessed successfully');
                }
            }

            // Show results section
            showElement(this.resultsSection);

            // Display header
            this.displayHeader(data.location, data.date);

            // Display data sources
            this.displayDataSources(data);

            // Display map
            this.displayMap(data.location, data.marine, data.weather, data.date, data.time);

            // Display location details (description and images)
            this.displayLocationDetails(data.location);

            // Display tide information
            await this.displayTides(data.tides, data.date);

            // Display weather
            this.displayWeather(data.weather, data.coastlineBearing);

            // Display hourly weather
            this.displayHourlyWeather(data.weather, data.date, data.time, data.coastlineBearing);

            // Display hourly marine conditions
            this.displayMarineConditions(data.marine, data.date, data.time);

            // Display grade card
            this.displayGradeCard(data);

            // Scroll to results (unless we're just reprocessing data)
            if (!this.skipScroll) {
                this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (error) {
            console.error('Error displaying results:', error);
            showError('Error displaying results. Please try again.');
        }
    }

    displayHeader(location, date) {
        document.getElementById('results-location').textContent = location.name;
        document.getElementById('results-date').textContent = formatDate(date);
        document.getElementById('results-coords').textContent =
            `${location.lat.toFixed(4)}°N, ${Math.abs(location.lon).toFixed(4)}°${location.lon >= 0 ? 'E' : 'W'}`;
    }

    displayDataSources(data) {
        // Get the data sources
        const tideSource = data.tides.source || 'worldtides';
        const marineSource = data.marine.source || 'open-meteo';
        const weatherSource = data.weather.source || 'open-meteo';

        // Create source name mappings
        const sourceNames = {
            'stormglass': 'Stormglass',
            'worldtides': 'WorldTides',
            'open-meteo': 'Open-Meteo'
        };

        // Check if Stormglass is being used
        const isStormglass = marineSource === 'stormglass' || weatherSource === 'stormglass';

        let stormglassSourceSelector = '';
        if (isStormglass) {
            const currentSource = localStorage.getItem('stormglassPreferredSource') || 'sg';
            stormglassSourceSelector = `
                <div class="data-source-item">
                    <strong>Stormglass Source:</strong>
                    <select id="stormglass-source-selector" class="source-selector">
                        <option value="sg" ${currentSource === 'sg' ? 'selected' : ''}>SG (Recommended)</option>
                        <option value="noaa" ${currentSource === 'noaa' ? 'selected' : ''}>NOAA</option>
                        <option value="meto" ${currentSource === 'meto' ? 'selected' : ''}>MetOffice</option>
                        <option value="smhi" ${currentSource === 'smhi' ? 'selected' : ''}>SMHI</option>
                        <option value="fcoo" ${currentSource === 'fcoo' ? 'selected' : ''}>FCOO</option>
                    </select>
                </div>
            `;
        }

        const dataSourcesDiv = document.getElementById('data-sources');
        dataSourcesDiv.innerHTML = `
            <h4>Data Sources:</h4>
            <div class="data-source-item">
                <strong>Tides:</strong> <span class="data-source-badge ${tideSource}">${sourceNames[tideSource]}</span>
            </div>
            <div class="data-source-item">
                <strong>Marine:</strong> <span class="data-source-badge ${marineSource}">${sourceNames[marineSource]}</span>
            </div>
            <div class="data-source-item">
                <strong>Weather:</strong> <span class="data-source-badge ${weatherSource}">${sourceNames[weatherSource]}</span>
            </div>
            ${stormglassSourceSelector}
        `;

        // Add event listener for source selector if present
        if (isStormglass) {
            const selector = document.getElementById('stormglass-source-selector');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    this.handleSourceChange(e.target.value);
                });
            }
        }
    }

    async handleSourceChange(newSource) {
        // Store the preference
        localStorage.setItem('stormglassPreferredSource', newSource);

        // Re-process and re-display data with new source
        if (this.currentDisplayData) {
            console.log('Source changed to:', newSource);
            console.log('Has raw Stormglass data:', !!this.currentDisplayData.rawStormglassData);

            if (!this.currentDisplayData.rawStormglassData) {
                console.error('No raw Stormglass data available for reprocessing');
                showError('Unable to change source - raw data not available. Please search again.');
                return;
            }

            // Set flag to prevent scroll on re-render
            this.skipScroll = true;

            await this.display(this.currentDisplayData, newSource);

            // Reset flag
            this.skipScroll = false;

            console.log('Display updated with new source');
        }
    }

    displayMap(location, marineData, weatherData, date, time) {
        const mapElement = document.getElementById('location-map');

        // Initialize map if not already done
        if (!this.map) {
            this.map = L.map('location-map').setView([location.lat, location.lon], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);
        } else {
            // Update existing map
            this.map.setView([location.lat, location.lon], 12);
        }

        // Clear existing markers and controls
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker || layer instanceof L.Circle) {
                this.map.removeLayer(layer);
            }
        });

        // Remove existing direction control if present
        if (this.directionControl) {
            this.map.removeControl(this.directionControl);
        }

        // Add location marker with simple popup
        const marker = L.marker([location.lat, location.lon]).addTo(this.map);
        marker.bindPopup(`<div style="text-align: center; font-weight: bold;">${location.name}</div>`).openPopup();

        // Create start datetime from date and time
        const startDateTime = new Date(`${date}T${time}`);

        // Get hourly data
        const weatherHourly = weatherData.hourlyData;
        const marineHourly = marineData.hourlyData;

        // Find the starting index for the selected time
        let startIndex = 0;
        for (let i = 0; i < weatherHourly.time.length; i++) {
            const hourTime = new Date(weatherHourly.time[i]);
            if (hourTime >= startDateTime) {
                startIndex = i;
                break;
            }
        }

        // Create custom control for direction arrows table
        const DirectionControl = L.Control.extend({
            options: {
                position: 'bottomleft'
            },

            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'map-direction-control');

                let content = '<table class="direction-table"><thead><tr><th class="col-time">Time</th><th class="col-wind">Wind</th><th class="col-waves">Waves</th><th class="col-current">Current</th></tr></thead><tbody>';

                // Show 6 hours
                const hoursToShow = Math.min(6, weatherHourly.time.length - startIndex);

                for (let i = 0; i < hoursToShow; i++) {
                    const index = startIndex + i;
                    const timeValue = weatherHourly.time[index];

                    // Get wind direction
                    const windDirection = weatherHourly.winddirection_10m[index];

                    // Get wave direction
                    const waveDirection = marineHourly.wave_direction[index];

                    // Get current direction
                    const currentDirection = marineHourly.ocean_current_direction[index];

                    content += `<tr>
                        <td class="time-cell col-time">${formatTime(timeValue)}</td>
                        <td class="col-wind"><div class="map-arrow" style="transform: rotate(${windDirection + 180}deg);">⬆</div></td>
                        <td class="col-waves"><div class="map-arrow" style="transform: rotate(${waveDirection !== null ? waveDirection + 180 : 0}deg);">${waveDirection !== null ? '⬆' : '-'}</div></td>
                        <td class="col-current"><div class="map-arrow" style="transform: rotate(${currentDirection !== null ? currentDirection + 180 : 0}deg);">${currentDirection !== null ? '⬆' : '-'}</div></td>
                    </tr>`;
                }

                content += '</tbody></table>';
                container.innerHTML = content;

                // Prevent map interactions on the control
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);

                return container;
            }
        });

        // Add the control to the map
        this.directionControl = new DirectionControl();
        this.map.addControl(this.directionControl);

        // Setup webcam button
        this.setupWebcamButton(location);

        // Setup routes button
        this.setupRoutesButton(location);

        // Setup parking controls
        this.setupParkingControls(location);
    }

    setupWebcamButton(location) {
        const webcamBtn = document.getElementById('webcam-btn');

        // Find nearby webcams
        const nearbyWebcams = findNearbyWebcams(location.lat, location.lon, 50);

        if (nearbyWebcams.length > 0) {
            // Show button with count
            webcamBtn.textContent = '';
            webcamBtn.innerHTML = `
                <span class="webcam-btn-icon">📹</span>
                View Webcams (${nearbyWebcams.length})
            `;
            webcamBtn.style.display = 'inline-flex';

            // Remove old event listeners by cloning the button
            const newBtn = webcamBtn.cloneNode(true);
            webcamBtn.parentNode.replaceChild(newBtn, webcamBtn);

            // Add click event
            newBtn.addEventListener('click', () => {
                if (typeof webcamViewer !== 'undefined') {
                    webcamViewer.show(location.lat, location.lon, location.name);
                }
            });
        } else {
            // No webcams nearby - still show button but with different text
            webcamBtn.textContent = '';
            webcamBtn.innerHTML = `
                <span class="webcam-btn-icon">📹</span>
                No Webcams Nearby
            `;
            webcamBtn.style.display = 'inline-flex';
            webcamBtn.style.opacity = '0.6';
            webcamBtn.style.cursor = 'default';

            // Remove old event listeners
            const newBtn = webcamBtn.cloneNode(true);
            webcamBtn.parentNode.replaceChild(newBtn, webcamBtn);

            // Add click event to show "how to add" message
            newBtn.addEventListener('click', () => {
                if (typeof webcamViewer !== 'undefined') {
                    webcamViewer.show(location.lat, location.lon, location.name);
                }
            });
        }
    }

    setupRoutesButton(location) {
        const routesBtn = document.getElementById('routes-btn');

        // Find nearby routes
        const nearbyRoutes = findRoutesNear(location.lat, location.lon, 10);

        if (nearbyRoutes.length > 0) {
            // Show button with count
            routesBtn.textContent = '';
            routesBtn.innerHTML = `
                <span class="routes-btn-icon">🗺️</span>
                View Routes (${nearbyRoutes.length})
            `;
            routesBtn.style.display = 'inline-flex';

            // Remove old event listeners by cloning the button
            const newBtn = routesBtn.cloneNode(true);
            routesBtn.parentNode.replaceChild(newBtn, routesBtn);

            // Add click event
            newBtn.addEventListener('click', () => {
                if (typeof routesViewer !== 'undefined') {
                    routesViewer.open(location);
                }
            });
        } else {
            // No routes nearby - still show button but with different text
            routesBtn.textContent = '';
            routesBtn.innerHTML = `
                <span class="routes-btn-icon">🗺️</span>
                No Routes Nearby
            `;
            routesBtn.style.display = 'inline-flex';
            routesBtn.style.opacity = '0.6';
            routesBtn.style.cursor = 'default';

            // Remove old event listeners
            const newBtn = routesBtn.cloneNode(true);
            routesBtn.parentNode.replaceChild(newBtn, routesBtn);

            // Add click event to show empty state
            newBtn.addEventListener('click', () => {
                if (typeof routesViewer !== 'undefined') {
                    routesViewer.open(location);
                }
            });
        }
    }

    setupParkingControls(location) {
        // Clear any existing parking map instance
        if (this.parkingMap) {
            this.parkingMap.clearAll();
        }

        // Create new parking map instance
        this.parkingMap = new ParkingMap(this.map, location);

        // Setup public parking button
        const publicParkingBtn = document.getElementById('public-parking-btn');
        if (publicParkingBtn) {
            // Remove old event listeners
            const newPublicBtn = publicParkingBtn.cloneNode(true);
            publicParkingBtn.parentNode.replaceChild(newPublicBtn, publicParkingBtn);

            newPublicBtn.addEventListener('click', () => {
                this.parkingMap.togglePublicParking();
            });
        }

        // Setup custom parking button
        const customParkingBtn = document.getElementById('custom-parking-btn');
        if (customParkingBtn) {
            // Remove old event listeners
            const newCustomBtn = customParkingBtn.cloneNode(true);
            customParkingBtn.parentNode.replaceChild(newCustomBtn, customParkingBtn);

            newCustomBtn.addEventListener('click', () => {
                this.parkingMap.toggleCustomParking();
            });
        }
    }

    displayLocationDetails(location) {
        // Check if this is a saved location with additional details
        const savedLocation = typeof findSavedLocation !== 'undefined'
            ? findSavedLocation(location.name)
            : null;

        console.log('Location name:', location.name);
        console.log('Saved location found:', savedLocation);
        console.log('Images:', savedLocation?.images);

        const descriptionDiv = document.getElementById('paddling-description');
        const imagesDiv = document.getElementById('location-images-gallery');

        if (savedLocation && savedLocation.paddlingDescription) {
            // Display paddling description
            descriptionDiv.innerHTML = `
                <h4>Paddling Information</h4>
                <p>${savedLocation.paddlingDescription}</p>
            `;
            descriptionDiv.style.display = 'block';
        } else {
            descriptionDiv.style.display = 'none';
        }

        if (savedLocation && savedLocation.images && savedLocation.images.length > 0) {
            // Display image gallery
            let galleryHTML = '<div class="image-gallery">';

            savedLocation.images.forEach((imagePath, index) => {
                galleryHTML += `
                    <div class="gallery-item">
                        <img
                            src="${imagePath}"
                            alt="${location.name} - Image ${index + 1}"
                            class="gallery-image"
                            onclick="openImageModal('${imagePath}', '${location.name}')"
                            onerror="this.parentElement.style.display='none';"
                        />
                    </div>
                `;
            });

            galleryHTML += '</div>';
            imagesDiv.innerHTML = galleryHTML;
            imagesDiv.style.display = 'block';
        } else {
            imagesDiv.style.display = 'none';
        }
    }

    async displayTides(tideData, date) {
        // Initialize tide widget if not already done
        if (!this.tideWidget) {
            this.tideWidget = new TideWidget('tide-canvas');
        }

        // Render tide visualization
        this.tideWidget.render(tideData, date);

        // Display tide times table
        const tableBody = document.getElementById('tide-table-body');
        tableBody.innerHTML = '';

        const allTides = [...tideData.highTides, ...tideData.lowTides].sort((a, b) =>
            new Date(a.DateTime) - new Date(b.DateTime)
        );

        allTides.forEach(tide => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatTime(tide.DateTime)}</td>
                <td>${tide.EventType === 'HighWater' ? 'High' : 'Low'}</td>
                <td>${tide.Height.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        // Calculate moon phase and spring/neap
        const moonInfo = this.calculateMoonPhase(date);
        const tidalType = this.calculateTidalType(tideData.tidalRange);

        // Display tidal range with moon phase
        const tidalRangeEl = document.getElementById('tidal-range');
        tidalRangeEl.innerHTML = `
            <strong>Tidal Range:</strong> ${tideData.tidalRange}m
            <br>
            <strong>Tidal Type:</strong> ${tidalType.icon} ${tidalType.name}
            <br>
            <strong>Moon Phase:</strong> ${moonInfo.icon} ${moonInfo.name}
            <br>
            <strong>Station:</strong> ${tideData.station.name}
            ${tideData.station.distance ? `(${tideData.station.distance}km away)` : ''}
        `;
    }

    calculateMoonPhase(dateStr) {
        const date = new Date(dateStr);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        const day = date.getDate();

        // Simplified moon phase calculation
        let c, e, jd, b;

        if (month < 3) {
            year--;
            month += 12;
        }

        c = 365.25 * year;
        e = 30.6 * month;
        jd = c + e + day - 694039.09;
        jd /= 29.5305882;
        b = parseInt(jd);
        jd -= b;
        b = Math.round(jd * 8);

        if (b >= 8) b = 0;

        const phases = [
            { name: 'New Moon', icon: '🌑' },
            { name: 'Waxing Crescent', icon: '🌒' },
            { name: 'First Quarter', icon: '🌓' },
            { name: 'Waxing Gibbous', icon: '🌔' },
            { name: 'Full Moon', icon: '🌕' },
            { name: 'Waning Gibbous', icon: '🌖' },
            { name: 'Last Quarter', icon: '🌗' },
            { name: 'Waning Crescent', icon: '🌘' }
        ];

        return phases[b];
    }

    calculateTidalType(tidalRange) {
        // Spring tides have larger range, neap tides have smaller range
        // Typical UK coast: Spring > 4m, Neap < 3m
        if (tidalRange > 4.0) {
            return { name: 'Spring Tides', icon: '🌊' };
        } else if (tidalRange < 3.0) {
            return { name: 'Neap Tides', icon: '〰️' };
        } else {
            return { name: 'Mid Tides', icon: '🌊' };
        }
    }

    displayWeather(weatherData, coastlineBearing) {
        // Wind - weatherData.windSpeed.avg is in m/s from Open-Meteo
        const windSpeedMps = weatherData.windSpeed.avg;
        const windKnots = mpsToKnots(windSpeedMps);
        const windMph = mpsToMph(windSpeedMps);
        const windDirection = weatherData.windDirection.avg;
        const beaufort = getBeaufortScale(windKnots);

        // Determine onshore/offshore
        let shoreDirection = '';
        if (coastlineBearing !== null) {
            const direction = getWindShoreDirection(windDirection, coastlineBearing);
            if (direction === 'onshore') {
                shoreDirection = '<div style="color: #f59e0b; font-weight: bold;">⚠ Onshore</div>';
            } else if (direction === 'offshore') {
                shoreDirection = '<div style="color: #dc3545; font-weight: bold;">⚠ Offshore</div>';
            } else {
                shoreDirection = '<div style="color: #6c757d;">Along Shore</div>';
            }
        }

        // Display wind with all measurements on separate lines
        document.getElementById('wind-speed').innerHTML = `
            <div style="font-size: 0.85em; line-height: 1.4;">
                <div>${windMph} mph</div>
                <div>${windKnots} kn</div>
                <div><strong>F${beaufort.force}</strong> ${beaufort.description}</div>
                ${shoreDirection}
            </div>
        `;

        // Create wind direction arrow
        const windArrow = document.getElementById('wind-direction');
        windArrow.style.transform = `rotate(${windDirection + 180}deg)`;
        windArrow.innerHTML = '⬆';
        windArrow.title = `${degreesToCompass(windDirection)}`;

        // Temperature
        document.getElementById('temperature').textContent = `${weatherData.temperature.avg}°C`;

        // Precipitation
        document.getElementById('precipitation').textContent = `${Math.round(weatherData.precipitation.probability)}%`;

        // Visibility
        const visibilityKm = (weatherData.visibility.avg / 1000).toFixed(1);
        document.getElementById('visibility').textContent = `${visibilityKm} km`;
    }

    displayHourlyWeather(weatherData, date, time, coastlineBearing) {
        const container = document.getElementById('hourly-weather');
        container.innerHTML = '';

        // Add source indicator if using Stormglass
        if (weatherData.source === 'stormglass') {
            const preferredSource = localStorage.getItem('stormglassPreferredSource') || 'sg';
            const sourceNames = {
                'sg': 'Stormglass',
                'noaa': 'NOAA',
                'meto': 'MetOffice',
                'smhi': 'SMHI',
                'fcoo': 'FCOO'
            };
            const sourceIndicator = document.createElement('div');
            sourceIndicator.style.cssText = 'font-size: 0.85em; color: #6c757d; margin-bottom: 10px; font-style: italic;';
            sourceIndicator.textContent = `Using ${sourceNames[preferredSource]} data`;
            container.appendChild(sourceIndicator);
        }

        const hourlyData = weatherData.hourlyData;

        // Create start datetime from date and time
        const startDateTime = new Date(`${date}T${time}`);

        // Find the starting index for the selected time
        let startIndex = 0;
        for (let i = 0; i < hourlyData.time.length; i++) {
            const hourTime = new Date(hourlyData.time[i]);
            if (hourTime >= startDateTime) {
                startIndex = i;
                break;
            }
        }

        // Display next 12 hours from start time
        const hoursToShow = Math.min(12, hourlyData.time.length - startIndex);

        for (let i = 0; i < hoursToShow; i++) {
            const index = startIndex + i;
            const timeValue = hourlyData.time[index];
            const temp = hourlyData.temperature_2m[index];
            const feelsLike = hourlyData.apparent_temperature ? hourlyData.apparent_temperature[index] : temp;
            const windSpeed = hourlyData.windspeed_10m[index]; // m/s
            const windGust = hourlyData.windgusts_10m ? hourlyData.windgusts_10m[index] : windSpeed;
            const windDirection = hourlyData.winddirection_10m[index];
            const precipProb = hourlyData.precipitation_probability ? hourlyData.precipitation_probability[index] : 0;
            const weatherCode = hourlyData.weather_code ? hourlyData.weather_code[index] : 0;
            const isDay = isDaytime(timeValue);

            const weather = getWeatherIcon(weatherCode, isDay);

            // Convert wind speeds
            const windKnots = mpsToKnots(windSpeed);
            const windMph = mpsToMph(windSpeed);
            const windBeaufort = getBeaufortScale(windKnots);

            const gustKnots = mpsToKnots(windGust);
            const gustMph = mpsToMph(windGust);
            const gustBeaufort = getBeaufortScale(gustKnots);

            // Determine onshore/offshore
            let shoreDirection = '';
            if (coastlineBearing !== null) {
                const direction = getWindShoreDirection(windDirection, coastlineBearing);
                if (direction === 'onshore') {
                    shoreDirection = '<div style="color: #f59e0b; font-weight: bold; font-size: 0.85em;">⚠ Onshore</div>';
                } else if (direction === 'offshore') {
                    shoreDirection = '<div style="color: #dc3545; font-weight: bold; font-size: 0.85em;">⚠ Offshore</div>';
                } else {
                    shoreDirection = '<div style="color: #6c757d; font-size: 0.85em;">Along Shore</div>';
                }
            }

            const hourCard = document.createElement('div');
            hourCard.className = 'hour-card-detailed';
            hourCard.innerHTML = `
                <div class="hour-header">
                    <div class="hour-time-large">${formatHour(timeValue)}</div>
                    <div class="hour-icon-large" title="${weather.desc}">${weather.icon}</div>
                </div>
                <div class="hour-temps">
                    <div><strong>Temp:</strong> ${temp.toFixed(0)}°C</div>
                    <div><strong>Feels like:</strong> ${feelsLike.toFixed(0)}°C</div>
                </div>
                <div class="hour-wind-info">
                    <div class="wind-row">
                        <strong>Wind:</strong> ${windMph} mph / ${windKnots} kn
                    </div>
                    <div class="wind-row">
                        <strong>F${windBeaufort.force}</strong> ${windBeaufort.description}
                    </div>
                    <div class="wind-direction-row">
                        ${degreesToCompass(windDirection)}
                        <span class="wind-arrow-inline" style="transform: rotate(${windDirection + 180}deg);">⬆</span>
                    </div>
                    ${shoreDirection}
                </div>
                <div class="hour-gust-info">
                    <div class="gust-row">
                        <strong>Gusts:</strong> ${gustMph} mph / ${gustKnots} kn
                    </div>
                    <div class="gust-row">
                        <strong>F${gustBeaufort.force}</strong> ${gustBeaufort.description}
                    </div>
                </div>
                <div class="hour-precip">
                    <strong>Rain/Snow:</strong> ${Math.round(precipProb)}%
                </div>
            `;

            container.appendChild(hourCard);
        }
    }

    displayMarineConditions(marineData, date, time) {
        const tableBody = document.getElementById('marine-table-body');
        tableBody.innerHTML = '';

        // Add source indicator if using Stormglass
        const tableContainer = document.querySelector('#marine-table').parentElement;

        // Remove any existing source indicator
        const existingIndicator = tableContainer.querySelector('.marine-source-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        if (marineData.source === 'stormglass') {
            const preferredSource = localStorage.getItem('stormglassPreferredSource') || 'sg';
            const sourceNames = {
                'sg': 'Stormglass',
                'noaa': 'NOAA',
                'meto': 'MetOffice',
                'smhi': 'SMHI',
                'fcoo': 'FCOO'
            };
            const sourceIndicator = document.createElement('div');
            sourceIndicator.className = 'marine-source-indicator';
            sourceIndicator.style.cssText = 'font-size: 0.85em; color: #6c757d; margin-bottom: 10px; font-style: italic;';
            sourceIndicator.textContent = `Using ${sourceNames[preferredSource]} data`;
            tableContainer.insertBefore(sourceIndicator, tableContainer.firstChild);
        }

        const hourlyData = marineData.hourlyData;

        // Create start datetime from date and time
        const startDateTime = new Date(`${date}T${time}`);

        // Find the starting index for the selected time
        let startIndex = 0;
        for (let i = 0; i < hourlyData.time.length; i++) {
            const hourTime = new Date(hourlyData.time[i]);
            if (hourTime >= startDateTime) {
                startIndex = i;
                break;
            }
        }

        // Display 24 hours of data from start time
        const hoursToShow = Math.min(24, hourlyData.time.length - startIndex);

        for (let i = 0; i < hoursToShow; i++) {
            const index = startIndex + i;
            const timeValue = hourlyData.time[index];
            const waveHeight = hourlyData.wave_height[index];
            const waveDirection = hourlyData.wave_direction[index];
            const wavePeriod = hourlyData.wave_period[index];
            const swellHeight = hourlyData.swell_wave_height[index];
            const currentVelocity = hourlyData.ocean_current_velocity[index];
            const currentDirection = hourlyData.ocean_current_direction[index];

            // Get sea temperature from hourly data (available from both Stormglass and Open-Meteo fallback)
            const seaTemp = hourlyData.sea_surface_temperature ? hourlyData.sea_surface_temperature[index] : null;

            // Build wave direction cell with arrow
            const waveDirCell = waveDirection !== null
                ? `<div class="table-direction">
                    <span>${degreesToCompass(waveDirection)}</span>
                    <span class="table-direction-arrow" style="transform: rotate(${waveDirection + 180}deg);">⬆</span>
                   </div>`
                : 'N/A';

            // Build current direction cell with arrow
            const currentDirCell = currentDirection !== null
                ? `<div class="table-direction">
                    <span>${degreesToCompass(currentDirection)}</span>
                    <span class="table-direction-arrow" style="transform: rotate(${currentDirection + 180}deg);">⬆</span>
                   </div>`
                : 'N/A';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatTime(timeValue)}</td>
                <td>${waveHeight ? waveHeight.toFixed(1) + 'm' : 'N/A'}</td>
                <td>${waveDirCell}</td>
                <td>${wavePeriod ? wavePeriod.toFixed(0) + 's' : 'N/A'}</td>
                <td>${swellHeight ? swellHeight.toFixed(1) + 'm' : 'N/A'}</td>
                <td>${currentVelocity ? (currentVelocity * 1.94384).toFixed(1) + ' kn' : 'N/A'}</td>
                <td>${currentDirCell}</td>
                <td>${seaTemp ? seaTemp.toFixed(1) + '°C' : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        }
    }

    displayGradeCard(data) {
        // Get data for calculations
        // Ensure we're using the selected date and time, not today's date
        const startDateTime = new Date(`${data.date}T${data.time}:00`);
        const weatherHourly = data.weather.hourlyData;
        const marineHourly = data.marine.hourlyData;

        console.log('Grade card using date:', data.date, 'time:', data.time);
        console.log('Start datetime for grading:', startDateTime.toISOString());

        // Find starting index
        let startIndex = 0;
        for (let i = 0; i < weatherHourly.time.length; i++) {
            const hourTime = new Date(weatherHourly.time[i]);
            if (hourTime >= startDateTime) {
                startIndex = i;
                console.log('Found start index:', startIndex, 'at time:', weatherHourly.time[i]);
                break;
            }
        }

        // Get max/min values for next 6 hours
        const hoursToCheck = Math.min(6, weatherHourly.time.length - startIndex);
        let maxWindSpeedMps = 0;
        let maxWindGustMps = 0;
        let minSeaTemp = null;
        let maxWaveHeight = 0;
        let maxWavePeriod = 0;

        for (let i = 0; i < hoursToCheck; i++) {
            const index = startIndex + i;

            // Wind speed and gust
            const windSpeed = weatherHourly.windspeed_10m[index];
            const windGust = weatherHourly.windgusts_10m[index];
            if (windSpeed > maxWindSpeedMps) maxWindSpeedMps = windSpeed;
            if (windGust > maxWindGustMps) maxWindGustMps = windGust;

            // Sea temperature (minimum = coldest = worst)
            if (marineHourly.sea_surface_temperature && marineHourly.sea_surface_temperature[index] !== null) {
                const temp = marineHourly.sea_surface_temperature[index];
                if (minSeaTemp === null || temp < minSeaTemp) {
                    minSeaTemp = temp;
                }
            }

            // Wave height (maximum)
            if (marineHourly.wave_height && marineHourly.wave_height[index] !== null) {
                const wave = marineHourly.wave_height[index];
                if (wave > maxWaveHeight) maxWaveHeight = wave;
            }

            // Wave period (maximum)
            if (marineHourly.wave_period && marineHourly.wave_period[index] !== null) {
                const period = marineHourly.wave_period[index];
                if (period > maxWavePeriod) maxWavePeriod = period;
            }
        }

        const maxWindKnots = parseFloat(mpsToKnots(maxWindSpeedMps));
        const maxGustKnots = parseFloat(mpsToKnots(maxWindGustMps));

        // Use calculated values, with fallback to average data
        let seaTemp = minSeaTemp;

        // Fallback to average sea temperature if hourly data not available
        if (seaTemp === null && data.marine.seaTemperature) {
            seaTemp = parseFloat(data.marine.seaTemperature.min || data.marine.seaTemperature.avg);
        }

        const waveHeight = maxWaveHeight;
        const wavePeriod = maxWavePeriod;

        // Calculate points for each factor
        const grades = [];
        let totalPoints = 0;

        // Water Temperature (minimum = coldest) - Always display
        if (seaTemp !== null) {
            const points = CONFIG.GRADING.waterTemp.calculatePoints(seaTemp);
            const color = CONFIG.GRADING.waterTemp.getColor(seaTemp);
            grades.push({
                name: 'Water Temperature',
                value: `${seaTemp.toFixed(1)}°C`,
                points: points,
                color: color
            });
            totalPoints += points;
        } else {
            // Show N/A if no data available
            grades.push({
                name: 'Water Temperature',
                value: 'N/A',
                points: 0,
                color: 'amber'
            });
        }

        // Wind Speed (maximum)
        const windPoints = CONFIG.GRADING.windSpeed.calculatePoints(maxWindKnots);
        const windColor = CONFIG.GRADING.windSpeed.getColor(maxWindKnots);
        grades.push({
            name: 'Wind Speed',
            value: `${maxWindKnots.toFixed(1)} kn`,
            points: windPoints,
            color: windColor
        });
        totalPoints += windPoints;

        // Wind Gust (maximum)
        const gustPoints = CONFIG.GRADING.windGust.calculatePoints(maxGustKnots, maxWindKnots);
        const gustColor = CONFIG.GRADING.windGust.getColor(maxGustKnots);
        grades.push({
            name: 'Wind Gust',
            value: `${maxGustKnots.toFixed(1)} kn`,
            points: gustPoints,
            color: gustColor
        });
        totalPoints += gustPoints;

        // Wave Height (maximum)
        const wavePoints = CONFIG.GRADING.waveHeight.calculatePoints(waveHeight);
        const waveColor = CONFIG.GRADING.waveHeight.getColor(waveHeight);
        grades.push({
            name: 'Wave Height',
            value: `${waveHeight.toFixed(1)}m`,
            points: wavePoints,
            color: waveColor
        });
        totalPoints += wavePoints;

        // Wave Period (maximum)
        const periodPoints = CONFIG.GRADING.wavePeriod.calculatePoints(wavePeriod);
        const periodColor = CONFIG.GRADING.wavePeriod.getColor(wavePeriod);
        grades.push({
            name: 'Wave Period',
            value: `${wavePeriod.toFixed(0)}s`,
            points: periodPoints,
            color: periodColor
        });
        totalPoints += periodPoints;

        // Display grade table
        const tableBody = document.getElementById('grade-table-body');
        tableBody.innerHTML = '';

        grades.forEach(grade => {
            const row = document.createElement('tr');
            row.className = `grade-row-${grade.color}`;
            row.innerHTML = `
                <td><strong>${grade.name}</strong></td>
                <td>${grade.value}</td>
            `;
            tableBody.appendChild(row);
        });

        // Store data for later use when checkboxes change
        this.currentGradeData = {
            basePoints: totalPoints,
            grades: grades,
            data: data
        };

        // Update total score (will be updated when checkboxes change)
        this.updateGradeTotal(totalPoints);

        // Set up checkbox event listeners
        this.setupGradeCheckboxes();

        // Generate AI assessment
        this.generateGradeAssessment();
    }

    updateGradeTotal(basePoints) {
        // Calculate additional points from checkboxes
        let additionalPoints = 0;
        document.querySelectorAll('.grade-checkbox:checked').forEach(checkbox => {
            additionalPoints += parseInt(checkbox.dataset.points);
        });

        const totalScore = basePoints + additionalPoints;
        const gradeScore = (totalScore / 20).toFixed(1);
        document.getElementById('grade-total-score').innerHTML = `<strong>${gradeScore}</strong>`;

        return totalScore;
    }

    setupGradeCheckboxes() {
        const checkboxes = document.querySelectorAll('.grade-checkbox');
        checkboxes.forEach(checkbox => {
            // Remove existing listeners
            checkbox.replaceWith(checkbox.cloneNode(true));
        });

        // Add new listeners
        document.querySelectorAll('.grade-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Update total score
                this.updateGradeTotal(this.currentGradeData.basePoints);
                // Regenerate assessment with updated activities
                this.generateGradeAssessment();
            });
        });
    }

    generateGradeAssessment() {
        if (!this.currentGradeData) return;

        const { basePoints, grades, data } = this.currentGradeData;

        // Calculate current total including activities
        const totalPoints = this.updateGradeTotal(basePoints);

        // Generate assessment based on total score and conditions
        const gradeScore = (totalPoints / 20).toFixed(1); // Keep decimal for display
        const roundedScore = Math.max(1, Math.round(totalPoints / 20)); // Round for category, minimum 1

        let assessmentText = '';
        let riskLevel = '';
        let riskDescription = '';

        if (roundedScore === 1) {
            riskLevel = '1 - Easy';
            riskDescription = 'Little Danger';
            assessmentText = `Excellent conditions for sea kayaking. ${riskDescription}. `;
        } else if (roundedScore === 2) {
            riskLevel = '2 - Moderate';
            riskDescription = 'Small Sea, very easy terrain';
            assessmentText = `Moderate conditions for sea kayaking. ${riskDescription}. `;
        } else if (roundedScore === 3) {
            riskLevel = '3 - Intermediate';
            riskDescription = 'Regular seas, easy landing areas';
            assessmentText = `Intermediate conditions for sea kayaking. ${riskDescription}. `;
        } else if (roundedScore === 4) {
            riskLevel = '4 - Advanced';
            riskDescription = 'Confused Seas, difficult landing areas';
            assessmentText = `Challenging conditions for sea kayaking. ${riskDescription}. Only suitable for experienced kayakers with proper skills and equipment. `;
        } else if (roundedScore === 5) {
            riskLevel = '5 - Extreme';
            riskDescription = 'Heavy Water, very confused sea';
            assessmentText = `Extreme conditions for sea kayaking. ${riskDescription}. Only expert paddlers should consider venturing out. `;
        } else {
            riskLevel = '6 - Very Extreme';
            riskDescription = 'V heavy water, completely unpredictable';
            assessmentText = `Very dangerous conditions for sea kayaking. ${riskDescription}. Conditions are severe and not recommended. `;
        }

        // Add the actual decimal score to the assessment
        assessmentText = `Risk Score: ${gradeScore}. ` + assessmentText;

        // Add specific concerns
        const concerns = [];
        grades.forEach(grade => {
            if (grade.color === 'red') {
                concerns.push(grade.name.toLowerCase());
            }
        });

        if (concerns.length > 0) {
            assessmentText += `<strong>Key concerns:</strong> ${concerns.join(', ')}. `;
        }

        // Check for selected activities
        const selectedActivities = [];
        let activityPoints = 0;

        if (document.getElementById('grade-rockhopping').checked) {
            selectedActivities.push('rockhopping');
            activityPoints += 20;
        }
        if (document.getElementById('grade-sea-caves').checked) {
            selectedActivities.push('sea caves');
            activityPoints += 20;
        }
        if (document.getElementById('grade-surfing').checked) {
            selectedActivities.push('surfing');
            activityPoints += 20;
        }
        if (document.getElementById('grade-night-time').checked) {
            selectedActivities.push('night time');
            activityPoints += 20;
        }

        if (selectedActivities.length > 0) {
            const activityGrade = (activityPoints / 20).toFixed(1);
            assessmentText += `<br><br><strong>Selected Activities:</strong> You have selected ${selectedActivities.join(', ')} which adds ${activityGrade} risk to your score. `;

            if (activityPoints >= 40) {
                assessmentText += `These activities significantly increase risk and require advanced skills, proper equipment, and thorough knowledge of the area. `;
            } else if (activityPoints >= 20) {
                assessmentText += `This activity increases risk and requires good judgment, experience, and proper safety precautions. `;
            }

            // Add activity-specific warnings
            if (selectedActivities.includes('rockhopping')) {
                assessmentText += `Rockhopping demands precise maneuvering near rocks with hazards from waves, surge, and submerged obstacles. `;
            }
            if (selectedActivities.includes('sea caves')) {
                assessmentText += `Sea caves require careful assessment of swell, tide levels, and exit routes - never enter alone. `;
            }
            if (selectedActivities.includes('surfing')) {
                assessmentText += `Surf zone kayaking demands strong bracing skills, roll ability, and understanding of wave dynamics. `;
            }
            if (selectedActivities.includes('night time')) {
                assessmentText += `Night kayaking requires navigation lights, headlamp, reflective gear, and excellent knowledge of the area - disorientation and limited visibility create serious hazards. `;
            }
        }

        // Display assessment
        const assessmentDiv = document.getElementById('grade-assessment');
        assessmentDiv.innerHTML = `
            <h4>${riskLevel}</h4>
            <p>${assessmentText}</p>
        `;
    }

    hide() {
        hideElement(this.resultsSection);
    }

    clear() {
        this.hide();
    }
}

// Initialize results display
let resultsDisplay;
document.addEventListener('DOMContentLoaded', () => {
    resultsDisplay = new ResultsDisplay();
});
