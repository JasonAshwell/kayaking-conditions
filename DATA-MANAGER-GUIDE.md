# Data Manager Guide

The **Data Manager** is a web-based portal for easily managing all your kayaking app databases without manually editing JavaScript files.

**🌐 Access Online:** [https://jasonashwell.github.io/kayaking-conditions/data-manager.html](https://jasonashwell.github.io/kayaking-conditions/data-manager.html)

## Quick Start

1. Open the [Data Manager](https://jasonashwell.github.io/kayaking-conditions/data-manager.html) in your web browser
2. Use the tabs to switch between different data types
3. **Click on the map** to drop a pin and set coordinates automatically
4. Or fill in the forms manually
5. See live map preview of coordinates
6. Download files or copy generated code
7. Import existing files to continue editing

## New Features ✨

### 📍 Click-to-Drop Pin (NEW!)
- **Click anywhere on the map** to instantly set coordinates
- Pin drops exactly where you click
- Latitude and longitude fields auto-populate
- No need to manually type coordinates
- Perfect for finding exact locations visually
- Works on all tabs: Locations, Routes, Parking, Webcams

**How to use:**
1. Zoom and pan the map to find your location
2. Click on the exact spot
3. Pin drops and coordinates are set automatically
4. Continue filling out the rest of the form

### ✏️ Edit Existing Entries
- **Quick Select Dropdown**: Select from dropdown at top of each tab to instantly load an entry for editing
- **Or Click "Edit"**: Click the Edit button on any entry in the list
- Form populates with existing data
- Submit button changes to "Update"
- Cancel editing anytime

**Two ways to edit:**
1. **Quick Select** (fastest): Use the green dropdown at the top → select entry → auto-loads
2. **Scroll & Click**: Scroll to the entry in the list → click "Edit" button

### 🗺️ Live Map Preview
- Interactive map shows your coordinates as you type
- Visual confirmation of location accuracy
- Updates in real-time as you edit coordinates
- Helps catch coordinate errors before saving
- Click to reposition pin anytime

### 💾 File Import/Export
- **Download File**: Generate and download .js files directly
- **Import from File**: Load existing .js files to continue editing
- No more manual copy/paste between files
- Seamlessly work with existing data

## Features

### 📍 Locations Manager
Add and manage saved kayaking locations:
- Name, coordinates, descriptions
- Paddling information
- Image paths
- Edit existing locations
- Map preview for coordinates
- Import/export locations.js

### 🗺️ Routes Manager
Add and manage kayaking routes:
- Route details (name, distance, difficulty)
- Platform links (Strava, Outdoor Active)
- Good conditions / Tricky conditions
- Full route descriptions
- Edit existing routes
- Map preview for coordinates
- Import/export routes.js

### 🅿️ Parking Manager
Add and manage parking locations:
- Parking name and coordinates
- Type (Free, Pay & Display, etc.)
- Descriptions and notes
- Edit existing parking
- Map preview for coordinates
- Import/export parking.js

### 📹 Webcams Manager
Add and manage webcam links:
- Webcam name and coordinates
- URL and type (image/iframe)
- Display mode (embed/new tab)
- Edit existing webcams
- Map preview for coordinates
- Import/export webcams.js

## How to Use

### Step 1: Add Data

1. **Open data-manager.html** in your browser
2. **Select a tab** (Locations, Routes, Parking, or Webcams)
3. **Fill in the form** with your data
4. **Click "Add"** button
5. **Repeat** for all your entries

### Step 2: Review & Edit

- Your entries appear in the **data list** below the form
- Click **Edit** to modify existing entries
- Click **Delete** to remove entries
- Data is automatically saved to your browser's **localStorage**

### Step 3: Use Map Preview

- As you enter lat/lon coordinates, the map updates automatically
- Verify your location is correct visually
- Map shows standard OpenStreetMap view
- Zoom level automatically adjusts to show the location

### Step 4: Save Your Data

**Option A: Download File (Recommended)**
1. Click **"💾 Download File"** button
2. File downloads directly to your computer
3. Move it to `js/data/` folder
4. Replaces the need to manually copy/paste

**Option B: Copy & Paste Code**
1. Scroll to the **"Generated Code"** section
2. Review the JavaScript code
3. Click **"📋 Copy to Clipboard"** button
4. Paste into files manually (see below)

### Step 5: Paste Into Files (if using Copy method)

**Locations:**
1. Open `js/data/locations.js`
2. Find the `const SAVED_LOCATIONS = [...]` line
3. Replace the entire array with your copied code

**Routes:**
1. Open `js/data/routes.js`
2. Find the `const KAYAKING_ROUTES = [...]` line
3. Replace the entire array with your copied code

**Parking:**
1. Open `js/data/parking.js`
2. Find the `const CUSTOM_PARKING = [...]` line
3. Replace the entire array with your copied code

**Webcams:**
1. Open `js/data/webcams.js`
2. Find the `const WEBCAMS = [...]` line
3. Replace the entire array with your copied code

### Step 6: Push to GitHub

```bash
git add js/data/
git commit -m "Update data from management portal"
git push
```

## Working with Existing Data

### Importing Existing Files

If you already have data in your .js files and want to edit it in the portal:

1. Click **"📁 Import from File"** button
2. Select your existing .js file (e.g., `locations.js`)
3. Review the import confirmation showing number of items
4. Click OK to import
5. Data loads into the portal for editing
6. Make your changes
7. Download the updated file

**Important**: Importing replaces all data in localStorage. Make sure you've downloaded or saved any changes first!

### Editing Workflow

**To edit an existing entry:**
1. Find the entry in the list
2. Click the **"Edit"** button (yellow)
3. Form populates with existing data
4. Modify any fields you want
5. Click **"Update [Type]"** button
6. Entry is updated in the list

**To cancel editing:**
- Click the "Cancel" link in the yellow edit mode banner
- Or click "Clear Form" to reset

## Tips & Tricks

### Getting Coordinates

**Option 1: Click-to-Drop Pin (Easiest!)**
1. Zoom and pan the map in the Data Manager
2. Click exactly where you want
3. Coordinates are set automatically
4. Done!

**Option 2: From Google Maps**
1. Right-click on the location
2. Click the coordinates at the top
3. Copy latitude and longitude
4. Paste into Data Manager
5. Verify on the map preview

**Option 3: From the Main App**
1. Search for a location
2. Open browser console (F12)
3. Type: `console.log(resultsDisplay.currentLocation)`
4. Copy the lat/lon values

### Data Persistence

- Data is saved in **localStorage** (your browser)
- Data persists between sessions
- **Important**: Clear browser data = lose saved entries
- Always copy the generated code to your files as backup!

### Map Preview & Click-to-Pin Tips

The interactive map helps you:
- **Click to drop pin** and set coordinates instantly
- **Verify coordinates** are correct before saving
- **Find locations visually** by zooming and panning
- **Visualize location** relative to coastline
- **Catch typos** in coordinates immediately
- **Reposition pin** anytime by clicking a new spot

**Best workflow:**
1. Start by zooming to the general area (UK coast)
2. Pan to find your specific location
3. Click exactly where you want the pin
4. Coordinates auto-populate
5. Fill in the rest of the form
6. Submit!

**Pro tip:** You can also manually type/edit coordinates, and the map updates in real-time. Click to fine-tune the position visually.

### Bulk Operations

For adding many entries at once:
1. Add them one by one in the manager
2. Copy all at the end
3. Paste into your file

### Validation

The manager checks for:
- Required fields (marked with *)
- Proper coordinate format (numbers)
- Valid URLs (for routes and webcams)

Red borders indicate required fields.

## Example Workflow

### Adding a New Location (with Click-to-Pin)

1. **Open the [Data Manager](https://jasonashwell.github.io/kayaking-conditions/data-manager.html)**
2. **Locations tab** → Use the map:
   - Zoom to Plymouth area on the map
   - **Click on Plymouth Sound** - coordinates auto-fill!
   - Name: "Plymouth Sound"
   - Description: "Large sheltered bay"
   - Paddling Description: "Expansive sheltered bay perfect for exploring..."
3. **Click "Add Location"**
4. **See it appear** in the list below
5. **Click "Download File"**
6. **Move the file** to `js/data/` folder (or copy code and paste)
7. **Save and push** to GitHub

### Adding a Route with Conditions

1. **Routes tab** → Fill in:
   - Name: "Dartmouth to The Mew Stone"
   - Lat: 50.3515, Lon: -3.5794
   - URL: your Strava link
   - Type: Strava
   - Distance: 12km
   - Difficulty: Moderate
   - Good Conditions: "Slack water, light offshore winds"
   - Tricky Conditions: "Strong SW winds create rough seas"
2. **Add Route**
3. **Copy code** → paste into `routes.js`

## Advantages Over Manual Editing

✅ **No JavaScript knowledge needed**
✅ **Click-to-drop pins** on interactive maps
✅ **Visual forms** instead of code syntax
✅ **Validation** prevents errors
✅ **No typos** in object structure
✅ **Live map preview** for coordinates
✅ **Edit existing entries** easily
✅ **Import existing files** to continue editing
✅ **Download files** directly - no copy/paste
✅ **Preview** before committing
✅ **Easier** to add many entries
✅ **Mobile-friendly** interface
✅ **Accessible online** - no local setup needed

## Limitations

❌ **No bulk upload** (CSV/JSON import)
❌ **Browser-based** only (no server sync)
❌ **Data stored in localStorage** (can be cleared)

## Troubleshooting

### Generated code looks wrong
- Check all required fields are filled
- Ensure coordinates are numbers (not text)
- Review the preview before copying

### Lost my data
- Data is in localStorage - clearing browser data deletes it
- Always copy generated code as backup
- Keep your actual data files as source of truth

### Can't paste code
- Make sure you copied from the code box
- Check you're pasting in the right array
- Don't delete the `const ARRAY_NAME =` part
- Keep the semicolon at the end

### Changes not showing on website
- Did you save the JavaScript file?
- Did you push to GitHub?
- GitHub Pages needs 1-2 minutes to rebuild
- Try hard refresh (Ctrl+Shift+R)

## Complete Workflow Examples

### First-Time Setup (Using Click-to-Pin)

1. Open the [Data Manager online](https://jasonashwell.github.io/kayaking-conditions/data-manager.html)
2. Go to Locations tab
3. Zoom map to UK coast, find Salcombe
4. **Click on Salcombe** - pin drops and coordinates auto-fill
5. Fill in name: "Salcombe"
6. Add description and paddling info
7. Click "Add Location"
8. Repeat for more locations
9. Click "Download File"
10. Move downloaded file to `js/data/` folder
11. Push to GitHub

### Updating Existing Data

1. Open the [Data Manager online](https://jasonashwell.github.io/kayaking-conditions/data-manager.html)
2. Click "Import from File"
3. Select your existing `locations.js` (or other file)
4. Click "Edit" on any entry
5. **Click map to reposition** or edit other fields
6. Click "Update Location"
7. Add new entries by clicking map
8. Click "Download File"
9. Replace old file in `js/data/`
10. Push to GitHub

### Quick Additions

1. Open the [Data Manager online](https://jasonashwell.github.io/kayaking-conditions/data-manager.html)
2. Import existing file (to preserve data in localStorage)
3. **Click map** to drop pins for new locations
4. Fill in details
5. Download updated file
6. Push to GitHub

## Best Practices

1. **Import first** before adding new entries (to avoid losing data)
2. **Download files** instead of copy/paste (faster, fewer errors)
3. **Test on localhost** before pushing
4. **Commit regularly** to Git
5. **Back up your data files** periodically
6. **Use Edit button** instead of delete + re-add

## Future Enhancements

Potential features for future versions:
- Bulk CSV/JSON import
- Export to multiple formats
- Duplicate detection
- Batch operations (delete multiple, etc.)
- Search/filter entries
- Sort entries by different fields
- Drag and drop to reorder entries
- Map view showing all saved locations

## Security Note

This manager runs entirely in your browser. No data is sent to any server. Everything is stored locally in your browser's localStorage.

---

**Tip**: Bookmark `data-manager.html` for quick access when you want to add new locations or routes!
