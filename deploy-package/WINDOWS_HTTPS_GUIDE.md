# 🔒 Windows Server HTTPS Setup Guide

## 🚨 **Problem: Mixed Content Error on Windows Server**

Your frontend at `https://hamdan.v2r.systems` is trying to make requests to your HTTP backend at `http://5.104.107.109:3000` or your new API domain at `https://system.v2r.ae`. Since you're running on **Windows Server**, you need Windows-compatible SSL setup.

## ✅ **Windows Server Solutions**

I've created **two Windows-compatible scripts** for you:

### **Solution 1: Batch Script (setup-ssl-windows.bat)**
- ✅ Simple double-click execution
- ✅ Uses PowerShell commands
- ✅ Good for quick setup

### **Solution 2: PowerShell Script (setup-ssl-windows.ps1)**
- ✅ More robust error handling
- ✅ Better user experience
- ✅ Recommended for production

---

## 🚀 **Quick Setup (Recommended)**

### **Step 1: Run the PowerShell Script**

1. **Right-click** on `setup-ssl-windows.ps1`
2. Select **"Run with PowerShell"** (or "Run as Administrator")
3. If prompted about execution policy, type `Y` and press Enter

**Alternative:**
- Open PowerShell as Administrator
- Navigate to your project folder
- Run: `.\setup-ssl-windows.ps1`

### **Step 2: Verify SSL Setup**

After running the script, you should see:
```
✅ SSL setup complete for Windows Server!
📁 SSL certificates: ssl\
🔒 Certificate file: ssl\certificate.pfx
🔑 Certificate file: ssl\certificate.crt
🔐 Passphrase: password123
```

### **Step 3: Restart Your Backend**

```cmd
# Stop current server (Ctrl+C)
# Then restart
npm start
```

**Expected Output:**
```
🚀 V2R Cheques Server running on port 3000 (HTTP)
🔒 Using Windows PFX certificate format
🔒 V2R Cheques Server running on port 3443 (HTTPS)
🌐 CORS enabled for: https://hamdan.v2r.systems
🔒 CORS credentials: enabled
```

### **Step 4: Update Your Frontend**

Change your API base URL from:
```javascript
const API_BASE = 'http://5.104.107.109:3000';
```

To:
```javascript
const API_BASE = 'https://system.v2r.ae';
```

---

## 🔧 **Alternative: Manual Setup**

If the scripts don't work, you can set up SSL manually:

### **Option 1: Using Windows Certificate Manager**

1. **Open Certificate Manager:**
   - Press `Win + R`
   - Type `certmgr.msc`
   - Press Enter

2. **Create Self-Signed Certificate:**
   - Right-click on "Personal" → "Certificates"
   - Select "All Tasks" → "Create Self-Signed Certificate"
   - Follow the wizard
   - Use "5.104.107.109" as the common name

3. **Export Certificate:**
   - Right-click the new certificate
   - Select "All Tasks" → "Export"
   - Choose PFX format
   - Set password (remember it!)
   - Save to `ssl\certificate.pfx`

### **Option 2: Using OpenSSL (if installed)**

```cmd
# Generate private key
openssl genrsa -out ssl\private.key 2048

# Generate certificate
openssl req -new -x509 -key ssl\private.key -out ssl\certificate.crt -days 365 -subj "/CN=5.104.107.109"
```

---

## 🧪 **Testing Your Setup**

### **Use the CORS Test File**

1. Open `cors-test.html` in your browser
2. Test both HTTP and HTTPS endpoints
3. Verify that HTTPS requests work

### **Test from Command Line**

```cmd
# Test HTTP endpoint
curl http://5.104.107.109:3000/health

# Test HTTPS endpoint (ignore certificate warnings)
curl -k https://5.104.107.109:3443/health
```

---

## 🔧 **Troubleshooting**

### **If HTTPS Still Doesn't Work:**

1. **Check SSL Directory:**
   ```cmd
   dir ssl
   # Should show: certificate.pfx, certificate.crt, ssl-config.js
   ```

2. **Check Port 3443:**
   ```cmd
   netstat -an | findstr :3443
   # Should show LISTENING
   ```

3. **Check Windows Firewall:**
   ```cmd
   # Allow port 3443
   netsh advfirewall firewall add rule name="HTTPS Backend" dir=in action=allow protocol=TCP localport=3443
   ```

4. **Check Certificate:**
   ```cmd
   # View certificate details
   certutil -dump ssl\certificate.pfx
   ```

### **Common Windows Issues:**

- **Execution Policy**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Port Already in Use**: Check if another service is using port 3443
- **Firewall Blocked**: Ensure Windows Firewall allows port 3443
- **Certificate Errors**: Self-signed certificates show browser warnings (this is normal)

---

## 📋 **Quick Fix Checklist**

- [ ] Run `setup-ssl-windows.ps1` as Administrator
- [ ] Verify SSL files created in `ssl\` folder
- [ ] Restart your Node.js backend server
- [ ] Check that HTTPS server starts on port 3443
- [ ] Update frontend to use HTTPS URL
- [ ] Test the connection

---

## 🎯 **Production Considerations**

### **Self-Signed vs. CA Certificates:**

- **Self-Signed** (current setup): Good for testing, shows browser warnings
- **CA Certificate**: Required for production, no browser warnings

### **For Production Use:**

1. **Get a real SSL certificate** from:
   - Let's Encrypt (free)
   - DigiCert, GlobalSign, etc. (paid)

2. **Use proper domain name** instead of IP address

3. **Consider using IIS** as reverse proxy with SSL

---

## 🆘 **Need Help?**

If you're still experiencing issues:

1. **Check PowerShell execution policy**: `Get-ExecutionPolicy`
2. **Run as Administrator**: Right-click PowerShell → "Run as Administrator"
3. **Check Windows Event Viewer** for errors
4. **Verify Node.js version**: `node --version`
5. **Check if port 3443 is available**: `netstat -an | findstr :3443`

---

## 🔗 **Useful Windows Commands**

```cmd
# Check listening ports
netstat -an | findstr :3443

# Check Windows Firewall
netsh advfirewall firewall show rule name="HTTPS Backend"

# Check certificate store
certmgr.msc

# Check execution policy
Get-ExecutionPolicy

# Set execution policy (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎉 **Success!**

After following these steps, your Windows Server should have:
- ✅ HTTP server on port 3000
- ✅ HTTPS server on port 3443
- ✅ SSL certificates properly configured
- ✅ CORS working for both HTTP and HTTPS
- ✅ Frontend able to make secure requests

Your Mixed Content error should be completely resolved! 🚀
