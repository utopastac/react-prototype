# LLM Integration for Flow Generation

This document explains how to set up and use the LLM integration for AI-powered flow generation in the Interventions Hub React project.

## Overview

The Flow Library Modal includes an AI-powered flow generation feature that can use various LLM providers:

- **Mock Mode**: Free testing mode with basic templates
- **OpenAI GPT-4**: High-quality flow generation (requires API key)
- **Anthropic Claude**: Alternative high-quality option (requires API key)
- **Block AI (Blockcell)**: Internal Block AI service (no API key required when deployed on Blockcell)

## Quick Setup for Blockcell Users

If you're using this on Blockcell (Block's internal platform), **no setup is required!** The system automatically detects the Blockcell environment and provides the "Block AI (Blockcell)" option that works without any API keys.

## Setup for Development/External Use

### Option 1: Environment Variables (Recommended)

1. **Copy the example environment file:**
   ```bash
   cp api-proxy/env.example .env
   ```

2. **Edit `.env` and add your API keys:**
   ```bash
   # For OpenAI
   REACT_APP_OPENAI_API_KEY=sk-your-openai-key-here
   
   # For Anthropic
   REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
   
   # Optional: Set default provider
   REACT_APP_DEFAULT_LLM_PROVIDER=openai
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Option 2: Manual API Key Entry

If you don't want to set environment variables, you can enter API keys directly in the UI:

1. Open the Flow Library Modal
2. Go to the "Generate Flow" tab
3. Enable "Use AI-powered generation"
4. Select your provider (OpenAI or Anthropic)
5. Enter your API key in the provided field

### Option 3: Proxy Server (Advanced)

For production deployments or when you want to hide API keys from the client:

1. **Set up the proxy server:**
   ```bash
   cd api-proxy
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   export OPENAI_API_KEY=sk-your-key-here
   export LLM_PROVIDER=openai
   ```

3. **Start the proxy server:**
   ```bash
   npm start
   ```

4. **Configure your React app to use the proxy:**
   ```bash
   export VITE_BLOCKCELL_ENV=true
   ```

## Getting API Keys

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

## Using the Flow Generator

1. **Open the Flow Library Modal** in your admin interface
2. **Switch to the "Generate Flow" tab**
3. **Describe your flow** in natural language, for example:
   - "Create a signup flow with name and email inputs"
   - "Build a payment flow with recipient selection and amount input"
   - "Generate an identity verification flow with SSN and DOB"
4. **Enable AI generation** if you have API keys configured
5. **Select your provider** (or use Block AI on Blockcell)
6. **Click "Generate Flow"**

The AI will create a complete flow that you can immediately use and customize.

## Environment Detection

The system automatically detects your environment:

- **Blockcell**: Shows "Block AI (Blockcell)" option, no API key needed
- **Development**: Uses environment variables or manual entry
- **No API keys**: Falls back to mock mode

## Troubleshooting

### "No API key required" but generation fails
- Make sure you're actually on Blockcell or have the proxy server running
- Check that the proxy server is accessible at `/api/llm`

### "API key is required" error
- Verify your API key is correct and starts with the right prefix
- Check that you have sufficient credits/quota with your provider
- Ensure the API key has the necessary permissions

### Rate limiting errors
- OpenAI and Anthropic have rate limits on their APIs
- Wait a moment and try again
- Consider upgrading your API plan for higher limits

### Mock mode responses
- If you're getting basic template responses, you're in mock mode
- This happens when no API keys are configured
- Set up API keys following the instructions above

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for production**
- **The proxy server keeps API keys server-side only**
- **Blockcell integration doesn't require exposing any keys**

## Integration with Goose

If you're using Goose (Block's AI assistant), you can integrate it with the proxy server:

1. **Set up Goose endpoint:**
   ```bash
   export GOOSE_ENDPOINT=http://localhost:8080
   export GOOSE_API_KEY=your-goose-token
   ```

2. **The proxy server will automatically route requests to Goose**

This allows you to use Goose's capabilities for flow generation while maintaining the same interface.

## Advanced Configuration

### Custom Models
```bash
# Use a specific model
REACT_APP_DEFAULT_LLM_MODEL=gpt-4-turbo-preview
```

### Proxy Configuration
```bash
# Custom proxy endpoint
REACT_APP_LLM_PROXY_ENDPOINT=https://your-proxy.com/api/llm
```

### Rate Limiting
The proxy server includes built-in rate limiting (10 requests/minute by default). Adjust in `api-proxy/server.js` if needed.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your API keys and configuration
3. Test with mock mode first
4. Check the proxy server logs if using the proxy option
