import { Components, ComponentData } from 'src/data/Components';
import * as Icons from 'src/data/Icons';
import { Avatars } from 'src/data/Avatars';
import InterventionScreen from 'src/containers/InterventionScreen';
import LoadingWrapper from './LoadingWrapper';
import { closeModal } from 'src/containers/TransitionContext';

export const verificationFlowData = [
  {
    path: '/',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Select your account',
            body: "Next, you'll log into your other account to verify it's yours.",
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diego Martinez',
            body: '$dmartinez',
            left: { type: ComponentData.CELL_AVATAR, image: Avatars.Darren },
            right: { type: ComponentData.CELL_PUSH },
            action: { path: '/account-linking/verify', type: ComponentData.BUTTON_ACTION_PATH }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diogo Martinez',
            body: '$diogomartinez',
            left: { type: ComponentData.CELL_AVATAR, image: Avatars.Isaac },
            right: { type: ComponentData.CELL_PUSH },
            action: { path: '/account-linking/verify', type: ComponentData.BUTTON_ACTION_PATH }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Find another account',
            body: 'Search by name, email, or phone number',
            left: { type: ComponentData.CELL_ICON_BG, icon: Icons.Search24 },
            right: { type: ComponentData.CELL_PUSH }
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
        },
        {
          component: Components.UpsellCard,
          props: {
            title: 'Why connect accounts?',
            body: 'Switch between accounts with 1 secure login while keeping your activity separate.'
          }
        }
      ],
      topBar: {
        left: { icon: Icons.Close },
        // onClick: -1,
        title: '',
        right: {}
      }
    }
  },
  {
    path: 'verify',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Get a code to log into $dmartinez',
            body: 'Select an option to verify this account belongs to you.',
            size: ComponentData.HEADER_PAGE,
            accessory: { type: ComponentData.HEADER_AVATAR, size: ComponentData.AVATAR_64, image: Avatars.Isaac }
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Phone number',
            body: '***-***-4567',
            right: { type: ComponentData.CARD_RADIO },
            checkedValue: 'phone',
            path: '/account-linking/code'
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM }
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Email',
            body: 'd*******z@gmail.com',
            right: { type: ComponentData.CARD_RADIO },
            checkedValue: 'email',
            path: '/account-linking/code'
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Verify another way', type: ComponentData.BUTTON_STANDARD },
          { title: 'Continue', type: ComponentData.BUTTON_PROMINENT, action: { path: '/account-linking/code', type: ComponentData.BUTTON_ACTION_PATH } }
        ]
      }
    }
  },
  {
    path: 'code',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Enter the code sent to (555) ***-**55',
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.Input,
          props: {
            placeholder: '--- ---'
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Continue',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/account-linking/pre-confirmation', type: ComponentData.BUTTON_ACTION_PATH }
          }
        ]
      }
    }
  },
  {
    path: 'pre-confirmation',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Connect these accounts?',
            body: "You'll access $dmartinez and $diogomartinez with 1 secure login.",
            size: ComponentData.HEADER_PAGE,
            accessory: { type: ComponentData.HEADER_AVATAR_STACKED_DIAGONAL, size: ComponentData.AVATAR_STACKED_DIAGONAL_64, image1: Avatars.Isaac, image2: Avatars.Darren }
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.Header,
          props: {
            title: 'What to expect',
            size: ComponentData.HEADER_SECTION
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Separate balances',
            body: 'Your transactions and other account activity stay where they are.',
            left: { type: ComponentData.CELL_ICON, icon: Icons.CurrencyUsd24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Shared contact preferences',
            body: "We'll send all your account notifications to the same email and phone number.",
            left: { type: ComponentData.CELL_ICON, icon: Icons.Notifications24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Security options',
            body: 'Turn on security lock to require a PIN or Face ID to switch accounts.',
            left: { type: ComponentData.CELL_ICON, icon: Icons.SecurityLockOutline24 }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Continue', type: ComponentData.BUTTON_PROMINENT, action: { path: '/account-linking/progress', type: ComponentData.BUTTON_ACTION_PATH } }
        ],
        disclaimer: "After you connect your accounts, they can't be disconnected.",
        showHairline: true
      }
    }
  },
  {
    path: 'progress',
    component: LoadingWrapper,
    route: '/account-linking/alias',
    data: {
      sections: [
        {
          component: Components.ProgressCircular,
          props: {
            label: 'Verifying your name...'
          }
        }
      ]
    }
  },
  {
    path: 'alias',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Review your login info',
            body: "You can access your accounts with any of these options. Be sure to remove any info you don't use anymore.",
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.Cell,
          props: {
            title: '555-123-4567',
            body: 'Updated 2 years ago',
            left: { type: ComponentData.CELL_ICON, icon: Icons.DeviceMobile24, color: ComponentData.ICON_STANDARD },
            right: { title: 'Remove', props: { type: ComponentData.BUTTON_DESTRUCTIVE }, type: ComponentData.CELL_BUTTON }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: '555-765-4321',
            body: 'Updated 1 year ago',
            left: { type: ComponentData.CELL_ICON, icon: Icons.DeviceMobile24, color: ComponentData.ICON_STANDARD },
            right: { title: 'Remove', props: { type: ComponentData.BUTTON_DESTRUCTIVE }, type: ComponentData.CELL_BUTTON }
          }
        },
        {
          component: Components.ButtonGroup,
          props: {
            buttons: [
              {
                title: 'Add email',
                type: ComponentData.BUTTON_STANDARD
              }
            ]
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Continue', type: ComponentData.BUTTON_PROMINENT, action: { path: '/account-linking/devices', type: ComponentData.BUTTON_ACTION_PATH } }
        ],
        disclaimer: 'You can update this info anytime in settings.'
      }
    }
  },
  {
    path: 'devices',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Still using these devices?',
            body: "Log out of any devices that shouldn't have access to your accounts.",
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Mac',
            body: 'Honolulu, HI • Today',
            left: { type: ComponentData.CELL_ICON, icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: ComponentData.CELL_BUTTON }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Windows PC',
            body: 'New York, NY • June 24',
            left: { type: ComponentData.CELL_ICON, icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: ComponentData.CELL_BUTTON }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: "Diogo's iPhone 12",
            body: 'New York, NY • Feb 3',
            left: { type: ComponentData.CELL_ICON, icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: ComponentData.CELL_BUTTON }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Log out all other devices', type: ComponentData.BUTTON_DESTRUCTIVE },
          { title: 'Continue', type: ComponentData.BUTTON_PROMINENT, action: { path: '/account-linking/confirmation', type: ComponentData.BUTTON_ACTION_PATH } }
        ]
      }
    }
  },
  {
    path: 'confirmation',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'All set!',
            body: 'You can now access and switch between your accounts with a single login.',
            accessory: { type: ComponentData.HEADER_ICON, theme: ComponentData.ICON_BG_BRAND, icon: Icons.Check32, iconSize: ComponentData.ICON_32 },
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE }
        },
        {
          component: Components.Header,
          props: {
            title: 'Connected accounts',
            size: ComponentData.HEADER_SECTION
          }
        },
        {
          component: Components.Divider,
          props: { size: ComponentData.DIVIDER_WITHIN_SECTION_SMALL }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diego Martinez',
            body: '$dmartinez',
            left: { type: ComponentData.CELL_AVATAR, image: Avatars.Darren }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diogo Martinez',
            body: '$diogomartinez',
            left: { type: ComponentData.CELL_AVATAR, image: Avatars.Isaac }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Review Settings', type: ComponentData.BUTTON_PROMINENT, action: { path: '/account', transition: closeModal, type: ComponentData.BUTTON_ACTION_PATH } }
        ]
      }
    }
  }
]; 