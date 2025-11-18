/**
 * Templates for AdminView: Predefined UI Layouts
 * 
 * This file defines a collection of pre-built UI layouts that can be quickly applied
 * in the admin interface. Each template represents a common UI pattern or screen type
 * that developers can use as starting points for building interfaces.
 * 
 * USAGE:
 * - Templates are displayed in a dropdown in the GlobalSettingsPanel (phone settings view)
 * - When selected, they replace the current layout with the predefined components
 * - Templates can include both regular components and special UI elements (top bar, bottom buttons)
 * - This enables rapid prototyping and consistent UI patterns across the app
 * 
 * STRUCTURE:
 * - Each template has a name, array of components, and optional special props
 * - Components are defined with their initial props and can be customized
 * - Special props control the top navigation bar and bottom action buttons
 * - Templates use the same component system as the drag-and-drop interface
 */

import { InterventionScreenComponents, initialComponentProps } from 'src/data/Components';
import { TopBarProps } from 'src/components/TopBar';
import { ButtonGroupProps } from 'src/components/ButtonGroup';
import { ToastProps } from 'src/components/Toast';
import { IOSStatusBarProps } from 'src/components/IOSStatusBar';
import * as Icons from 'src/data/Icons';
import { Images } from 'src/data/Images';
import { PatternDescription } from 'src/patterns/PatternDescription';

/**
 * AdminTemplate Interface
 * 
 * Defines the structure for a template that can be applied to the admin interface.
 * Templates consist of:
 * - name: Display name for the template selector
 * - components: Array of components with their props to render in the layout
 * - topBarProps: Optional configuration for the top navigation bar
 * - bottomButtonsProps: Optional configuration for bottom action buttons
 */
export interface AdminTemplate {
  name: string;
  group?: string,
  description?: PatternDescription;
  components: { name: string; Component: React.ComponentType<any>; props: any }[];
  topBarProps?: TopBarProps;
  bottomButtonsProps?: ButtonGroupProps;
  toastProps?: ToastProps;
  statusBarProps?: IOSStatusBarProps; 
}

/**
 * AdminTemplates Collection
 * 
 * Array of predefined templates that can be applied in the admin interface.
 * Each template demonstrates a different UI pattern or screen type.
 * 
 * TEMPLATE TYPES:
 * - Blank: Empty canvas for starting from scratch
 * - Simple List: Basic list with info card and continue button
 * - Promo Page: Welcome/onboarding screen with call-to-action
 * - Multi Select: Radio button selection interface
 * - Input Fields: Form with text inputs
 * - Error Message: Error state with alert icon and action buttons
 */
export const AdminTemplates: AdminTemplate[] = [
  /**
   * Blank Template
   * 
   * Empty canvas template - no components, no special UI elements.
   * Used as a starting point for custom layouts or to clear the current layout.
   */
  {
    name: 'Blank',
    group: 'Information',
    description: {
      title: 'Blank Template',
      overview: 'An empty canvas template with no components or special UI elements. Use this as a starting point for custom layouts or to clear the current layout.',
      useCases: [
        'Starting from scratch',
        'Clearing existing layouts',
        'Building custom patterns'
      ]
    },
    components: [],
    topBarProps: {
      title: '',
      left: undefined,
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: undefined,
  },

  /**
   * Loading Template
   * 
   * Loading spinner - just circular progress, no special UI elements.
   * Used to demonstrate loading steps in flows.
   */
  {
    name: 'Loading',
    group: 'Information',
    description: {
      title: 'Loading Template',
      overview: 'A simple loading state with a circular progress indicator. Perfect for showing users that content is being fetched or processed.',
      useCases: [
        'Data fetching screens',
        'Processing states',
        'Transition screens in multi-step flows'
      ]
    },
    components: [
      {
        name: 'ProgressCircular',
        Component: (InterventionScreenComponents as any)['ProgressCircular'],
        props: initialComponentProps['ProgressCircular']
      },
    ],
    topBarProps: undefined,
    bottomButtonsProps: undefined,
  },
  
  /**
   * Simple List Template
   * 
   * Demonstrates a basic list layout with:
   * - Dividers for visual separation
   * - Info card for content display
   * - Bottom continue button for navigation
   * - Top bar with title
   * 
   * Common use case: Information display screens, simple forms
   */
  {
    name: 'Simple List',
    group: 'Information',
    description: {
      title: 'Simple List Template',
      overview: 'A basic list layout with dividers, headers, and informational content. Includes a top bar with navigation and a bottom continue button.',
      features: [
        'Page header for context',
        'Unordered list items',
        'Section headers for organization',
        'Upsell card for additional content',
        'Bottom action button'
      ],
      useCases: [
        'Information display screens',
        'Simple forms',
        'Settings pages',
        'Feature lists'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: { title: 'This is a simple list', body: '', size: 'page' }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: initialComponentProps['Divider']
      },
      // ListUnordered replacing two Cell entries
      {
        name: 'ListUnordered',
        Component: (InterventionScreenComponents as any)['ListUnordered'],
        props: initialComponentProps['ListUnordered']
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'extraLarge' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Section Title',
          body: 'This is a section header for additional information.',
          size: 'section'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
    ],
    topBarProps: {
      title: 'Simple List',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [{ title: 'Continue' }],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  
  /**
   * Promo Page Template
   * 
   * Welcome/onboarding screen template with:
   * - Customized info card with welcome message
   * - Call-to-action button
   * - Top bar with "Promo" title
   * - No bottom buttons (button is part of the content)
   * 
   * Common use case: App onboarding, feature introductions, welcome screens
   */
  {
    name: 'Promo Page',
    group: 'Information',
    description: {
      title: 'Promo Page Template',
      overview: 'A welcome or onboarding screen designed to introduce features or collect user information. Features a hero header with an image accessory and informational cells.',
      features: [
        'Hero header with image accessory',
        'Multiple informational cells with icons',
        'Transparent top bar',
        'Prominent call-to-action button'
      ],
      useCases: [
        'App onboarding',
        'Feature introductions',
        'Welcome screens',
        'Information collection flows'
      ]
    },
    components: [
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "Get started",
          body: 'We need to collect some information to set up your account.',
          size: 'hero',
          accessory: {
            type: 'image',
            image: Images.Conversation,
            offset: true
          }
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      // Informational Cell 1
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Your info is secure',
          body: 'We use industry-standard encryption to protect your data.',
          left: { type: 'icon', icon: Icons.Push },
          right: { type: 'none' }
        }
      },
      // Informational Cell 2
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Why we ask',
          body: 'This information helps us personalize your experience.',
          left: { type: 'icon', icon: Icons.Add16 },
          right: { type: 'none' }
        }
      },
      // Informational Cell 3
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Need help?',
          body: 'Contact support if you have any questions.',
          left: { type: 'icon', icon: Icons.Help24 },
          right: { type: 'none' }
        }
      },
      
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      transparent: true,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Continue', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
    statusBarProps: {
      transparent: true,
      showNotch: false,
      inverse: false
    }
  },
  
  /**
   * Multi Select Template
   * 
   * Radio button selection interface with:
   * - Page header with question
   * - Multiple radio button options (Morning, Afternoon, Evening)
   * - Close button in top bar
   * - Back/Continue buttons at bottom
   * 
   * Common use case: Survey questions, preference selection, multi-step forms
   */
  {
    name: 'Radio options',
    group: 'Form',
    description: {
      title: 'Radio Options Template',
      overview: 'A single-choice selection interface using radio buttons. Perfect for questions where users need to select one option from multiple choices.',
      features: [
        'Page header with question',
        'Multiple radio button options',
        'Back and Continue navigation buttons',
        'Clean, scannable layout'
      ],
      useCases: [
        'Survey questions',
        'Preference selection',
        'Multi-step forms',
        'Decision points in flows'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: 'page' }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Morning',
          body: '',
          right: { type: 'radio' },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Afternoon',
          body: '',
          right: { type: 'radio' },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Evening',
          body: '',
          right: { type: 'radio' },
          checked: false
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Back', type: 'standard' },
        { title: 'Continue', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Multi Select Template
   * 
   * Radio button selection interface with:
   * - Page header with question
   * - Multiple radio button options (Morning, Afternoon, Evening)
   * - Close button in top bar
   * - Back/Continue buttons at bottom
   * 
   * Common use case: Survey questions, preference selection, multi-step forms
   */
  {
    name: 'Checkbox options',
    group: 'Form',
    description: {
      title: 'Checkbox Options Template',
      overview: 'A multi-choice selection interface using checkboxes. Allows users to select multiple options from a list, unlike radio buttons which only allow single selection.',
      features: [
        'Page header with question',
        'Multiple checkbox options',
        'Back and Continue navigation buttons',
        'Clean, scannable layout'
      ],
      useCases: [
        'Multi-select surveys',
        'Preference selection (select all that apply)',
        'Feature selection',
        'Tag selection'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: 'page' }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Morning',
          body: '',
          right: { type: 'checkbox' },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Afternoon',
          body: '',
          right: { type: 'checkbox' },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'InputCard',
        Component: (InterventionScreenComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Evening',
          body: '',
          right: { type: 'checkbox' },
          checked: false
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Back', type: 'standard' },
        { title: 'Continue', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  
  /**
   * Input Fields Template
   * 
   * Form with text inputs demonstrating:
   * - Page header with explanation text
   * - Multiple text input fields (First name, Last name)
   * - Close button in top bar
   * - Single "Next" button at bottom
   * 
   * Common use case: User registration, profile forms, data collection
   */
  {
    name: 'Input Fields',
    group: 'Form',
    description: {
      title: 'Input Fields Template',
      overview: 'A form with standard text input fields for collecting user information. Features a clear header with explanation text and multiple input fields.',
      features: [
        'Page header with explanation text',
        'Multiple text input fields',
        'Clean, focused layout',
        'Single action button'
      ],
      useCases: [
        'User registration',
        'Profile forms',
        'Data collection',
        'Personal information entry'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "What's your name?",
          body: 'We need to collect some information to set up your profile.',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'Input',
        Component: (InterventionScreenComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: undefined,
          placeholder: 'First name'
        }
      },
      {
        name: 'Input',
        Component: (InterventionScreenComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: undefined,
          placeholder: 'Last name'
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Next', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  
  
  /**
   * Error Message Template
   * 
   * Error state screen demonstrating:
   * - Error header with alert icon
   * - Descriptive error message
   * - Close button in top bar
   * - Two action buttons: standard and prominent
   * 
   * Common use case: Error handling, validation failures, user feedback
   */
  {
    name: 'Error Message',
    group: 'Information',
    description: {
      title: 'Error Message Template',
      overview: 'An error state screen designed to clearly communicate problems to users. Features an alert icon and actionable buttons to resolve the issue.',
      features: [
        'Error icon with themed styling',
        'Clear error title and description',
        'Multiple action buttons (alternative method, retry)',
        'Close button in top bar'
      ],
      useCases: [
        'Validation errors',
        'Failed operations',
        'Network errors',
        'Authentication failures'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "Information doesn't match",
          body: "The information you entered doesn't match our records.",
          size: 'page',
          accessory: {
            type: 'icon',
            icon: Icons.Alert24,
            theme: 'error'
          }
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Close },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Use another method', type: 'standard' },
        { title: 'Try again', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Success Message Template
   * 
   * Success state screen demonstrating:
   * - Success header with check/verified icon
   * - Descriptive success message
   * - Close button in top bar
   * - Single action button: Done
   * 
   * Common use case: Confirmation, completion, user feedback
   */
  {
    name: 'Success Message',
    group: 'Information',
    description: {
      title: 'Success Message Template',
      overview: 'A success state screen that confirms completed actions to users. Features a success icon and a clear completion message.',
      features: [
        'Success icon with brand theming',
        'Clear success title and message',
        'Single "Done" action button',
        'Close button in top bar'
      ],
      useCases: [
        'Action confirmations',
        'Completion screens',
        'Success feedback',
        'Transaction confirmations'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Success!',
          body: 'Your action was completed successfully.',
          size: 'page',
          accessory: {
            type: 'icon',
            icon: Icons.Push,
            theme: 'brand'
          }
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Close },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Done', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Address Form Template
   *
   * Collects a user's address with multiple input fields.
   * - Header with explanation
   * - Input fields: Street Address, City, State, ZIP Code
   * - Divider for separation
   * - Close button in top bar
   * - "Next" button at bottom
   */
  {
    name: 'Address Form',
    group: 'Form',
    description: {
      title: 'Address Form Template',
      overview: 'A comprehensive address collection form with multiple input fields. Uses a stacked horizontal input for state and ZIP code to optimize space.',
      features: [
        'Page header with prompt',
        'Street address input',
        'City input',
        'Stacked horizontal inputs for State and ZIP',
        'Single "Next" action button'
      ],
      useCases: [
        'Shipping address collection',
        'Billing address forms',
        'Location registration',
        'Profile address updates'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'What\'s your address?',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'Input',
        Component: (InterventionScreenComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: 'Address',
          placeholder: 'Street Address'
        }
      },
      {
        name: 'Input',
        Component: (InterventionScreenComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: 'City',
          placeholder: 'City'
        }
      },
      {
        name: 'InputStackedHorizontal',
        Component: (InterventionScreenComponents as any)['InputStackedHorizontal'],
        props: {
          ...initialComponentProps['InputStackedHorizontal'],
          label1: 'State',
          placeholder1: 'NY',
          label2: 'ZIP Code',
          placeholder2: '01234'
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Next', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Long Form Text Template
   *
   * Collects long-form text input from the user.
   * - Header with prompt
   * - Divider for separation
   * - TextArea for long-form input
   * - Close button in top bar
   * - "Submit" button at bottom
   */
  {
    name: 'Long Form Text',
    group: 'Form',
    description: {
      title: 'Long Form Text Template',
      overview: 'A form for collecting longer text input from users using a textarea component. Perfect for open-ended questions and detailed responses.',
      features: [
        'Page header with prompt and explanation',
        'Large textarea for multi-line input',
        'Single "Submit" action button',
        'Clean, focused layout'
      ],
      useCases: [
        'Feedback forms',
        'Comments and reviews',
        'Detailed descriptions',
        'Open-ended questions',
        'Support requests'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Tell us more',
          body: 'Please provide additional details below.',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'TextArea',
        Component: (InterventionScreenComponents as any)['TextArea'],
        props: {
          ...initialComponentProps['TextArea'],
          label: undefined,
          placeholder: 'Enter your response here...'
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Submit', type: 'primary' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * PIN Entry Template
   *
   * PIN entry screen for authentication, matching the provided screenshot.
   * - Header with prompt for PIN and username
   * - PINCheck for PIN input (4 digits)
   * - Top bar with close (left) and help (right) icons
   * - Bottom text button: "I don't have this info"
   */
  {
    name: 'PIN Entry',
    group: 'Authentication',
    description: {
      title: 'PIN Entry Template',
      overview: 'A secure PIN entry screen for authentication. Features a specialized PIN input component that displays dots for entered digits.',
      features: [
        'Page header with username context',
        'PIN input component (4-digit display)',
        'Close and help buttons in top bar',
        'Subtle "I don\'t have this info" button'
      ],
      useCases: [
        'Account authentication',
        'Transaction verification',
        'Secure access',
        'Two-factor authentication'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Enter your PIN',
          body: 'Please enter your PIN to continue.',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'PINCheck',
        Component: (InterventionScreenComponents as any)['PINCheck'],
        props: {
          value: '', // Start empty; user will enter PIN
          length: 4
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Close },
      right: { icon: Icons.Help24 },
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: "I don't have this info", type: 'subtle' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Code Verification Template
   *
   * Code entry screen for authentication, matching the provided screenshot.
   * - Header with prompt for code and hardcoded email
   * - Input for code entry (placeholder '--- ---')
   * - Top bar with back (left) and help (right) icons
   * - Bottom prominent button: 'Continue' (disabled)
   */
  {
    name: 'Code Verification',
    group: 'Authentication',
    description: {
      title: 'Code Verification Template',
      overview: 'A code entry screen for email or SMS verification. Features a formatted input field and disabled state until code is entered.',
      features: [
        'Page header with masked email/phone',
        'Formatted code input field',
        'Back and help buttons in top bar',
        'Disabled "Continue" button until code entered'
      ],
      useCases: [
        'Email verification',
        'SMS code verification',
        'Two-factor authentication',
        'Account recovery'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Enter the code sent to d••••••z@gmail.com',
          body: '',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      {
        name: 'Input',
        Component: (InterventionScreenComponents as any)['Input'],
        props: {
          placeholder: '--- ---'
        }
      }
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: { icon: Icons.Help24 },
      inverse: false,
      isBackNavigation: false,
    },
    bottomButtonsProps: {
      buttons: [
        { title: 'Continue', type: 'primary', disabled: true }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
  /**
   * Account Verification Options Template
   *
   * Matches the screenshot: header, subtitle, list of verification options, and a bottom subtle button.
   */
  {
    name: 'Account Verification Options',
    group: 'Authentication',
    description: {
      title: 'Account Verification Options Template',
      overview: 'A selection screen that presents multiple verification methods to users. Each option is displayed as a tappable cell with an icon.',
      features: [
        'Page header with explanation',
        'List of verification method cells with icons',
        'Push indicators for navigation',
        'Fallback option button'
      ],
      useCases: [
        'Account verification flows',
        'Identity verification',
        'Multi-factor authentication setup',
        'Security verification'
      ]
    },
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'medium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Verify this account belongs to you',
          body: 'Select an option to verify this account is yours.',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'large' }
      },
      // Email
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Email',
          left: { type: 'icon', icon: Icons.Email24 },
          right: { type: 'push' }
        }
      },
      // PIN code
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'PIN code',
          left: { type: 'icon', icon: Icons.Passcode24 },
          right: { type: 'push' }
        }
      },
      // Synced contacts
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Phone contacts',
          left: { type: 'icon', icon: Icons.ContactCheck },
          right: { type: 'push' }
        }
      },
      // Linked account
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Linked account',
          left: { type: 'icon', icon: Icons.Alert24 },
          right: { type: 'push' }
        }
      },
    ],
    topBarProps: {
      title: '',
      left: { icon: Icons.Back },
      right: undefined,
      inverse: false,
      isBackNavigation: true,
    },
    bottomButtonsProps: {
      buttons: [
        { title: "I don't have any of these", type: 'standard' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'cta',
    },
  },
]; 