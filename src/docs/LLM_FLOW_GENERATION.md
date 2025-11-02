# LLM Flow Generation Feature

## Overview

The Flow Library Modal now includes an AI-powered flow generation feature that allows users to create end-to-end user flows using natural language descriptions. This feature uses only the available FormblockerComponents to ensure compatibility with the existing admin interface.

## How to Use

1. **Access the Flow Library**: In the admin interface, click the "Flow Library" button (⌘/) or navigate to the templates section.

2. **Switch to Generate Tab**: Click on the "Generate Flow" tab in the modal.

3. **Describe Your Flow**: Enter a natural language description of the user flow you want to create. For example:
   - "Create a signup flow with name and email inputs"
   - "Build a login screen with email and password"
   - "Generate a payment flow with recipient selection and amount input"
   - "Create an identity verification flow with SSN and DOB inputs"

4. **Generate**: Click the "Generate Flow" button to create your flow.

5. **Load and Edit**: Once generated, click "Load Generated Flow" to import it into the admin interface for further editing.

## Available Components

The flow generator uses only the following FormblockerComponents:

- **Header Components**: Header, FilterBar
- **Input Components**: Input, TextArea, InputCard, ButtonGroup, SearchBar, UpsellCard, InputStackedHorizontal, PINCheck
- **Cell Components**: Cell, CellActivity
- **Avatar Components**: AvatarCarousel
- **UI Components**: Divider, SegmentedControl, Slider, Timeline, TimelineRow, Toast, Text, ListUnordered, ListOrdered, ProgressCircular, Modal, MarketingCardSmall, MarketingCardLarge

## Flow Templates

The system includes several pre-built flow templates that are automatically selected based on keywords in your description:

### Signup Flow
- **Keywords**: signup, register, create, account, onboarding, setup
- **Screens**: Welcome, Email, Success
- **Components**: Headers, Input fields, Buttons, Dividers

### Login Flow
- **Keywords**: login, signin, authenticate
- **Screens**: Login
- **Components**: Headers, Input fields, Buttons

### Payment Flow
- **Keywords**: payment, send, money, transfer
- **Screens**: Send Money, Amount
- **Components**: Headers, Search bars, Cells, Input fields, Buttons

### Verification Flow
- **Keywords**: verify, identity, kyc
- **Screens**: Identity Verification
- **Components**: Headers, Input fields, Buttons

## Technical Implementation

### Flow Generator (`src/admin/utils/flowGenerator.ts`)

The flow generation logic is implemented in a dedicated utility file that includes:

- **Keyword Mapping**: Maps natural language keywords to flow templates
- **Component Patterns**: Maps UI patterns to specific components
- **Flow Templates**: Pre-built templates for common user flows
- **Advanced Generation**: More sophisticated logic for complex requirements

### Integration

The feature is integrated into the existing `FlowLibraryModal` component with:

- **Tab Interface**: Separate tabs for templates and generation
- **Real-time Generation**: Immediate flow creation based on descriptions
- **Preview**: Shows generated flow details before loading
- **Error Handling**: Graceful error handling for failed generations

## Example Usage

```typescript
// Generate a signup flow
const description = "Create a signup flow with name and email inputs";
const generatedFlow = generateFlowFromDescription(description);

// The generated flow includes:
// - Multiple layouts (screens)
// - Proper component mapping
// - Navigation structure
// - Consistent styling
```

## LLM Integration

The system now supports real LLM APIs for advanced flow generation:

### Supported Providers
- **OpenAI GPT-4**: High-quality, creative flows
- **Anthropic Claude**: Excellent reasoning and structure
- **Mock Mode**: Free testing without API costs

### Setup
1. **Environment Variables**: Add API keys to `.env` file
2. **UI Configuration**: Configure in the Generate Flow tab
3. **Automatic Detection**: System detects available APIs

### Usage
1. **Enable AI Generation**: Check "Use AI-powered generation"
2. **Select Provider**: Choose OpenAI, Anthropic, or Mock
3. **Enter API Key**: Secure input field (not persisted)
4. **Generate**: Create flows with natural language

See [LLM Setup Guide](./LLM_SETUP.md) for detailed configuration instructions.

## Future Enhancements

Potential improvements for the LLM flow generation feature:

1. **More LLM Providers**: Support for additional AI services
2. **Custom Templates**: User-defined flow templates
3. **Flow Validation**: Enhanced validation and error handling
4. **A/B Testing**: Generate multiple flow variations for testing
5. **Export Options**: Export generated flows to different formats
6. **Flow Optimization**: AI-powered flow optimization suggestions

## Troubleshooting

### Common Issues

1. **No Flow Generated**: Ensure your description includes relevant keywords
2. **Missing Components**: Check that your description uses available components
3. **Generation Fails**: Try simplifying your description or using example prompts

### Debug Mode

Enable debug mode to see detailed generation logs:

```typescript
// Add to flowGenerator.ts
const DEBUG = true;
if (DEBUG) {
  console.log('Flow generation:', { description, flowType, template });
}
```
