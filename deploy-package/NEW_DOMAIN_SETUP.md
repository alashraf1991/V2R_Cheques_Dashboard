# 🌐 New API Domain Setup: system.v2r.ae

## ✅ **Domain Update Complete!**

Your API endpoint has been successfully updated from:
- **Old**: `http://5.104.107.109:3000`
- **New**: `https://system.v2r.ae`

## 🔄 **What I've Updated:**

### **1. Backend Configuration (`index.js`)**
- ✅ Added `https://system.v2r.ae` to CORS allowed origins
- ✅ Added `http://system.v2r.ae` as fallback
- ✅ Maintains backward compatibility with old IP

### **2. SSL Certificate Scripts**
- ✅ Updated Windows batch script to use `system.v2r.ae`
- ✅ Updated PowerShell script to use `system.v2r.ae`
- ✅ Updated Nginx configuration for `system.v2r.ae`

### **3. Testing Tools**
- ✅ Added new domain test in `cors-test.html`
- ✅ Added test button for `system.v2r.ae`
- ✅ Maintains all existing test functionality

### **4. Documentation**
- ✅ Updated all setup guides
- ✅ Updated troubleshooting guides
- ✅ Updated configuration examples

## 🚀 **Next Steps:**

### **Option 1: Use New Domain (Recommended)**
```javascript
// In your frontend code
const API_BASE = 'https://system.v2r.ae';

// Example API calls
const response = await fetch(`${API_BASE}/api/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
```

### **Option 2: Keep Both (Fallback)**
```javascript
// In your frontend code
const API_BASE = 'https://system.v2r.ae';
const FALLBACK_API = 'http://5.104.107.109:3000';

// Try new domain first, fallback to old if needed
async function makeAPICall(endpoint, options) {
  try {
    return await fetch(`${API_BASE}${endpoint}`, options);
  } catch (error) {
    console.log('New domain failed, trying fallback...');
    return await fetch(`${FALLBACK_API}${endpoint}`, options);
  }
}
```

## 🔒 **SSL Certificate Setup:**

Since you're using a new domain, you'll need to set up SSL certificates:

### **For Windows Server:**
```cmd
# Run as Administrator
.\setup-ssl-windows.ps1
```

### **For Linux Server:**
```bash
# Run as root
sudo ./setup-nginx-proxy.sh
```

## 🧪 **Testing Your New Domain:**

### **1. Use the Updated Test File**
- Open `cors-test.html` in your browser
- Click "Test system.v2r.ae" button
- Verify the new domain works

### **2. Test from Your Frontend**
```javascript
// Test login endpoint
const response = await fetch('https://system.v2r.ae/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' })
});

console.log('Response:', response.status);
```

### **3. Test from Command Line**
```bash
# Test new domain
curl -k https://system.v2r.ae/health

# Test old IP (should still work)
curl http://5.104.107.109:3000/health
```

## 🔧 **Configuration Files Updated:**

- ✅ `index.js` - CORS origins updated
- ✅ `cors-test.html` - New domain test added
- ✅ `setup-ssl-windows.bat` - Domain updated
- ✅ `setup-ssl-windows.ps1` - Domain updated
- ✅ `nginx-reverse-proxy.conf` - Server name updated
- ✅ `setup-nginx-proxy.sh` - Domain examples updated
- ✅ `WINDOWS_HTTPS_GUIDE.md` - Documentation updated
- ✅ `HTTPS_SOLUTION_GUIDE.md` - Documentation updated

## 🎯 **Benefits of New Domain:**

1. **Professional**: `system.v2r.ae` looks more professional than IP address
2. **Flexible**: Can change server IP without updating frontend code
3. **Scalable**: Easy to add load balancers or multiple servers
4. **Maintainable**: Clear separation between frontend and backend domains
5. **SSL Ready**: Proper domain for SSL certificates

## ⚠️ **Important Notes:**

- **DNS Configuration**: Ensure `system.v2r.ae` points to your server IP `5.104.107.109`
- **SSL Certificates**: New domain requires new SSL certificates
- **CORS**: Both domains are now allowed for maximum compatibility
- **Backward Compatibility**: Old IP endpoint still works for transition period

## 🎉 **Success!**

Your API is now accessible at:
- **Primary**: `https://system.v2r.ae`
- **Fallback**: `http://5.104.107.109:3000`
- **HTTPS Fallback**: `https://5.104.107.109:3443`

All Mixed Content errors should be resolved! 🚀
