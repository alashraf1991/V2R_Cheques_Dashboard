# SSL Setup Script for V2R Cheques Dashboard Backend (Windows Server)
# This script helps you set up HTTPS for your backend

Write-Host "🔒 Setting up SSL for V2R Cheques Dashboard Backend (Windows Server)" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    Write-Host "💡 Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create SSL directory
if (!(Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" | Out-Null
}
Write-Host "📁 Created SSL directory" -ForegroundColor Green

# Generate self-signed certificate
Write-Host "🔐 Generating self-signed SSL certificate..." -ForegroundColor Yellow

try {
    # Create certificate
    $cert = New-SelfSignedCertificate -DnsName "system.v2r.ae" -CertStoreLocation "Cert:\LocalMachine\My" -KeyAlgorithm "RSA" -KeyLength 2048 -NotAfter (Get-Date).AddYears(1) -FriendlyName "V2R Cheques Dashboard"
    
    # Export certificate files
    $cert | Export-Certificate -FilePath "ssl\certificate.crt" -Type CERT
    $cert | Export-PfxCertificate -FilePath "ssl\certificate.pfx" -Password (ConvertTo-SecureString -String "password123" -AsPlainText -Force)
    
    Write-Host "✅ SSL certificate generated successfully!" -ForegroundColor Green
    
    # Create SSL configuration file
    Write-Host "📝 Creating SSL configuration..." -ForegroundColor Yellow
    
    $sslConfig = @"
const fs = require('fs');

// SSL Configuration for Windows
const httpsOptions = {
  pfx: fs.readFileSync('./ssl/certificate.pfx'),
  passphrase: 'password123'
};

module.exports = httpsOptions;
"@
    
    $sslConfig | Out-File -FilePath "ssl\ssl-config.js" -Encoding UTF8
    
    Write-Host "✅ SSL setup complete for Windows Server!" -ForegroundColor Green
    Write-Host "===============================================================" -ForegroundColor Green
    Write-Host "📁 SSL certificates: ssl\" -ForegroundColor Cyan
    Write-Host "🔒 Certificate file: ssl\certificate.pfx" -ForegroundColor Cyan
    Write-Host "🔑 Certificate file: ssl\certificate.crt" -ForegroundColor Cyan
    Write-Host "🔐 Passphrase: password123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your Node.js backend server" -ForegroundColor White
    Write-Host "2. Update your frontend to use HTTPS" -ForegroundColor White
    Write-Host "3. Test the connection" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Note: This is a self-signed certificate" -ForegroundColor Red
    Write-Host "   Browsers will show security warnings" -ForegroundColor Red
    Write-Host "   For production, use a proper CA certificate" -ForegroundColor Red
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to generate SSL certificate" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Read-Host "Press Enter to exit"
