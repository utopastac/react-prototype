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
import SearchInput, { SearchInputPropMeta } from 'src/components/SearchInput';
//
//
// Removed MoneyInputDisplay
import PINCheck, { PINCheckPropMeta } from 'src/components/PINCheck';

// Cell Components
import Cell, {
  CellPropMeta
} from 'src/components/Cell';

// Entity Components
import Entity, {
  EntityPropMeta
} from 'src/components/Entity';
//
import EntityStack, { EntityStackPropMeta } from "src/components/EntityStack";
//
import EntityGrid, {
  EntityGridPropMeta
} from 'src/components/EntityGrid';

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

import Badge, {
  BadgePropMeta
} from 'src/components/Badge';

import Accordion, {
  AccordionPropMeta
} from 'src/components/Accordion';

import Tag, {
  TagPropMeta
} from 'src/components/Tag';

import { Avatars } from './Avatars';
import IOSStatusBar, {IOSStatusBarPropMeta} from 'src/components/IOSStatusBar';

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
  SearchInput,
  PINCheck,
  InputStackedHorizontal,

  // Cell Components
  Cell,
  ListUnordered,
  ListOrdered,

  // Entity Components
  Entity,
  EntityStack,
  EntityGrid,

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
  Badge,
  Accordion,
  Tag,
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
  SearchInput,
  InputStackedHorizontal,
  PINCheck,

  // Cell Components
  Cell,

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
  Modal
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
  SearchInput: SearchInputPropMeta,
  PINCheck: PINCheckPropMeta,
  Cell: CellPropMeta,
  Entity: EntityPropMeta,
  EntityStack: EntityStackPropMeta,
  EntityGrid: EntityGridPropMeta,
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
  Modal: ModalPropMeta,
  Badge: BadgePropMeta,
  Accordion: AccordionPropMeta,
  Tag: TagPropMeta
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
  InputCard: { title: 'Input Card', body: 'Body', right: { type: 'radio' }, orientation: 'right', checked: false },
  ButtonGroup: { buttons: [{ title: 'Button' }] },
  SearchInput: { placeholder: 'Search...' },
  PINCheck: { label: 'PIN', placeholder: 'Enter PIN' },
  Cell: { title: 'Cell', body: 'Body' },
  Text: { text: 'Text', size: 'body', color: 'standard' },
  Divider: { size: 'medium' },
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
  },
  Badge: {
    type: 'text',
    children: '99+'
  },
  Accordion: {
    heading: 'Heading',
    defaultOpen: false,
    children: 'Content that shows when open'
  },
  Button: {
    title: 'Button',
    type: 'secondary',
    size: 'medium'
  },
  Tag: {
    children: 'Label',
    size: 'small',
    type: 'default'
  }
};

