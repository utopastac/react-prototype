import React from "react";
import { useNavigate } from 'react-router-dom'
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";

// Direct component imports
import TopBar from 'src/components/TopBar';
import Header from 'src/components/Header';
import Divider from 'src/components/Divider';
import FilterBar from 'src/components/FilterBar';
import SegmentedControl from 'src/components/SegmentedControl';
import Slider from 'src/components/Slider';
import Input from 'src/components/Input';
import InputCard from 'src/components/InputCard';
import Cell from 'src/components/Cell';
import Timeline, { TimelineProps} from "src/components/Timeline";
import TimelineRow, {
  TimelineRowProps
} from 'src/components/Timeline/TimelineRow';
import SearchBar from 'src/components/SearchBar';
import AvatarCarousel from 'src/components/AvatarCarousel';
// Removed Applet components (BalanceApplet, SavingsApplet, DiscoverPromo)
import ButtonGroup from 'src/components/ButtonGroup';
import Button from 'src/components/Buttons/Button';
import IconBg from 'src/components/IconBg';
import Avatar from 'src/components/Avatar';
import Badge from 'src/components/Badge';

import styles from "./index.module.sass";
//

const ComponentsView = () => {

  const navigate = useNavigate();

  // Dummy job application data
  const application = {
    company: "Tech Corp",
    position: "Senior Software Engineer",
    date: "March 15, 2024",
    time: "2:30 PM",
    location: "San Francisco, CA",
    recruiter: "Sarah Johnson",
    status: "In Review",
    applicationId: "APP123456789"
  };

  const rowData: TimelineRowProps[] = [
    { 
      label: 'Application Submitted', 
      body: application.time,
      value: application.position,
      state: 'done', 
      placing: 'beginning' 
    },
    { 
      label: 'Application Reviewed', 
      value: 'Under Review',
      state: 'skipped', 
      placing: 'middle' 
    },
    { 
      label: 'Recruiter Contacted', 
      value: application.recruiter,
      state: 'done', 
      placing: 'middle' 
    },
    { 
      label: 'Interview Scheduled', 
      value: application.location,
      state: 'collapsed', 
      placing: 'middle' 
    },
    { 
      label: 'Decision Made', 
      value: '4 May 2025',
      state: 'notStarted', 
      placing: 'end' 
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
              navigate("/flows/discover")
            }
          }}
          right={{
          }}
        />
        <Header
          title = "What do you go by?"
          body = "If you don't go by your legal first name, you can change it here. We'll use this name on your profile. "
          size="page"
        />
        <Divider size="withinSectionMedium" />
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
          size="betweenSectionExtraLargeCell"
        />
        <SegmentedControl
          left={{title: "Control left", active: true}}
          right={{title: "Control right", active: false}}
          onClick={(segment) => {}}
        />
        <Divider
          size="betweenSectionExtraLarge"
        />
        <Slider
          onDrop={()=>{}}
        />
        <Divider
          size="betweenSectionExtraLarge"
        />
        <Timeline rowData={rowData} />
        <Divider
          size="betweenSectionExtraLarge"
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
          size="betweenSectionExtraLarge"
        />
        <InputCard
          title="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          right={{
            type: "radio",
          }}
          checked={false}
          onClick={() => {}}
        />
        <Divider
          size='withinSectionMedium'
        />
        <InputCard
          title="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          right={{
            type: "checkbox"
          }}
          checked={false}
          onClick={() => {}}
        />
        <Divider
          size="betweenSectionExtraLarge"
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "avatar",
            image: Avatars.Karen
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "icon",
            icon: Icons.Push
          }}
          right={{
            type: "button",
            title: "Button"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "iconBg",
            icon: Icons.Push,
            theme: "brand"
          }}
          right={{
            type: "labelPush",
            title: "Label"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "avatar",
            image: undefined,
          }}
          right={{
            type: "toggle",
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "iconBg",
            icon: Icons.Push,
            theme: "grey"
          }}
          right={{
            type: "checkbox",
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Cell"
          body="Cell default can be used in a wide variety of use casee"
          left={{
            type: "iconBg",
            icon: Icons.Add16,
            theme: "brand"
          }}
          right={{
            type: "radio",
            checked: false,
            onClick: () => {}
          }}
          onClick={()=>{}}
        />
        {/* Applet components removed */}
        <Divider size='betweenSectionExtraLargeCell' />
        <SearchBar placeholder="Search" />
        <AvatarCarousel
          avatars={[
            {
              avatar: {size: "64", initial: "J"},
              title: "Jane"
            },
            {
              avatar: {size: "64", initial:"N"},
              title: "Nigel"
            },
            {
              avatar: {size: "64", image:Avatars.Chavez},
              title: "Chavez"
            },
            {
              avatar: {size: "64", image:Avatars.James},
              title: "James"
            },
            {
              avatar: {size: "64", image:Avatars.Nina},
              title: "Lisa"
            },
            {
              avatar: {size: "64", image:Avatars.Darren},
              title: "Darren"
            },
            {
              avatar: {size: "64", image:Avatars.Kevin},
              title: "Kevin"
            }
          ]}
        />
        <Divider size="betweenSectionLarge" />
        {/* DiscoverPromo removed */}
        <Divider size="betweenSectionExtraLarge" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0 16px', alignItems: 'center' }}>
          <Badge type="dot" />
          <Badge type="text">99+</Badge>
        </div>
      </ScrollContainer>
      <ButtonGroup
        buttons={[
          {title: "Save", type: "prominent", onClick:()=>{}}
        ]}
      />      
    </PageWrapper>
  );
};

export default ComponentsView;
