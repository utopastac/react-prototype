# LLM Proxy Server

A simple proxy server that allows the React app to make AI requests without exposing API keys to the client. Perfect for Blockcell deployments.

## Features

- **Multiple LLM Providers**: Support for OpenAI, Anthropic, and Goose
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Environment Detection**: Automatically detects Blockcell environment
- **Mock Mode**: Fallback mock responses for testing
- **CORS Support**: Ready for cross-origin requests

## Quick Start

1. Install dependencies:
   ```bash
   cd api-proxy
   npm install
   ```

2. Set environment variables:
   ```bash
   # Optional: Set your preferred provider
   export LLM_PROVIDER=openai
   
   # Set API keys (at least one)
   export OPENAI_API_KEY=sk-...
   export ANTHROPIC_API_KEY=sk-ant-...
   
   # Optional: Goose integration
   export GOOSE_ENDPOINT=http://localhost:8080
   export GOOSE_API_KEY=your-goose-token
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on port 3001 by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `LLM_PROVIDER` | Primary LLM provider (`openai`, `anthropic`, `goose`) | `openai` |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |
| `GOOSE_ENDPOINT` | Goose API endpoint | - |
| `GOOSE_API_KEY` | Goose API key | `goose-token` |

## API Endpoints

### POST /api/llm/chat/completions

Main LLM proxy endpoint that accepts OpenAI-compatible requests.

**Request:**
```json
{
  "model": "gpt-4-turbo-preview",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Generate a user flow"}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Generated flow JSON..."
    }
  }]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "provider": "openai",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Integration with React App

The React app automatically detects when running on Blockcell and offers the "Block AI (Blockcell)" option in the provider dropdown. This uses the proxy server instead of requiring users to enter API keys.

## Goose Integration

To integrate with Goose, set the `GOOSE_ENDPOINT` environment variable:

```bash
export GOOSE_ENDPOINT=http://localhost:8080
export GOOSE_API_KEY=your-goose-token
```

The proxy will then route requests to your Goose instance.

## Rate Limiting

The server includes basic rate limiting:
- 10 requests per minute per IP address
- In-memory storage (resets on server restart)
- Returns 429 status when limit exceeded

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Blockcell

1. Build the Docker image
2. Deploy to your Blockcell environment
3. Set environment variables in your deployment configuration
4. The React app will automatically detect and use the proxy

## Security Considerations

- API keys are stored server-side only
- Rate limiting prevents abuse
- CORS is configured for cross-origin requests
- No sensitive data is logged

## Development

```bash
# Install dependencies
npm install

# Start in development mode with auto-reload
npm run dev

# Test the health endpoint
curl http://localhost:3001/health
```

## Troubleshooting

1. **"No API keys configured"**: Set at least one of the API key environment variables
2. **Rate limit errors**: Wait a minute or increase the rate limit in the code
3. **CORS errors**: Ensure the server is running and accessible from your React app
4. **Connection refused**: Check that the server is running on the expected port
