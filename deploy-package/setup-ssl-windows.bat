@echo off
echo 🔒 Setting up SSL for V2R Cheques Dashboard Backend (Windows Server)
echo ================================================================

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ This script must be run as Administrator
    echo 💡 Right-click Command Prompt and select "Run as Administrator"
    pause
    exit /b 1
)

REM Create SSL directory
if not exist "ssl" mkdir ssl
echo 📁 Created SSL directory

REM Generate self-signed certificate using PowerShell
echo 🔐 Generating self-signed SSL certificate...
powershell -Command "& {New-SelfSignedCertificate -DnsName 'system.v2r.ae' -CertStoreLocation 'Cert:\LocalMachine\My' -KeyAlgorithm 'RSA' -KeyLength 2048 -NotAfter (Get-Date).AddYears(1) -FriendlyName 'V2R Cheques Dashboard' | Export-Certificate -FilePath 'ssl\certificate.crt' -Type CERT}"
powershell -Command "& {Get-ChildItem -Path 'Cert:\LocalMachine\My' | Where-Object {$_.Subject -like '*system.v2r.ae*'} | Export-PfxCertificate -FilePath 'ssl\certificate.pfx' -Password (ConvertTo-SecureString -String 'password123' -AsPlainText -Force)}"

REM Convert PFX to PEM format (if OpenSSL is available)
if exist "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" (
    echo 🔄 Converting certificate to PEM format...
    "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" pkcs12 -in ssl\certificate.pfx -out ssl\certificate.crt -clcerts -nokeys -passin pass:password123
    "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" pkcs12 -in ssl\certificate.pfx -out ssl\private.key -nocerts -nodes -passin pass:password123
    echo ✅ Certificate converted to PEM format
) else (
    echo ⚠️  OpenSSL not found. Using PFX format.
    echo 💡 To convert to PEM, install OpenSSL or use the PFX file directly
)

REM Create SSL configuration file
echo 📝 Creating SSL configuration...
echo const fs = require('fs');> ssl\ssl-config.js
echo const https = require('https');>> ssl\ssl-config.js
echo.>> ssl\ssl-config.js
echo // SSL Configuration for Windows>> ssl\ssl-config.js
echo const httpsOptions = {>> ssl\ssl-config.js
echo   pfx: fs.readFileSync('./ssl/certificate.pfx'),>> ssl\ssl-config.js
echo   passphrase: 'password123'>> ssl\ssl-config.js
echo };>> ssl\ssl-config.js
echo.>> ssl\ssl-config.js
echo module.exports = httpsOptions;>> ssl\ssl-config.js

echo.
echo ✅ SSL setup complete for Windows Server!
echo ================================================================
echo 📁 SSL certificates: ssl\
echo 🔒 Certificate file: ssl\certificate.pfx
echo 🔑 Private key: ssl\private.key (if converted)
echo 🔐 Passphrase: password123
echo.
echo 💡 Next steps:
echo 1. Restart your Node.js backend server
echo 2. Update your frontend to use HTTPS
echo 3. Test the connection
echo.
echo ⚠️  Note: This is a self-signed certificate
echo    Browsers will show security warnings
echo    For production, use a proper CA certificate
echo.
pause
