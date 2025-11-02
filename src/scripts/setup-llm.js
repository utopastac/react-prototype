#!/usr/bin/env node

/**
 * LLM Setup Script
 * 
 * This script helps you set up LLM API keys for the flow generation feature.
 * It creates a .env file with the necessary environment variables.
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

async function setupLLM() {
  console.log('🤖 LLM Setup for Flow Generation\n');
  console.log('This script will help you configure API keys for AI-powered flow generation.\n');

  const envPath = path.join(process.cwd(), '.env');
  const envExists = fs.existsSync(envPath);

  if (envExists) {
    console.log('⚠️  .env file already exists. This script will append to it.\n');
  }

  let envContent = '';
  if (envExists) {
    envContent = fs.readFileSync(envPath, 'utf8') + '\n';
  }

  // Ask for OpenAI API key
  console.log('📝 OpenAI Configuration (Optional)');
  console.log('Get your API key from: https://platform.openai.com/api-keys\n');
  
  const openaiKey = await question('Enter your OpenAI API key (or press Enter to skip): ');
  
  if (openaiKey.trim()) {
    if (!openaiKey.startsWith('sk-')) {
      console.log('⚠️  Warning: OpenAI API keys typically start with "sk-"\n');
    }
    envContent += `REACT_APP_OPENAI_API_KEY=${openaiKey.trim()}\n`;
    console.log('✅ OpenAI API key configured\n');
  }

  // Ask for Anthropic API key
  console.log('📝 Anthropic Configuration (Optional)');
  console.log('Get your API key from: https://console.anthropic.com/\n');
  
  const anthropicKey = await question('Enter your Anthropic API key (or press Enter to skip): ');
  
  if (anthropicKey.trim()) {
    if (!anthropicKey.startsWith('sk-ant-')) {
      console.log('⚠️  Warning: Anthropic API keys typically start with "sk-ant-"\n');
    }
    envContent += `REACT_APP_ANTHROPIC_API_KEY=${anthropicKey.trim()}\n`;
    console.log('✅ Anthropic API key configured\n');
  }

  // Ask for default provider
  if (openaiKey.trim() || anthropicKey.trim()) {
    console.log('📝 Default Provider Configuration');
    console.log('Which provider should be used by default?\n');
    
    const options = [];
    if (openaiKey.trim()) options.push('openai');
    if (anthropicKey.trim()) options.push('anthropic');
    
    console.log('Available providers:', options.join(', '));
    const defaultProvider = await question(`Enter default provider (${options.join('/')}): `);
    
    if (options.includes(defaultProvider.toLowerCase())) {
      envContent += `REACT_APP_DEFAULT_LLM_PROVIDER=${defaultProvider.toLowerCase()}\n`;
      console.log(`✅ Default provider set to ${defaultProvider}\n`);
    }
  }

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('✅ .env file created/updated successfully!\n');
  } catch (error) {
    console.error('❌ Error writing .env file:', error.message);
    process.exit(1);
  }

  // Summary
  console.log('📋 Configuration Summary:');
  if (openaiKey.trim()) {
    console.log('  ✅ OpenAI: Configured');
  } else {
    console.log('  ❌ OpenAI: Not configured');
  }
  
  if (anthropicKey.trim()) {
    console.log('  ✅ Anthropic: Configured');
  } else {
    console.log('  ❌ Anthropic: Not configured');
  }

  if (!openaiKey.trim() && !anthropicKey.trim()) {
    console.log('\n⚠️  No API keys configured. The system will use mock mode.');
    console.log('   Mock mode is free but provides basic templates only.');
  } else {
    console.log('\n🎉 Setup complete! Restart your development server to apply changes.');
    console.log('   Run: npm run dev');
  }

  console.log('\n📚 Next steps:');
  console.log('   1. Restart your development server');
  console.log('   2. Open the Flow Library in your admin interface');
  console.log('   3. Switch to the "Generate Flow" tab');
  console.log('   4. The AI generation should be automatically enabled');

  rl.close();
}

// Handle errors
process.on('SIGINT', () => {
  console.log('\n\nSetup cancelled.');
  rl.close();
  process.exit(0);
});

setupLLM().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
