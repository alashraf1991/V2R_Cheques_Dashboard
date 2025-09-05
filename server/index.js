const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Database connection
const sql = require('mssql');
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true
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
    
    // Pass BuildingID parameter to the stored procedure if provided
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
    
    // Note: Your stored procedures expect BuildingID and ApartmentID as integers
    // If you want to filter by names, you'll need to modify the stored procedures
    // For now, we'll get all cheques and filter by names in the frontend
    const result = await request.execute('sp_GetChequesDetail');
    
    // Filter by building name and apartment name if provided
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
    
    // Note: Your stored procedures expect BuildingID and ApartmentID as integers
    // If you want to filter by names, you'll need to modify the stored procedures
    // For now, we'll get all cheques and calculate summary in the frontend
    const result = await request.execute('sp_GetChequesSummary');
    
    // If filters are applied, we need to get the detail data and filter it
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
    
    console.log('Login attempt for username:', username);
    
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
    
    console.log('Calling sp_Login with parameters:', { username, password });
    
    const result = await request.execute('sp_Login');
    
    console.log('sp_Login result:', result);
    console.log('Result recordset:', result.recordset);
    console.log('Result recordset length:', result.recordset ? result.recordset.length : 'undefined');
    
    // Check if the stored procedure returned any data
    if (result.recordset && result.recordset.length > 0) {
      const loginResult = result.recordset[0];
      console.log('First record from sp_Login:', loginResult);
      console.log('All columns in result:', Object.keys(loginResult));
      
      // Check for LoginSuccess column specifically
      if (loginResult.LoginSuccess === true || loginResult.LoginSuccess === 1 || loginResult.LoginSuccess === '1') {
        console.log('Login successful for user:', username);
        res.json({
          success: true,
          message: 'Login successful',
          user: {
            username: username,
            // Add any other user data returned by the SP
          }
        });
      } else {
        console.log('Login failed - LoginSuccess is not true');
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } else {
      console.log('No records returned from sp_Login');
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

// Serve Vue app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});
