# XMRT AI Organization - Deployment Guide

This guide provides comprehensive instructions for deploying the XMRT AI Organization prototype in various environments.

## 🚀 Quick Start Deployment

### Local Development
```bash
# Clone and setup
git clone https://github.com/DevGruGold/xmrt-ai-organization.git
cd xmrt-ai-organization
npm install

# Build and start
npm run build
npm start
```

### Production Ready
```bash
# Environment setup
cp .env.example .env
# Edit .env with production values

# Build frontend and backend
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist/* public/
npm run build

# Start production server
NODE_ENV=production npm start
```

## 🌐 Cloud Deployment Options

### 1. Railway (Recommended for Full-Stack)

**Step 1**: Connect GitHub Repository
- Visit [Railway.app](https://railway.app)
- Connect your GitHub account
- Select the `xmrt-ai-organization` repository

**Step 2**: Configure Environment
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
XMRT_ECOSYSTEM_URL=https://xmrt.io
```

**Step 3**: Deploy
- Railway will automatically build and deploy
- Custom domain can be configured in settings

### 2. Vercel (Frontend Only)

**Step 1**: Build Frontend
```bash
cd frontend
npm run build
```

**Step 2**: Deploy to Vercel
```bash
npx vercel --prod
```

**Step 3**: Configure Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Heroku (Full-Stack)

**Step 1**: Create Heroku App
```bash
heroku create xmrt-ai-organization
```

**Step 2**: Configure Environment
```bash
heroku config:set NODE_ENV=production
heroku config:set HOST=0.0.0.0
heroku config:set XMRT_ECOSYSTEM_URL=https://xmrt.io
```

**Step 3**: Deploy
```bash
git push heroku main
```

### 4. AWS/GCP/Azure (Container)

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production
RUN cd frontend && npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN cd frontend && npm run build && cd ..
RUN cp -r frontend/dist/* public/
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

**Build and Deploy**:
```bash
# Build image
docker build -t xmrt-ai-organization .

# Run locally
docker run -p 3000:3000 xmrt-ai-organization

# Deploy to cloud registry
docker tag xmrt-ai-organization your-registry/xmrt-ai-organization
docker push your-registry/xmrt-ai-organization
```

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Server Configuration
PORT=3000                    # Server port
NODE_ENV=production         # Environment mode
HOST=0.0.0.0               # Bind address

# XMRT Ecosystem
XMRT_ECOSYSTEM_URL=https://xmrt.io
XMRT_API_BASE_URL=https://api.xmrt.io
```

### Optional Environment Variables
```env
# AI Model APIs (for enhanced functionality)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Blockchain Integration
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/...
ALCHEMY_API_KEY=...
THIRDWEB_CLIENT_ID=...

# Security
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Database (if implementing persistence)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# External APIs
COINGECKO_API_KEY=...
DEFIPULSE_API_KEY=...
```

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

### CORS Configuration
```javascript
// In production, restrict CORS to specific domains
app.use(cors({
  origin: ['https://yourdomain.com', 'https://xmrt.io'],
  credentials: true
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Logging

### Health Checks
The application provides health check endpoints:
- `GET /health` - Basic health status
- `GET /api/organization/status` - Detailed system status

### Logging Configuration
```env
LOG_LEVEL=info              # info, warn, error, debug
LOG_FORMAT=json            # json, text
```

### Monitoring Integration
```javascript
// Example: Integration with monitoring services
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy XMRT AI Organization

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm ci
        cd frontend && npm ci
        
    - name: Build application
      run: |
        cd frontend && npm run build && cd ..
        cp -r frontend/dist/* public/
        npm run build
        
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Build Failures**
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Frontend Not Loading**
```bash
# Ensure frontend is built and copied
cd frontend && npm run build && cd ..
cp -r frontend/dist/* public/
```

**WebSocket Connection Issues**
- Check firewall settings
- Ensure WebSocket support in proxy/load balancer
- Verify CORS configuration

### Performance Optimization

**Frontend Optimization**
- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Optimize images and assets

**Backend Optimization**
- Enable response compression
- Implement caching strategies
- Use connection pooling
- Monitor memory usage

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers for multiple instances
- Implement session storage (Redis)
- Use message queues for async processing
- Consider microservices architecture

### Database Scaling
- Implement read replicas
- Use connection pooling
- Consider database sharding
- Implement caching layers

### CDN Integration
- Serve static assets via CDN
- Implement edge caching
- Use geographic distribution
- Optimize asset delivery

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks
- Update dependencies regularly
- Monitor security vulnerabilities
- Review and rotate secrets
- Backup data and configurations
- Monitor performance metrics

### Update Process
```bash
# Update dependencies
npm update
cd frontend && npm update && cd ..

# Rebuild application
npm run build
cd frontend && npm run build && cd ..
cp -r frontend/dist/* public/

# Restart application
npm start
```

## 📞 Support

For deployment support:
- **GitHub Issues**: https://github.com/DevGruGold/xmrt-ai-organization/issues
- **Email**: xmrtsolutions@gmail.com
- **Documentation**: Check README.md for additional information

---

**Deployment Guide v1.0**
*Last updated: January 2025*

