/**
 * Templates for AdminView: Predefined UI Layouts
 * 
 * This file defines a collection of pre-built UI layouts that can be quickly applied
 * in the admin interface. Each template represents a common UI pattern or screen type
 * that developers can use as starting points for building interfaces.
 * 
 * USAGE:
 * - Templates are displayed in a dropdown in the ComponentPanel
 * - When selected, they replace the current layout with the predefined components
 * - Templates can include both regular components and special UI elements (top bar, bottom buttons)
 * - This enables rapid prototyping and consistent UI patterns across the app
 * 
 * STRUCTURE:
 * - Each template has a name, array of dropped components, and optional special props
 * - Components are defined with their initial props and can be customized
 * - Special props control the top navigation bar and bottom action buttons
 * - Templates use the same component system as the drag-and-drop interface
 */

import { FormblockerComponents, initialComponentProps } from 'src/data/Components';
import { TopBarProps } from 'src/components/TopBar';
import { ButtonGroupProps } from 'src/components/ButtonGroup';
import { ToastProps } from 'src/components/Toast';
import { IOSStatusBarProps } from 'src/components/IOSStatusBar';
import { ComponentData } from 'src/data/Components';
import * as Icons from 'src/data/Icons';
import { Images } from 'src/data/Images';

/**
 * AdminTemplate Interface
 * 
 * Defines the structure for a template that can be applied to the admin interface.
 * Templates consist of:
 * - name: Display name for the template selector
 * - dropped: Array of components with their props to render in the layout
 * - topBarProps: Optional configuration for the top navigation bar
 * - bottomButtonsProps: Optional configuration for bottom action buttons
 */
export interface AdminTemplate {
  name: string;
  group?: string,
  dropped: { name: string; Component: React.ComponentType<any>; props: any }[];
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
    dropped: [],
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
    dropped: [
      {
        name: 'ProgressCircular',
        Component: (FormblockerComponents as any)['ProgressCircular'],
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: { title: 'This is a simple list', body: '', size: ComponentData.HEADER_PAGE }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: initialComponentProps['Divider']
      },
      // ListUnordered replacing two Cell entries
      {
        name: 'ListUnordered',
        Component: (FormblockerComponents as any)['ListUnordered'],
        props: initialComponentProps['ListUnordered']
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Section Title',
          body: 'This is a section header for additional information.',
          size: ComponentData.HEADER_SECTION
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'UpsellCard',
        Component: (FormblockerComponents as any)['UpsellCard'],
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
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: "Get direct Deposit",
          body: 'We need to collect some info to confirm that you are really you.',
          size: ComponentData.HEADER_HERO,
          accessory: {
            type: ComponentData.HEADER_IMAGE,
            image: Images.Security,
            offset: true
          }
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      // Informational Cell 1
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Your info is secure',
          body: 'We use bank-level encryption to protect your data.',
          left: { type: ComponentData.CELL_ICON, icon: Icons.SecurityCheckFill },
          right: { type: ComponentData.CELL_NONE }
        }
      },
      // Informational Cell 2
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Why we ask',
          body: 'We need your legal name to verify your identity.',
          left: { type: ComponentData.CELL_ICON, icon: Icons.Information16 },
          right: { type: ComponentData.CELL_NONE }
        }
      },
      // Informational Cell 3
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Need help?',
          body: 'Contact support if you have questions about verification.',
          left: { type: ComponentData.CELL_ICON, icon: Icons.Help24 },
          right: { type: ComponentData.CELL_NONE }
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
        { title: 'Continue', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: ComponentData.HEADER_PAGE }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Morning',
          body: '',
          right: { type: ComponentData.CARD_RADIO },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Afternoon',
          body: '',
          right: { type: ComponentData.CARD_RADIO },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Evening',
          body: '',
          right: { type: ComponentData.CARD_RADIO },
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
        { title: 'Back', type: ComponentData.BUTTON_STANDARD },
        { title: 'Continue', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: { title: 'When did you notice your phone was missing?', body: '', size: ComponentData.HEADER_PAGE }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Morning',
          body: '',
          right: { type: ComponentData.CARD_CHECKBOX },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Afternoon',
          body: '',
          right: { type: ComponentData.CARD_CHECKBOX },
          checked: false
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'InputCard',
        Component: (FormblockerComponents as any)['InputCard'],
        props: {
          ...initialComponentProps['InputCard'],
          title: 'Evening',
          body: '',
          right: { type: ComponentData.CARD_CHECKBOX },
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
        { title: 'Back', type: ComponentData.BUTTON_STANDARD },
        { title: 'Continue', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: "What's your legal name?",
          body: 'We need to collect some info to confirm that you are really you.',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'Input',
        Component: (FormblockerComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: undefined,
          placeholder: 'First name'
        }
      },
      {
        name: 'Input',
        Component: (FormblockerComponents as any)['Input'],
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
        { title: 'Next', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: "Card numbers don't match",
          body: "The card number you entered doesn't match what's on file.",
          size: ComponentData.HEADER_PAGE,
          accessory: {
            type: ComponentData.HEADER_ICON,
            icon: Icons.Alert32,
            theme: ComponentData.ICON_BG_ERROR
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
        { title: 'Confirm another way', type: ComponentData.BUTTON_STANDARD },
        { title: 'Try again', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: 'BUTTON_CTA_SIZE',
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Success!',
          body: 'Your action was completed successfully.',
          size: ComponentData.HEADER_PAGE,
          accessory: {
            type: ComponentData.HEADER_ICON,
            icon: Icons.AccountVerified32,
            theme: ComponentData.ICON_BG_BRAND
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
        { title: 'Done', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'What\'s your address?',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'Input',
        Component: (FormblockerComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: 'Address',
          placeholder: 'Street Address'
        }
      },
      {
        name: 'Input',
        Component: (FormblockerComponents as any)['Input'],
        props: {
          ...initialComponentProps['Input'],
          label: 'City',
          placeholder: 'City'
        }
      },
      {
        name: 'InputStackedHorizontal',
        Component: (FormblockerComponents as any)['InputStackedHorizontal'],
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
        { title: 'Next', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Tell us more',
          body: 'Please provide additional details below.',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'TextArea',
        Component: (FormblockerComponents as any)['TextArea'],
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
        { title: 'Submit', type: ComponentData.BUTTON_PROMINENT }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Enter your Interventions Hub PIN for $diogomartinez',
          body: '',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'PINCheck',
        Component: (FormblockerComponents as any)['PINCheck'],
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
        { title: "I don't have this info", type: 'BUTTON_SUBTLE' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Enter the code sent to d••••••z@gmail.com',
          body: '',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      {
        name: 'Input',
        Component: (FormblockerComponents as any)['Input'],
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
        { title: 'Continue', type: ComponentData.BUTTON_PROMINENT, disabled: true }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
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
    dropped: [
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
      },
      {
        name: 'Header',
        Component: (FormblockerComponents as any)['Header'],
        props: {
          title: 'Verify this account belongs to you',
          body: 'Select an option to verify this account is yours.',
          size: ComponentData.HEADER_PAGE
        }
      },
      {
        name: 'Divider',
        Component: (FormblockerComponents as any)['Divider'],
        props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
      },
      // Email
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Email',
          left: { type: ComponentData.CELL_ICON, icon: Icons.CommEmail24 },
          right: { type: ComponentData.CELL_PUSH }
        }
      },
      // Phone number
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Phone number',
          left: { type: ComponentData.CELL_ICON, icon: Icons.DeviceMobile24 },
          right: { type: ComponentData.CELL_PUSH }
        }
      },
      // Interventions Hub PIN
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Interventions Hub PIN',
          left: { type: ComponentData.CELL_ICON, icon: Icons.PasscodeFill24 },
          right: { type: ComponentData.CELL_PUSH }
        }
      },
      // Synced contacts
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Synced contacts',
          left: { type: ComponentData.CELL_ICON, icon: Icons.ContactTrue },
          right: { type: ComponentData.CELL_PUSH }
        }
      },
      // Linked debit card
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Linked debit card',
          left: { type: ComponentData.CELL_ICON, icon: Icons.BankLinked24 },
          right: { type: ComponentData.CELL_PUSH }
        }
      },
      // Cash Card
      {
        name: 'Cell',
        Component: (FormblockerComponents as any)['Cell'],
        props: {
          title: 'Cash Card',
          left: { type: ComponentData.CELL_ICON, icon: Icons.CardBasic24 },
          right: { type: ComponentData.CELL_PUSH }
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
        { title: "I don't have any of these", type: 'BUTTON_STANARD' }
      ],
      horizontal: false,
      inComponent: false,
      showHairline: false,
      disclaimer: '',
      size: ComponentData.BUTTON_CTA_SIZE,
    },
  },
]; 