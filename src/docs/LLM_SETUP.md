# LLM Setup Guide

## Overview

The Flow Library now supports AI-powered flow generation using real LLM APIs. This guide will help you set up and configure the LLM integration.

## Supported Providers

### 1. OpenAI GPT-4
- **Model**: gpt-4-turbo-preview
- **Cost**: ~$0.01-0.03 per generation
- **Quality**: Excellent for complex flows
- **Setup**: Requires OpenAI API key

### 2. Anthropic Claude
- **Model**: claude-3-sonnet-20240229
- **Cost**: ~$0.015-0.045 per generation
- **Quality**: Excellent reasoning and structure
- **Setup**: Requires Anthropic API key

### 3. Mock Mode (Testing)
- **Model**: Local mock implementation
- **Cost**: Free
- **Quality**: Basic templates only
- **Setup**: No API key required

## Setup Instructions

### Option 1: Environment Variables (Recommended)

1. **Create a `.env` file** in your project root:
```bash
# OpenAI
REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key-here

# OR Anthropic
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

2. **Restart your development server**:
```bash
npm run dev
```

3. **The system will automatically detect** the API key and configure the appropriate provider.

### Option 2: Manual Configuration in UI

1. **Open the Flow Library** in your admin interface
2. **Switch to the "Generate Flow" tab**
3. **Check "Use AI-powered generation"**
4. **Select your preferred provider** from the dropdown
5. **Enter your API key** in the secure input field
6. **The key is stored only in memory** and not persisted

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add billing information to your account

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. Add billing information to your account

## Usage Examples

### Basic Flow Generation
```
"Create a signup flow with name and email inputs"
```

### Complex Multi-Screen Flow
```
"Build a complete payment flow with recipient selection, amount input, confirmation, and success screen"
```

### Specific Component Requests
```
"Create a verification flow using PIN input, progress indicators, and toast notifications"
```

## Cost Optimization

### OpenAI
- **GPT-4 Turbo**: Best quality, higher cost
- **GPT-3.5 Turbo**: Good quality, lower cost
- **Estimated cost**: $0.01-0.03 per generation

### Anthropic
- **Claude 3 Sonnet**: Best quality, higher cost
- **Claude 3 Haiku**: Good quality, lower cost
- **Estimated cost**: $0.015-0.045 per generation

## Troubleshooting

### Common Issues

1. **"API key is required"**
   - Ensure your API key is correctly entered
   - Check that the key starts with the correct prefix
   - Verify the key has sufficient credits

2. **"API error: 401"**
   - Invalid API key
   - Check your key in the provider's dashboard

3. **"API error: 429"**
   - Rate limit exceeded
   - Wait a few minutes and try again

4. **"Failed to parse LLM response"**
   - The AI generated invalid JSON
   - Try regenerating with a simpler description
   - Check the console for detailed error information

### Debug Mode

Enable detailed logging by opening the browser console (F12) and looking for:
- `Generating flow with LLM:` - Shows the request being sent
- `LLM response:` - Shows the raw AI response
- `Parsed flow:` - Shows the processed flow data

## Security Notes

- **API keys are never stored** in localStorage or cookies
- **Keys are only kept in memory** during the session
- **Environment variables** are the most secure option
- **Never commit API keys** to version control

## Advanced Configuration

### Custom Models
You can modify the model selection in `src/admin/utils/llmFlowGenerator.ts`:

```typescript
// For OpenAI
model: 'gpt-4-turbo-preview' // or 'gpt-3.5-turbo'

// For Anthropic
model: 'claude-3-sonnet-20240229' // or 'claude-3-haiku-20240307'
```

### Custom Base URLs
For self-hosted or custom endpoints:

```typescript
baseUrl: 'https://your-custom-endpoint.com/v1'
```

### Temperature Control
Adjust creativity vs consistency:

```typescript
temperature: 0.7 // 0.0 = very consistent, 1.0 = very creative
```

## Best Practices

1. **Start with mock mode** to test the interface
2. **Use specific descriptions** for better results
3. **Review generated flows** before using them
4. **Monitor API usage** to control costs
5. **Keep API keys secure** and rotate them regularly
