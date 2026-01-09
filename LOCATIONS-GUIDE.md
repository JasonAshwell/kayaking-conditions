# Saved Locations Guide

This guide explains how to add and manage your favorite kayaking locations in the Sea Kayaking Conditions app.

## Overview

The saved locations feature provides a dropdown menu of your favorite spots for quick access, eliminating the need to search for the same locations repeatedly.

## Adding New Locations

### 1. Open the Locations Database File

Edit the file: `js/data/locations.js`

### 2. Add Location Entries

Add new location objects to the `SAVED_LOCATIONS` array. Each location needs:

- **name**: Display name for the location
- **lat**: Latitude (decimal degrees)
- **lon**: Longitude (decimal degrees)
- **description**: Optional brief description (appears as tooltip in dropdown)
- **paddlingDescription**: Optional detailed description for paddlers (displayed in location card)
- **images**: Optional array of up to 3 image paths (displayed as gallery)

### 3. Basic Location Format

```javascript
{
    name: "Falmouth",
    lat: 50.1532,
    lon: -5.0697,
    description: "Sheltered harbour with access to open coast"
}
```

### 4. Full Location Format with Paddling Info and Images

```javascript
{
    name: "Salcombe",
    lat: 50.2394,
    lon: -3.7694,
    description: "Scenic estuary and coastal routes",
    paddlingDescription: "Stunning sheltered estuary with sandy beaches and crystal-clear water. Perfect for beginners and families with calm conditions in the main channel. More experienced paddlers can explore the exposed coastal sections around Bolt Head and Prawle Point. Launch from multiple beaches along the estuary. Strong tidal currents in the narrows near the town - time your paddle carefully.",
    images: [
        "images/locations/salcombe/salcombe-1.jpg",
        "images/locations/salcombe/salcombe-2.jpg",
        "images/locations/salcombe/salcombe-3.jpg"
    ]
}
```

## Adding Location Images

### 1. Prepare Your Images

- **Format**: JPG or PNG recommended
- **Size**: 800x600 pixels or similar landscape ratio
- **File size**: Keep under 500KB for fast loading
- **Quantity**: Up to 3 images per location

### 2. Create Location Folder

Create a folder in `images/locations/` with your location name:
- Use lowercase
- Replace spaces with hyphens
- Example: `salcombe`, `plymouth-sound`, `isle-of-skye`

### 3. Add Images to Folder

```
images/locations/salcombe/
├── salcombe-1.jpg  (main view)
├── salcombe-2.jpg  (alternative angle)
└── salcombe-3.jpg  (launch spot)
```

### 4. Update Location Entry

```javascript
{
    name: "Salcombe",
    lat: 50.2394,
    lon: -3.7694,
    description: "Scenic estuary and coastal routes",
    paddlingDescription: "Detailed paddling information here...",
    images: [
        "images/locations/salcombe/salcombe-1.jpg",
        "images/locations/salcombe/salcombe-2.jpg",
        "images/locations/salcombe/salcombe-3.jpg"
    ]
}
```

### 5. Example Entry with Everything

```javascript
const SAVED_LOCATIONS = [
    // Existing locations...

    // Add your new location here:
    {
        name: "Poole Harbour",
        lat: 50.7050,
        lon: -1.9872,
        description: "Large natural harbour with islands",
        paddlingDescription: "Sheltered harbour perfect for all abilities. Explore Brownsea Island, numerous channels, and quiet beaches. Watch for commercial traffic in main channels. Popular with families and beginners.",
        images: [
            "images/locations/poole-harbour/poole-1.jpg",
            "images/locations/poole-harbour/poole-2.jpg"
        ]
    },

    // More locations...
];
```

## Finding Location Information

### Getting Coordinates

**Method 1: Google Maps**
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the location you want
3. Click the coordinates to copy them
4. Format: `51.1234, -0.5678` (latitude, longitude)

**Method 2: What3Words**
1. Use [What3Words](https://what3words.com) to find precise locations
2. Click on the location to see coordinates
3. Use the latitude and longitude values

**Method 3: OpenStreetMap**
1. Go to [OpenStreetMap](https://www.openstreetmap.org)
2. Right-click on the location
3. Select "Show address" to see coordinates

### Coordinate Format

- **Latitude**: -90 to +90 (North is positive, South is negative)
- **Longitude**: -180 to +180 (East is positive, West is negative)
- **UK Coordinates**: Latitude ~49 to ~61, Longitude ~-8 to +2
- **Decimal Places**: 4 decimal places = ~11 meters accuracy (sufficient)

## Organization Tips

### Group by Region

Organize your locations by region using comments:

```javascript
const SAVED_LOCATIONS = [
    // Cornwall
    {
        name: "Falmouth",
        lat: 50.1532,
        lon: -5.0697,
        description: "Sheltered harbour with access to open coast"
    },
    {
        name: "St Ives",
        lat: 50.2119,
        lon: -5.4797,
        description: "Beautiful bay with varied conditions"
    },

    // Devon
    {
        name: "Plymouth Sound",
        lat: 50.3559,
        lon: -4.1425,
        description: "Large sheltered bay with islands"
    },

    // Your Locations
    {
        name: "My Secret Spot",
        lat: 50.1234,
        lon: -5.5678,
        description: "Quiet cove with great wildlife"
    },
];
```

### Naming Conventions

**Good Names:**
- "Falmouth Harbour"
- "Anglesey - Beaumaris"
- "Isle of Skye - Portree"
- "Newquay - Fistral Beach"

**Avoid:**
- Very long names (keep under 40 characters)
- Special characters that might cause issues
- Duplicate names (add region to distinguish)

### Useful Descriptions

Add helpful details in the description:
- Water type (harbour, estuary, open coast, loch)
- Shelter level (exposed, sheltered, protected)
- Special features (caves, islands, tidal races)
- Difficulty indicators

**Examples:**
```javascript
description: "Sheltered harbour with access to open coast"
description: "Exposed surf beach - experienced paddlers only"
description: "Tidal estuary - plan around tide times"
description: "Dramatic coastline with sea caves"
description: "Protected bay - ideal for beginners"
```

## Managing Your List

### Removing Locations

Simply delete or comment out locations you no longer need:

```javascript
// {
//     name: "Old Location",
//     lat: 50.1234,
//     lon: -5.5678,
//     description: "No longer used"
// },
```

### Alphabetical Sorting

The dropdown automatically sorts locations alphabetically by name, so don't worry about the order in the file.

### Testing Additions

After adding locations:
1. Save the `locations.js` file
2. Refresh the app in your browser
3. Check the "Saved Locations" dropdown
4. Select your new location to test it works

## Example Database

Here's a well-organized example:

```javascript
const SAVED_LOCATIONS = [
    // ===== CORNWALL =====
    {
        name: "Falmouth Harbour",
        lat: 50.1532,
        lon: -5.0697,
        description: "Sheltered harbour with access to open coast"
    },
    {
        name: "Newquay - Fistral Beach",
        lat: 50.4167,
        lon: -5.0833,
        description: "Exposed surf beach"
    },
    {
        name: "St Ives Bay",
        lat: 50.2119,
        lon: -5.4797,
        description: "Beautiful bay with varied conditions"
    },

    // ===== DEVON =====
    {
        name: "Plymouth Sound",
        lat: 50.3559,
        lon: -4.1425,
        description: "Large sheltered bay with islands"
    },
    {
        name: "Salcombe Estuary",
        lat: 50.2394,
        lon: -3.7694,
        description: "Scenic estuary and coastal routes"
    },

    // ===== WALES =====
    {
        name: "Anglesey - Beaumaris",
        lat: 53.2644,
        lon: -4.0903,
        description: "Menai Strait with tidal races"
    },
    {
        name: "Pembrokeshire - St Davids",
        lat: 51.8812,
        lon: -5.2660,
        description: "Dramatic coastline with caves"
    },

    // ===== SCOTLAND =====
    {
        name: "Oban Bay",
        lat: 56.4141,
        lon: -5.4720,
        description: "Gateway to the Inner Hebrides"
    },
    {
        name: "Isle of Skye - Portree",
        lat: 57.4126,
        lon: -6.1944,
        description: "Stunning Highland scenery"
    },
];
```

## Common UK Kayaking Locations

### Cornwall
- Falmouth, St Ives, Newquay, Fowey, Looe, Padstow, Port Isaac

### Devon
- Plymouth, Salcombe, Dartmouth, Torquay, Exmouth, Sidmouth

### Dorset
- Poole, Weymouth, Swanage, Lyme Regis

### Wales
- Tenby, Pembrokeshire Coast, Anglesey, Llŷn Peninsula, Gower

### Scotland
- Oban, Isle of Skye, Outer Hebrides, Orkney, Shetland, Argyll

### England - South & East
- Brighton, Eastbourne, Hastings, Dover, Norfolk Broads

### England - North
- Lake District, Isle of Man, North Yorkshire Coast

## Troubleshooting

### Location doesn't appear in dropdown
- Check file syntax is correct (commas, brackets, quotes)
- Ensure location is within the SAVED_LOCATIONS array
- Refresh browser with hard reload (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors (F12)

### Wrong location shown
- Verify latitude and longitude are correct
- Make sure lat/lon aren't swapped (lat is first)
- Check coordinates are in decimal degrees format, not DMS
- Test coordinates in Google Maps first

### Dropdown not working
- Verify `locations.js` is loaded before `location-search.js` in index.html
- Check for JavaScript syntax errors in the file
- Ensure file is saved with correct encoding (UTF-8)

## Writing Good Paddling Descriptions

Include these elements in your `paddlingDescription`:

### Essential Information
- **Suitability**: Beginner-friendly, intermediate, advanced, expert
- **Shelter level**: Sheltered, partially exposed, fully exposed
- **Water type**: Estuary, harbour, open coast, loch, river
- **Launch spots**: Where to put in and take out

### Useful Details
- **Key features**: Islands, beaches, caves, wildlife
- **Tidal considerations**: Strong currents, timing requirements
- **Hazards**: Rocks, commercial traffic, surf, wind exposure
- **Distance options**: Short routes, longer expeditions
- **Landing areas**: Beaches accessible along the route

### Example Good Description
```
"Stunning sheltered estuary with sandy beaches and crystal-clear water. Perfect for beginners and families with calm conditions in the main channel. More experienced paddlers can explore the exposed coastal sections around Bolt Head and Prawle Point. Launch from multiple beaches along the estuary. Strong tidal currents in the narrows near the town - time your paddle carefully. Look out for seals near the entrance."
```

## Image Tips

### What to Photograph
- **Launch spots**: Show where to put in
- **Key landmarks**: Islands, headlands, beaches
- **Water conditions**: Typical sea state
- **Scenery**: What makes this location special
- **Landing areas**: Alternative beaches or coves

### Photography Guidelines
- Take photos in good lighting (morning/evening)
- Include scale (boats, people) when helpful
- Show different perspectives (aerial, water level, shore)
- Avoid photos with identifiable people (privacy)
- Ensure you own copyright or have permission

### Image Gallery Display
- Images appear as thumbnails in the location card
- Click any image to view full-size in a modal
- Up to 3 images displayed per location
- Images load only when location is selected (fast performance)

## Best Practices

1. **Start with familiar locations** - Add places you know well first
2. **Test coordinates** - Verify each location appears correctly on the map
3. **Add detailed descriptions** - Help others plan their trips safely
4. **Include images** - Visual references are invaluable
5. **Group logically** - Organize by region or frequency of use
6. **Keep it current** - Update descriptions and add new images
7. **Backup your files** - Keep copies of your custom locations and images

## Need Help?

- Check browser console for errors (F12)
- Verify file syntax (matching brackets, commas between entries)
- Test with the provided example locations first
- Ensure coordinates are valid UK locations
