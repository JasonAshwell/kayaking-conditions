# How to Get Your Free WorldTides API Key (2 Minutes)

WorldTides provides **1000 free requests per month forever** - more than enough for personal kayaking trip planning!

## Step-by-Step Instructions

### 1. Register for Free Account

Visit: **https://www.worldtides.info/register**

Fill in:
- Email address
- Password
- Name (can be anything)

Click **"Create Account"**

### 2. Verify Your Email

- Check your email inbox
- Click the verification link
- Your account is now active!

### 3. Get Your API Key

- Log in at: https://www.worldtides.info/login
- Go to: https://www.worldtides.info/account
- Under **"API Keys"** section, you'll see your key
- It looks like: `135660c8-6da3-4b8f-baf2-eb3f3c56b6c9`

### 4. Add Key to the App

Open `js/utils/config.js` and find this line (around line 7):

```javascript
apiKey: '', // Leave empty for free tier, or add your key for more requests
```

Replace it with:

```javascript
apiKey: 'YOUR-API-KEY-HERE', // Your actual key
```

And change this line (around line 9):

```javascript
useFreeMode: true
```

To:

```javascript
useFreeMode: false
```

### 5. Done!

Save the file and refresh your browser. The app now works!

## Why Register?

- ✅ **Permanently Free** - 1000 requests/month forever
- ✅ **No Credit Card** - Completely free, no payment needed
- ✅ **Takes 2 Minutes** - Fastest setup possible
- ✅ **Global Coverage** - Works worldwide
- ✅ **Accurate Data** - High-quality tide predictions

## Free Tier Limits

- **1000 requests/month** = ~33 requests/day
- Each search uses 1 request
- More than enough for personal use!
- If you hit the limit, it resets next month

## Need Help?

If you have any issues:
1. Check your email for the verification link
2. Make sure you copied the full API key (including dashes)
3. Check `js/utils/config.js` has the key in quotes
4. Try clearing your browser cache (Ctrl+F5)

## Alternative: Use Without API Key (Limited)

The app will try to work without an API key, but you may hit rate limits quickly. Registering is highly recommended!
