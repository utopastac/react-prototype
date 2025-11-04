import React from "react";
import { useNavigate } from 'react-router-dom'
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';

// Direct component imports
import TopBar from 'src/components/TopBar';
import Header, { HEADER_PAGE } from 'src/components/Header';
import Divider, { 
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE,
  DIVIDER_BETWEEN_SECTION_LARGE
} from 'src/components/Divider';
import FilterBar from 'src/components/FilterBar';
import SegmentedControl from 'src/components/SegmentedControl';
import Slider from 'src/components/Slider';
import Input from 'src/components/Input';
import InputCard, { CARD_RADIO, CARD_CHECKBOX } from 'src/components/InputCard';
import Cell, {
  CELL_AVATAR,
  CELL_ICON,
  CELL_ICON_BG,
  CELL_PUSH,
  CELL_BUTTON,
  CELL_LABEL_PUSH,
  CELL_TOGGLE,
  CELL_CHECKBOX,
  CELL_RADIO
} from 'src/components/Cell';
import Timeline, { TimelineProps} from "src/components/Timeline";
import TimelineRow, {
  STATE_NOT_STARTED,
  STATE_IN_PROGRESS,
  STATE_DONE,
  STATE_PENDING,
  STATE_SKIPPED,
  STATE_COLLAPSED,
  PLACING_BEGINNING,
  PLACING_MIDDLE,
  PLACING_END,
  TimelineRowProps
} from 'src/components/Timeline/TimelineRow';
import SearchBar from 'src/components/SearchBar';
import AvatarCarousel from 'src/components/AvatarCarousel';
// Removed Applet components (BalanceApplet, SavingsApplet, DiscoverPromo)
import ButtonGroup from 'src/components/ButtonGroup';
import Button, { BUTTON_PROMINENT } from 'src/components/Buttons/Button';
import IconBg, { ICON_BG_BRAND, ICON_BG_GRAY } from 'src/components/IconBg';
import Avatar, { AVATAR_64, AVATAR_48 } from 'src/components/Avatar';

import styles from "./index.module.sass";
//

const ComponentsView = () => {

  const layersDispatch = useLayersDispatch();
  const navigate = useNavigate();

  function openLayer(){
    layersDispatch({
      type: ADD_LAYER,
      component: Sections,
      props: {}
    })
  }

  // Dummy transaction data
  const transaction = {
    merchant: "Starbucks",
    amount: "$4.50",
    date: "March 15, 2024",
    time: "2:30 PM",
    location: "123 Main St, San Francisco, CA",
    card: "Interventions Hub Card",
    status: "Completed",
    transactionId: "TX123456789"
  };

  const rowData: TimelineRowProps[] = [
    { 
      label: 'Transaction Initiated', 
      body: transaction.time,
      value: transaction.amount,
      state: STATE_DONE, 
      placing: PLACING_BEGINNING 
    },
    { 
      label: 'Payment Processing', 
      value: 'Processing',
      state: STATE_SKIPPED, 
      placing: PLACING_MIDDLE 
    },
    { 
      label: 'Merchant Verification', 
      value: transaction.merchant,
      state: STATE_DONE, 
      placing: PLACING_MIDDLE 
    },
    { 
      label: 'Location Confirmed', 
      value: transaction.location,
      state: STATE_COLLAPSED, 
      placing: PLACING_MIDDLE 
    },
    { 
      label: 'Transaction Completed', 
      value: '4 May 2025',
      state: STATE_NOT_STARTED, 
      placing: PLACING_END 
    },
  ];

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TopBar
          title="Component list"
          left={{
            icon: Icons.Close,
            onClick: ()=>{
              navigate("/discover")
            }
          }}
          right={{
          }}
        />
        <Header
          title = "What do you go by?"
          body = "If you don't go by your legal first name, you can change it here. We'll use this name on your profile. "
          size={HEADER_PAGE}
        />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <FilterBar
          filterChips = {[
            {title: "Chip 1", active: false},
            {title: "Chip title", active: false},
            {title: "Chip 3", active: true, icon: true},
            {title: "Chip 4", active: false},
            {title: "Chipmunks", active: false},
          ]}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL}
        />
        <SegmentedControl
          left={{title: "Control left", active: true}}
          right={{title: "Control right", active: false}}
          onClick={(segment) => {}}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        />
        <Slider
          onDrop={()=>{}}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        />
        <Timeline rowData={rowData} />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        />
        <Input
          label="Preferred first name"
          body="Choose the name you prefer to be called"
          placeholder="Enter a name"
        />
        <Input
          label="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          placeholder="Wright"
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        />
        <InputCard
          title="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          right={{
            type: CARD_RADIO,
          }}
          checked={false}
          onClick={() => {}}
        />
        <Divider
          size={DIVIDER_WITHIN_SECTION_MEDIUM}
        />
        <InputCard
          title="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          right={{
            type: CARD_CHECKBOX
          }}
          checked={false}
          onClick={() => {}}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_AVATAR,
            image: Avatars.Karen
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_ICON,
            icon: Icons.SecurityCheckFill
          }}
          right={{
            type: CELL_BUTTON,
            title: "Button"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_ICON_BG,
            icon: Icons.SecurityCheckFill,
            theme: ICON_BG_BRAND
          }}
          right={{
            type: CELL_LABEL_PUSH,
            title: "Label"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_AVATAR,
            image: undefined,
          }}
          right={{
            type: CELL_TOGGLE,
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_ICON_BG,
            icon: Icons.SecurityCheckFill,
            theme: ICON_BG_GRAY
          }}
          right={{
            type: CELL_CHECKBOX,
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: CELL_ICON_BG,
            icon: Icons.ArrowLink,
            theme: ICON_BG_BRAND
          }}
          right={{
            type: CELL_RADIO,
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        {/* Applet components removed */}
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} />
        <SearchBar placeholder="Search" />
        <AvatarCarousel
          avatars={[
            {
              avatar: {size: AVATAR_64, initial: "J"},
              title: "Jane"
            },
            {
              avatar: {size: AVATAR_64, initial:"N"},
              title: "Nigel"
            },
            {
              avatar: {size: AVATAR_64, image:Avatars.Chavez},
              title: "Chavez"
            },
            {
              avatar: {size: AVATAR_64, image:Avatars.James},
              title: "James"
            },
            {
              avatar: {size: AVATAR_64, image:Avatars.Nina},
              title: "Lisa"
            },
            {
              avatar: {size: AVATAR_64, image:Avatars.Darren},
              title: "Darren"
            },
            {
              avatar: {size: AVATAR_64, image:Avatars.Kevin},
              title: "Kevin"
            }
          ]}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
        {/* DiscoverPromo removed */}
      </ScrollContainer>
      <ButtonGroup
        buttons={[
          {title: "Learn more", onClick: openLayer},
          {title: "Save", type: BUTTON_PROMINENT, onClick:()=>{}}
        ]}
      />      
    </PageWrapper>
  );
};

export default ComponentsView;
