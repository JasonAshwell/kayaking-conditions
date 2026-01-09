# Location Image Manager Guide

A simple web tool to easily add images to your saved locations.

## Quick Start

1. Open `location-image-manager.html` in your web browser
2. Select a location from the dropdown
3. Upload up to 3 images (drag & drop or click)
4. Click "Generate Setup Instructions"
5. Follow the step-by-step instructions provided

## Features

### 📸 Image Upload
- Drag and drop or click to upload
- Supports JPG and PNG files
- Maximum 3 images per location
- Automatic image preview
- File size recommendations (< 500KB)

### 🎯 Automatic Setup
- Generates properly named files (e.g., `dartmouth-1.jpg`)
- Creates folder structure instructions
- Provides ready-to-use code for `locations.js`
- Download links for all images with correct names

### ✨ User-Friendly
- Lists all your saved locations
- Visual image previews
- Remove images before generating
- Step-by-step instructions
- No server required - runs entirely in browser

## How to Use

### Step 1: Open the Tool

Double-click `location-image-manager.html` to open it in your default browser.

### Step 2: Select Location

Choose one of your saved locations from the dropdown menu. The list is automatically populated from your `js/data/locations.js` file.

### Step 3: Upload Images

**Drag and Drop:**
- Drag up to 3 images onto the upload area
- Images will preview immediately

**Click to Upload:**
- Click the upload area
- Select up to 3 images from your computer

**Requirements:**
- Format: JPG or PNG
- Recommended size: 800x600 pixels
- Keep under 500KB per image for fast loading

### Step 4: Review Images

- Preview all uploaded images
- Click the × button to remove any image
- Upload different images if needed

### Step 5: Generate Instructions

Click "Generate Setup Instructions" to get:

1. **Download Links** - Click each link to save properly named images
2. **Folder Structure** - Shows exactly where to create folders
3. **Code Snippet** - Copy and paste into `locations.js`
4. **Test Instructions** - How to verify everything works

## Example Workflow

Let's add images to Salcombe:

### 1. Select Location
Choose "Salcombe" from dropdown

### 2. Upload Images
Drag 3 photos of Salcombe into the upload area

### 3. Generate
Click "Generate Setup Instructions"

### 4. Download
Click all three download links:
- `salcombe-1.jpg`
- `salcombe-2.jpg`
- `salcombe-3.jpg`

### 5. Create Folder
Make folder: `images/locations/salcombe/`

### 6. Move Files
Move the 3 downloaded images into the folder

### 7. Update Code
Open `js/data/locations.js` and add:

```javascript
{
    name: "Salcombe",
    lat: 50.2394,
    lon: -3.7694,
    description: "Scenic estuary and coastal routes",
    paddlingDescription: "Stunning sheltered estuary...",
    images: [
        "images/locations/salcombe/salcombe-1.jpg",
        "images/locations/salcombe/salcombe-2.jpg",
        "images/locations/salcombe/salcombe-3.jpg"
    ]
}
```

### 8. Test
Refresh your main app and select Salcombe!

## Tips

### Image Selection
- **Image 1**: Main view (estuary/harbour/beach)
- **Image 2**: Launch spot or key landmark
- **Image 3**: Additional detail (caves/islands/coastline)

### Image Optimization
Before uploading, consider:
- Resize to 800x600 or similar landscape ratio
- Compress to reduce file size (use tools like TinyPNG)
- Crop to show the most relevant parts
- Adjust brightness/contrast for clarity

### Best Practices
1. **Use descriptive photos** - Show launch spots, key features
2. **Good lighting** - Avoid very dark or overexposed images
3. **Clear subjects** - Avoid cluttered or confusing compositions
4. **Landscape orientation** - Works best for the gallery layout
5. **No people** - Respect privacy, avoid identifiable individuals

## Troubleshooting

### Location not appearing in dropdown
- Make sure the location exists in `js/data/locations.js`
- Refresh the browser page
- Check browser console for errors (F12)

### Images won't upload
- Check file format (must be JPG or PNG)
- Verify file size (should be under 2MB)
- Try uploading one at a time
- Clear browser cache and reload

### Download links not working
- Make sure popup blocker isn't blocking downloads
- Try right-click → "Save link as" instead
- Use a different browser

### Generated code doesn't work
- Check all commas and brackets in `locations.js`
- Ensure image paths match exactly (case-sensitive)
- Verify images are in correct folder
- Hard refresh browser (Ctrl+Shift+R)

## Limitations

Due to browser security, this tool cannot:
- Directly write files to your computer
- Automatically move images to folders
- Automatically edit `locations.js`

However, it makes the manual steps much easier by:
- Automatically naming files correctly
- Providing download links
- Generating ready-to-use code
- Giving clear step-by-step instructions

## Alternative: Manual Method

If you prefer not to use this tool:

1. Manually create folder: `images/locations/[location-name]/`
2. Copy your images and rename them: `[location-name]-1.jpg`, etc.
3. Manually add the image paths to `locations.js`

The tool just automates these tedious steps!

## Browser Compatibility

Works in all modern browsers:
- Chrome / Edge (recommended)
- Firefox
- Safari
- Opera

## Need Help?

- See main guide: `LOCATIONS-GUIDE.md`
- Check image folder: `images/locations/README.md`
- Review sample setup: `images/locations/SAMPLE-SETUP.md`
