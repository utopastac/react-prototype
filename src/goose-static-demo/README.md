# Goose-Powered Static Site Demo

This project demonstrates how to create a static website that leverages Goose for LLM generation features.

## Integration Approaches

### 1. Build-Time Generation
Generate content with Goose during the build process and include it in the static files.

**Example workflow:**
```bash
# Use Goose to generate content
goose session start
# In Goose: "Generate a blog post about AI trends"
# Save output to content files

# Build static site with generated content
npm run build
```

### 2. Runtime Integration (Client-Side)
Have the static site communicate with a running Goose instance.

**Requirements:**
- Goose running with API endpoint exposed
- CORS configuration for browser access
- Local development setup

### 3. Hybrid Approach
Combine both methods:
- Pre-generate core content at build time
- Allow dynamic generation for interactive features

## Current Implementation

This demo includes:
- **Static HTML/CSS/JS** - Ready for Blockcell deployment
- **Fallback UI** - Manual copy/paste workflow when API unavailable
- **API Integration** - Attempts to connect to local Goose instance
- **Responsive Design** - Works on mobile and desktop

## Deployment to Blockcell

```bash
# Deploy to Blockcell
goose "Deploy this directory to blockcell as 'goose-demo'"
```

## Potential Goose API Integration

For full runtime integration, Goose would need to expose an HTTP API:

```javascript
// Example API call
const response = await fetch('http://localhost:8080/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        prompt: "Generate a summary of recent AI developments",
        model: "gpt-4o",
        max_tokens: 500
    })
});
```

## Use Cases

1. **Content Generation Sites** - Blogs, documentation, marketing copy
2. **Interactive Tools** - Code generators, writing assistants
3. **Educational Platforms** - AI-powered tutorials and explanations
4. **Creative Applications** - Story generators, image prompts, brainstorming tools

## Limitations

- **Static Nature** - No server-side processing on Blockcell
- **CORS Restrictions** - Browser security limits API access
- **Local Dependencies** - Requires Goose running locally for full features

## Next Steps

1. **Goose API Development** - Add HTTP endpoint to Goose
2. **Build Tools** - Create scripts for build-time content generation
3. **Templates** - Develop reusable templates for different use cases
4. **Authentication** - Secure API access for production use
