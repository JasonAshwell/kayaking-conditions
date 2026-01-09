# Kayaking Routes Database Guide

Build a personal database of your favorite kayaking routes from Strava, Outdoor Active, or other platforms.

## Overview

The Routes feature lets you:
- **Store links** to your favorite kayaking routes
- **View routes** near any location you search
- **Quick access** to route details and maps
- **Organize routes** by location, difficulty, and distance

## Adding Routes

### Location: `js/data/routes.js`

Open `js/data/routes.js` and add entries to the `KAYAKING_ROUTES` array:

```javascript
const KAYAKING_ROUTES = [
    {
        name: "Dartmouth to Dittisham",
        lat: 50.3515,
        lon: -3.5794,
        url: "https://www.strava.com/routes/123456789",
        type: "strava",
        description: "Beautiful upstream paddle along River Dart. Sheltered route suitable for beginners.",
        distance: "8km",
        difficulty: "Easy",
        goodConditions: "High tide with light winds from NE or E. Spring tides give more water over mud banks.",
        trickyConditions: "Strong SW winds funnel up the valley. Low tide exposes mud banks and narrows the channel."
    },
    {
        name: "Salcombe Estuary Explorer",
        lat: 50.2394,
        lon: -3.7694,
        url: "https://www.outdooractive.com/en/route/kayaking/uk/salcombe-estuary/123456",
        type: "outdooractive",
        description: "Explore the stunning Salcombe estuary with stops at sandy beaches. Full circuit of inner estuary.",
        distance: "12km",
        difficulty: "Moderate",
        goodConditions: "Mid to high tide. Light to moderate winds. Early morning for calmer water.",
        trickyConditions: "Strong southerly winds cause rough conditions at harbor entrance. Busy with boat traffic in summer."
    },
    {
        name: "Start Point Coastal Paddle",
        lat: 50.2210,
        lon: -3.6419,
        url: "https://www.ukriversguidebook.co.uk/route/start-point",
        type: "other",
        description: "Advanced coastal route around Start Point. Strong tidal currents. Experienced paddlers only.",
        distance: "15km",
        difficulty: "Advanced",
        goodConditions: "Slack water at Start Point. Light offshore winds. Good visibility. Calm sea state.",
        trickyConditions: "Tidal race at Start Point (avoid 3hrs either side of high water). Strong SW winds create rough seas. Poor visibility dangerous due to shipping."
    }
];
```

## Field Descriptions

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | **Yes** | Route name | "Dartmouth to Dittisham" |
| `lat` | **Yes** | Latitude of route start/center | 50.3515 |
| `lon` | **Yes** | Longitude of route start/center | -3.5794 |
| `url` | **Yes** | Link to the route | "https://www.strava.com/routes/..." |
| `type` | **Yes** | Platform type | "strava", "outdooractive", "other" |
| `description` | No | Route details and notes | "Beautiful upstream paddle..." |
| `distance` | No | Route distance | "8km", "5 miles" |
| `difficulty` | No | Difficulty level | "Easy", "Moderate", "Advanced" |
| `goodConditions` | No | When to paddle this route | "High tide, light NE winds" |
| `trickyConditions` | No | Conditions to avoid | "Strong SW winds, low tide" |

## Supported Platforms

### Strava
- **Type**: `"strava"`
- **URL Format**: `https://www.strava.com/routes/[route-id]`
- **Icon**: 🏃
- Great for tracking paddling activities

### Outdoor Active
- **Type**: `"outdooractive"`
- **URL Format**: `https://www.outdooractive.com/en/route/kayaking/...`
- **Icon**: 🥾
- Detailed route planning and maps

### Other Platforms
- **Type**: `"other"`
- **URL Format**: Any valid URL
- **Icon**: 🗺️
- Use for:
  - UK Rivers Guidebook
  - British Canoeing resources
  - Personal blog posts
  - GPX files
  - Any other route resource

## Getting Route Coordinates

The lat/lon should represent the **start point** or **center** of the route.

### From Strava:
1. Open your route in Strava
2. Right-click on the start point
3. Copy coordinates from the URL or map

### From Outdoor Active:
1. Open the route
2. Check the route details for start coordinates
3. Or right-click the map to get coordinates

### Use the App:
1. Search for the route's location in the app
2. Open console (F12): `console.log(resultsDisplay.currentLocation)`
3. Copy the lat/lon

## Route Descriptions

Include helpful information:

**Conditions**:
- "Best at high tide"
- "Sheltered from westerly winds"
- "Exposed to sea swell"

**Suitability**:
- "Suitable for beginners"
- "Intermediate paddlers with self-rescue skills"
- "Advanced - strong tidal streams"

**Features**:
- "Sandy beaches for breaks"
- "Wildlife spotting opportunities"
- "Historic landmarks"
- "Rock hopping sections"

**Warnings**:
- "Strong currents at headland"
- "Busy with commercial traffic"
- "No landing spots for 5km"

## Good Conditions & Tricky Conditions

The `goodConditions` and `trickyConditions` fields help paddlers understand when to (and when not to) paddle a route.

### Good Conditions

Describe the ideal conditions for this route:

**Tidal State**:
- "High tide for deepest water"
- "Mid tide gives best flow"
- "Slack water at headland"
- "2 hours after high water"

**Wind**:
- "Light NE winds (offshore)"
- "Moderate E or SE winds"
- "Calm or light winds only"
- "Wind <10 knots"

**Sea State**:
- "Calm sea, <0.5m swell"
- "Flat conditions"
- "Protected from swell"

**Time of Day**:
- "Early morning for calm water"
- "Best paddled at dawn"
- "Avoid midday boat traffic"

**Season**:
- "Spring tides give more water"
- "Summer for warmer water"
- "Best March-October"

### Tricky Conditions

Warn paddlers about conditions to avoid:

**Tidal Hazards**:
- "Tidal race at Start Point (avoid 3hrs either side of HW)"
- "Strong ebb creates overfalls"
- "Low tide exposes rocks and mud"
- "Spring tides create strong currents"

**Wind Warnings**:
- "SW winds funnel up valley"
- "Onshore winds create surf"
- "Wind against tide = rough seas"
- "Exposed to southerly gales"

**Sea State**:
- "Large swell makes landing difficult"
- "Confused seas in wind-against-tide"
- "Reef breaks in big swells"

**Other Hazards**:
- "Busy with boat traffic in summer"
- "Commercial shipping lanes"
- "Poor visibility dangerous"
- "No landing spots for 8km"

**Example Entry**:
```javascript
{
    name: "Bigbury to Hope Cove",
    lat: 50.2839,
    lon: -3.8943,
    url: "https://www.strava.com/activities/123456",
    type: "strava",
    description: "Coastal paddle around Bolt Tail headland with stunning views.",
    distance: "10km",
    difficulty: "Intermediate",
    goodConditions: "Slack water at Bolt Tail. Light offshore (N or NE) winds. Good visibility. Calm sea state <1m. Best 2hrs either side of slack water.",
    trickyConditions: "Strong tidal streams around Bolt Tail (up to 3 knots). SW winds create rough seas and make landing at Hope Cove difficult. Avoid in swell >1.5m. Commercial fishing boats in area."
}
```

## Difficulty Levels

Suggested classification:

| Level | Description | Examples |
|-------|-------------|----------|
| **Easy** | Sheltered waters, minimal currents, beginner-friendly | Estuary paddles, calm rivers |
| **Moderate** | Some exposure, moderate conditions, intermediate skills | Coastal paddles in good conditions |
| **Intermediate** | Exposed sections, tidal planning needed | Headland crossings, tidal races |
| **Advanced** | Challenging conditions, strong currents | Open crossings, rough water |
| **Extreme** | Expert only, serious hazards | Tide races, heavy surf, remote areas |

## Example Entries

### Short Beginner Route
```javascript
{
    name: "Fowey Harbour Paddle",
    lat: 50.3348,
    lon: -4.6364,
    url: "https://www.strava.com/routes/987654",
    type: "strava",
    description: "Easy sheltered paddle around Fowey harbour. Perfect for beginners. 1-2 hours. Launch from Caffa Mill slip.",
    distance: "5km",
    difficulty: "Easy",
    goodConditions: "Any tide state works. Best in light winds <10 knots. Sheltered from most wind directions.",
    trickyConditions: "Watch for ferries and commercial traffic in main channel. Strong SW winds can make return challenging."
}
```

### Coastal Adventure
```javascript
{
    name: "Prawle Point to Salcombe",
    lat: 50.2150,
    lon: -3.7200,
    url: "https://www.outdooractive.com/route/123456",
    type: "outdooractive",
    description: "Stunning coastal paddle from Prawle Point to Salcombe. Requires calm conditions. Spectacular cliff scenery. Seals and seabirds common. Must have solid self-rescue skills. Plan timing for tidal assistance.",
    distance: "18km",
    difficulty: "Advanced",
    goodConditions: "Calm seas <1m. Light to moderate offshore winds. Good visibility. Slack water or tidal assistance. Best on neap tides.",
    trickyConditions: "Strong tidal streams around Prawle Point (up to 4 knots on springs). SW winds create rough seas and surf. No landing spots for 12km in rough conditions. Shipping traffic offshore."
}
```

### Multi-Day Expedition
```javascript
{
    name: "South Devon Coast - 3 Day Expedition",
    lat: 50.2800,
    lon: -3.8000,
    url: "https://example.com/my-blog/south-devon-expedition",
    type: "other",
    description: "3-day coastal expedition from Plymouth to Dartmouth. Wild camping spots marked. Experienced expedition paddlers only. Weather window essential. Full trip report and GPS tracks available.",
    distance: "65km",
    difficulty: "Extreme"
}
```

## How It Works

1. **Add routes** to `js/data/routes.js`
2. **Search for a location** in the app
3. **Click "View Routes"** button (shows count if routes nearby)
4. **See nearby routes** (within 10km)
5. **Click "View Route"** to open on the platform

## Search Radius

Routes within **10km** of your selected location are shown.

Routes are sorted by distance from the selected location.

## Route Display

Each route card shows:
- **Route name** and platform icon
- **Distance** from current location
- **Description** (if provided)
- **Route distance** (if provided)
- **Difficulty level** (if provided)
- **Platform** (Strava, Outdoor Active, etc.)
- **Button** to view route on platform

## Tips for Building Your Database

### Organization Strategies

**By Region**:
```javascript
// Cornwall
{ name: "St Ives Bay...", ... },
{ name: "Falmouth Harbour...", ... },

// Devon
{ name: "Dartmouth...", ... },
{ name: "Salcombe...", ... },
```

**By Difficulty**:
```javascript
// Beginner Routes
{ name: "Easy Estuary...", difficulty: "Easy", ... },

// Advanced Routes
{ name: "Challenging Coastal...", difficulty: "Advanced", ... },
```

**By Type**:
```javascript
// Estuary Paddles
// Coastal Routes
// River Trips
// Island Circumnavigations
```

### Quality Over Quantity

Better to have:
- 20 well-described routes you've actually paddled
- Than 100 routes with minimal information

Include your personal insights and local knowledge!

## Sharing Routes

Consider:
- **Creating route collections** for specific areas
- **Sharing your database** with your paddling club
- **Contributing routes** to platforms like Outdoor Active
- **Writing detailed trip reports** to link from the app

## Troubleshooting

### "No routes found near this location"

- Routes must be within 10km
- Check your lat/lon coordinates are correct
- Add more routes to the database

### Routes not showing

1. Check JavaScript syntax in `routes.js`
2. Open browser console (F12) for errors
3. Verify URL format is correct
4. Ensure file is saved

### Button shows "No Routes Nearby"

This is normal! It means no routes are within 10km of the selected location. The button still works - click it to see the empty state message.

## Best Practices

1. **Test routes** before adding them
2. **Update descriptions** after paddling
3. **Note seasonal changes** (e.g., "Summer only - seals pupping in winter")
4. **Include safety info** (e.g., "VHF channel 16 recommended")
5. **Link to trip reports** for detailed information
6. **Keep URLs working** - check links periodically

## Advanced: Dynamic Routes

For power users, you could:
- Generate routes programmatically from GPX files
- Import from Strava API
- Create route variations (clockwise/anticlockwise)
- Add tidal timing recommendations

## Privacy Note

Routes are stored locally in your app. Links are opened in new tabs - your browsing is not tracked.

Public route platforms (Strava, Outdoor Active) may have their own privacy settings for route visibility.

---

**Happy Paddling!** Build your database and never forget a great route again! 🛶
