import { Components } from 'src/data/Components';
import { BUTTON_ACTION_PATH } from 'src/hooks/useButtonAction';
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
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'withinSectionMedium' }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diego Martinez',
            body: '$dmartinez',
            left: { type: 'avatar', image: Avatars.Darren },
            right: { type: 'push' },
            action: { path: '/flows/account-linking/verify', type: BUTTON_ACTION_PATH }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diogo Martinez',
            body: '$diogomartinez',
            left: { type: 'avatar', image: Avatars.Isaac },
            right: { type: 'push' },
            action: { path: '/flows/account-linking/verify', type: BUTTON_ACTION_PATH }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Find another account',
            body: 'Search by name, email, or phone number',
            left: { type: 'iconBg', icon: Icons.Search24 },
            right: { type: 'push' }
          }
        },
        {
          component: Components.Divider,
          props: { size: 'withinSectionMedium' }
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
            size: 'page',
            accessory: { type: 'avatar', size: '64', image: Avatars.Isaac }
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Phone number',
            body: '***-***-4567',
            right: { type: 'radio' },
            checkedValue: 'phone',
            path: '/flows/account-linking/code'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'withinSectionMedium' }
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Email',
            body: 'd*******z@gmail.com',
            right: { type: 'radio' },
            checkedValue: 'email',
            path: '/flows/account-linking/code'
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Verify another way', type: 'standard' },
          { title: 'Continue', type: 'prominent', action: { path: '/flows/account-linking/code', type: BUTTON_ACTION_PATH } }
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
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
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
            type: 'prominent',
            action: { path: '/flows/account-linking/pre-confirmation', type: BUTTON_ACTION_PATH }
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
            size: 'page',
            accessory: { type: 'avatarStackedDiagonal', size: '64', image1: Avatars.Isaac, image2: Avatars.Darren }
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
        },
        {
          component: Components.Header,
          props: {
            title: 'What to expect',
            size: 'section'
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Separate balances',
            body: 'Your transactions and other account activity stay where they are.',
            left: { type: 'icon', icon: Icons.CurrencyUsd24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Shared contact preferences',
            body: "We'll send all your account notifications to the same email and phone number.",
            left: { type: 'icon', icon: Icons.Notifications24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Security options',
            body: 'Turn on security lock to require a PIN or Face ID to switch accounts.',
            left: { type: 'icon', icon: Icons.SecurityLockOutline24 }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Continue', type: 'prominent', action: { path: '/flows/account-linking/progress', type: BUTTON_ACTION_PATH } }
        ],
        disclaimer: "After you connect your accounts, they can't be disconnected.",
        showHairline: true
      }
    }
  },
  {
    path: 'progress',
    component: LoadingWrapper,
    route: '/flows/account-linking/alias',
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
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
        },
        {
          component: Components.Cell,
          props: {
            title: '555-123-4567',
            body: 'Updated 2 years ago',
            left: { type: 'icon', icon: Icons.DeviceMobile24, color: 'standard' },
            right: { title: 'Remove', props: { type: 'destructive' }, type: 'button' }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: '555-765-4321',
            body: 'Updated 1 year ago',
            left: { type: 'icon', icon: Icons.DeviceMobile24, color: 'standard' },
            right: { title: 'Remove', props: { type: 'destructive' }, type: 'button' }
          }
        },
        {
          component: Components.ButtonGroup,
          props: {
            buttons: [
              {
                title: 'Add email',
                type: 'standard'
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
          { title: 'Continue', type: 'prominent', action: { path: '/flows/account-linking/devices', type: BUTTON_ACTION_PATH } }
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
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Mac',
            body: 'Honolulu, HI • Today',
            left: { type: 'icon', icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: 'button' }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Windows PC',
            body: 'New York, NY • June 24',
            left: { type: 'icon', icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: 'button' }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: "Diogo's iPhone 12",
            body: 'New York, NY • Feb 3',
            left: { type: 'icon', icon: Icons.AlertOutline24 },
            right: { title: 'Log out', type: 'button' }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Log out all other devices', type: 'destructive' },
          { title: 'Continue', type: 'prominent', action: { path: '/flows/account-linking/confirmation', type: BUTTON_ACTION_PATH } }
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
            accessory: { type: 'icon', theme: 'brand', icon: Icons.Check32, iconSize: '32' },
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'betweenSectionLarge' }
        },
        {
          component: Components.Header,
          props: {
            title: 'Connected accounts',
            size: 'section'
          }
        },
        {
          component: Components.Divider,
          props: { size: 'withinSectionSmall' }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diego Martinez',
            body: '$dmartinez',
            left: { type: 'avatar', image: Avatars.Darren }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Diogo Martinez',
            body: '$diogomartinez',
            left: { type: 'avatar', image: Avatars.Isaac }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          { title: 'Review Settings', type: 'prominent', action: { path: '/flows/account', transition: closeModal, type: BUTTON_ACTION_PATH } }
        ]
      }
    }
  }
]; 