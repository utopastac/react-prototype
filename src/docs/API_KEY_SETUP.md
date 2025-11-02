# API Key Setup Guide

## Overview

This guide shows you how to safely configure LLM API keys without requiring users to enter them manually. There are several secure approaches depending on your deployment environment.

## 🚀 **Option 1: Automated Setup Script (Recommended)**

The easiest way to configure API keys is using the automated setup script:

```bash
npm run setup-llm
```

This interactive script will:
- Guide you through the setup process
- Validate API key formats
- Create/update your `.env` file
- Configure default providers
- Provide next steps

## 🔧 **Option 2: Manual Environment Variables**

### For Development

1. **Create a `.env` file** in your project root:
```bash
# OpenAI (get from https://platform.openai.com/api-keys)
REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic (get from https://console.anthropic.com/)
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Optional: Set default provider
REACT_APP_DEFAULT_LLM_PROVIDER=openai

# Optional: Set default model
REACT_APP_DEFAULT_LLM_MODEL=gpt-4-turbo-preview
```

2. **Restart your development server**:
```bash
npm run dev
```

### For Production

#### Vercel Deployment
```bash
# Set environment variables in Vercel dashboard
vercel env add REACT_APP_OPENAI_API_KEY
vercel env add REACT_APP_ANTHROPIC_API_KEY
vercel env add REACT_APP_DEFAULT_LLM_PROVIDER
```

#### Netlify Deployment
```bash
# Set environment variables in Netlify dashboard
# Or create a netlify.toml file:
[build.environment]
  REACT_APP_OPENAI_API_KEY = "sk-your-key"
  REACT_APP_DEFAULT_LLM_PROVIDER = "openai"
```

#### Docker Deployment
```dockerfile
# In your Dockerfile
ENV REACT_APP_OPENAI_API_KEY=sk-your-key
ENV REACT_APP_DEFAULT_LLM_PROVIDER=openai
```

## 🏢 **Option 3: Enterprise/Team Setup**

### Shared Configuration File

Create a `config/llm-keys.json` file (add to .gitignore):

```json
{
  "openai": {
    "apiKey": "sk-your-openai-key",
    "model": "gpt-4-turbo-preview"
  },
  "anthropic": {
    "apiKey": "sk-ant-your-anthropic-key",
    "model": "claude-3-sonnet-20240229"
  },
  "defaultProvider": "openai"
}
```

### Update the configuration loader:

```typescript
// src/config/llm.ts
import llmKeys from '../config/llm-keys.json';

export function getAutoConfig(): LLMConfig {
  // Try environment variables first
  const openaiKey = getEnvVar('REACT_APP_OPENAI_API_KEY');
  const anthropicKey = getEnvVar('REACT_APP_ANTHROPIC_API_KEY');
  
  // Fallback to config file
  if (!openaiKey && llmKeys.openai?.apiKey) {
    return {
      provider: 'openai',
      apiKey: llmKeys.openai.apiKey,
      model: llmKeys.openai.model || 'gpt-4-turbo-preview',
      baseUrl: 'https://api.openai.com/v1'
    };
  }
  
  if (!anthropicKey && llmKeys.anthropic?.apiKey) {
    return {
      provider: 'anthropic',
      apiKey: llmKeys.anthropic.apiKey,
      model: llmKeys.anthropic.model || 'claude-3-sonnet-20240229',
      baseUrl: 'https://api.anthropic.com/v1'
    };
  }
  
  return { provider: 'mock' };
}
```

## 🔐 **Option 4: Backend Proxy (Most Secure)**

For maximum security, proxy API calls through your backend:

### Backend API Endpoint

```javascript
// server.js or similar
app.post('/api/generate-flow', async (req, res) => {
  const { description } = req.body;
  
  // Your API keys are secure on the server
  const openaiKey = process.env.OPENAI_API_KEY;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
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
    
    const data = await response.json();
    res.json({ success: true, flow: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Frontend Configuration

```typescript
// src/config/llm.ts
export function getAutoConfig(): LLMConfig {
  return {
    provider: 'backend-proxy',
    apiKey: undefined, // No API key needed on frontend
    model: 'gpt-4-turbo-preview',
    baseUrl: '/api' // Your backend endpoint
  };
}
```

## 🛡️ **Security Best Practices**

### 1. **Never Commit API Keys**
```bash
# Add to .gitignore
.env
.env.local
.env.production
config/llm-keys.json
```

### 2. **Use Environment-Specific Keys**
```bash
# Development
REACT_APP_OPENAI_API_KEY=sk-dev-key

# Staging
REACT_APP_OPENAI_API_KEY=sk-staging-key

# Production
REACT_APP_OPENAI_API_KEY=sk-prod-key
```

### 3. **Rotate Keys Regularly**
- Set up key rotation schedules
- Monitor API usage for anomalies
- Use different keys for different environments

### 4. **Limit Key Permissions**
- Use API keys with minimal required permissions
- Set up usage limits and alerts
- Monitor costs and usage patterns

## 🔄 **Environment Detection**

The system automatically detects your environment and configures accordingly:

```typescript
// Development: Uses mock mode by default
// Production: Auto-detects available APIs
// Staging: Auto-detects available APIs

const config = getConfig();
console.log(`Environment: ${config.provider}`);
```

## 📋 **Configuration Priority**

The system follows this priority order:

1. **Environment Variables** (highest priority)
2. **Configuration Files** (if enabled)
3. **Backend Proxy** (if configured)
4. **Mock Mode** (fallback)

## 🚨 **Troubleshooting**

### Common Issues

1. **"No API keys found"**
   - Check that `.env` file exists and has correct format
   - Verify environment variable names start with `REACT_APP_`
   - Restart development server after changes

2. **"Invalid API key"**
   - Verify key format (OpenAI: `sk-...`, Anthropic: `sk-ant-...`)
   - Check key permissions and billing status
   - Test key in provider's dashboard

3. **"Environment not detected"**
   - Ensure `NODE_ENV` is set correctly
   - Check that environment variables are loaded
   - Verify configuration file paths

### Debug Mode

Enable detailed logging:

```typescript
// Add to your app initialization
console.log('LLM Config:', getAutoConfig());
console.log('Available Providers:', getAvailableProviders());
console.log('LLM Available:', isLLMAvailable());
```

## 📚 **Next Steps**

1. **Run the setup script**: `npm run setup-llm`
2. **Test the configuration**: Restart your dev server
3. **Verify in UI**: Check the Generate Flow tab
4. **Monitor usage**: Track API costs and usage
5. **Set up alerts**: Configure usage notifications

## 🔗 **Additional Resources**

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [Security Best Practices](https://owasp.org/www-project-api-security/)
