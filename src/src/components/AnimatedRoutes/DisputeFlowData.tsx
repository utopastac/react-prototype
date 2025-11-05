import {Components} from 'src/data/Components';
import { BUTTON_ACTION_PATH } from 'src/hooks/useButtonAction';
import { closeModal } from 'src/containers/TransitionContext';
import * as Icons from 'src/data/Icons';
import InterventionScreen from 'src/containers/InterventionScreen';
import LoadingWrapper from './LoadingWrapper';

export const disputeFlowData = [
  {
    path: '/',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Dispute a Payment',
            body: "We're here to help resolve issues with your transactions. We'll help you through the process and investigate your claim.",
            size: 'page',
          }
        },
        {
          component: Components.Divider,
          props: {size: 'betweenSectionExtraLarge'}
        },
        {
          component: Components.Header,
          props: {
            title: 'Before you start',
            body: 'It will help us investigate if you have a few things.',
            size: 'section',
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Documents',
            body: 'Any receipts you might have',
            left: { type: 'icon', icon: Icons.Document24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Merchant communication',
            body: 'Screenshots of communication with merchants',
            left: { type: 'icon', icon: Icons.CardAdd24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Details',
            body: 'Any relevant information about what happened',
            left: { type: 'icon', icon: Icons.Bills24 }
          }
        },
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Cancel',
            type: 'standard',
            action: { path: 'discover', transition: closeModal, type: BUTTON_ACTION_PATH },
          },
          {
            title: 'Start Dispute',
            type: 'prominent',
            action: { path: 'dispute/transaction', type: BUTTON_ACTION_PATH },
          },
        ]
      }
    }
  },
  {
    path: 'transaction',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Select Transaction',
            body: 'Choose the transaction you want to dispute',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Recent Transactions',
            body: 'Tap to select from your recent activity',
            right: { type: 'push' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Search by Date',
            body: 'Find a specific transaction by date',
            right: { type: 'push' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Enter Transaction Details',
            body: 'Manually enter transaction information',
            right: { type: 'push' }
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
            action: { path: 'dispute/reason', type: BUTTON_ACTION_PATH },
          }
        ],
        showHairline: true
      }
    }
  },
  {
    path: 'reason',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: "What's the Issue?",
            body: "Select the reason for your dispute",
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Unauthorized Transaction',
            body: 'I did not authorize this payment or someone else used my account',
            right: { type: 'radio' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Incorrect Amount',
            body: 'The amount charged is different from what I expected',
            right: { type: 'radio' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Duplicate Charge',
            body: 'I was charged multiple times for the same transaction',
            right: { type: 'radio' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Merchant Dispute',
            body: 'I have an issue with the merchant (wrong item, not received, etc.)',
            right: { type: 'radio' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Processing Error',
            body: 'There was a technical error in processing this transaction',
            right: { type: 'radio' }
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
            action: { path: 'dispute/details', type: BUTTON_ACTION_PATH },
          }
        ],
        showHairline: true
      }
    }
  },
  {
    path: 'details',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Transaction Details',
            body: 'Please provide information about the disputed transaction',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Transaction Date",
            placeholder: "MM/DD/YYYY",
            type: "date"
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Transaction Amount",
            placeholder: "$0.00",
            type: "number"
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Merchant Name",
            placeholder: "Enter merchant or business name"
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Transaction ID (if known)",
            placeholder: "Optional - found on receipt or statement"
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
            action: { path: 'dispute/merchant-contact', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'merchant-contact',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Did you contact the merchant?',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'betweenSectionLarge'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Yes',
            right: { type: 'radio' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'No',
            right: { type: 'radio' }
          }
        },
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Continue',
            type: 'prominent',
            action: { path: 'dispute/description', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'description',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Describe the Issue',
            body: 'Please provide a detailed description of what happened',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.TextArea,
          props: {
            placeholder: "Describe the issue in detail. Include when you first noticed the problem, what you expected vs. what happened, and any steps you've already taken to resolve it...",
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Continue',
            type: 'prominent',
            action: { path: 'dispute/evidence', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'evidence',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Supporting Evidence',
            body: 'Upload any documents that support your dispute, including receipts, emails, screenshots, or any communication with the merchant can help us resolve your dispute faster.',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Receipt',
            body: 'Add a photo or PDF of your receipt',
            right: { type: 'push' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Communication',
            body: 'Add emails, chat logs, or other correspondence',
            right: { type: 'push' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Screenshots',
            body: 'Add screenshots of the issue or error messages',
            right: { type: 'push' }
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Skip for Now',
            type: 'standard',
            action: { path: 'dispute/contact', type: BUTTON_ACTION_PATH },
          },
          {
            title: 'Continue',
            type: 'prominent',
            action: { path: 'dispute/contact', type: BUTTON_ACTION_PATH },
          }
        ],
        showHairline: true
      }
    }
  },
  {
    path: 'contact',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Contact Information',
            body: 'How should we reach you about your dispute?',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Phone Number",
            placeholder: "(555) 123-4567",
            type: "tel"
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Email Address",
            placeholder: "your.email@example.com",
            type: "email"
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Input,
          props: {
            label: "Best Time to Contact",
            placeholder: "e.g., Weekdays 9 AM - 5 PM",
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
            action: { path: 'dispute/review', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'review',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Review Your Dispute',
            body: 'Please review all information before submitting',
            size: 'page'
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.UpsellCard,
          props: {
            title: 'Regulation E Rights',
            body: 'Under federal law, you have the right to dispute unauthorized transactions. We must investigate and resolve your claim within specific timeframes.'
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      scrollContainerClassName: 'separatedContainer',
      buttons: {
        buttons: [
          {
            title: 'Edit Information',
            type: 'standard',
            action: { path: 'dispute/details', type: BUTTON_ACTION_PATH },
          },
          {
            title: 'Submit Dispute',
            type: 'prominent',
            action: { path: 'dispute/loading', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'loading',
    component: LoadingWrapper,
    route: 'dispute/confirm',
    data: {
      sections: [
        {
          component: Components.ProgressCircular,
          props: {
            label: "Submitting dispute..."
          }
        }
      ],
    }
  },
  {
    path: 'confirm',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Header,
          props: {
            title: 'Dispute Submitted',
            body: 'Your dispute has been received and is being processed',
            size: 'page',
            accessory: { type: 'icon', icon: Icons.Check32, theme: 'brand' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'withinSectionMedium'}
        },
        {
          component: Components.Cell,
          props: {
            title: 'REF-2024-001234',
            body: 'Save this reference number for your records.',
            right: { type: 'none' }
          }
        },
        {
          component: Components.Divider,
          props: {size: 'betweenSectionExtraLargeCell'}
        },
        {
          component: Components.Header,
          props: {
            title: 'What happens next?',
            size: 'section',
          }
        },
        {
          component: Components.Timeline,
          props: {
            rowData: [
              {
                label: 'Dispute Submitted',
                body: 'Your dispute has been received and is being processed',
                state: 'done',
                placing: 'beginning'
              },
              {
                label: 'Investigation Begins',
                body: 'We will investigate your dispute within 10 business days',
                state: 'notStarted',
                placing: 'middle'
              },
              {
                label: 'Temporary Credit',
                body: 'You may receive a temporary credit while we work with the merchant',
                state: 'notStarted',
                placing: 'middle'
              },
              {
                label: 'Resolution',
                body: 'You will receive updates via email and in the app',
                state: 'notStarted',
                placing: 'end'
              }
            ]
          }
        },
        {
          component: Components.Divider,
          props: {size: 'betweenSectionExtraLargeCell'}
        },
        {
          component: Components.Header,
          props: {
            title: 'Contact Us',
            body: 'If you have questions or need to provide additional information, contact our support team. Reference your dispute number when calling.',
            size: 'section',
          }
        }
      ],
      buttons: {
        buttons: [
          {
            title: 'Done',
            type: 'standard',
            action: { path: 'discover', transition: closeModal, type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  }
]; 