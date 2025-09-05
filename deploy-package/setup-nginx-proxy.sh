#!/bin/bash

# Nginx Reverse Proxy Setup Script for V2R Cheques Dashboard
# This script sets up Nginx as a reverse proxy with SSL

echo "🌐 Setting up Nginx Reverse Proxy with SSL"
echo "=========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Update package list
echo "📦 Updating package list..."
apt-get update

# Install nginx and certbot
echo "📦 Installing nginx and certbot..."
apt-get install -y nginx certbot python3-certbot-nginx

# Get SSL certificate
echo "🔐 Getting SSL certificate from Let's Encrypt..."
echo "Please enter your domain name (e.g., system.v2r.ae):"
read -p "Domain: " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

# Get certificate
certbot --nginx -d $DOMAIN --email admin@v2r.systems --agree-tos --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Copy our custom nginx configuration
    echo "📁 Setting up nginx configuration..."
    cp nginx-reverse-proxy.conf /etc/nginx/sites-available/v2r-cheques
    
    # Replace domain placeholder
    sed -i "s/5.104.107.109/$DOMAIN/g" /etc/nginx/sites-available/v2r-cheques
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/v2r-cheques /etc/nginx/sites-enabled/
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    echo "🔍 Testing nginx configuration..."
    nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx configuration is valid"
        
        # Reload nginx
        systemctl reload nginx
        systemctl enable nginx
        
        echo "✅ Nginx reverse proxy setup complete!"
        echo "=========================================="
        echo "🌐 Domain: $DOMAIN"
        echo "🔒 HTTPS port: 443"
        echo "📁 Config: /etc/nginx/sites-available/v2r-cheques"
        echo ""
        echo "💡 Next steps:"
        echo "1. Make sure your backend is running on port 3000"
        echo "2. Update your frontend to use: https://$DOMAIN"
        echo "3. Test the connection"
        echo ""
        echo "🔗 Test endpoints:"
        echo "   - https://$DOMAIN/health"
        echo "   - https://$DOMAIN/api/cors-test"
        echo ""
        echo "📝 To manage nginx:"
        echo "   - Status: systemctl status nginx"
        echo "   - Reload: systemctl reload nginx"
        echo "   - Restart: systemctl restart nginx"
        
    else
        echo "❌ Nginx configuration test failed"
        exit 1
    fi
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo "💡 Make sure your domain points to this server's IP address"
    exit 1
fi
