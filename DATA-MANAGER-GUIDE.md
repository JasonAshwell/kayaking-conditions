# Data Manager Guide

The **Data Manager** is a web-based portal for easily managing all your kayaking app databases without manually editing JavaScript files.

## Quick Start

1. Open `data-manager.html` in your web browser
2. Use the tabs to switch between different data types
3. Fill in the forms to add entries
4. Copy the generated code
5. Paste into your data files

## Features

### 📍 Locations Manager
Add and manage saved kayaking locations:
- Name, coordinates, descriptions
- Paddling information
- Image paths

### 🗺️ Routes Manager
Add and manage kayaking routes:
- Route details (name, distance, difficulty)
- Platform links (Strava, Outdoor Active)
- Good conditions / Tricky conditions
- Full route descriptions

### 🅿️ Parking Manager
Add and manage parking locations:
- Parking name and coordinates
- Type (Free, Pay & Display, etc.)
- Descriptions and notes

### 📹 Webcams Manager
Add and manage webcam links:
- Webcam name and coordinates
- URL and type (image/iframe)
- Display mode (embed/new tab)

## How to Use

### Step 1: Add Data

1. **Open data-manager.html** in your browser
2. **Select a tab** (Locations, Routes, Parking, or Webcams)
3. **Fill in the form** with your data
4. **Click "Add"** button
5. **Repeat** for all your entries

### Step 2: Review

- Your entries appear in the **data list** below the form
- You can **delete** entries if you make a mistake
- Data is automatically saved to your browser's **localStorage**

### Step 3: Copy Code

1. Scroll to the **"Generated Code"** section
2. Review the JavaScript code
3. Click **"📋 Copy to Clipboard"** button

### Step 4: Paste Into Files

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

### Step 5: Push to GitHub

```bash
git add js/data/
git commit -m "Update data from management portal"
git push
```

## Tips & Tricks

### Getting Coordinates

**From Google Maps:**
1. Right-click on the location
2. Click the coordinates at the top
3. Copy latitude and longitude

**From the App:**
1. Search for a location
2. Open browser console (F12)
3. Type: `console.log(resultsDisplay.currentLocation)`
4. Copy the lat/lon values

### Data Persistence

- Data is saved in **localStorage** (your browser)
- Data persists between sessions
- **Important**: Clear browser data = lose saved entries
- Always copy the generated code to your files as backup!

### Editing Entries

Currently, the manager doesn't have an edit feature. To edit:
1. Delete the entry
2. Re-add with corrected information

Or:
1. Copy the generated code
2. Edit manually in a text editor
3. Paste back into the data file

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

### Adding a New Location

1. **Open data-manager.html**
2. **Locations tab** → Fill in:
   - Name: "Plymouth Sound"
   - Lat: 50.3559
   - Lon: -4.1425
   - Description: "Large sheltered bay"
   - Paddling Description: "Expansive sheltered bay perfect for exploring..."
3. **Click "Add Location"**
4. **See it appear** in the list below
5. **Copy generated code**
6. **Open** `js/data/locations.js`
7. **Replace** the array
8. **Save and push** to GitHub

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
✅ **Visual forms** instead of code syntax
✅ **Validation** prevents errors
✅ **No typos** in object structure
✅ **Preview** before committing
✅ **Easier** to add many entries
✅ **Mobile-friendly** interface

## Limitations

❌ **No import** from existing files (yet)
❌ **No edit** function (delete and re-add instead)
❌ **No bulk upload** (CSV/JSON import)
❌ **Browser-based** only (no server sync)

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

## Best Practices

1. **Use the manager for additions**, not as your only copy
2. **Always copy code to files** after adding entries
3. **Test on localhost** before pushing
4. **Commit regularly** to Git
5. **Back up your data files** periodically

## Future Enhancements

Potential features for future versions:
- Import existing data from files
- Edit existing entries
- Bulk CSV/JSON import
- Export to multiple formats
- Validation preview
- Map preview for coordinates
- Duplicate detection

## Security Note

This manager runs entirely in your browser. No data is sent to any server. Everything is stored locally in your browser's localStorage.

---

**Tip**: Bookmark `data-manager.html` for quick access when you want to add new locations or routes!
