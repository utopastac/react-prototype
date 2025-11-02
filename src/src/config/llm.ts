// LLM Configuration
// This file handles API key configuration safely

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'mock' | 'proxy' | 'goose';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

// Get environment variables safely
function getEnvVar(key: string): string | undefined {
  // Try different ways to access environment variables
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV[key];
  }
  
  // For Vite/React apps
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  
  // For Create React App
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  return undefined;
}

// Check if we're running on Blockcell
function isBlockcellEnvironment(): boolean {
  // Check for Blockcell-specific indicators
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const hasProxy = getEnvVar('VITE_BLOCKCELL_ENV') === 'true';
  
  // Only return true if we explicitly enable proxy mode
  // This prevents automatic proxy detection until we deploy the proxy server
  return hasProxy && (hostname.includes('blockcell') || hostname.includes('block.xyz'));
}

// Default configuration
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'mock',
  apiKey: undefined,
  model: 'gpt-4-turbo-preview',
  baseUrl: 'https://api.openai.com/v1'
};

// Auto-detect configuration from environment
export function getAutoConfig(): LLMConfig {
  // Check for Goose configuration first (highest priority for Block internal use)
  const gooseEndpoint = getEnvVar('VITE_GOOSE_ENDPOINT') || getEnvVar('REACT_APP_GOOSE_ENDPOINT');
  const gooseApiKey = getEnvVar('VITE_GOOSE_API_KEY') || getEnvVar('REACT_APP_GOOSE_API_KEY');
  
  // For Block internal use, connect to local Goose instance
  const useBlockAI = getEnvVar('VITE_USE_BLOCK_AI') === 'true';
  
  if (useBlockAI) {
    return {
      provider: 'goose',
      apiKey: 'local-goose', // Local Goose doesn't need auth
      model: 'goose-claude-4-sonnet',
      baseUrl: 'http://127.0.0.1:63564' // Your local Goose instance
    };
  }
  
  if (gooseEndpoint) {
    return {
      provider: 'goose',
      apiKey: gooseApiKey || 'goose-default-token',
      model: 'gpt-4-turbo-preview',
      baseUrl: gooseEndpoint
    };
  }

  // If running on Blockcell, use proxy by default
  if (isBlockcellEnvironment()) {
    return {
      provider: 'proxy',
      apiKey: undefined, // No API key needed for proxy
      model: 'gpt-4-turbo-preview',
      baseUrl: '/api/llm' // Proxy endpoint
    };
  }

  const openaiKey = getEnvVar('REACT_APP_OPENAI_API_KEY') || getEnvVar('VITE_OPENAI_API_KEY');
  const anthropicKey = getEnvVar('REACT_APP_ANTHROPIC_API_KEY') || getEnvVar('VITE_ANTHROPIC_API_KEY');
  const defaultProvider = getEnvVar('REACT_APP_DEFAULT_LLM_PROVIDER') || getEnvVar('VITE_DEFAULT_LLM_PROVIDER');
  const defaultModel = getEnvVar('REACT_APP_DEFAULT_LLM_MODEL') || getEnvVar('VITE_DEFAULT_LLM_MODEL');

  // Priority: OpenAI > Anthropic > Mock
  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      model: defaultModel || 'gpt-4-turbo-preview',
      baseUrl: 'https://api.openai.com/v1'
    };
  }
  
  if (anthropicKey) {
    return {
      provider: 'anthropic',
      apiKey: anthropicKey,
      model: defaultModel || 'claude-3-sonnet-20240229',
      baseUrl: 'https://api.anthropic.com/v1'
    };
  }

  // Fallback to mock mode
  return {
    provider: 'mock',
    apiKey: undefined,
    model: 'mock',
    baseUrl: undefined
  };
}

// Configuration for different environments
export const ENV_CONFIGS = {
  development: {
    // Use mock mode by default in development
    provider: 'mock' as const,
    apiKey: undefined,
    model: 'mock',
    baseUrl: undefined
  },
  production: {
    // Auto-detect in production
    ...getAutoConfig()
  },
  staging: {
    // Auto-detect in staging
    ...getAutoConfig()
  }
};

// Get configuration for current environment
export function getConfig(): LLMConfig {
  const env = getEnvVar('NODE_ENV') || 'development';
  return ENV_CONFIGS[env as keyof typeof ENV_CONFIGS] || ENV_CONFIGS.development;
}

// Check if LLM is available
export function isLLMAvailable(): boolean {
  const config = getConfig();
  
  // Goose is always available if configured
  if (config.provider === 'goose') {
    return true;
  }
  
  // Proxy mode is always available on Blockcell
  if (config.provider === 'proxy' && isBlockcellEnvironment()) {
    return true;
  }
  
  return config.provider !== 'mock' && !!config.apiKey;
}

// Get available providers
export function getAvailableProviders(): Array<'openai' | 'anthropic' | 'proxy' | 'goose'> {
  const providers: Array<'openai' | 'anthropic' | 'proxy' | 'goose'> = [];
  
  // Add Goose if configured
  if (getEnvVar('VITE_USE_BLOCK_AI') === 'true' || getEnvVar('VITE_GOOSE_ENDPOINT') || getEnvVar('REACT_APP_GOOSE_ENDPOINT')) {
    providers.push('goose');
  }
  
  // Add proxy if on Blockcell
  if (isBlockcellEnvironment()) {
    providers.push('proxy');
  }
  
  if (getEnvVar('REACT_APP_OPENAI_API_KEY') || getEnvVar('VITE_OPENAI_API_KEY')) {
    providers.push('openai');
  }
  
  if (getEnvVar('REACT_APP_ANTHROPIC_API_KEY') || getEnvVar('VITE_ANTHROPIC_API_KEY')) {
    providers.push('anthropic');
  }
  
  return providers;
}

// Check if we're in Blockcell environment
export function isBlockcell(): boolean {
  return isBlockcellEnvironment();
}
