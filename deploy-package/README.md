# V2R Cheques Management Server

## 🚀 Deployment Instructions

### Prerequisites
- Node.js 14+ installed
- Access to SQL Server database
- Port 3000 available (or change in config.env)

### Quick Start
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Edit `config.env` with your database credentials
   - Update CORS origins if needed

3. **Start server:**
   ```bash
   npm start
   ```

### Production Deployment

#### Option 1: PM2 (Recommended)
```bash
npm install -g pm2
pm2 start index.js --name "v2r-cheques-server"
pm2 startup
pm2 save
```

#### Option 2: Systemd Service
Create `/etc/systemd/system/v2r-cheques.service`:
```ini
[Unit]
Description=V2R Cheques Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/server
ExecStart=/usr/bin/node index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable v2r-cheques
sudo systemctl start v2r-cheques
```

#### Option 3: Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
- `DB_SERVER`: SQL Server IP/hostname
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (production/development)

### Health Check
Test if server is running:
```bash
curl http://localhost:3000/health
```

### API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/buildings` - Get all buildings
- `GET /api/apartments` - Get apartments (with optional BuildingID filter)
- `GET /api/cheques/detail` - Get cheque details
- `GET /api/cheques/summary` - Get cheque summary
- `GET /health` - Server health check

### Troubleshooting
- Check database connectivity
- Verify SQL Server stored procedures exist
- Check firewall settings for port 3000
- Review server logs for errors
