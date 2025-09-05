# 🌐 CORS Configuration Setup Guide

## Problem
Your frontend (https://hamdan.v2r.systems) is trying to make requests to your backend (http://5.104.107.109:3000), but the browser is blocking these requests due to CORS (Cross-Origin Resource Sharing) policy violations.

## Solution Implemented
I've updated your `index.js` file with a comprehensive CORS configuration that:

1. ✅ Allows requests from your production frontend domain
2. ✅ Handles preflight requests properly
3. ✅ Includes proper security headers
4. ✅ Supports credentials for authenticated requests
5. ✅ Provides fallback for local development

## Changes Made

### 1. Enhanced CORS Configuration
```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://hamdan.v2r.systems',  // Your production frontend domain
      'http://hamdan.v2r.systems',   // Fallback for HTTP
      'http://localhost:3000',       // Local development
      'http://localhost:3001',       // Local development alternative port
      'http://localhost:5173',       // Vite default port
      'http://localhost:8080'        // Alternative local port
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight response for 24 hours
}));
```

### 2. Preflight Request Handler
```javascript
// Handle CORS preflight requests
app.options('*', cors());
```

### 3. Additional CORS Headers
```javascript
// Additional headers for CORS and security
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### 4. CORS Test Endpoint
Added `/api/cors-test` endpoint to verify CORS is working:
```javascript
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS is working!', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method
  });
});
```

## Deployment Steps

### 1. Restart Your Backend Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

### 2. Verify CORS is Working
You should see these log messages when the server starts:
```
🚀 V2R Cheques Server running on port 3000
📊 Environment: production
🔗 Health check: http://localhost:3000/health
🌐 CORS enabled for: https://hamdan.v2r.systems
🔒 CORS credentials: enabled
```

### 3. Test CORS Configuration
Use the provided `cors-test.html` file to test your CORS setup:

1. Open `cors-test.html` in your browser
2. Click "Test CORS" button
3. Verify that the request succeeds

## Testing Your Frontend

### 1. Test from Your Production Frontend
In your frontend code, make sure you're using the correct backend URL:
```javascript
const API_BASE = 'http://5.104.107.109:3000';

// Example API call
const response = await fetch(`${API_BASE}/api/buildings`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### 2. Test Individual Endpoints
You can test these endpoints directly:
- `GET http://5.104.107.109:3000/api/cors-test` - CORS test
- `GET http://5.104.107.109:3000/api/buildings` - Buildings data
- `GET http://5.104.107.109:3000/api/apartments` - Apartments data
- `GET http://5.104.107.109:3000/health` - Health check

## Troubleshooting

### If CORS Still Doesn't Work:

1. **Check Server Logs**: Look for CORS-related errors in your server console
2. **Verify Origin**: Make sure your frontend is actually running on `https://hamdan.v2r.systems`
3. **Check Browser Console**: Look for CORS errors in the browser's developer tools
4. **Test with curl**: Use curl to test the API directly:
   ```bash
   curl -H "Origin: https://hamdan.v2r.systems" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        http://5.104.107.109:3000/api/cors-test
   ```

### Common Issues:

1. **Mixed Content**: Your frontend is HTTPS but backend is HTTP
   - Solution: Consider using HTTPS for your backend or a reverse proxy
   
2. **Port Mismatch**: Make sure you're using port 3000 for the backend
   
3. **Firewall**: Ensure port 3000 is open on your server

## Security Considerations

⚠️ **Important**: The current configuration allows credentials and specific origins. For production:

1. **Limit Origins**: Only allow the domains you actually need
2. **HTTPS Backend**: Consider using HTTPS for your backend API
3. **Rate Limiting**: Implement rate limiting for your API endpoints
4. **Input Validation**: Ensure all API inputs are properly validated

## Next Steps

1. ✅ Deploy the updated backend code
2. ✅ Test CORS with the provided test file
3. ✅ Verify your frontend can now make requests successfully
4. 🔄 Consider implementing HTTPS for your backend (recommended for production)

## Support

If you continue to experience CORS issues after implementing these changes, please check:
1. Server logs for error messages
2. Browser console for CORS errors
3. Network tab in browser dev tools for request/response details
4. That your frontend is actually making requests to the correct backend URL
