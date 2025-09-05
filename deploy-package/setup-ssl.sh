#!/bin/bash

# SSL Setup Script for V2R Cheques Dashboard Backend
# This script helps you set up HTTPS for your backend

echo "🔒 Setting up SSL for V2R Cheques Dashboard Backend"
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Update package list
echo "📦 Updating package list..."
apt-get update

# Install certbot and nginx
echo "📦 Installing certbot and nginx..."
apt-get install -y certbot nginx

# Create SSL directory
echo "📁 Creating SSL directory..."
mkdir -p ./ssl

# Get SSL certificate
echo "🔐 Getting SSL certificate from Let's Encrypt..."
echo "Please enter your domain name (e.g., api.v2r.systems):"
read -p "Domain: " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

# Stop nginx temporarily
systemctl stop nginx

# Get certificate
certbot certonly --standalone -d $DOMAIN --email admin@v2r.systems --agree-tos --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Copy certificates to our SSL directory
    echo "📁 Copying certificates..."
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/private.key
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/certificate.crt
    
    # Set proper permissions
    chmod 600 ./ssl/private.key
    chmod 644 ./ssl/certificate.crt
    
    echo "✅ SSL certificates copied to ./ssl/ directory"
    echo "🔒 Your backend can now run with HTTPS on port 3443"
    echo "🌐 Update your frontend to use: https://$DOMAIN:3443"
    
    # Create renewal script
    cat > ./renew-ssl.sh << 'EOF'
#!/bin/bash
# SSL Renewal Script
certbot renew --quiet
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/private.key
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/certificate.crt
chmod 600 ./ssl/private.key
chmod 644 ./ssl/certificate.crt
echo "SSL certificates renewed at $(date)"
EOF
    
    chmod +x ./renew-ssl.sh
    echo "📝 Created renewal script: ./renew-ssl.sh"
    
    # Add to crontab for auto-renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * cd $(pwd) && ./renew-ssl.sh") | crontab -
    echo "⏰ Added SSL renewal to crontab (runs daily at 12:00 PM)"
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo "💡 Make sure your domain points to this server's IP address"
    exit 1
fi

# Restart nginx
systemctl start nginx

echo ""
echo "🎉 SSL setup complete!"
echo "=================================================="
echo "📁 SSL certificates: ./ssl/"
echo "🔒 HTTPS port: 3443"
echo "🌐 Domain: $DOMAIN"
echo "📝 Renewal script: ./renew-ssl.sh"
echo ""
echo "💡 Next steps:"
echo "1. Restart your backend server: npm start"
echo "2. Update your frontend to use HTTPS backend URL"
echo "3. Test the connection"
echo ""
echo "🔗 Test HTTPS endpoint: https://$DOMAIN:3443/health"
