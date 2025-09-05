# V2R Cheques Dashboard

A modern, responsive dashboard for managing building and cheque data built with Node.js backend and Vue.js frontend.

## Features

- **Dashboard Overview**: Real-time summary cards and charts
- **Cheques Management**: Detailed view with filtering and export capabilities
- **Buildings Management**: Building overview with statistics and details
- **Apartments Management**: Apartment information with filtering and search
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Real-time Data**: Live data from SQL Server stored procedures
- **Export Functionality**: CSV export for cheque data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MSSQL** - SQL Server database driver
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Date-fns** - Date utility library

## Prerequisites

- Node.js (v16 or higher)
- SQL Server database with the following stored procedures:
  - `sp_GetBuildings`
  - `sp_GetApartments`
  - `sp_GetChequesDetail`
  - `sp_GetChequesSummary`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd V2R_ChequesDashboard
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   - Copy `config.env` and update with your database credentials:
   ```env
   DB_SERVER=your_server_ip
   DB_NAME=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

1. **Start both backend and frontend simultaneously**
   ```bash
   npm run dev
   ```

2. **Or start them separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Buildings
- `GET /api/buildings` - Get all buildings

### Apartments
- `GET /api/apartments` - Get all apartments
- `GET /api/apartments?buildingId=X` - Get apartments for specific building

### Cheques
- `GET /api/cheques/detail` - Get detailed cheque information
- `GET /api/cheques/detail?fromDate=X&toDate=Y&buildingId=Z&apartmentId=W` - Filtered cheques
- `GET /api/cheques/summary` - Get cheque summary statistics
- `GET /api/cheques/summary?fromDate=X&toDate=Y&buildingId=Z&apartmentId=W` - Filtered summary

## Database Schema Requirements

The application expects the following data structure from your stored procedures:

### Buildings (`sp_GetBuildings`)
- `BuildingID` (int)
- `BuildingName` (varchar)
- `BuildingNumber` (varchar, optional)

### Apartments (`sp_GetApartments`)
- `ApartmentID` (int)
- `ApartmentName` (varchar)
- `BuildingID` (int)
- `FloorNumber` (int)
- `ApartmentNumber` (varchar, optional)

### Cheques (`sp_GetChequesDetail`)
- `ChequeID` (int)
- `ChequeDate` (date)
- `ChequeNo` (varchar)
- `Amount` (decimal)
- `BuildingID` (int)
- `ApartmentID` (int)
- `BuildingName` (varchar)
- `ApartmentName` (varchar)

### Cheques Summary (`sp_GetChequesSummary`)
- `NumberOfCheques` (int)
- `TotalAmount` (decimal)

## Features Overview

### Dashboard
- Summary cards showing totals for buildings, apartments, cheques, and amounts
- Interactive charts for data visualization
- Recent cheques table
- Real-time data refresh

### Cheques Detail
- Advanced filtering by date range, building, and apartment
- Search functionality
- Pagination for large datasets
- CSV export capability
- Summary statistics

### Buildings Management
- Building overview cards with statistics
- Click to view detailed information
- Apartment counts and financial summaries
- Occupancy rate indicators

### Apartments Management
- Filter by building and floor
- Search by name or number
- Pagination for large lists
- Detailed view with cheque history
- Financial summaries per apartment

## Customization

### Styling
- Modify `client/src/assets/css/main.css` for custom CSS
- Update `client/tailwind.config.js` for theme customization
- Colors, fonts, and spacing can be adjusted in the Tailwind config

### Components
- Vue components are located in `client/src/views/`
- Reusable components can be added to `client/src/components/`
- API calls are centralized in the backend routes

### Database
- Modify stored procedure calls in `server/index.js`
- Add new API endpoints as needed
- Update data processing logic in Vue components

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials in `config.env`
   - Check SQL Server is running and accessible
   - Ensure firewall allows connections

2. **Frontend Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all required dependencies are installed

3. **API Endpoints Not Working**
   - Check backend server is running
   - Verify CORS settings
   - Check browser console for errors

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
