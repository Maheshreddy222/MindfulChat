# Mindful Chat - Deployment Guide

Deploy Mindful Chat to production with these step-by-step guides for various platforms.

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured (`.env`)
- [ ] Database backups enabled
- [ ] HTTPS/SSL certificates ready
- [ ] API rate limiting configured
- [ ] CORS restrictions set
- [ ] Input validation enhanced
- [ ] Security headers added
- [ ] Error logging enabled
- [ ] User authentication implemented
- [ ] Terms of Service & Privacy Policy created

---

## 1. Heroku Deployment (Easiest)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed

### Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create new app
heroku create mindful-chat

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set GOOGLE_API_KEY=your_api_key_here

# 4. Create Procfile (if not exists)
echo "web: node backend/server.js" > Procfile

# 5. Create app.json for configuration
cat > app.json << 'EOF'
{
  "name": "Mindful Chat",
  "description": "AI-powered mental health support",
  "repository": "https://github.com/yourusername/mindful-chat",
  "env": {
    "GOOGLE_API_KEY": {
      "description": "Google Gemini API key",
      "required": true
    }
  },
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
EOF

# 6. Deploy
git push heroku main

# 7. View logs
heroku logs --tail

# 8. Open app
heroku open
```

### Heroku SQLite Limitation
Heroku doesn't persist SQLite between dyno restarts. For production, upgrade to PostgreSQL:

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Modify database.js to use PostgreSQL instead
# (See PostgreSQL section below)
```

---

## 2. Railway.app Deployment

Fast alternative to Heroku with better SQLite support.

### Steps

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Create environment
railway environment

# 5. Set variables
railway variables set GOOGLE_API_KEY=your_key_here
railway variables set NODE_ENV=production

# 6. Deploy
railway deploy

# 7. View URL
railway open
```

---

## 3. AWS EC2 Deployment

Complete control, requires more setup.

### Launch EC2 Instance

```bash
# 1. Launch Ubuntu 20.04 LTS t2.micro (free tier)
# 2. Configure security group:
#    - Inbound: Port 80 (HTTP), 443 (HTTPS), 22 (SSH)

# 3. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 4. Update system
sudo apt update && sudo apt upgrade -y

# 5. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# 6. Install Git
sudo apt install git -y

# 7. Clone repository
git clone https://github.com/yourusername/mindful-chat.git
cd mindful-chat

# 8. Install dependencies
npm install

# 9. Create .env file
nano backend/.env
# Add: GOOGLE_API_KEY=your_key_here
# Add: NODE_ENV=production

# 10. Install PM2 (process manager)
sudo npm install -g pm2

# 11. Start app with PM2
pm2 start backend/server.js --name "mindful-chat"
pm2 startup
pm2 save

# 12. Install Nginx (reverse proxy)
sudo apt install nginx -y

# 13. Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**
```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# 14. Setup HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com

# 15. Auto-renew certificates
sudo systemctl enable certbot.timer
```

---

## 4. Docker Containerization

Deploy to any Docker-compatible platform.

### Create Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["node", "backend/server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mindful-chat:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      GOOGLE_API_KEY: ${GOOGLE_API_KEY}
      DATABASE_PATH: ./db.sqlite
    volumes:
      - ./db.sqlite:/app/db.sqlite
    restart: unless-stopped
```

### Build & Run

```bash
# Build image
docker build -t mindful-chat .

# Run container
docker run -p 5000:5000 \
  -e GOOGLE_API_KEY=your_key \
  -e NODE_ENV=production \
  mindful-chat

# Or with docker-compose
docker-compose up -d
```

---

## 5. Vercel Deployment (Frontend + Serverless)

For serverless deployment (requires API refactoring).

### Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Create vercel.json
cat > vercel.json << 'EOF'
{
  "version": 2,
  "public": false,
  "env": {
    "GOOGLE_API_KEY": "@google_api_key"
  },
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/index.html"
    }
  ]
}
EOF

# 4. Add environment variables
vercel env add GOOGLE_API_KEY

# 5. Deploy
vercel --prod
```

---

## 6. DigitalOcean App Platform

PaaS alternative to Heroku.

### Steps

1. Create DigitalOcean account
2. Go to **Apps** → **Create App**
3. Connect GitHub repository
4. Configure:
   - Source: `mindful-chat` repo
   - Build: Automatic
   - Run: `npm start`
5. Set environment variables:
   - `GOOGLE_API_KEY`
   - `NODE_ENV=production`
6. Deploy

---

## Production Hardening

### 1. Add Security Headers

```javascript
// In server.js
const helmet = require('helmet');
app.use(helmet());
```

Install: `npm install helmet`

### 2. Input Validation & Sanitization

```javascript
// In routes
const { body, validationResult } = require('express-validator');

app.post('/api/conversations/:id/messages', [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process message
});
```

Install: `npm install express-validator`

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

Install: `npm install express-rate-limit`

### 4. HTTPS Only

```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && 
      req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 5. Database Backups

```bash
# SQLite backup script (backup.sh)
#!/bin/bash
cp db.sqlite db.sqlite.backup.$(date +%Y%m%d_%H%M%S)

# Schedule with cron (every day at 2 AM)
crontab -e
# Add: 0 2 * * * /home/ubuntu/mindful-chat/backup.sh
```

### 6. Logging & Monitoring

```javascript
// Add logging
const fs = require('fs');
const logFile = fs.createWriteStream('app.log', { flags: 'a' });

app.use((req, res, next) => {
  logFile.write(`${new Date().toISOString()} ${req.method} ${req.url}\n`);
  next();
});

// Error tracking with Sentry
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

---

## PostgreSQL Migration

For scalable database solution:

### Setup PostgreSQL

```bash
# Install
sudo apt install postgresql postgresql-contrib -y

# Create database
sudo -u postgres createdb mindful_chat

# Create user
sudo -u postgres createuser mindful_user
sudo -u postgres psql -c "ALTER USER mindful_user WITH PASSWORD 'strong_password';"
```

### Update database.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Create tables
pool.query(`
  CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);
```

Install: `npm install pg`

---

## Performance Optimization

### 1. Enable Gzip Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Database Indexing
```sql
CREATE INDEX idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);
```

### 3. Cache Control
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 4. Connection Pooling
Already configured in database.js with promise-based wrappers.

---

## Monitoring & Alerts

### Using PM2 Plus

```bash
# Create PM2 account
pm2 plus

# Link app
pm2 link your_secret_key your_public_key

# Real-time monitoring at https://app.pm2.io
```

### Health Checks

```bash
# Simple monitoring script
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
  if [ $response -ne 200 ]; then
    echo "Server down: $response" | mail -s "Alert" your@email.com
    pm2 restart mindful-chat
  fi
  sleep 300
done
```

---

## Environment Variables (Production)

```env
# Core
NODE_ENV=production
PORT=5000

# API
GOOGLE_API_KEY=your_production_key_here

# Database
DATABASE_PATH=./db.sqlite
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=mindful_chat

# Security
CORS_ORIGIN=https://yourdomain.com
SESSION_SECRET=long_random_string_here

# Monitoring
SENTRY_DSN=your_sentry_dsn_here

# Logging
LOG_LEVEL=info
```

---

## Troubleshooting Deployment

### "Cannot find module"
```bash
npm install --production
```

### "Database locked"
```bash
# Kill existing connections
pkill node
# Restart
pm2 start backend/server.js
```

### "Out of memory"
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### "CORS errors"
Update CORS in server.js:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

## Maintenance

### Regular Tasks

- **Daily**: Monitor logs and errors
- **Weekly**: Database backups
- **Monthly**: Security updates
- **Quarterly**: Performance review

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Major updates
npm install -g npm-check-updates
ncu -u
npm install
```

---

## Support

For deployment issues:
- Check logs: `heroku logs --tail` or `pm2 logs`
- Verify environment variables
- Test API endpoints: `curl http://localhost:5000/api/health`
- Check database connection

---

**Last Updated:** January 2024
