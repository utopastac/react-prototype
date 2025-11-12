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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'betweenSectionExtraLargeCell' }
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
        props: { size: 'betweenSectionLarge' }
      },
      {
        name: 'UpsellCard',
        Component: (InterventionScreenComponents as any)['UpsellCard'],
        props: initialComponentProps['UpsellCard']
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
    components: [
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "Get direct Deposit",
          body: 'We need to collect some info to confirm that you are really you.',
          size: 'hero',
          accessory: {
            type: 'image',
            image: Images.Security,
            offset: true
          }
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'betweenSectionLarge' }
      },
      // Informational Cell 1
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Your info is secure',
          body: 'We use bank-level encryption to protect your data.',
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
          body: 'We need your legal name to verify your identity.',
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
          body: 'Contact support if you have questions about verification.',
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
        { title: 'Continue', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: 'page' }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'betweenSectionLarge' }
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
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'withinSectionMedium' }
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
        { title: 'Continue', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: 'page' }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'betweenSectionLarge' }
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
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'withinSectionMedium' }
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
        { title: 'Continue', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "What's your legal name?",
          body: 'We need to collect some info to confirm that you are really you.',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'betweenSectionLarge' }
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
        { title: 'Next', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: "Card numbers don't match",
          body: "The card number you entered doesn't match what's on file.",
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
        { title: 'Confirm another way', type: 'standard' },
        { title: 'Try again', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        { title: 'Done', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'betweenSectionLarge' }
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
        { title: 'Next', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'betweenSectionLarge' }
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
        { title: 'Submit', type: 'prominent' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
      },
      {
        name: 'Header',
        Component: (InterventionScreenComponents as any)['Header'],
        props: {
          title: 'Enter your Interventions Hub PIN for $diogomartinez',
          body: '',
          size: 'page'
        }
      },
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'betweenSectionLarge' }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'betweenSectionLarge' }
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
        { title: 'Continue', type: 'prominent', disabled: true }
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
    components: [
      {
        name: 'Divider',
        Component: (InterventionScreenComponents as any)['Divider'],
        props: { size: 'withinSectionMedium' }
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
        props: { size: 'betweenSectionLarge' }
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
      // Phone number
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Phone number',
          left: { type: 'icon', icon: Icons.DeviceMobile24 },
          right: { type: 'push' }
        }
      },
      // Interventions Hub PIN
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Interventions Hub PIN',
          left: { type: 'icon', icon: Icons.PasscodeFill24 },
          right: { type: 'push' }
        }
      },
      // Synced contacts
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Synced contacts',
          left: { type: 'icon', icon: Icons.ContactTrue },
          right: { type: 'push' }
        }
      },
      // Linked debit card
      {
        name: 'Cell',
        Component: (InterventionScreenComponents as any)['Cell'],
        props: {
          title: 'Linked debit card',
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