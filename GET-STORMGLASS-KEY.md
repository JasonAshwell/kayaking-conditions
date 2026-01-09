# How to Get Your Free Stormglass API Key

Stormglass provides highly accurate marine data including wave heights, wave periods, wave directions, swell, ocean currents, and sea temperature - specifically designed for coastal areas where kayakers paddle. The free tier includes 50 requests per day (enough for typical kayaking trip planning).

## Step 1: Sign Up for Free Account

1. Visit https://stormglass.io/
2. Click **"Sign Up"** or **"Get Started Free"**
3. Create your account with email and password
4. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Stormglass account
2. Go to your **Dashboard** at https://dashboard.stormglass.io/
3. Under the **API** section, you'll see your API key
4. Copy the API key (it looks like: `abc123def456-abc1-2345-6789-abcdef123456`)

## Step 3: Add the API Key to Your App

1. Open the file: `js/utils/config.js`
2. Find this line (around line 22):
   ```javascript
   apiKey: '', // User needs to add their API key from https://stormglass.io/
   ```
3. Replace it with:
   ```javascript
   apiKey: 'YOUR-ACTUAL-API-KEY-HERE',
   ```
4. Save the file

## Step 4: Test It

1. Refresh your browser
2. Search for a coastal location
3. Open the browser console (F12) - you should see "Using Stormglass marine data (more accurate)"
4. Check the Marine Conditions table - all data (waves, currents, temperature) is now from Stormglass

## Important Notes

- **Free Tier Limit**: 50 requests per day
- **What counts as a request**: Each time you search for conditions = 1 request
- **Rate limit reached**: If you hit the 50/day limit, sea temperature will show "N/A" but everything else still works
- **Data Coverage**: Works best for coastal areas where kayaking happens
- **Caching**: Data is cached for 6 hours to minimize API usage

## Troubleshooting

**Sea temperature still shows "N/A":**
- Check that you copied the API key correctly (no extra spaces)
- Make sure you saved the config.js file
- Refresh your browser (clear cache if needed)
- Check browser console for any error messages

**Rate limit reached:**
- You've used your 50 requests for today
- Wait until tomorrow (resets at midnight UTC)
- Or upgrade to a paid plan at stormglass.io

## Privacy & Security

- Your API key is stored locally in your browser only
- For public deployment, consider using a backend proxy to hide the API key
- Monitor your usage at https://dashboard.stormglass.io/

## Why Stormglass?

- ✅ **Coastal accuracy**: Specifically designed for coastal marine data where kayaking happens
- ✅ **Complete marine data**: Wave heights, periods, directions, swell, currents, and temperature
- ✅ **Multiple sources**: Combines NOAA, MetOffice, and other trusted sources for best accuracy
- ✅ **Free tier**: Generous 50 requests/day
- ✅ **CORS-enabled**: Works directly in browsers
- ✅ **Automatic fallback**: If unavailable, automatically uses Open-Meteo as backup

## How the App Uses Data Sources

The app now uses an intelligent fallback system:

1. **Primary**: Stormglass API (most accurate, especially for coastal areas)
   - Used when API key is configured and requests available
   - Provides all marine data: waves, currents, temperature

2. **Fallback**: Open-Meteo Marine API (always available)
   - Used if Stormglass is unavailable or rate limit reached
   - Free and unlimited, but less accurate for coastal areas

**Your app will automatically use the best available source!**

Enjoy highly accurate marine data for your kayaking trips!
