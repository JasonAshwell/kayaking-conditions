// Manual Webcam Database
// Add webcam URLs here for specific locations
// Format: { name, lat, lon, url, type, display }

const MANUAL_WEBCAMS = [
    // Cornwall
    {
        name: "Falmouth Harbour",
        lat: 50.1532,
        lon: -5.0697,
        url: "https://www.falmouth.co.uk/webcam",
        type: "image",
        display: "embed"  // "embed" = show in modal, "newtab" = direct link only
    },
    {
        name: "Newquay - Fistral Beach",
        lat: 50.4167,
        lon: -5.0833,
        url: "https://www.surfcheck.co.uk/surf-reports/fistral-beach",
        type: "image",
        display: "newtab"  // Opens directly in new tab (doesn't embed well)
    },
    {
        name: "St Ives Harbour",
        lat: 50.2119,
        lon: -5.4797,
        url: "https://www.stives-cornwall.co.uk/webcam/",
        type: "image",
        display: "embed"
    },

    // Devon
    {
        name: "Blackpool Sands",
        lat: 50.3188,
        lon: -3.6116,
        url: "https://www.blackpoolsands.co.uk/webcam/",
        type: "image",
        display: "newtab"  // Opens directly in new tab (doesn't embed well)
    },
	{
        name: "Bigbury On Sea",
       lat: 50.2839,
        lon: -3.8943,
        url: "https://www.lovingthebeach.co.uk/viewcamera.php?location=bigburyonsea",
        type: "image",
        display: "newtab"  // Opens directly in new tab (doesn't embed well)
    },

    // Wales
    {
        name: "Tenby Harbour",
        lat: 51.6723,
        lon: -4.7003,
        url: "https://www.tenby-today.co.uk/webcam/",
        type: "image",
        display: "embed"
    },

    // Scotland
    {
        name: "Oban Bay",
        lat: 56.4141,
        lon: -5.4720,
        url: "https://www.oban.org.uk/webcam/",
        type: "image",
        display: "embed"
    },

    // Add more webcams here as needed
    //
    // DISPLAY OPTIONS:
    // - "embed": Shows webcam embedded in the modal viewer (default)
    // - "newtab": Provides only a "Open in New Tab" link (for sites that block embedding)
    //
    // Example formats:
    //
    // For image webcam (embedded):
    // {
    //     name: "Location Name",
    //     lat: 50.123,
    //     lon: -4.567,
    //     url: "https://example.com/webcam.jpg",
    //     type: "image",
    //     display: "embed"
    // }
    //
    // For iframe/embed (embedded):
    // {
    //     name: "Location Name",
    //     lat: 50.123,
    //     lon: -4.567,
    //     url: "https://example.com/embed",
    //     type: "iframe",
    //     display: "embed"
    // }
    //
    // For link only (no embedding):
    // {
    //     name: "Location Name",
    //     lat: 50.123,
    //     lon: -4.567,
    //     url: "https://example.com/webcam-page",
    //     type: "image",
    //     display: "newtab"
    // }
];

/**
 * Find webcams near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} maxDistance - Maximum distance in km (default 50km)
 * @returns {Array} Array of nearby webcams with distance
 */
function findNearbyWebcams(lat, lon, maxDistance = 50) {
    const nearby = [];

    MANUAL_WEBCAMS.forEach(webcam => {
        const distance = calculateDistance(lat, lon, webcam.lat, webcam.lon);

        if (distance <= maxDistance) {
            nearby.push({
                ...webcam,
                distance: distance.toFixed(1)
            });
        }
    });

    // Sort by distance (closest first)
    nearby.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return nearby;
}

/**
 * Get all webcams (for editing/viewing the database)
 * @returns {Array} All webcams in the database
 */
function getAllWebcams() {
    return MANUAL_WEBCAMS;
}
