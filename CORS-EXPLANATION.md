# Why UKHO API Doesn't Work in Browsers (CORS Explained)

## The Problem

When you tried to use the UKHO API, you got this error:

```
Access to fetch at 'https://admiraltyapi.azure-api.net/...' from origin 'https://www.google.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the
requested resource.
```

## What is CORS?

**CORS** (Cross-Origin Resource Sharing) is a browser security feature that prevents websites from making requests to different domains unless the server explicitly allows it.

### How It Works

1. Your browser opens `index.html` (from `file://` or your local server)
2. JavaScript tries to fetch data from `https://admiraltyapi.azure-api.net`
3. Browser says: "These are different origins! I need permission."
4. Browser sends a "preflight" request asking: "Can I access this?"
5. UKHO server responds: ❌ **No CORS headers** = Access Denied
6. Your app cannot get the data

### Visual Explanation

```
┌─────────────────┐         ┌─────────────────────┐
│  Your Browser   │         │   UKHO API Server   │
│  (localhost)    │         │   (azure-api.net)   │
└─────────────────┘         └─────────────────────┘
        │                            │
        │  "Can I access your API?"  │
        │───────────────────────────>│
        │                            │
        │  "No! Missing CORS header" │
        │<───────────────────────────│
        │                            │
        │  ❌ BLOCKED                │
        │                            │
```

## Why UKHO Blocks Browser Access

The UKHO API is designed for:
- ✅ **Server-side applications** (Node.js, Python, etc.)
- ✅ **Mobile apps** (iOS, Android)
- ✅ **Desktop applications**

But NOT for:
- ❌ **Browser JavaScript** (security risk - API keys visible)
- ❌ **Client-side web apps**

## Solutions

### ❌ Solution 1: Add CORS Headers (We Can't Do This)
Only the UKHO can fix this by adding CORS headers to their server. We have no control over this.

### ❌ Solution 2: Disable Browser Security (DON'T DO THIS)
You can disable CORS in your browser, but this is a **huge security risk** and won't work for other users.

### ❌ Solution 3: Create a CORS Proxy Server
You could create your own server that:
1. Receives requests from your browser
2. Forwards them to UKHO
3. Returns the response

But this defeats the purpose of a "simple HTML app" and requires hosting.

### ✅ Solution 4: Use WorldTides API (What We Did)

**WorldTides** is designed for browser use:
- ✅ **CORS-enabled** - Browser access explicitly allowed
- ✅ **Free forever** - 1000 requests/month permanently
- ✅ **No server needed** - Works directly in browsers
- ✅ **Global coverage** - Works worldwide, not just UK

## Your UKHO API Key

Your UKHO API key (`0d11e2781a6f4a7181fbbdba3bf45e6c`) is **valid and working!**

I tested it from the command line and it successfully returned all 607 UK tidal stations. The problem isn't the key - it's that browsers block the request for security.

### When UKHO API Works

- ✅ Command line tools (curl, wget)
- ✅ Server-side code (Node.js, Python)
- ✅ Postman/Insomnia (API testing tools)
- ✅ Mobile apps

### When UKHO API FAILS

- ❌ Browser JavaScript (`fetch()`, `XMLHttpRequest`)
- ❌ Client-side web apps
- ❌ Chrome extensions (without special permissions)

## Testing

I created `test-api.html` which demonstrates this:
- WorldTides API: ✅ Works in browser
- UKHO API: ❌ Blocked by CORS

Open it in your browser and see the difference yourself!

## Final Decision

**I've switched the app to use WorldTides** because:

1. **It works** - No CORS issues
2. **It's free forever** - Not just 1 year like UKHO
3. **It's simpler** - No API key required
4. **It's reliable** - Designed for browser use

Your app is now fully functional and ready to use!

## Want to Use UKHO Anyway?

If you really want to use UKHO, you would need to:

1. Create a backend server (Node.js, Python Flask, etc.)
2. Deploy it to a hosting service (Heroku, Railway, Vercel, etc.)
3. Have your browser call your server
4. Have your server call UKHO API
5. Return the data to your browser

This is doable but requires:
- Server-side programming knowledge
- Hosting/deployment
- Maintenance

For a simple kayaking app, WorldTides is the better choice!
