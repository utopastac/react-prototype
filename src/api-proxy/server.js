#!/usr/bin/env node

/**
 * Simple LLM Proxy Server for Blockcell
 * 
 * This server acts as a proxy to LLM services, allowing the React app
 * to make AI requests without exposing API keys to the client.
 * 
 * It can be integrated with Goose or other AI services.
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const config = {
  // Default to OpenAI, but can be configured
  provider: process.env.LLM_PROVIDER || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  gooseEndpoint: process.env.GOOSE_ENDPOINT, // For Goose integration
  
  // Rate limiting (simple in-memory)
  requestsPerMinute: 10,
  requestCounts: new Map()
};

// Simple rate limiting
function checkRateLimit(req, res, next) {
  const clientId = req.ip;
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!config.requestCounts.has(clientId)) {
    config.requestCounts.set(clientId, []);
  }
  
  const requests = config.requestCounts.get(clientId);
  // Remove old requests
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= config.requestsPerMinute) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.' 
    });
  }
  
  recentRequests.push(now);
  config.requestCounts.set(clientId, recentRequests);
  next();
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    provider: config.provider,
    timestamp: new Date().toISOString()
  });
});

// Main LLM proxy endpoint
app.post('/api/llm/chat/completions', checkRateLimit, async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    
    console.log('LLM Request:', { model, messageCount: messages?.length, temperature, max_tokens });
    
    let response;
    
    if (config.gooseEndpoint) {
      // Use Goose integration
      response = await callGoose(messages, model, temperature, max_tokens);
    } else if (config.provider === 'openai' && config.openaiApiKey) {
      // Use OpenAI
      response = await callOpenAI(messages, model, temperature, max_tokens);
    } else if (config.provider === 'anthropic' && config.anthropicApiKey) {
      // Use Anthropic
      response = await callAnthropic(messages, model, temperature, max_tokens);
    } else {
      // Fallback to mock response
      response = await callMock(messages);
    }
    
    console.log('LLM Response received');
    res.json(response);
    
  } catch (error) {
    console.error('LLM Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Goose integration
async function callGoose(messages, model, temperature, maxTokens) {
  const response = await fetch(`${config.gooseEndpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GOOSE_API_KEY || 'goose-token'}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4-turbo-preview',
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2000
    })
  });
  
  if (!response.ok) {
    throw new Error(`Goose API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// OpenAI integration
async function callOpenAI(messages, model, temperature, maxTokens) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4-turbo-preview',
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2000
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Anthropic integration
async function callAnthropic(messages, model, temperature, maxTokens) {
  // Convert OpenAI format to Anthropic format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const anthropicMessages = userMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));
  
  const requestBody = {
    model: model || 'claude-3-sonnet-20240229',
    max_tokens: maxTokens || 2000,
    messages: anthropicMessages
  };
  
  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Convert Anthropic format back to OpenAI format
  return {
    choices: [{
      message: {
        role: 'assistant',
        content: data.content[0].text
      }
    }]
  };
}

// Mock response for testing
async function callMock(messages) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockResponse = {
    "layouts": [
      {
        "dropped": [
          {
            "name": "ArcadeHeader",
            "props": {
              "title": "AI Generated Flow",
              "body": "This flow was generated using the proxy service",
              "size": "HEADER_PAGE"
            }
          },
          {
            "name": "ArcadeDivider",
            "props": {
              "size": "DIVIDER_BETWEEN_SECTION_LARGE"
            }
          },
          {
            "name": "ArcadeInput",
            "props": {
              "label": "Your Input",
              "placeholder": "Enter your information"
            }
          },
          {
            "name": "ArcadeButtonGroup",
            "props": {
              "buttons": [
                {
                  "title": "Continue",
                  "type": "BUTTON_PROMINENT"
                }
              ]
            }
          }
        ],
        "showStatusBar": true,
        "showTopBar": false,
        "showBottomButtons": false,
        "topBarProps": {
          "title": "Flow Generator",
          "left": undefined,
          "inverse": false,
          "isBackNavigation": false
        },
        "bottomButtonsProps": {
          "buttons": [{ "title": "Button" }],
          "horizontal": false,
          "inComponent": false,
          "showHairline": false,
          "disclaimer": "",
          "size": "BUTTON_CTA_SIZE"
        },
        "showToast": false,
        "toastProps": {
          "headline": "Success!",
          "body": "Flow generated successfully",
          "button": "OK",
          "icon": ""
        },
        "statusBarProps": {
          "showNotch": false,
          "transparent": false
        },
        "description": "AI Generated Flow"
      }
    ],
    "names": ["AI Generated Flow"],
    "layoutPositions": { "0": { "row": 0, "col": 0 } },
    "gridRows": 1,
    "gridCols": 1
  };
  
  return {
    choices: [{
      message: {
        role: 'assistant',
        content: JSON.stringify(mockResponse)
      }
    }]
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`🤖 LLM Proxy Server running on port ${PORT}`);
  console.log(`📡 Provider: ${config.provider}`);
  console.log(`🔑 OpenAI: ${config.openaiApiKey ? 'Configured' : 'Not configured'}`);
  console.log(`🔑 Anthropic: ${config.anthropicApiKey ? 'Configured' : 'Not configured'}`);
  console.log(`🔑 Goose: ${config.gooseEndpoint ? 'Configured' : 'Not configured'}`);
  console.log(`📊 Rate limit: ${config.requestsPerMinute} requests/minute`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});
