# Webcam Database Guide

This guide explains how to add and manage webcams in the Sea Kayaking Conditions app.

## Overview

The webcam feature searches for nearby webcams when you view location conditions. Webcams are stored in a manually editable JavaScript file.

## Adding New Webcams

### 1. Open the Webcam Database File

Edit the file: `js/data/webcams.js`

### 2. Add Webcam Entries

Add new webcam objects to the `MANUAL_WEBCAMS` array. Each webcam needs:

- **name**: Display name for the webcam
- **lat**: Latitude (decimal degrees)
- **lon**: Longitude (decimal degrees)
- **url**: URL to the webcam
- **type**: Either `"image"` or `"iframe"`
- **display**: Either `"embed"` (show in modal) or `"newtab"` (link only)

### 3. Display Modes

#### Embed Mode (`display: "embed"`)
Shows the webcam directly in the modal viewer (default):

```javascript
{
    name: "Falmouth Harbour",
    lat: 50.1532,
    lon: -5.0697,
    url: "https://www.example.com/webcam.jpg",
    type: "image",
    display: "embed"  // Shows webcam in modal
}
```

#### New Tab Mode (`display: "newtab"`)
Provides only a link to open the webcam in a new tab (for sites that block embedding):

```javascript
{
    name: "Newquay Surf Check",
    lat: 50.4167,
    lon: -5.0833,
    url: "https://www.surfcheck.co.uk/surf-reports/fistral-beach",
    type: "image",
    display: "newtab"  // Opens in new tab only
}
```

### 4. Webcam Types

#### Image Webcam
Direct link to a webcam image (refreshes automatically):

```javascript
{
    name: "Brighton Marina",
    lat: 50.8155,
    lon: -0.1087,
    url: "https://www.brightonmarina.co.uk/webcam.jpg",
    type: "image",
    display: "embed"
}
```

#### Iframe Webcam
Embeddable webcam player (YouTube, custom player, etc.):

```javascript
{
    name: "Newquay Live Stream",
    lat: 50.4167,
    lon: -5.0833,
    url: "https://www.youtube.com/embed/VIDEO_ID",
    type: "iframe",
    display: "embed"
}
```

### 5. Example Entry

```javascript
const MANUAL_WEBCAMS = [
    // Existing webcams...

    // Add your new webcam here:
    {
        name: "Brighton Marina",
        lat: 50.8155,
        lon: -0.1087,
        url: "https://www.brightonmarina.co.uk/webcam.jpg",
        type: "image",
        display: "embed"  // Try "embed" first, change to "newtab" if it doesn't load
    },

    // More webcams...
];
```

## Finding Webcam Information

### Getting Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the webcam location
3. Click the coordinates to copy them
4. Format: `51.1234, -0.5678` (latitude, longitude)

### Finding Webcam URLs

**Image URLs:**
- Look for direct image links ending in `.jpg`, `.png`, or `.gif`
- Right-click on webcam image and select "Open image in new tab"
- Copy the URL from the address bar

**Iframe URLs:**
- YouTube live streams: Use format `https://www.youtube.com/embed/VIDEO_ID`
- Other embeds: Look for "embed" or "share" options on the webcam page

### Testing Webcams

After adding a webcam:
1. Save the `webcams.js` file
2. Refresh the app in your browser
3. Search for a location near your webcam
4. Click "View Webcams" to test

## Search Radius

The app searches for webcams within **50km** of the selected location. Webcams are sorted by distance (closest first).

## Tips

### Finding UK Coastal Webcams

Good sources for UK coastal webcams:
- Local harbour authorities
- Surf check websites (e.g., Surfcheck.co.uk)
- Tourism websites
- Local council websites
- Beach lifeguard stations

### Webcam Embedding Restrictions

Some webcams prevent embedding due to CORS (Cross-Origin) restrictions. If a webcam doesn't display:
- Change `display: "embed"` to `display: "newtab"` in the webcam config
- This will show a message and "Open in New Tab" button only
- Try finding an alternative URL for the same location
- Consider contacting the webcam operator

### When to Use Each Display Mode

**Use `display: "embed"`:**
- Direct image URLs (ending in .jpg, .png, .gif)
- YouTube embed URLs
- Sites that allow embedding
- Your own webcam servers

**Use `display: "newtab"`:**
- Websites that block embedding (CORS errors)
- Surf check sites with multiple webcams on one page
- Sites requiring login or cookies
- Pages with multiple elements beyond the webcam

### Best Practices

1. **Test URLs**: Verify webcam URLs work before adding them
2. **Try Embed First**: Start with `display: "embed"`, switch to `"newtab"` if it doesn't work
3. **Update URLs**: Webcam URLs can change - check periodically
4. **Accurate Coordinates**: Place coordinates at the webcam's actual viewing location
5. **Descriptive Names**: Use clear names like "Falmouth Harbour View"
6. **UK Focus**: Prioritize UK coastal locations relevant to kayaking

## Example Database Structure

```javascript
const MANUAL_WEBCAMS = [
    // Cornwall
    {
        name: "Falmouth Harbour",
        lat: 50.1532,
        lon: -5.0697,
        url: "https://www.falmouth.co.uk/webcam",
        type: "image",
        display: "embed"
    },

    // Devon
    {
        name: "Plymouth Sound",
        lat: 50.3559,
        lon: -4.1425,
        url: "https://www.plymouth.gov.uk/webcam",
        type: "image",
        display: "embed"
    },

    // Wales - this one doesn't embed well, so link only
    {
        name: "Tenby Harbour",
        lat: 51.6723,
        lon: -4.7003,
        url: "https://www.tenby-today.co.uk/webcam/",
        type: "image",
        display: "newtab"
    },

    // Scotland
    {
        name: "Oban Bay",
        lat: 56.4141,
        lon: -5.4720,
        url: "https://www.oban.org.uk/webcam/",
        type: "image",
        display: "embed"
    }
];
```

## Troubleshooting

### Webcam doesn't display
- Check the URL is correct
- Try opening the URL directly in a new tab
- Change `display: "embed"` to `display: "newtab"` in the webcam config
- Some webcams block embedding due to CORS restrictions
- Check browser console (F12) for error messages

### No webcams showing
- Verify coordinates are within 50km of search location
- Check the `webcams.js` file is loaded correctly
- Look for JavaScript errors in browser console (F12)

### Wrong location
- Double-check latitude and longitude values
- Ensure coordinates are in decimal degrees format
- Negative values: West (longitude) and South (latitude)

## Need Help?

- Check browser console for errors (F12)
- Verify file syntax in `webcams.js`
- Test with example webcams first
- Ensure file is saved with correct encoding (UTF-8)
