# Parking Database Guide

Add your known parking locations to the custom parking database for quick access on the map.

## Overview

The app provides two types of parking:

1. **Public Parking** (🅿️) - Automatically fetched from OpenStreetMap
   - Shows all public car parks within 2km
   - Includes pay & display, free parking, and parking areas
   - No setup required - just click the button!

2. **Custom Parking** (📍) - Your personal database
   - Add your favorite or known parking spots
   - Useful for:
     - Launch sites with nearby parking
     - Hidden or unofficial parking areas
     - Parking with specific notes (restrictions, fees, etc.)

## Adding Custom Parking

### Location: `js/data/parking.js`

Open `js/data/parking.js` and add entries to the `CUSTOM_PARKING` array:

```javascript
const CUSTOM_PARKING = [
    {
        name: "Bigbury Beach Car Park",
        lat: 50.2839,
        lon: -3.8943,
        description: "Large pay & display car park near beach. Gets busy in summer. £5 all day.",
        type: "Pay & Display"
    },
    {
        name: "Hope Cove Outer Hope Beach",
        lat: 50.2443,
        lon: -3.8629,
        description: "Free parking near Outer Hope beach. Limited spaces. Very popular in summer.",
        type: "Free"
    },
    {
        name: "Dartmouth Castle Car Park",
        lat: 50.3498,
        lon: -3.5674,
        description: "Small car park near castle. Walk down to launch site.",
        type: "Pay & Display"
    }
];
```

## Field Descriptions

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | **Yes** | Name of the parking location | "Bigbury Beach Car Park" |
| `lat` | **Yes** | Latitude (decimal degrees) | 50.2839 |
| `lon` | **Yes** | Longitude (decimal degrees) | -3.8943 |
| `description` | No | Helpful notes about the parking | "Gets busy in summer" |
| `type` | No | Type of parking | "Free", "Pay & Display", "Permit Only" |

## Getting Coordinates

### Method 1: Google Maps
1. Right-click on the location in Google Maps
2. Click the coordinates at the top
3. Copy the latitude and longitude

### Method 2: OpenStreetMap
1. Visit [openstreetmap.org](https://www.openstreetmap.org)
2. Right-click on the location
3. Select "Show address"
4. Copy the coordinates

### Method 3: Use the App
1. Load the app and search for your location
2. Open browser console (F12)
3. Type: `console.log(resultsDisplay.currentLocation)`
4. Copy the lat/lon values

## Parking Types

Common types to use:

- `"Free"` - Free parking
- `"Pay & Display"` - Pay and display machines
- `"Permit Only"` - Residents/permit holders only
- `"Limited"` - Time-limited parking
- `"Disabled"` - Disabled parking only
- `"Informal"` - Informal/roadside parking

## Tips for Good Descriptions

Include useful information like:

- **Fees**: "£5 all day" or "Free after 6pm"
- **Capacity**: "10 spaces" or "Large car park"
- **Seasonal notes**: "Gets very busy in summer"
- **Restrictions**: "Height barrier 2m", "No overnight parking"
- **Walking distance**: "5 min walk to launch site"
- **Surface type**: "Gravel surface", "Tarmac"
- **Access**: "Steep slope", "Easy access"

## Example Entry

```javascript
{
    name: "Salcombe North Sands Car Park",
    lat: 50.2394,
    lon: -3.7694,
    description: "Large car park at North Sands beach. Pay & display £8/day in summer, £4/day in winter. Very busy July-August. 100+ spaces. Direct beach access for launching. Toilets and cafe nearby.",
    type: "Pay & Display"
}
```

## How It Works

1. **Add parking** to `js/data/parking.js`
2. **Search for a location** in the app
3. **Click "Custom Parking"** button on the map
4. **See your parking** displayed with distance from location
5. **Click markers** to see details

## Search Radius

- Public parking: 2km radius
- Custom parking: 5km radius

Parking locations are automatically sorted by distance from your selected location.

## Combining Public and Custom

You can show both at the same time:

1. Click **"🅿️ Public Parking"** - Shows OpenStreetMap data
2. Click **"📍 Custom Parking"** - Shows your custom entries
3. Both sets of markers will be visible together
4. Click buttons again to hide each layer

## Troubleshooting

### "No custom parking found within 5km"

Your parking locations are more than 5km away. Either:
- Add parking closer to the location
- The coordinates might be incorrect

### Parking not showing on map

1. Check your JavaScript syntax in `parking.js`
2. Open browser console (F12) for errors
3. Verify lat/lon coordinates are correct
4. Ensure the file is saved

### Public parking not loading

- Check your internet connection
- OpenStreetMap Overpass API might be slow
- Try again in a few seconds

## Share Your Data

If you've built a comprehensive parking database for a region, consider:
- Sharing it with other kayakers
- Contributing to OpenStreetMap to improve public data
- Creating a regional guide

---

**Note**: Custom parking is stored locally in your copy of the app. Public parking data comes from OpenStreetMap and doesn't require any setup.
