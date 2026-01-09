// Parking Map Controls

class ParkingMap {
    constructor(map, location) {
        this.map = map;
        this.location = location;
        this.publicParkingMarkers = [];
        this.customParkingMarkers = [];
        this.publicParkingVisible = false;
        this.customParkingVisible = false;
    }

    /**
     * Toggle public parking display
     */
    async togglePublicParking() {
        if (this.publicParkingVisible) {
            this.hidePublicParking();
        } else {
            await this.showPublicParking();
        }
    }

    /**
     * Toggle custom parking display
     */
    toggleCustomParking() {
        if (this.customParkingVisible) {
            this.hideCustomParking();
        } else {
            this.showCustomParking();
        }
    }

    /**
     * Show public parking from OpenStreetMap
     */
    async showPublicParking() {
        try {
            // Show loading state
            const btn = document.getElementById('public-parking-btn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Loading...';
            }

            const parking = await this.fetchPublicParking(
                this.location.lat,
                this.location.lon,
                2000 // 2km radius
            );

            // Clear existing markers
            this.hidePublicParking();

            // Add markers for each parking location
            parking.forEach(p => {
                const marker = L.marker([p.lat, p.lon], {
                    icon: L.divIcon({
                        className: 'parking-marker parking-marker-public',
                        html: '<div class="parking-marker-icon">🅿️</div>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                });

                const popupContent = `
                    <div class="parking-popup">
                        <strong>${p.name || 'Public Parking'}</strong><br>
                        ${p.type ? `<em>${p.type}</em><br>` : ''}
                        ${p.capacity ? `Capacity: ${p.capacity} spaces<br>` : ''}
                        ${p.fee ? `<span class="parking-fee">${p.fee}</span><br>` : ''}
                        <small>Distance: ${p.distance.toFixed(2)}km</small>
                    </div>
                `;

                marker.bindPopup(popupContent);
                marker.addTo(this.map);
                this.publicParkingMarkers.push(marker);
            });

            this.publicParkingVisible = true;

            // Update button
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🅿️ Hide Public Parking';
                btn.classList.add('active');
            }

            // Show info message
            if (parking.length === 0) {
                alert('No public parking found within 2km of this location.');
            }

        } catch (error) {
            console.error('Error fetching public parking:', error);
            alert('Failed to load public parking. Please try again.');

            const btn = document.getElementById('public-parking-btn');
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🅿️ Public Parking';
            }
        }
    }

    /**
     * Hide public parking markers
     */
    hidePublicParking() {
        this.publicParkingMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.publicParkingMarkers = [];
        this.publicParkingVisible = false;

        const btn = document.getElementById('public-parking-btn');
        if (btn) {
            btn.textContent = '🅿️ Public Parking';
            btn.classList.remove('active');
        }
    }

    /**
     * Show custom parking from database
     */
    showCustomParking() {
        // Clear existing markers
        this.hideCustomParking();

        // Find custom parking near location (5km radius)
        const parking = findCustomParkingNear(
            this.location.lat,
            this.location.lon,
            5 // 5km radius
        );

        if (parking.length === 0) {
            alert('No custom parking found within 5km. Add parking locations to js/data/parking.js');
            return;
        }

        // Add markers for each parking location
        parking.forEach(p => {
            const distance = calculateDistance(
                this.location.lat,
                this.location.lon,
                p.lat,
                p.lon
            );

            const marker = L.marker([p.lat, p.lon], {
                icon: L.divIcon({
                    className: 'parking-marker parking-marker-custom',
                    html: '<div class="parking-marker-icon">📍</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            });

            const popupContent = `
                <div class="parking-popup">
                    <strong>${p.name}</strong><br>
                    ${p.type ? `<em>${p.type}</em><br>` : ''}
                    ${p.description ? `${p.description}<br>` : ''}
                    <small>Distance: ${distance.toFixed(2)}km</small>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.addTo(this.map);
            this.customParkingMarkers.push(marker);
        });

        this.customParkingVisible = true;

        const btn = document.getElementById('custom-parking-btn');
        if (btn) {
            btn.textContent = '📍 Hide Custom Parking';
            btn.classList.add('active');
        }
    }

    /**
     * Hide custom parking markers
     */
    hideCustomParking() {
        this.customParkingMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.customParkingMarkers = [];
        this.customParkingVisible = false;

        const btn = document.getElementById('custom-parking-btn');
        if (btn) {
            btn.textContent = '📍 Custom Parking';
            btn.classList.remove('active');
        }
    }

    /**
     * Fetch public parking from OpenStreetMap Overpass API
     */
    async fetchPublicParking(lat, lon, radiusMeters = 2000) {
        const query = `
            [out:json][timeout:25];
            (
                node["amenity"="parking"](around:${radiusMeters},${lat},${lon});
                way["amenity"="parking"](around:${radiusMeters},${lat},${lon});
            );
            out body;
            >;
            out skel qt;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Process results
        const parking = [];

        data.elements.forEach(element => {
            if (element.type === 'node' && element.lat && element.lon) {
                parking.push({
                    lat: element.lat,
                    lon: element.lon,
                    name: element.tags?.name || 'Parking',
                    type: element.tags?.parking || 'surface',
                    capacity: element.tags?.capacity,
                    fee: element.tags?.fee === 'yes' ? 'Pay & Display' : element.tags?.fee === 'no' ? 'Free' : null,
                    distance: calculateDistance(lat, lon, element.lat, element.lon)
                });
            } else if (element.type === 'way' && element.center) {
                // For parking areas (ways), use the center point
                parking.push({
                    lat: element.center.lat,
                    lon: element.center.lon,
                    name: element.tags?.name || 'Parking Area',
                    type: element.tags?.parking || 'surface',
                    capacity: element.tags?.capacity,
                    fee: element.tags?.fee === 'yes' ? 'Pay & Display' : element.tags?.fee === 'no' ? 'Free' : null,
                    distance: calculateDistance(lat, lon, element.center.lat, element.center.lon)
                });
            }
        });

        // Sort by distance
        parking.sort((a, b) => a.distance - b.distance);

        return parking;
    }

    /**
     * Clear all parking markers
     */
    clearAll() {
        this.hidePublicParking();
        this.hideCustomParking();
    }
}
