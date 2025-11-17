import { Images } from "src/data/Images";
// Header Components
import Header, { 
  HeaderPropMeta
} from 'src/components/Header';
//
import TopBar from 'src/components/TopBar';
import TitleBar, { TitleBarPropMeta } from 'src/components/TitleBar';
import NavigationBar from 'src/components/NavigationBar';
import FilterBar, { FilterBarPropMeta } from 'src/components/FilterBar';
// Input Components
import Input, {
  InputStackedHorizontal,
  InputStackedHorizontalPropMeta,
  InputPropMeta
} from 'src/components/Input';
import TextArea, { TextAreaPropMeta } from 'src/components/TextArea';
//
import InputCard, {
  InputCardPropMeta
} from 'src/components/InputCard';
//
import ButtonGroup, { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import SearchBar, { SearchBarPropMeta } from 'src/components/SearchBar';
//
//
// Removed MoneyInputDisplay
import UpsellCard, { UpsellCardPropMeta } from 'src/components/UpsellCard';
import PINCheck, { PINCheckPropMeta } from 'src/components/PINCheck';

// Cell Components
import Cell, {
  CellPropMeta
} from 'src/components/Cell';
//
import CellActivity, {
  CellActivityPropMeta
} from 'src/components/CellActivity';

// Avatar Components
import Avatar, {
  AvatarPropMeta
} from 'src/components/Avatar';
//
import AvatarCarousel, { AvatarCarouselPropMeta } from "src/components/AvatarCarousel";
import AvatarRow, { AvatarRowPropMeta } from "src/components/AvatarRow";
//
import AvatarStackedDiagonal, {
  AvatarStackedDiagonalPropMeta
} from 'src/components/AvatarStackedDiagonal';

// Applet Components
// Removed Applet components (DiscoverPromo, BalanceApplet, SavingsApplet, CryptoApplet, SecondaryApplet, TertiaryApplet)

import Text, {
  TextPropMeta
} from 'src/components/Text';

// UI Components
import IconBg, {
  IconBgPropMeta
} from 'src/components/IconBg';
//
import Button, {
  ButtonPropMeta
} from 'src/components/Buttons/Button';
//
//
import Divider, {
  DividerPropMeta
} from 'src/components/Divider';
//
import SegmentedControl, { SegmentedControlPropMeta } from 'src/components/SegmentedControl';
import Slider, { SliderPropMeta } from 'src/components/Slider';
import ProgressCircular, { ProgressCircularPropMeta } from 'src/components/ProgressCircular';
import Timeline, { TimelinePropMeta } from 'src/components/Timeline';
import TimelineRow, {
  TimelineRowPropMeta
} from 'src/components/Timeline/TimelineRow';

import Toast, { ToastPropMeta } from 'src/components/Toast';
import ListOrdered, { ListOrderedPropMeta } from 'src/components/ListOrdered';
import ListUnordered, { ListUnorderedPropMeta } from 'src/components/ListUnordered';
import Modal, { ModalPropMeta } from 'src/components/Modal';

// Icons
import Icon, {
  IconPropMeta
} from 'src/components/Icon';

import { Avatars } from './Avatars';
import IOSStatusBar, {IOSStatusBarPropMeta} from 'src/components/IOSStatusBar';
import MarketingCardSmall, { MarketingCardSmallPropMeta } from 'src/components/MarketingCardSmall';
import MarketingCardLarge, { MarketingCardLargePropMeta } from "src/components/MarketingCardLarge";

// Component Exports
export const Components = {
  // Header Components
  Header,
  TopBar,
  TitleBar,
  NavigationBar,
  FilterBar,

  // Input Components
  Input,
  TextArea,
  InputCard,
  ButtonGroup,
  SearchBar,
  PINCheck,
  UpsellCard,
  InputStackedHorizontal,

  // Cell Components
  Cell,
  CellActivity,
  ListUnordered,
  ListOrdered,

  // Avatar Components
  Avatar,
  AvatarCarousel,
  AvatarRow,
  AvatarStackedDiagonal,

  // Applet Components removed

  // UI Components
  IconBg,
  Button,
  Divider,
  SegmentedControl,
  Slider,
  Icon,
  ProgressCircular,
  Timeline,
  TimelineRow,
  Toast,
  IOSStatusBar,
  Text,
  Modal,
  MarketingCardSmall,
  MarketingCardLarge,
};


// InterventionScreen Component Exports
export const InterventionScreenComponents = {
  // Header Components
  Header,
  FilterBar,

  // Input Components
  Input,
  TextArea,
  InputCard,
  ButtonGroup,
  SearchBar,
  UpsellCard,
  InputStackedHorizontal,
  PINCheck,

  // Cell Components
  Cell,
  CellActivity,

  // Avatar Components
  AvatarCarousel,

  // UI Components
  Divider,
  SegmentedControl,
  Slider,
  Timeline,
  TimelineRow,
  Toast,
  Text,
  ListUnordered,
  ListOrdered,
  ProgressCircular,
  Modal,
  MarketingCardSmall,
  MarketingCardLarge
};

// InterventionScreen Component Exports
export const UiComponents = {
  ...InterventionScreenComponents
};

export const ComponentPropMeta = {
  Header: HeaderPropMeta,
  TitleBar: TitleBarPropMeta,
  FilterBar: FilterBarPropMeta,
  Input: InputPropMeta,
  TextArea: TextAreaPropMeta,
  InputCard: InputCardPropMeta,
  ButtonGroup: ButtonGroupPropMeta,
  SearchBar: SearchBarPropMeta,
  PINCheck: PINCheckPropMeta,
  UpsellCard: UpsellCardPropMeta,
  MarketingCardSmall: MarketingCardSmallPropMeta,
  MarketingCardLarge: MarketingCardLargePropMeta,
  Cell: CellPropMeta,
  CellActivity: CellActivityPropMeta,
  Avatar: AvatarPropMeta,
  AvatarCarousel: AvatarCarouselPropMeta,
  AvatarRow: AvatarRowPropMeta,
  AvatarStackedDiagonal: AvatarStackedDiagonalPropMeta,
  // DiscoverPromo removed
  IconBg: IconBgPropMeta,
  Button: ButtonPropMeta,
  Divider: DividerPropMeta,
  SegmentedControl: SegmentedControlPropMeta,
  Slider: SliderPropMeta,
  Timeline: TimelinePropMeta,
  TimelineRow: TimelineRowPropMeta,
  Icon: IconPropMeta,
  Toast: ToastPropMeta,
  IOSStatusBar: IOSStatusBarPropMeta,
  Text: TextPropMeta,
  ListUnordered: ListUnorderedPropMeta,
  ListOrdered: ListOrderedPropMeta,
  InputStackedHorizontal: InputStackedHorizontalPropMeta,
  ProgressCircular: ProgressCircularPropMeta,
  Modal: ModalPropMeta
  // Add more component meta objects here as you build them
};

export const initialComponentProps: Record<string, any> = {
  Header: { title: 'Header', body: 'Body copy', size: 'page' },
  FilterBar: { filterChips: [{ title: 'Chip', active: true }] },
  Input: { label: 'Label', placeholder: 'Placeholder' },
  InputStackedHorizontal: {
    label1: 'Label 1',
    placeholder1: 'Placeholder 1',
    label2: 'Label 2',
    placeholder2: 'Placeholder 2'
  },
  TextArea: { label: 'Label', placeholder: 'Placeholder' },
  InputCard: { title: 'Input Card', body: 'Body', right: { type: 'radio' }, checked: false },
  ButtonGroup: { buttons: [{ title: 'Button' }] },
  SearchBar: { placeholder: 'Search...' },
  PINCheck: { label: 'PIN', placeholder: 'Enter PIN' },
  UpsellCard: { title: 'Info Card', body: 'Body', size: 'small' },
  MarketingCardSmall: { title: 'Marketing Card Small', body: 'Body', image: Images.Collaboration, button: 'Button text' },
  MarketingCardLarge: { title: 'Marketing Card Large', body: 'Body', image: Images.Broadcast, button: 'Button text' },
  Cell: { title: 'Cell', body: 'Body' },
  CellActivity: { title: 'Cell Activity', body: 'Body', date: 'Today', left: {}, right: {}, onClick: () => {} },
  Text: { text: 'Text', size: 'body', color: 'standard' },
  AvatarCarousel: { avatars: [{
    avatar: {size: '64', initial: "J", image: null},
    title: "Jane"
  },
  {
    avatar: {size: '64', initial:"N", image: null},
    title: "Nigel"
  },
  {
    avatar: {size: '64', image:Avatars.Chavez, initial: undefined},
    title: "Chavez"
  },] },
  Divider: { size: 'withinSectionMedium' },
  SegmentedControl: { left: { title: 'Left', active: true }, right: { title: 'Right', active: false }, onClick: () => {} },
  Slider: { onDrop: () => {} },
  Timeline: {
    rowData: [
      {
        label: "Account Created",
        body: "Welcome to Interventions Hub!",
        value: "Jan 1",
        valueDescriptor: "Completed",
        state: 'done',
        placing: 'beginning'
      },
      {
        label: "First Job Applied",
        body: "At Google",
        value: "Jan 5",
        valueDescriptor: "Completed",
        state: 'done',
        placing: 'middle'
      },
      {
        label: "Card Ordered",
        body: "Card",
        value: "Jan 10",
        valueDescriptor: "In Progress",
        state: 'inProgress',
        placing: 'middle'
      },
      {
        label: "Card Delivered",
        body: "Arriving soon",
        value: "Jan 15",
        valueDescriptor: "Pending",
        state: 'pending',
        placing: 'end'
      }
    ]
  },
  TimelineRow: {
    label: "Card Ordered",
    body: "Card",
    value: "Jan 10",
    valueDescriptor: "In Progress",
    state: 'inProgress',
    placing: 'middle'
  },
  Toast: {
    headline: "Headline",
    body: "Body",
    button: "Button"
  },
  ListOrdered: {
    items: [
      {
        title: 'First item',
        body: 'This is the first item body.',
      },
      {
        title: 'Second item',
        body: 'This is the second item body.',
      },
    ],
    type: 'standard',
  },
  ListUnordered: {
    items: [
      {
        title: 'First item',
        body: 'This is the first item body.',
        value: 'Value 1'
      },
      {
        title: 'Second item',
        body: 'This is the second item body.',
        value: 'Value 2'
      },
    ],
    prominence: 'standard',
    size: 'compact',
  },
  ProgressCircular: {
    fullHeight: true,
    width: 56,
    height: 56,
    label: 'Loading Explanation'
  },
  Modal: {
    title: 'Modal Title',
    description: 'This is a description for the modal.',
    icon: '',
    primaryButton: { label: 'OK' },
    secondaryButton: { label: 'Cancel' }
  }
};

