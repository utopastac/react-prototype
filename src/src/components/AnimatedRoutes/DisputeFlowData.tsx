import {Components, ComponentData} from 'src/data/Components';
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
            size: ComponentData.HEADER_PAGE,
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        },
        {
          component: Components.Header,
          props: {
            title: 'Before you start',
            body: 'It will help us investigate if you have a few things.',
            size: ComponentData.HEADER_SECTION,
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Documents',
            body: 'Any receipts you might have',
            left: { type: ComponentData.CELL_ICON, icon: Icons.Document24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Merchant communication',
            body: 'Screenshots of communication with merchants',
            left: { type: ComponentData.CELL_ICON, icon: Icons.CardAdd24 }
          }
        },
        {
          component: Components.Cell,
          props: {
            title: 'Details',
            body: 'Any relevant information about what happened',
            left: { type: ComponentData.CELL_ICON, icon: Icons.Bills24 }
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
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/discover', transition: closeModal, type: ComponentData.BUTTON_ACTION_PATH },
          },
          {
            title: 'Start Dispute',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/transaction', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Recent Transactions',
            body: 'Tap to select from your recent activity',
            right: { type: ComponentData.CELL_PUSH }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Search by Date',
            body: 'Find a specific transaction by date',
            right: { type: ComponentData.CELL_PUSH }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Enter Transaction Details',
            body: 'Manually enter transaction information',
            right: { type: ComponentData.CELL_PUSH }
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
            action: { path: '/dispute/reason', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Unauthorized Transaction',
            body: 'I did not authorize this payment or someone else used my account',
            right: { type: ComponentData.CARD_RADIO }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Incorrect Amount',
            body: 'The amount charged is different from what I expected',
            right: { type: ComponentData.CARD_RADIO }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Duplicate Charge',
            body: 'I was charged multiple times for the same transaction',
            right: { type: ComponentData.CARD_RADIO }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Merchant Dispute',
            body: 'I have an issue with the merchant (wrong item, not received, etc.)',
            right: { type: ComponentData.CARD_RADIO }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Processing Error',
            body: 'There was a technical error in processing this transaction',
            right: { type: ComponentData.CARD_RADIO }
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
            action: { path: '/dispute/details', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/merchant-contact', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_BETWEEN_SECTION_LARGE}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'Yes',
            right: { type: ComponentData.CARD_RADIO }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.InputCard,
          props: {
            title: 'No',
            right: { type: ComponentData.CARD_RADIO }
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
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/description', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.TextArea,
          props: {
            placeholder: "Describe the issue in detail. Include when you first noticed the problem, what you expected vs. what happened, and any steps you've already taken to resolve it...",
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Continue',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/evidence', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Receipt',
            body: 'Add a photo or PDF of your receipt',
            right: { type: ComponentData.CELL_PUSH }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Communication',
            body: 'Add emails, chat logs, or other correspondence',
            right: { type: ComponentData.CELL_PUSH }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'Upload Screenshots',
            body: 'Add screenshots of the issue or error messages',
            right: { type: ComponentData.CELL_PUSH }
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
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/dispute/contact', type: ComponentData.BUTTON_ACTION_PATH },
          },
          {
            title: 'Continue',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/contact', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/review', type: ComponentData.BUTTON_ACTION_PATH },
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
            size: ComponentData.HEADER_PAGE
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
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
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/dispute/details', type: ComponentData.BUTTON_ACTION_PATH },
          },
          {
            title: 'Submit Dispute',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/dispute/loading', type: ComponentData.BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'loading',
    component: LoadingWrapper,
    route: '/dispute/confirm',
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
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Header,
          props: {
            title: 'Dispute Submitted',
            body: 'Your dispute has been received and is being processed',
            size: ComponentData.HEADER_PAGE,
            accessory: { type: ComponentData.HEADER_ICON, icon: Icons.Check32, theme: ComponentData.ICON_BG_BRAND }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM}
        },
        {
          component: Components.Cell,
          props: {
            title: 'REF-2024-001234',
            body: 'Save this reference number for your records.',
            right: { type: ComponentData.CELL_NONE }
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL}
        },
        {
          component: Components.Header,
          props: {
            title: 'What happens next?',
            size: ComponentData.HEADER_SECTION,
          }
        },
        {
          component: Components.Timeline,
          props: {
            rowData: [
              {
                label: 'Dispute Submitted',
                body: 'Your dispute has been received and is being processed',
                state: ComponentData.TIMELINE_STATE_DONE,
                placing: ComponentData.TIMELINE_PLACING_BEGINNING
              },
              {
                label: 'Investigation Begins',
                body: 'We will investigate your dispute within 10 business days',
                state: ComponentData.TIMELINE_STATE_NOT_STARTED,
                placing: ComponentData.TIMELINE_PLACING_MIDDLE
              },
              {
                label: 'Temporary Credit',
                body: 'You may receive a temporary credit while we work with the merchant',
                state: ComponentData.TIMELINE_STATE_NOT_STARTED,
                placing: ComponentData.TIMELINE_PLACING_MIDDLE
              },
              {
                label: 'Resolution',
                body: 'You will receive updates via email and in the app',
                state: ComponentData.TIMELINE_STATE_NOT_STARTED,
                placing: ComponentData.TIMELINE_PLACING_END
              }
            ]
          }
        },
        {
          component: Components.Divider,
          props: {size: ComponentData.DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL}
        },
        {
          component: Components.Header,
          props: {
            title: 'Contact Us',
            body: 'If you have questions or need to provide additional information, contact our support team. Reference your dispute number when calling.',
            size: ComponentData.HEADER_SECTION,
          }
        }
      ],
      buttons: {
        buttons: [
          {
            title: 'Done',
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/discover', transition: closeModal, type: ComponentData.BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  }
]; 