const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Middleware
app.use(helmet());
app.use(compression());

// CORS configuration - allow requests from your frontend domain
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://hamdan.v2r.systems',  // Your production frontend domain
      'http://hamdan.v2r.systems',   // Fallback for HTTP
      'https://system.v2r.ae',       // Your new API domain
      'http://system.v2r.ae',        // Fallback for HTTP
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
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  maxAge: 86400 // Cache preflight response for 24 hours
}));

app.use(express.json());

// Handle CORS preflight requests
app.options('*', cors());

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

// Database connection
const sql = require('mssql');
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// API Routes
app.get('/api/buildings', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().execute('sp_GetBuildings');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching buildings:', err);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});

app.get('/api/apartments', async (req, res) => {
  try {
    const { buildingId } = req.query;
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    
    if (buildingId) {
      request.input('BuildingID', sql.Int, parseInt(buildingId));
    }
    
    const result = await request.execute('sp_GetApartments');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching apartments:', err);
    res.status(500).json({ error: 'Failed to fetch apartments' });
  }
});

app.get('/api/cheques/detail', async (req, res) => {
  try {
    const { fromDate, toDate, buildingName, apartmentName } = req.query;
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    
    if (fromDate) request.input('FromDate', sql.Date, new Date(fromDate));
    if (toDate) request.input('ToDate', sql.Date, new Date(toDate));
    
    const result = await request.execute('sp_GetChequesDetail');
    
    let filteredResult = result.recordset;
    if (buildingName) {
      filteredResult = filteredResult.filter(cheque => cheque.BuildingName === buildingName);
    }
    if (apartmentName) {
      filteredResult = filteredResult.filter(cheque => cheque.ApartmentName === apartmentName);
    }
    
    res.json(filteredResult);
  } catch (err) {
    console.error('Error fetching cheque details:', err);
    res.status(500).json({ error: 'Failed to fetch cheque details' });
  }
});

app.get('/api/cheques/summary', async (req, res) => {
  try {
    const { fromDate, toDate, buildingName, apartmentName } = req.query;
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    
    if (fromDate) request.input('FromDate', sql.Date, new Date(fromDate));
    if (toDate) request.input('ToDate', sql.Date, new Date(toDate));
    
    const result = await pool.request().execute('sp_GetChequesSummary');
    
    if (buildingName || apartmentName) {
      const detailResult = await pool.request().execute('sp_GetChequesDetail');
      let filteredCheques = detailResult.recordset;
      
      if (buildingName) {
        filteredCheques = filteredCheques.filter(cheque => cheque.BuildingName === buildingName);
      }
      if (apartmentName) {
        filteredCheques = filteredCheques.filter(cheque => cheque.ApartmentName === apartmentName);
      }
      
      const summary = {
        NumberOfCheques: filteredCheques.length,
        TotalAmount: filteredCheques.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
      };
      
      res.json(summary);
    } else {
      res.json(result.recordset[0] || { NumberOfCheques: 0, TotalAmount: 0 });
    }
  } catch (err) {
    console.error('Error fetching cheque summary:', err);
    res.status(500).json({ error: 'Failed to fetch cheque summary' });
  }
});

// Login API endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    
    request.input('Username', sql.NVarChar, username);
    request.input('Password', sql.NVarChar, password);
    
    const result = await request.execute('sp_Login');
    
    if (result.recordset && result.recordset.length > 0) {
      const loginResult = result.recordset[0];
      
      if (loginResult.LoginSuccess === true || loginResult.LoginSuccess === 1 || loginResult.LoginSuccess === '1') {
        res.json({
          success: true,
          message: 'Login successful',
          user: { username: username }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS is working!', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Request body:', req.body);
  console.error('Request headers:', req.headers);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'Invalid JSON format', 
      details: 'Request body must be valid JSON',
      received: req.body
    });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// HTTP Server (for development/testing)
app.listen(PORT, () => {
  console.log(`🚀 V2R Cheques Server running on port ${PORT} (HTTP)`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for: https://hamdan.v2r.systems`);
  console.log(`🔒 CORS credentials: enabled`);
});

// HTTPS Server (for production)
try {
  let httpsOptions;
  
  // Try Windows PFX format first
  if (fs.existsSync('./ssl/certificate.pfx')) {
    httpsOptions = {
      pfx: fs.readFileSync('./ssl/certificate.pfx'),
      passphrase: 'password123'
    };
    console.log('🔒 Using Windows PFX certificate format');
  }
  // Try Linux PEM format
  else if (fs.existsSync('./ssl/private.key') && fs.existsSync('./ssl/certificate.crt')) {
    httpsOptions = {
      key: fs.readFileSync('./ssl/private.key'),
      cert: fs.readFileSync('./ssl/certificate.crt')
    };
    console.log('🔒 Using Linux PEM certificate format');
  }
  // Try custom SSL config
  else if (fs.existsSync('./ssl/ssl-config.js')) {
    httpsOptions = require('./ssl/ssl-config.js');
    console.log('🔒 Using custom SSL configuration');
  }
  
  if (httpsOptions) {
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`🔒 V2R Cheques Server running on port ${HTTPS_PORT} (HTTPS)`);
      console.log(`🔗 Health check: https://localhost:${HTTPS_PORT}/health`);
      console.log(`🌐 CORS enabled for: https://hamdan.v2r.systems`);
      console.log(`🔒 CORS credentials: enabled`);
    });
  } else {
    throw new Error('No valid SSL configuration found');
  }
} catch (error) {
  console.log('⚠️  HTTPS not configured - SSL certificates not found');
  console.log('💡 To enable HTTPS on Windows Server:');
  console.log('   1. Run setup-ssl-windows.bat as Administrator');
  console.log('   2. Or place SSL certificates in ./ssl/ folder:');
  console.log('      - certificate.pfx (Windows PFX format)');
  console.log('      - private.key + certificate.crt (Linux PEM format)');
  console.log('      - ssl-config.js (custom configuration)');
}
