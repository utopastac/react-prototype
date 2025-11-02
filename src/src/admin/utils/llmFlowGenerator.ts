import { FormblockerComponents, ComponentData, initialComponentProps } from 'src/data/Components';
import { getConfig, getAutoConfig, isLLMAvailable, getAvailableProviders, LLMConfig } from 'src/config/llm';

export interface GeneratedFlow {
  layouts: any[];
  names: string[];
  layoutPositions: Record<string, { row: number; col: number }>;
  gridRows: number;
  gridCols: number;
}

// Available components for LLM generation
const availableComponents = Object.keys(FormblockerComponents);

// Component mapping for common UI patterns
const componentPatterns = {
  header: 'Header',
  input: 'Input',
  textArea: 'TextArea',
  button: 'ButtonGroup',
  divider: 'Divider',
  text: 'Text',
  cell: 'Cell',
  search: 'SearchBar',
  progress: 'ProgressCircular',
  toast: 'Toast',
  modal: 'Modal',
  list: 'ListUnordered',
  timeline: 'Timeline',
  slider: 'Slider',
  segmentedControl: 'SegmentedControl',
  upsell: 'UpsellCard',
  marketing: 'MarketingCardSmall',
  disclaimer: 'Disclaimer',
  pinCheck: 'PINCheck',
  inputCard: 'InputCard',
  avatar: 'AvatarCarousel',
  cellActivity: 'CellActivity'
};

// Default configuration - auto-detected from environment
const DEFAULT_LLM_CONFIG: LLMConfig = getAutoConfig();

/**
 * Generate a system prompt for the LLM
 */
function createSystemPrompt(): string {
  return `You are an expert UI/UX designer and React developer. Your task is to generate user flows for a mobile app using only the available components.

AVAILABLE COMPONENTS:
${availableComponents.join(', ')}

COMPONENT PATTERNS:
${Object.entries(componentPatterns).map(([pattern, component]) => `${pattern}: ${component}`).join('\n')}

COMPONENT CONSTANTS:
- HEADER_SIZES: HEADER_PAGE, HEADER_SECTION, HEADER_HERO
- BUTTON_TYPES: BUTTON_PROMINENT, BUTTON_STANDARD, BUTTON_DESTRUCTIVE
- DIVIDER_SIZES: DIVIDER_BETWEEN_SECTION_LARGE, DIVIDER_WITHIN_SECTION_MEDIUM
- TEXT_SIZES: TEXT_BODY, TEXT_HEADER, TEXT_DESCRIPTION

REQUIRED OUTPUT FORMAT:
Return a valid JSON object with this exact structure:
{
  "layouts": [
    {
      "dropped": [
        {
          "name": "ComponentName",
          "props": {
            "title": "string",
            "body": "string",
            "size": "CONSTANT_NAME",
            // ... other props
          }
        }
      ],
      "showStatusBar": true,
      "showTopBar": boolean,
      "showBottomButtons": boolean,
      "topBarProps": {
        "title": "string",
        "left": { "icon": "string" } | undefined,
        "inverse": boolean,
        "isBackNavigation": boolean
      },
      "bottomButtonsProps": {
        "buttons": [{ "title": "string", "type": "BUTTON_TYPE" }],
        "horizontal": boolean,
        "inComponent": boolean,
        "showHairline": boolean,
        "disclaimer": "string",
        "size": "BUTTON_CTA_SIZE"
      },
      "showToast": boolean,
      "toastProps": {
        "headline": "string",
        "body": "string",
        "button": "string",
        "icon": "string"
      },
      "statusBarProps": {
        "showNotch": boolean,
        "transparent": boolean
      },
      "description": "string"
    }
  ],
  "names": ["string"],
  "layoutPositions": { "0": { "row": 0, "col": 0 } },
  "gridRows": 1,
  "gridCols": 1
}

GUIDELINES:
1. Use only the available components listed above
2. Create logical, user-friendly flows
3. Include proper navigation (back buttons on screens after the first)
4. Use appropriate component constants
5. Ensure all required properties are included
6. Create 1-4 screens depending on the complexity of the flow
7. Make the flow feel natural and intuitive`;
}

/**
 * Create a user prompt for the LLM
 */
function createUserPrompt(description: string): string {
  return `Generate a user flow for: "${description}"

Please create a complete, functional flow that users can immediately use and edit. Focus on creating a smooth, intuitive user experience.`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string, config: LLMConfig): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: createSystemPrompt() },
        { role: 'user', content: createUserPrompt(prompt) }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Proxy API (for Blockcell environment)
 */
async function callProxy(prompt: string, config: LLMConfig): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: createSystemPrompt() },
        { role: 'user', content: createUserPrompt(prompt) }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Proxy API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Goose API directly using real Databricks integration
 */
async function callGoose(prompt: string, config: LLMConfig): Promise<string> {
  console.log('Calling real Goose API at:', config.baseUrl);
  
  // Create the full prompt with system context
  const fullPrompt = `${createSystemPrompt()}\n\n${createUserPrompt(prompt)}`;
  
  try {
    // Call Goose's chat completion endpoint
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Goose typically doesn't require auth for local instances
      },
      body: JSON.stringify({
        model: config.model || 'goose-claude-4-sonnet',
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Goose API error response:', errorText);
      throw new Error(`Goose API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Goose API response:', data);
    
    // Extract the content from Goose's response format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else if (data.content) {
      return data.content;
    } else {
      throw new Error('Unexpected Goose API response format');
    }
    
  } catch (error) {
    console.error('Goose API call failed:', error);
    
    // If the real API fails, provide a helpful error message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Could not connect to Goose. Make sure Goose is running locally.');
    }
    
    throw error;
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(prompt: string, config: LLMConfig): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: `${createSystemPrompt()}\n\n${createUserPrompt(prompt)}` }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Mock LLM for testing (fallback)
 */
async function callMockLLM(prompt: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a simple mock response
  return JSON.stringify({
    layouts: [
      {
        dropped: [
          {
            name: "Header",
            props: {
              title: "Welcome",
              body: "Let's get started with your flow",
              size: "HEADER_PAGE"
            }
          },
          {
            name: "Divider",
            props: {
              size: "DIVIDER_BETWEEN_SECTION_LARGE"
            }
          },
          {
            name: "Input",
            props: {
              label: "Name",
              placeholder: "Enter your name"
            }
          },
          {
            name: "ButtonGroup",
            props: {
              buttons: [
                {
                  title: "Continue",
                  type: "BUTTON_PROMINENT"
                }
              ]
            }
          }
        ],
        showStatusBar: true,
        showTopBar: false,
        showBottomButtons: false,
        topBarProps: {
          title: "Funblocker",
          left: undefined,
          right: undefined,
          inverse: false,
          isBackNavigation: false
        },
        bottomButtonsProps: {
          buttons: [{ title: "Button" }],
          horizontal: false,
          inComponent: false,
          showHairline: false,
          disclaimer: "",
          size: "BUTTON_CTA_SIZE"
        },
        showToast: false,
        toastProps: {
          headline: "This is a toast!",
          body: "Toast body",
          button: "OK",
          icon: ""
        },
        statusBarProps: {
          showNotch: false,
          transparent: false
        },
        description: "Welcome"
      }
    ],
    names: ["Generated Flow"],
    layoutPositions: { "0": { row: 0, col: 0 } },
    gridRows: 1,
    gridCols: 1
  });
}

/**
 * Parse LLM response and validate it
 */
function parseLLMResponse(response: string): GeneratedFlow {
  try {
    // Try to extract JSON from the response (in case LLM adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the structure
    if (!parsed.layouts || !Array.isArray(parsed.layouts)) {
      throw new Error('Invalid response: missing or invalid layouts array');
    }
    
    if (!parsed.names || !Array.isArray(parsed.names)) {
      throw new Error('Invalid response: missing or invalid names array');
    }
    
    if (!parsed.layoutPositions || typeof parsed.layoutPositions !== 'object') {
      throw new Error('Invalid response: missing or invalid layoutPositions');
    }
    
    // Validate each layout
    parsed.layouts.forEach((layout: any, index: number) => {
      if (!layout.dropped || !Array.isArray(layout.dropped)) {
        throw new Error(`Invalid layout ${index}: missing or invalid dropped array`);
      }
      
      // Validate each dropped component
      layout.dropped.forEach((item: any, itemIndex: number) => {
        if (!item.name || !availableComponents.includes(item.name)) {
          throw new Error(`Invalid component in layout ${index}, item ${itemIndex}: unknown component "${item.name}"`);
        }
        
        if (!item.props || typeof item.props !== 'object') {
          throw new Error(`Invalid component in layout ${index}, item ${itemIndex}: missing props`);
        }
      });
    });
    
    return {
      layouts: parsed.layouts,
      names: parsed.names,
      layoutPositions: parsed.layoutPositions,
      gridRows: parsed.gridRows || 1,
      gridCols: parsed.gridCols || 1
    };
  } catch (error) {
    console.error('Failed to parse LLM response:', error);
    console.error('Raw response:', response);
    throw new Error(`Failed to parse LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main function to generate a flow using an actual LLM
 */
export async function generateFlowWithLLM(
  description: string, 
  config: LLMConfig = DEFAULT_LLM_CONFIG
): Promise<GeneratedFlow> {
  console.log('Generating flow with LLM:', { description, config });
  
  let response: string;
  
  try {
    switch (config.provider) {
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        response = await callOpenAI(description, config);
        break;
        
      case 'anthropic':
        if (!config.apiKey) {
          throw new Error('Anthropic API key is required');
        }
        response = await callAnthropic(description, config);
        break;
        
      case 'goose':
        response = await callGoose(description, config);
        break;
        
      case 'proxy':
        response = await callProxy(description, config);
        break;
        
      case 'mock':
        response = await callMockLLM(description);
        break;
        
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
    
    console.log('LLM response:', response);
    
    const parsedFlow = parseLLMResponse(response);
    console.log('Parsed flow:', parsedFlow);
    
    return parsedFlow;
    
  } catch (error) {
    console.error('LLM generation failed:', error);
    throw error;
  }
}

/**
 * Configuration helper functions
 */
export function setLLMConfig(config: Partial<LLMConfig>): void {
  Object.assign(DEFAULT_LLM_CONFIG, config);
}

/**
 * Environment variable helpers
 */
export function setupLLMFromEnv(): void {
  const config = getAutoConfig();
  setLLMConfig(config);
  
  if (config.provider === 'mock') {
    console.warn('No LLM API keys found in environment variables. Using mock mode.');
  } else {
    console.log(`LLM configured for ${config.provider} with model ${config.model}`);
  }
}
