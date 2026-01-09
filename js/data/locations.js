// Saved Locations Database
// Add your favorite kayaking locations here for quick access
// Format: { name, lat, lon, description (optional), paddlingDescription (optional), images (optional) }

const SAVED_LOCATIONS = [


    // Devon
    {
        name: "Dartmouth",
        lat: 50.3515,
        lon: -3.5794,
        description: "River Dart estuary",
        paddlingDescription: "Beautiful sheltered estuary with historic castle and vibrant town. Good for all abilities with options for coastal paddles around the Mew stone with rock hopping for intermediate kayakers paddling either way out of the estuary. For the less adventurous or in windy conditions paddle upstream towards Dittisham and Totnes",
        images: [
            "images/locations/dartmouth/dartmouth-1.jpg",
            "images/locations/dartmouth/dartmouth-2.jpg",
            "images/locations/dartmouth/dartmouth-3.jpg"
        ]
    },
	 {
        name: "Salcombe",
        lat: 50.2394,
        lon: -3.7694,
        description: "Scenic estuary and coastal routes",
        paddlingDescription: "Stunning sheltered estuary with sandy beaches and crystal-clear water. Perfect for beginners and families. Exposed coastal sections for advanced paddlers.",
        images: [
           "images/locations/salcombe/salcombe-1.jpg",
		   "images/locations/salcombe/salcombe-2.jpg",
		   "images/locations/salcombe/salcombe-3.jpg"
        ]
    },
	{
        name: "Plymouth Sound",
        lat: 50.3559,
        lon: -4.1425,
        description: "Large sheltered bay with islands",
        paddlingDescription: "Expansive sheltered bay perfect for exploring. Drake's Island and multiple breakwaters offer interesting routes. Good for intermediate paddlers. Watch for commercial shipping, ferries, and military vessels in marked channels. Launch from multiple slipways around the sound. Tidal streams can be strong near the breakwater entrances. Explore Jennycliff Bay, Cawsand Bay, and Mount Batten. Popular training ground for sea kayaking skills.",
        images: [
            "images/locations/plymouth-sound/plymouth-sound-1.jpg",
            "images/locations/plymouth-sound/plymouth-sound-2.jpg",
            "images/locations/plymouth-sound/plymouth-sound-3.jpg"
        ]
    },
    {
        name: "Bigbury on Sea",
        lat: 50.2839,
        lon: -3.8943,
        description: "Large Bay with Burgh Island",
        paddlingDescription: "Beautiful sandy bay with iconic Burgh Island accessible at low tide. Good for beginners in calm conditions. Launch from Bigbury beach with easy access. Paddle around Burgh Island for stunning views. Can be exposed to southwesterly winds and swell - check forecast carefully. Strong tidal currents around the island. Good surf beach when swell is running. Popular with families - watch for swimmers in summer.",
        images: [
            "images/locations/bigbury-on-sea/bigbury-on-sea-1.jpg",
            "images/locations/bigbury-on-sea/bigbury-on-sea-2.jpg",
            "images/locations/bigbury-on-sea/bigbury-on-sea-3.jpg"
        ]
    },
	{
        name: "Slapton Sands",
        lat: 50.2869,
        lon: -3.6444,
        description: "Long Open Beach with surfing in some conditions",
        paddlingDescription: "Long shingle and sand beach backed by freshwater lagoon. Open to southerly swells making it good for surf kayaking when conditions allow. Suitable for confident intermediate paddlers. Launch from multiple points along the beach. Can be rough in onshore winds - fully exposed to south. Limited shelter once launched. Good for coastal tours towards Start Point for experienced paddlers. Watch for strong currents off Start Point. Beach fishing popular - be aware of lines.",
        images: [
            "images/locations/slapton-sands/slapton-sands-1.jpg",
            "images/locations/slapton-sands/slapton-sands-2.jpg",
           "images/locations/slapton-sands/slapton-sands-3.jpg"
        ]
    },
	{
        name: "Hope Cove",
        lat: 50.2443,
        lon: -3.8629,
        description: "Pretty Cove with 2 put in beaches",
        paddlingDescription: "Sheltered cove with Inner and Outer Hope beaches offering different launch options. Good for beginners in calm conditions, with options for intermediate coastal paddling. Inner Hope more sheltered, Outer Hope better for launching in moderate conditions. Rocky coastline excellent for exploring caves and gullies. Can paddle around Bolt Tail headland in calm seas (experienced only). Strong tidal streams around headlands. Beautiful clear water with good visibility. Launch easily from sandy beaches at mid to high tide.",
        images: [
            "images/locations/hope-cove/hope-cove-1.jpg",
            "images/locations/hope-cove/hope-cove-2.jpg",
           "images/locations/hope-cove/hope-cove-3.jpg"
        ]
    },
	{
        name: "Wembury",
        lat: 50.3287,
        lon: -4.0841,
        description: "Long Open Beach with surfing in some conditions",
        paddlingDescription: "Scenic beach with Great Mewstone island offshore making for an interesting paddle. Suitable for intermediate kayakers in moderate conditions. Launch from beach at mid to high tide. Can be exposed to southerly swells and winds. Rock hopping opportunities along coastline to east towards Bovisand. Good surf when swell is up. Strong tidal streams around Mewstone - plan timing carefully. Popular with divers - watch for boats. Marine Conservation Area - rich wildlife including seals. Rocky areas at low water.",
        images: [
            "images/locations/wembury/wembury-1.jpg",
            "images/locations/wembury/wembury-2.jpg",
            "images/locations/wembury/wembury-3.jpg"
        ]
    },
	{
        name: "Brixham",
        lat: 50.3952,
        lon: -3.5145,
        description: "Working fishing harbour and marina",
        paddlingDescription: "Historic working harbour with busy fishing fleet and marina. Sheltered inner harbour good for beginners. Launch from slipway or breakwater. Plenty to explore including breakwater, Berry Head, and coastal caves for intermediate paddlers. Watch for fishing boats, trawlers, and ferries - keep clear of commercial traffic. Can be busy in summer with pleasure boats. Paddle to Berry Head Nature Reserve for dramatic cliffs and seabirds. Tidal streams moderate inside harbour, stronger outside. Good facilities with cafes and shops nearby.",
        images: [
            "images/locations/brixham/brixham-1.jpg",
           "images/locations/brixham/brixham-2.jpg",
            "images/locations/brixham/brixham-3.jpg"
        ]
    },
    {
        name: "Blackpool Sands",
        lat: 50.3188,
        lon: -3.6116,
        description: "Sheltered shingle beach in private bay",
        paddlingDescription: "Beautiful sheltered shingle beach in a private bay owned by local estate. Very beginner-friendly with good facilities. Launch easily from beach at all tides. Sheltered from most winds making it reliable. Good for first-time sea kayakers and families. Clear turquoise water with excellent visibility. Paddle along sheltered coastline or venture out to Start Point for advanced paddlers. Small fee for parking but excellent facilities including cafe and toilets. Popular in summer so arrive early. Limited rock hopping but beautiful scenery.",
        images: [
            "images/locations/blackpool-sands/blackpool-sands-1.jpg",
            "images/locations/blackpool-sands/blackpool-sands-2.jpg",
            "images/locations/blackpool-sands/blackpool-sands-3.jpg"
        ]
    },
// Cornwall
    {
        name: "Falmouth",
        lat: 50.1532,
        lon: -5.0697,
        description: "Sheltered harbour with access to open coast",
        paddlingDescription: "Excellent all-round location with sheltered harbour for beginners and exposed coastline for advanced paddlers. Launch from multiple slipways and beaches. Inner harbour very sheltered - perfect for learning. Explore Pendennis and St Mawes castles, beaches, and creeks. Paddle up Helford River for scenic sheltered tour. Busy with ferries, sailing boats, and commercial vessels - stay alert. Can venture outside to Roseland Peninsula or west towards Lizard for experienced kayakers. Strong tidal streams at harbour entrance. Popular yacht racing - watch for boats. Excellent facilities in town.",
        images: [
            // "images/locations/falmouth/falmouth-1.jpg",
            // "images/locations/falmouth/falmouth-2.jpg",
            // "images/locations/falmouth/falmouth-3.jpg"
        ]
    },
    {
        name: "St Ives",
        lat: 50.2119,
        lon: -5.4797,
        description: "Beautiful bay with varied conditions",
        paddlingDescription: "Stunning sandy bay with dramatic headlands and islands. Sheltered harbour beach good for beginners. Multiple beaches offering different conditions. Launch from harbour, Porthmeor, or Porthminster beaches. Paddle to The Island (St Ives Head) for seals and spectacular coastal scenery. Can be exposed to northwesterly swells on north-facing beaches. Strong tidal streams around headlands - timing important. Good rock hopping and cave exploration for intermediate paddlers. Very busy with tourists in summer. Surfing possible at Porthmeor. Stunning clear water and white sand beaches.",
        images: [
            // "images/locations/st-ives/st-ives-1.jpg",
            // "images/locations/st-ives/st-ives-2.jpg",
            // "images/locations/st-ives/st-ives-3.jpg"
        ]
    },
    {
        name: "Newquay - Fistral Beach",
        lat: 50.4167,
        lon: -5.0833,
        description: "Exposed surf beach",
        paddlingDescription: "World-famous surf beach fully exposed to Atlantic swell. Excellent for surf kayaking and experienced sea kayakers only. Consistent waves make it popular year-round. Launch from beach but can be challenging in surf. Strong rips and currents - know how to handle surf zone. Not suitable for beginners unless in very calm conditions. Watch for surfers, bodyboarders, and swimmers. Best at mid to high tide. Can paddle around Towan Head to explore other beaches in calmer conditions. Lifeguarded in summer. Good facilities and surf shops.",
        images: [
            // "images/locations/newquay-fistral-beach/newquay-fistral-beach-1.jpg",
            // "images/locations/newquay-fistral-beach/newquay-fistral-beach-2.jpg",
            // "images/locations/newquay-fistral-beach/newquay-fistral-beach-3.jpg"
        ]
    },
    {
        name: "Fowey",
        lat: 50.3348,
        lon: -4.6364,
        description: "River estuary and coastal paddling",
        paddlingDescription: "Beautiful sheltered estuary with historic harbour town and extensive river to explore. Good for all abilities with options for everyone. Launch from multiple points along estuary. Upper river very sheltered - perfect for beginners and families. Historic town makes interesting paddle with castles guarding entrance. Can paddle out to Gribbin Head and Polkerris for coastal exploration. Watch for ferries, yachts, and commercial vessels in main channel. Strong tidal streams at harbour entrance and in narrows. Popular sailing area. Excellent pubs and facilities in town. Many secluded beaches and creeks to discover up river.",
        images: [
            // "images/locations/fowey/fowey-1.jpg",
            // "images/locations/fowey/fowey-2.jpg",
            // "images/locations/fowey/fowey-3.jpg"
        ]
    },
  

    // ==========================================
    // ADD YOUR OWN LOCATIONS HERE
    // ==========================================
    //
    // Basic format (name, coordinates, short description):
    // {
    //     name: "Your Location Name",
    //     lat: 50.1234,
    //     lon: -5.5678,
    //     description: "Brief description for dropdown tooltip"
    // },
    //
    // Full format (with paddling info and images):
    // {
    //     name: "Your Location Name",
    //     lat: 50.1234,
    //     lon: -5.5678,
    //     description: "Brief description for dropdown tooltip",
    //     paddlingDescription: "Detailed paddling information: shelter level, suitability, launch spots, hazards, key features, tidal info. This appears in the location card.",
    //     images: [
    //         "images/locations/your-location/your-location-1.jpg",
    //         "images/locations/your-location/your-location-2.jpg",
    //         "images/locations/your-location/your-location-3.jpg"
    //     ]
    // },
    //
    // To add images:
    // 1. Create folder: images/locations/your-location/
    // 2. Add up to 3 images (JPG/PNG, 800x600px, <500KB each)
    // 3. Update the images array above with the file paths
    //
    // See LOCATIONS-GUIDE.md for detailed instructions
];

/**
 * Get all saved locations
 * @returns {Array} All saved locations
 */
function getSavedLocations() {
    // Sort alphabetically by name
    return SAVED_LOCATIONS.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Find a saved location by name
 * @param {string} name - Location name
 * @returns {Object|null} Location object or null if not found
 */
function findSavedLocation(name) {
    return SAVED_LOCATIONS.find(loc => loc.name === name) || null;
}
