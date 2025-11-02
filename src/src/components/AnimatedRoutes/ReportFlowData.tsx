import {Components, ComponentData} from 'src/data/Components';
import * as Icons from 'src/data/Icons';
import { WHITE } from 'src/containers/TabBackgroundContext';
import Formblocker from 'src/containers/Formblocker';
import LoadingWrapper from './LoadingWrapper';
import { closeModal } from 'src/containers/TransitionContext';

export const reportFlowData = [
  {
    path: '/',
    component: Formblocker,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Report Account',
            body: "Help us understand what's happening",
            size: ComponentData.HEADER_PAGE,
          }
        },
        {
          component: Components.UpsellCard,
          props: {
            title: 'About Reporting',
            body: 'If you believe an account is violating our community guidelines or engaging in inappropriate behavior, please let us know. Your report will be reviewed by our team and kept confidential.'
          }
        }
      ],
      scrollContainerClassName: 'separatedContainer',
      tabBackground: WHITE,
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Cancel',
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/money', transition: closeModal, type: ComponentData.BUTTON_ACTION_PATH },
          },
          {
            title: 'Start Report',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/report/type', type: ComponentData.BUTTON_ACTION_PATH },
          },
        ]
      }
    }
  },
  {
    path: 'type',
    component: Formblocker,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: "What's the Issue?",
            body: "Select the type of inappropriate behavior you're reporting",
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
            title: 'Spam or Scam',
            body: 'Account is sending unwanted messages or attempting to deceive users',
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
            title: 'Harassment',
            body: 'Account is bullying, threatening, or intimidating others',
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
            title: 'Inappropriate Content',
            body: 'Account is sharing content that violates our community guidelines',
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
            title: 'Fake Account',
            body: 'Account appears to be impersonating someone else',
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
            action: { path: '/report/details', type: ComponentData.BUTTON_ACTION_PATH },
          }
        ],
        showHairline: true
      }
    }
  },
  {
    path: 'details',
    component: Formblocker,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Additional Details',
            body: 'Please provide any additional information that might help us understand the situation better',
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
            label: "Additional Details",
            placeholder: "Describe what happened, when it occurred, and any other relevant information...",
          }
        }
      ],
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Submit Report',
            type: ComponentData.BUTTON_PROMINENT,
            action: { path: '/report/loading', type: ComponentData.BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'loading',
    component: LoadingWrapper,
    route: '/report/confirm',
    data: {
      sections: [
        {
          component: Components.ProgressCircular,
          props: {
            label: "Submitting report..."
          }
        }
      ],
    }
  },
  {
    path: 'confirm',
    component: Formblocker,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Report Submitted',
            body: 'Thank you for helping us maintain a safe community',
            size: ComponentData.HEADER_PAGE,
            accessory: { type: ComponentData.HEADER_ICON, icon: Icons.Check32, theme: ComponentData.ICON_BG_BRAND }
          }
        },
        {
          component: Components.UpsellCard,
          props: {
            title: 'What happens next?',
            body: 'Our team will review your report and take appropriate action. We may contact you if we need additional information.'
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
            title: 'Done',
            type: ComponentData.BUTTON_STANDARD,
            action: { path: '/money', type: ComponentData.BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  }
]; 