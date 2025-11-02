#!/usr/bin/env node

/**
 * Goose Integration Setup Script
 * 
 * This script helps set up integration between the React app and Goose.
 * It configures the proxy server to route LLM requests to a Goose instance.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGooseIntegration() {
  console.log('🪿 Goose Integration Setup\n');
  console.log('This script will help you integrate your React app with Goose for AI-powered flow generation.\n');

  // Check if Goose is running
  console.log('📋 Prerequisites:');
  console.log('  1. Goose should be running and accessible');
  console.log('  2. Goose should have LLM capabilities enabled');
  console.log('  3. You should know the Goose endpoint URL\n');

  const proceed = await question('Do you want to continue? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  // Get Goose configuration
  console.log('\n📝 Goose Configuration:');
  
  const gooseEndpoint = await question('Enter Goose endpoint URL (e.g., http://localhost:8080): ');
  if (!gooseEndpoint.trim()) {
    console.log('❌ Goose endpoint is required.');
    rl.close();
    return;
  }

  const gooseApiKey = await question('Enter Goose API key (or press Enter for default): ');
  
  // Test connection to Goose
  console.log('\n🔍 Testing connection to Goose...');
  try {
    const fetch = require('node-fetch');
    const testResponse = await fetch(`${gooseEndpoint.trim()}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${gooseApiKey.trim() || 'goose-token'}`
      }
    });
    
    if (testResponse.ok) {
      console.log('✅ Successfully connected to Goose!');
    } else {
      console.log(`⚠️  Goose responded with status ${testResponse.status}. Continuing anyway...`);
    }
  } catch (error) {
    console.log(`⚠️  Could not connect to Goose (${error.message}). Continuing anyway...`);
  }

  // Update proxy server configuration
  const proxyEnvPath = path.join(process.cwd(), 'api-proxy', '.env');
  let envContent = '';

  if (fs.existsSync(proxyEnvPath)) {
    envContent = fs.readFileSync(proxyEnvPath, 'utf8') + '\n';
  }

  // Remove existing Goose configuration
  envContent = envContent
    .split('\n')
    .filter(line => !line.startsWith('GOOSE_ENDPOINT') && !line.startsWith('GOOSE_API_KEY'))
    .join('\n');

  // Add new Goose configuration
  envContent += `\n# Goose Integration\n`;
  envContent += `GOOSE_ENDPOINT=${gooseEndpoint.trim()}\n`;
  if (gooseApiKey.trim()) {
    envContent += `GOOSE_API_KEY=${gooseApiKey.trim()}\n`;
  }
  envContent += `LLM_PROVIDER=goose\n`;

  try {
    fs.writeFileSync(proxyEnvPath, envContent.trim() + '\n');
    console.log('✅ Proxy server configuration updated!');
  } catch (error) {
    console.error('❌ Error updating proxy configuration:', error.message);
  }

  // Update React app configuration
  const reactEnvPath = path.join(process.cwd(), '.env');
  let reactEnvContent = '';

  if (fs.existsSync(reactEnvPath)) {
    reactEnvContent = fs.readFileSync(reactEnvPath, 'utf8') + '\n';
  }

  // Enable Blockcell mode to use proxy
  if (!reactEnvContent.includes('VITE_BLOCKCELL_ENV')) {
    reactEnvContent += `\n# Enable proxy mode for Goose integration\n`;
    reactEnvContent += `VITE_BLOCKCELL_ENV=true\n`;

    try {
      fs.writeFileSync(reactEnvPath, reactEnvContent.trim() + '\n');
      console.log('✅ React app configuration updated!');
    } catch (error) {
      console.error('❌ Error updating React configuration:', error.message);
    }
  }

  // Instructions
  console.log('\n🎉 Goose integration setup complete!\n');
  console.log('📋 Next steps:');
  console.log('  1. Start the proxy server:');
  console.log('     cd api-proxy && npm install && npm start');
  console.log('  2. Start your React development server:');
  console.log('     npm run dev');
  console.log('  3. Open the Flow Library and switch to "Generate Flow"');
  console.log('  4. You should see "Block AI (Blockcell)" as an available option');
  console.log('  5. Describe your flow and click "Generate Flow"');

  console.log('\n📚 How it works:');
  console.log('  • The React app detects it\'s in "Blockcell mode"');
  console.log('  • LLM requests are sent to the proxy server (/api/llm)');
  console.log('  • The proxy server forwards requests to your Goose instance');
  console.log('  • Goose processes the request and returns the generated flow');

  console.log('\n🔧 Troubleshooting:');
  console.log('  • If generation fails, check the proxy server logs');
  console.log('  • Ensure Goose is running and accessible');
  console.log('  • Verify Goose has LLM capabilities enabled');
  console.log('  • Check that the API key (if used) is correct');

  rl.close();
}

// Handle errors
process.on('SIGINT', () => {
  console.log('\n\nSetup cancelled.');
  rl.close();
  process.exit(0);
});

setupGooseIntegration().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
