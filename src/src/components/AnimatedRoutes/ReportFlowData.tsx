import {Components} from 'src/data/Components';
import { BUTTON_ACTION_PATH } from 'src/hooks/useButtonAction';
import * as Icons from 'src/data/Icons';
import InterventionScreen from 'src/containers/InterventionScreen';
import LoadingWrapper from './LoadingWrapper';
import { closeModal } from 'src/containers/TransitionContext';

export const reportFlowData = [
  {
    path: '/',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Report Account',
            body: "Help us understand what's happening",
            size: 'page',
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
      topBar: {
        isBackNavigation: true
      },
      buttons: {
        buttons: [
          {
            title: 'Cancel',
            type: 'standard',
            action: { path: '/flows/discover', transition: closeModal, type: BUTTON_ACTION_PATH },
          },
          {
            title: 'Start Report',
            type: 'primary',
            action: { path: '/flows/report/type', type: BUTTON_ACTION_PATH },
          },
        ]
      }
    }
  },
  {
    path: 'type',
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: "What's the Issue?",
            body: "Select the type of inappropriate behavior you're reporting",
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
            title: 'Spam or Scam',
            body: 'Account is sending unwanted messages or attempting to deceive users',
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
            title: 'Harassment',
            body: 'Account is bullying, threatening, or intimidating others',
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
            title: 'Inappropriate Content',
            body: 'Account is sharing content that violates our community guidelines',
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
            title: 'Fake Account',
            body: 'Account appears to be impersonating someone else',
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
            type: 'primary',
            action: { path: '/flows/report/details', type: BUTTON_ACTION_PATH },
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
            title: 'Additional Details',
            body: 'Please provide any additional information that might help us understand the situation better',
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
            type: 'primary',
            action: { path: '/flows/report/loading', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  },
  {
    path: 'loading',
    component: LoadingWrapper,
    route: '/flows/report/confirm',
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
    component: InterventionScreen,
    data: {
      sections: [
        {
          component: Components.Header,
          props: {
            title: 'Report Submitted',
            body: 'Thank you for helping us maintain a safe community',
            size: 'page',
            accessory: { type: 'icon', icon: Icons.Check32, theme: 'brand' }
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
            type: 'standard',
            action: { path: 'discover', type: BUTTON_ACTION_PATH },
          }
        ]
      }
    }
  }
]; 