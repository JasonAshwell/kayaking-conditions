// Custom Parking Database
// Add your known parking locations here for quick access
// Format: { name, lat, lon, description (optional), type (optional) }

const CUSTOM_PARKING = [
    // Example format - add your own parking locations below:
    // {
    //     name: "Bigbury Beach Car Park",
    //     lat: 50.2839,
    //     lon: -3.8943,
    //     description: "Large pay & display car park near beach. Gets busy in summer.",
    //     type: "Pay & Display" // Free, Pay & Display, Permit Only, etc.
    // },

    // ==========================================
    // ADD YOUR PARKING LOCATIONS HERE
    // ==========================================


];

/**
 * Get all custom parking locations
 * @returns {Array} All custom parking locations
 */
function getCustomParking() {
    return CUSTOM_PARKING;
}

/**
 * Find custom parking near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Custom parking within radius
 */
function findCustomParkingNear(lat, lon, radiusKm = 5) {
    return CUSTOM_PARKING.filter(parking => {
        const distance = calculateDistance(lat, lon, parking.lat, parking.lon);
        return distance <= radiusKm;
    }).sort((a, b) => {
        const distA = calculateDistance(lat, lon, a.lat, a.lon);
        const distB = calculateDistance(lat, lon, b.lat, b.lon);
        return distA - distB;
    });
}
