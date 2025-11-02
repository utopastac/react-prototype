# Production Deployment Guide

## Overview

This guide covers how to safely deploy the LLM flow generation feature to production while maintaining security and performance.

## 🔐 **Security Considerations**

### **Client-Side API Keys (Current Implementation)**
- ✅ **Works**: API keys are functional in production
- ⚠️ **Security Risk**: Keys are visible in browser's network tab
- ⚠️ **Cost Risk**: Users could potentially extract and misuse your keys

### **Recommended: Backend Proxy (Production-Ready)**

For production deployments, we recommend proxying API calls through a backend server.

## 🚀 **Option 1: Backend Proxy (Recommended)**

### **Backend Implementation**

Create a simple backend server (Node.js/Express):

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Secure API key storage (server-side only)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/api/generate-flow', async (req, res) => {
  const { description, provider = 'openai' } = req.body;
  
  try {
    let response;
    
    if (provider === 'openai' && OPENAI_API_KEY) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'Generate a user flow...' },
            { role: 'user', content: description }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });
    } else if (provider === 'anthropic' && ANTHROPIC_API_KEY) {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            { role: 'user', content: `Generate a user flow for: ${description}` }
          ],
        }),
      });
    } else {
      return res.status(400).json({ error: 'Invalid provider or missing API key' });
    }
    
    const data = await response.json();
    
    if (provider === 'openai') {
      res.json({ success: true, flow: data.choices[0].message.content });
    } else {
      res.json({ success: true, flow: data.content[0].text });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate flow' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **Frontend Configuration**

Update your configuration to use the backend proxy:

```typescript
// src/config/llm.ts
export function getAutoConfig(): LLMConfig {
  // In production, use backend proxy
  if (process.env.NODE_ENV === 'production') {
    return {
      provider: 'backend-proxy',
      apiKey: undefined, // No API key needed on frontend
      model: 'gpt-4-turbo-preview',
      baseUrl: '/api' // Your backend endpoint
    };
  }
  
  // In development, use direct API calls
  return getDirectConfig();
}
```

### **Deployment Setup**

1. **Deploy backend** to your preferred platform (Railway, Render, Heroku, etc.)
2. **Set environment variables** on the backend:
   ```bash
   OPENAI_API_KEY=sk-your-key
   ANTHROPIC_API_KEY=sk-ant-your-key
   ```
3. **Update frontend** to point to your backend URL
4. **Deploy frontend** as a static site

## 🎯 **Option 2: Client-Side (Current Implementation)**

### **For Low-Risk Deployments**

If you're comfortable with the security implications, you can deploy as-is:

### **Vercel Deployment**
```bash
# Set environment variables in Vercel dashboard
vercel env add REACT_APP_OPENAI_API_KEY
vercel env add REACT_APP_DEFAULT_LLM_PROVIDER

# Deploy
vercel --prod
```

### **Netlify Deployment**
```bash
# Set environment variables in Netlify dashboard
# Deploy
netlify deploy --prod
```

### **GitHub Pages**
```bash
# Set environment variables in GitHub Secrets
# Use GitHub Actions to build and deploy
```

## 🔧 **Environment-Specific Configuration**

### **Development**
```bash
# .env.development
REACT_APP_OPENAI_API_KEY=sk-dev-key
REACT_APP_DEFAULT_LLM_PROVIDER=openai
```

### **Staging**
```bash
# .env.staging
REACT_APP_OPENAI_API_KEY=sk-staging-key
REACT_APP_DEFAULT_LLM_PROVIDER=openai
```

### **Production**
```bash
# .env.production
REACT_APP_OPENAI_API_KEY=sk-prod-key
REACT_APP_DEFAULT_LLM_PROVIDER=openai
```

## 🛡️ **Security Best Practices**

### **1. API Key Management**
- Use different keys for different environments
- Set up usage limits and alerts
- Monitor API usage regularly
- Rotate keys periodically

### **2. Rate Limiting**
```javascript
// Add rate limiting to your backend
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/generate-flow', limiter);
```

### **3. CORS Configuration**
```javascript
// Configure CORS for your domain only
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 📊 **Monitoring & Analytics**

### **Usage Tracking**
```javascript
// Add usage tracking to your backend
app.post('/api/generate-flow', async (req, res) => {
  const { description, provider } = req.body;
  
  // Log usage
  console.log(`Flow generation: ${provider} - ${description.substring(0, 50)}...`);
  
  // Track metrics
  // ... your tracking logic
  
  // Continue with API call
});
```

### **Error Monitoring**
```javascript
// Add error tracking
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  // Send to your error tracking service
  // Sentry, LogRocket, etc.
  next(error);
});
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Set up environment variables
- [ ] Configure CORS if using backend proxy
- [ ] Set up monitoring and alerts
- [ ] Test API key functionality
- [ ] Set up rate limiting

### **Post-Deployment**
- [ ] Verify environment variables are loaded
- [ ] Test flow generation functionality
- [ ] Monitor API usage and costs
- [ ] Set up error tracking
- [ ] Configure usage alerts

## 💰 **Cost Management**

### **Usage Limits**
```javascript
// Add usage limits to your backend
const userLimits = new Map();

app.post('/api/generate-flow', async (req, res) => {
  const userId = req.headers['x-user-id'] || req.ip;
  const userUsage = userLimits.get(userId) || 0;
  
  if (userUsage > 50) { // 50 generations per day
    return res.status(429).json({ error: 'Daily limit exceeded' });
  }
  
  userLimits.set(userId, userUsage + 1);
  // Continue with generation...
});
```

### **Cost Alerts**
- Set up billing alerts with your API provider
- Monitor usage patterns
- Implement usage quotas per user

## 🔗 **Platform-Specific Guides**

### **Vercel**
- Environment variables in dashboard
- Serverless functions for backend proxy
- Automatic deployments from Git

### **Netlify**
- Environment variables in dashboard
- Functions for backend proxy
- Form handling for usage tracking

### **Railway/Render**
- Environment variables in dashboard
- Full backend deployment support
- Database integration for usage tracking

## 📚 **Next Steps**

1. **Choose deployment strategy** (backend proxy vs client-side)
2. **Set up environment variables** for your platform
3. **Deploy and test** the functionality
4. **Monitor usage** and costs
5. **Set up alerts** and error tracking
