# Sea Kayaking Conditions - UK

A web application for checking sea kayaking conditions around the UK coast, including tides, wave heights, weather, and safety assessments.

## Features

- **Location Search**: Find any UK coastal location using free-text search
- **Saved Locations**: Quick dropdown access to your favorite spots with detailed paddling info
- **Date Selection**: Check conditions for today or up to 6 days ahead
- **Comprehensive Data Display**:
  - Interactive tide visualization showing rise and fall throughout the day (30-minute intervals)
  - High and low tide times and heights
  - Wave height, period, and direction (multiple data sources)
  - Wind speed and direction with Beaufort scale
  - Wind onshore/offshore detection
  - Temperature, visibility, and precipitation
  - Ocean current information
  - Automated risk scoring (6-level system)
- **Webcam Integration**: View nearby webcams for live conditions
- **Location Images**: Photo galleries for saved locations
- **Activity Modifiers**: Adjust risk scores for rockhopping, caves, surfing, night paddling

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- **WorldTides API Key** (free, takes 2 minutes to get)

### Quick Start - Get Your Free API Key

WorldTides requires a free API key (1000 requests/month, permanently free):

**Step 1: Register (2 minutes)**
1. Visit: https://www.worldtides.info/register
2. Create free account
3. Verify your email
4. Get your API key from: https://www.worldtides.info/account

**Step 2: Add API Key**
1. Open `js/utils/config.js`
2. Find line 7: `apiKey: '',`
3. Replace with: `apiKey: 'your-key-here',`
4. Find line 9: `useFreeMode: true`
5. Change to: `useFreeMode: false`
6. Save the file

**Step 3: Use the App**
1. Open `index.html` in your browser
2. Search for any UK location
3. Check conditions for today or up to 6 days ahead
4. View comprehensive tide, wave, and weather data

**Detailed Instructions:** See [GET-API-KEY.md](GET-API-KEY.md) for step-by-step guide with screenshots.

## Management Tools

### 📸 Location Image Manager (`location-image-manager.html`)

Easily add images to your saved locations with a user-friendly web interface:
- Upload up to 3 images per location
- Automatic file naming
- Generates setup instructions
- No manual file renaming needed

**Quick Start:**
1. Open `location-image-manager.html` in your browser
2. Select a location from dropdown
3. Upload images (drag & drop or click)
4. Click "Generate Setup Instructions"
5. Follow the step-by-step guide

See **[LOCATION-IMAGE-MANAGER-GUIDE.md](LOCATION-IMAGE-MANAGER-GUIDE.md)** for detailed instructions.

### 📍 Location Database (`js/data/locations.js`)

Add your favorite kayaking spots with:
- Coordinates
- Brief descriptions (for dropdown tooltips)
- Detailed paddling descriptions (displayed in app)
- Up to 3 images per location

See **[LOCATIONS-GUIDE.md](LOCATIONS-GUIDE.md)** for complete guide.

### 📹 Webcam Database (`js/data/webcams.js`)

Add webcams for live views near your locations:
- Support for image and iframe webcams
- Choose between embedded or external link display
- Automatic distance calculation

See **[WEBCAM-GUIDE.md](WEBCAM-GUIDE.md)** for setup instructions.

### Why WorldTides Instead of UKHO?

The app uses **WorldTides API** instead of UKHO because:

❌ **UKHO has CORS restrictions** - Cannot be called from browsers
✅ **WorldTides is CORS-enabled** - Works perfectly in browsers
✅ **Permanently free** - 1000 requests/month forever
✅ **No API key required** - Works immediately
✅ **Global coverage** - Works worldwide

**Note**: While UKHO provides excellent data, their API is designed for server-side applications only. Browser-based apps like this one are blocked by CORS (Cross-Origin Resource Sharing) security policies.

## Usage

1. **Search for a Location**:
   - Type a UK coastal location in the search box (e.g., "Falmouth", "Brighton", "Anglesey")
   - Select your location from the dropdown suggestions

2. **Select a Date**:
   - Choose a date from the date picker (today or up to 6 days ahead)

3. **Get Conditions**:
   - Click the **"Get Conditions"** button
   - Wait a few seconds while data is fetched
   - View the comprehensive conditions display

## Understanding the Results

### Safety Rating

- **GOOD**: Favorable conditions for most kayakers
- **MODERATE**: Exercise caution, suitable for experienced kayakers
- **POOR**: Not recommended, dangerous conditions

### Safety Warnings

The app automatically checks for:
- High winds (Force 5+)
- Large waves (>1m)
- Wind against tide (creates rough, choppy water)
- Poor visibility (<1km)
- Cold water temperature (<12°C)

### Tide Widget

- **Blue line**: Rising tide
- **Red line**: Falling tide
- **HW**: High Water (high tide)
- **LW**: Low Water (low tide)
- **NOW**: Current time (shown if viewing today's data)

## Data Sources

- **Tidal Data**: WorldTides (30-minute interval predictions)
- **Marine Conditions**: Stormglass API with multiple sources:
  - Stormglass (SG) - Aggregated best-of-breed (recommended)
  - MetOffice (METO) - UK Met Office
  - NOAA - US National Oceanic data
  - SMHI - Swedish Meteorological Institute
  - FCOO - Danish Defence
  - *Selectable via dropdown in results*
- **Weather**: Stormglass API (wind, temperature, visibility, precipitation)
- **Location Data**: OpenStreetMap Nominatim
- **Coastline**: OpenStreetMap Overpass API (for onshore/offshore detection)
- **Webcams**: Manual database (configurable)

**Note:** Stormglass free tier provides 10 requests/day. WorldTides free tier provides 1000 requests/month.

## Important Disclaimer

**This application is for informational purposes only.**

- Do not rely solely on this data for safety decisions
- Always check official forecasts before kayaking
- Conditions can change rapidly
- Sea kayaking carries inherent risks
- Ensure you have proper training, equipment, and experience

## Technical Details

### Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **No frameworks**: Vanilla JavaScript for simplicity
- **No build process**: Just open the HTML file
- **APIs**: All free, no-cost APIs

### File Structure

```
kayaking-conditions/
├── index.html                       # Main application
├── location-image-manager.html      # Image upload tool
├── README.md                        # This file
├── LOCATIONS-GUIDE.md               # Location setup guide
├── LOCATION-IMAGE-MANAGER-GUIDE.md  # Image manager guide
├── WEBCAM-GUIDE.md                  # Webcam setup guide
├── GET-API-KEY.md                   # API key instructions
├── css/
│   ├── main.css                    # Main styles
│   ├── tide-widget.css             # Tide visualization
│   ├── calendar.css                # Date picker
│   ├── webcam.css                  # Webcam viewer
│   └── location-gallery.css        # Image gallery
├── js/
│   ├── app.js                      # Main controller
│   ├── api/                        # API integrations
│   │   ├── geocoding.js            # Location search
│   │   ├── coastline.js            # Coastline detection
│   │   ├── tides.js                # WorldTides API
│   │   ├── marine.js               # Marine conditions fallback
│   │   ├── stormglass.js           # Stormglass API (primary)
│   │   └── weather.js              # Weather data fallback
│   ├── data/                       # Configuration databases
│   │   ├── locations.js            # ⚡ Edit: Add locations
│   │   └── webcams.js              # ⚡ Edit: Add webcams
│   ├── ui/                         # UI components
│   │   ├── location-search.js
│   │   ├── date-picker.js
│   │   ├── tide-widget.js
│   │   ├── webcam-viewer.js
│   │   └── results-display.js
│   └── utils/                      # Utilities
│       ├── config.js               # ⚡ Edit: Add API keys
│       └── helpers.js              # Helper functions
└── images/
    └── locations/                  # ⚡ Add: Your images
        ├── README.md
        ├── SAMPLE-SETUP.md
        └── [location-folders]/
```

### Caching

The app implements intelligent caching to minimize API calls:
- **Location searches**: 24 hours (localStorage)
- **Weather/marine data**: 1 hour (sessionStorage)
- **Tidal data**: 6 hours (sessionStorage)

### Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design, full support

## Troubleshooting

### Tide Data Not Loading

- Check your internet connection
- Open browser console (F12) to see specific error messages
- If you see quota exceeded, the free tier has a limited number of requests
- For unlimited use, register at https://www.worldtides.info/register (permanently free)

### No Location Found

- Try different search terms (e.g., "Falmouth Cornwall" instead of just "Falmouth")
- Ensure you're searching for UK locations
- Check your spelling

### No Tidal Data Available

- Some locations may not have nearby tidal stations
- The nearest station will be shown with its distance
- Consider trying a nearby major coastal town

### CORS Errors

- Open-Meteo and Nominatim support CORS, so this shouldn't happen
- If it does, try a different browser
- Check your browser console for specific errors

## Recent Enhancements

✅ **Completed:**
- Saved locations with dropdown selector
- Webcam integration near locations
- Location image galleries
- Image upload management tool
- Risk scoring with activity modifiers
- Multi-source marine data (Stormglass)
- Onshore/offshore wind detection
- 30-minute tide interval predictions

## Possible Future Enhancements

Ideas for further development:
- Compare multiple locations side-by-side
- Email/SMS alerts for ideal conditions
- Offline PWA support
- Sunrise/sunset times integration
- Tidal stream predictions
- Export trip reports

## Contributing

This is a personal project, but feel free to fork and modify for your own use.

## License

Free to use for personal, non-commercial purposes.

## Acknowledgments

- WorldTides for global tide predictions with browser support
- Open-Meteo for free weather and marine APIs
- OpenStreetMap community for geocoding data

---

**Stay safe on the water!**
