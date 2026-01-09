# Sample Image Setup

## Quick Start

To add images to a location, follow this simple process:

### Step 1: Create a Folder

Create a folder with your location name (lowercase, hyphens for spaces):

```
images/locations/dartmouth/
```

### Step 2: Add Your Images

Add up to 3 images:

```
images/locations/dartmouth/
├── dartmouth-1.jpg
├── dartmouth-2.jpg
└── dartmouth-3.jpg
```

### Step 3: Update locations.js

Edit `js/data/locations.js`:

```javascript
{
    name: "Dartmouth",
    lat: 50.3515,
    lon: -3.5794,
    description: "River Dart estuary",
    paddlingDescription: "Beautiful sheltered estuary with historic castle...",
    images: [
        "images/locations/dartmouth/dartmouth-1.jpg",
        "images/locations/dartmouth/dartmouth-2.jpg",
        "images/locations/dartmouth/dartmouth-3.jpg"
    ]
}
```

## Example Folder Structure

```
images/locations/
├── README.md
├── SAMPLE-SETUP.md (this file)
├── dartmouth/
│   ├── dartmouth-1.jpg
│   ├── dartmouth-2.jpg
│   └── dartmouth-3.jpg
├── salcombe/
│   ├── salcombe-1.jpg
│   └── salcombe-2.jpg
└── plymouth-sound/
    ├── plymouth-1.jpg
    ├── plymouth-2.jpg
    └── plymouth-3.jpg
```

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: 800x600 pixels (landscape)
- **File size**: < 500KB each
- **Content**: Launch spots, views, key features
- **Naming**: `[location-name]-[1-3].jpg`

## Testing

1. Add your images to the folder
2. Update `js/data/locations.js`
3. Refresh the app in your browser
4. Select the location from the dropdown
5. Images should appear below the location description

## Need Help?

See the full guide at: `LOCATIONS-GUIDE.md`
