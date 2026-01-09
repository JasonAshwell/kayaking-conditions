# Location Images

This folder contains images for saved locations displayed in the app.

## Folder Structure

Organize images by location name:

```
images/locations/
├── dartmouth/
│   ├── dartmouth-1.jpg
│   ├── dartmouth-2.jpg
│   └── dartmouth-3.jpg
├── salcombe/
│   ├── salcombe-1.jpg
│   ├── salcombe-2.jpg
│   └── salcombe-3.jpg
└── falmouth/
    ├── falmouth-1.jpg
    └── falmouth-2.jpg
```

## Adding Images

1. Create a folder with the location name (lowercase, use hyphens for spaces)
2. Add up to 3 images per location
3. Recommended image format: JPG or PNG
4. Recommended size: 800x600 pixels or similar landscape ratio
5. Keep file sizes reasonable (< 500KB per image for fast loading)

## Naming Convention

Use descriptive names:
- `[location-name]-1.jpg` (main view)
- `[location-name]-2.jpg` (alternative view)
- `[location-name]-3.jpg` (additional detail)

## Example

For Salcombe location:
- Folder: `images/locations/salcombe/`
- Images:
  - `salcombe-1.jpg` (estuary view)
  - `salcombe-2.jpg` (beach launch)
  - `salcombe-3.jpg` (coastal paddle)

In `js/data/locations.js`:
```javascript
{
    name: "Salcombe",
    lat: 50.2394,
    lon: -3.7694,
    description: "Scenic estuary",
    paddlingDescription: "Beautiful sheltered estuary...",
    images: [
        "images/locations/salcombe/salcombe-1.jpg",
        "images/locations/salcombe/salcombe-2.jpg",
        "images/locations/salcombe/salcombe-3.jpg"
    ]
}
```

## Tips

- Take photos on good weather days
- Include launch/landing spots
- Show key features (beaches, rocks, islands)
- Consider different tide states if relevant
- Respect privacy - avoid identifiable people
- You own the copyright or have permission to use images
