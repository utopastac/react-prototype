import { Images } from "src/data/Images";
// Header Components
import Header, { 
  HEADER_HERO, 
  HEADER_PAGE, 
  HEADER_SECTION, 
  HEADER_AVATAR, 
  HEADER_AVATAR_STACKED_DIAGONAL, 
  HEADER_ICON,
  HEADER_IMAGE,
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
  CARD_RADIO,
  CARD_CHECKBOX,
  InputCardPropMeta
} from 'src/components/InputCard';
//
import ButtonGroup, { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import SearchBar, { SearchBarPropMeta } from 'src/components/SearchBar';
//
//
// Removed MoneyInputDisplay
import UpsellCard, { UPSELL_LARGE, UPSELL_SMALL,UpsellCardPropMeta } from 'src/components/UpsellCard';
import PINCheck, { PINCheckPropMeta } from 'src/components/PINCheck';

// Cell Components
import Cell, {
  CELL_AVATAR,
  CELL_AVATAR_STACKED,
  CELL_ICON,
  CELL_ICON_BG,
  CELL_NONE,
  CELL_BUTTON,
  CELL_CHECKBOX,
  CELL_PUSH,
  CELL_LABEL_PUSH,
  CELL_RADIO,
  CELL_TOGGLE,
  CellPropMeta
} from 'src/components/Cell';
//
import CellActivity, {
  CELL_ACTIVITY_AVATAR,
  CELL_ACTIVITY_BUTTON,
  CELL_ACTIVITY_ICON_BG,
  CELL_ACTIVITY_INFO,
  CellActivityPropMeta
} from 'src/components/CellActivity';

// Avatar Components
import Avatar, {
  AVATAR_96,
  AVATAR_64,
  AVATAR_48,
  AVATAR_32,
  AVATAR_28,AVATAR_24,
  AvatarPropMeta
} from 'src/components/Avatar';
//
import AvatarCarousel, { AvatarCarouselPropMeta } from "src/components/AvatarCarousel";
import AvatarRow, { AvatarRowPropMeta } from "src/components/AvatarRow";
//
import AvatarStackedDiagonal, {
  AVATAR_STACKED_DIAGONAL_64,
  AVATAR_STACKED_DIAGONAL_48,
  AVATAR_STACKED_DIAGONAL_32,
  AVATAR_STACKED_DIAGONAL_24,
  AvatarStackedDiagonalPropMeta
} from 'src/components/AvatarStackedDiagonal';

// Applet Components
// Removed Applet components (DiscoverPromo, BalanceApplet, SavingsApplet, CryptoApplet, SecondaryApplet, TertiaryApplet)

import Text, {
  TEXT_HERO,
  TEXT_HEADER,
  TEXT_SECTION_TITLE,
  TEXT_BODY,
  TEXT_DESCRIPTION,
  TEXT_PROMINENT,
  TEXT_STANDARD,
  TEXT_SUBTLE,
  TextPropMeta
} from 'src/components/Text';

// UI Components
import IconBg, {
  ICON_BG_BRAND,
  ICON_BG_GRAY,
  ICON_BG_ERROR,
  ICON_BG_48,
  ICON_BG_64,
  IconBgPropMeta
} from 'src/components/IconBg';
//
import Button, {
  BUTTON_PROMINENT,
  BUTTON_STANDARD,
  BUTTON_DESTRUCTIVE,
  BUTTON_SUBTLE,
  BUTTON_BRAND,
  BUTTON_COMPACT_SIZE,
  BUTTON_CTA_SIZE,
  BUTTON_DEFAULT_SIZE,
  ButtonPropMeta
} from 'src/components/Buttons/Button';
//
import {
  BUTTON_ACTION_CLICK,
  BUTTON_ACTION_PATH,
  BUTTON_ACTION_HALFSHEET
} from 'src/hooks/useButtonAction';
//
import Divider, {
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE,
  DIVIDER_BETWEEN_SECTION_LARGE,
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_WITHIN_SECTION_SMALL,
  DividerPropMeta
} from 'src/components/Divider';
//
import SegmentedControl, { SegmentedControlPropMeta } from 'src/components/SegmentedControl';
import Slider, { SliderPropMeta } from 'src/components/Slider';
import Disclaimer, { DisclaimerPropMeta } from 'src/components/Disclaimer';
import ProgressCircular, { ProgressCircularPropMeta } from 'src/components/ProgressCircular';
import Timeline, { TimelinePropMeta } from 'src/components/Timeline';
import TimelineRow, {
  STATE_NOT_STARTED,
  STATE_IN_PROGRESS,
  STATE_PENDING,
  STATE_DONE,
  STATE_SKIPPED,
  STATE_COLLAPSED,
  PLACING_BEGINNING,
  PLACING_MIDDLE,
  PLACING_END,
  TimelineRowPropMeta
} from 'src/components/Timeline/TimelineRow';

import Toast, { ToastPropMeta } from 'src/components/Toast';
import ListOrdered, { ListOrderedPropMeta } from 'src/components/ListOrdered';
import ListUnordered, { ListUnorderedPropMeta } from 'src/components/ListUnordered';
import Modal, { ModalPropMeta } from 'src/components/Modal';

// Icons
import Icon, {
  ICON_16,
  ICON_24,
  ICON_32,
  ICON_BRAND,
  ICON_DISABLED,
  ICON_INVERSE,
  ICON_PROMINENT,
  ICON_STANDARD,
  ICON_SUBTLE,
  ICON_EXTRA_SUBTLE,
  ICON_SUCCESS,
  ICON_WHITE,
  ICON_FAILURE,
  IconPropMeta
} from 'src/components/Icon';

import { Avatars } from './Avatars';
import IOSStatusBar, {IOSStatusBarPropMeta} from 'src/components/IOSStatusBar';
import { size } from 'lodash';
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
  Disclaimer,
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

// Constants and Enums
export const ComponentData = {
  // Input Card
  CARD_RADIO,
  CARD_CHECKBOX,

  // Header
  HEADER_HERO,
  HEADER_PAGE,
  HEADER_SECTION,
  HEADER_AVATAR,
  HEADER_AVATAR_STACKED_DIAGONAL,
  HEADER_ICON,
  HEADER_IMAGE,

  // Cell
  CELL_AVATAR,
  CELL_AVATAR_STACKED,
  CELL_ICON,
  CELL_ICON_BG,
  CELL_NONE,
  CELL_BUTTON,
  CELL_CHECKBOX,
  CELL_PUSH,
  CELL_LABEL_PUSH,
  CELL_RADIO,
  CELL_TOGGLE,

  // Timeline
  TIMELINE_STATE_NOT_STARTED: STATE_NOT_STARTED,
  TIMELINE_STATE_IN_PROGRESS: STATE_IN_PROGRESS,
  TIMELINE_STATE_PENDING: STATE_PENDING,
  TIMELINE_STATE_DONE: STATE_DONE,
  TIMELINE_STATE_SKIPPED: STATE_SKIPPED,
  TIMELINE_STATE_COLLAPSED: STATE_COLLAPSED,
  TIMELINE_PLACING_BEGINNING: PLACING_BEGINNING,
  TIMELINE_PLACING_MIDDLE: PLACING_MIDDLE,
  TIMELINE_PLACING_END: PLACING_END,

  // Icon Background
  ICON_BG_BRAND,
  ICON_BG_GRAY,
  ICON_BG_ERROR,
  ICON_BG_48,
  ICON_BG_64,

  // Button
  BUTTON_PROMINENT,
  BUTTON_STANDARD,
  BUTTON_DESTRUCTIVE,
  BUTTON_SUBTLE,
  BUTTON_BRAND,
  BUTTON_COMPACT_SIZE,
  BUTTON_CTA_SIZE,
  BUTTON_DEFAULT_SIZE,
  BUTTON_ACTION_CLICK,
  BUTTON_ACTION_PATH,
  BUTTON_ACTION_HALFSHEET,

  // Divider
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE,
  DIVIDER_BETWEEN_SECTION_LARGE,
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_WITHIN_SECTION_SMALL,

  // Avatar
  AVATAR_96,
  AVATAR_64,
  AVATAR_48,
  AVATAR_32,
  AVATAR_28,
  AVATAR_24,

  // Avatar Stacked Diagonal
  AVATAR_STACKED_DIAGONAL_64,
  AVATAR_STACKED_DIAGONAL_48,
  AVATAR_STACKED_DIAGONAL_32,
  AVATAR_STACKED_DIAGONAL_24,

  // Text
  TEXT_HERO,
  TEXT_HEADER,
  TEXT_SECTION_TITLE,
  TEXT_BODY,
  TEXT_DESCRIPTION,
  TEXT_PROMINENT,
  TEXT_STANDARD,
  TEXT_SUBTLE,

  // Cell Activity
  CELL_ACTIVITY_AVATAR,
  CELL_ACTIVITY_BUTTON,
  CELL_ACTIVITY_ICON_BG,
  CELL_ACTIVITY_INFO,

  // Keypad
  // CashKeypad removed

  // Icon
  ICON_16,
  ICON_24,
  ICON_32,
  ICON_BRAND,
  ICON_DISABLED,
  ICON_INVERSE,
  ICON_PROMINENT,
  ICON_STANDARD,
  ICON_SUBTLE,
  ICON_EXTRA_SUBTLE,
  ICON_SUCCESS,
  ICON_WHITE,
  ICON_FAILURE,

  // Upsell Card
  UPSELL_SMALL,
  UPSELL_LARGE,
};

// Formblocker Component Exports
export const FormblockerComponents = {
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

// Formblocker Component Exports
export const UiComponents = {
  ...FormblockerComponents
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
  Disclaimer: DisclaimerPropMeta,
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
  Header: { title: 'Header', body: 'Body copy', size: ComponentData.HEADER_PAGE },
  FilterBar: { filterChips: [{ title: 'Chip', active: true }] },
  Input: { label: 'Label', placeholder: 'Placeholder' },
  InputStackedHorizontal: {
    label1: 'Label 1',
    placeholder1: 'Placeholder 1',
    label2: 'Label 2',
    placeholder2: 'Placeholder 2'
  },
  TextArea: { label: 'Label', placeholder: 'Placeholder' },
  InputCard: { title: 'Input Card', body: 'Body', right: { type: ComponentData.CARD_RADIO }, checked: false },
  ButtonGroup: { buttons: [{ title: 'Button' }] },
  SearchBar: { placeholder: 'Search...' },
  PINCheck: { label: 'PIN', placeholder: 'Enter PIN' },
  UpsellCard: { title: 'Info Card', body: 'Body', size: ComponentData.UPSELL_SMALL },
  MarketingCardSmall: { title: 'Marketing Card Small', body: 'Body', image: Images.Bed, button: 'Button text' },
  MarketingCardLarge: { title: 'Marketing Card Large', body: 'Body', image: Images.Cards, button: 'Button text' },
  Cell: { title: 'Cell', body: 'Body' },
  CellActivity: { title: 'Cell Activity', body: 'Body', date: 'Today', left: {}, right: {}, onClick: () => {} },
  Text: { text: 'Text', size: ComponentData.TEXT_BODY, color: ComponentData.TEXT_STANDARD },
  AvatarCarousel: { avatars: [{
    avatar: {size: ComponentData.AVATAR_64, initial: "J", image: null},
    title: "Jane"
  },
  {
    avatar: {size: ComponentData.AVATAR_64, initial:"N", image: null},
    title: "Nigel"
  },
  {
    avatar: {size: ComponentData.AVATAR_64, image:Avatars.Chavez, initial: undefined},
    title: "Chavez"
  },] },
  Divider: { size: ComponentData.DIVIDER_WITHIN_SECTION_MEDIUM },
  SegmentedControl: { left: { title: 'Left', active: true }, right: { title: 'Right', active: false }, onClick: () => {} },
  Slider: { onDrop: () => {} },
  Timeline: {
    rowData: [
      {
        label: "Account Created",
        body: "Welcome to Interventions Hub!",
        value: "Jan 1",
        valueDescriptor: "Completed",
        state: ComponentData.TIMELINE_STATE_DONE,
        placing: ComponentData.TIMELINE_PLACING_BEGINNING
      },
      {
        label: "First Payment Sent",
        body: "$20 to Jane",
        value: "Jan 5",
        valueDescriptor: "Completed",
        state: ComponentData.TIMELINE_STATE_DONE,
        placing: ComponentData.TIMELINE_PLACING_MIDDLE
      },
      {
        label: "Card Ordered",
        body: "Physical Cash Card",
        value: "Jan 10",
        valueDescriptor: "In Progress",
        state: ComponentData.TIMELINE_STATE_IN_PROGRESS,
        placing: ComponentData.TIMELINE_PLACING_MIDDLE
      },
      {
        label: "Card Delivered",
        body: "Arriving soon",
        value: "Jan 15",
        valueDescriptor: "Pending",
        state: ComponentData.TIMELINE_STATE_PENDING,
        placing: ComponentData.TIMELINE_PLACING_END
      }
    ]
  },
  TimelineRow: {
    label: "Card Ordered",
    body: "Physical Cash Card",
    value: "Jan 10",
    valueDescriptor: "In Progress",
    state: ComponentData.TIMELINE_STATE_IN_PROGRESS,
    placing: ComponentData.TIMELINE_PLACING_MIDDLE
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

