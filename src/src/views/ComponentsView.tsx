import { useNavigate } from 'react-router-dom'
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import { Images } from "src/data/Images";
import * as Icons from "src/data/Icons";

// Direct component imports
import TopBar from 'src/components/TopBar';
import Header from 'src/components/Header';
import Divider from 'src/components/Divider';
import PillGroup from 'src/components/PillGroup';
import SegmentedControl from 'src/components/SegmentedControl';
import TabGroup from 'src/components/TabGroup';
import Slider from 'src/components/Slider';
import Switch from 'src/components/Switch';
import TextInput from 'src/components/TextInput';
import SelectInput from 'src/components/SelectInput';
import InputCard from 'src/components/InputCard';
import Timeline from "src/components/Timeline";
import {
  TimelineRowProps
} from 'src/components/Timeline/TimelineRow';
import Stepper from 'src/components/Stepper';
import SearchInput from 'src/components/SearchInput';
// Removed Applet components (BalanceApplet, SavingsApplet, DiscoverPromo)
import ButtonGroup from 'src/components/ButtonGroup';
import EntityStack from 'src/components/EntityStack';
import EntityGrid from 'src/components/EntityGrid';
import EntityLockup from 'src/components/EntityLockup';
import Badge from 'src/components/Badge';
import Accordion from 'src/components/Accordion';
import Tag from 'src/components/Tag';
import InlineFeedback from 'src/components/InlineFeedback';
import Menu from 'src/components/Menu';
import { System } from 'src/data/AllIcons';
import LinkPreview from 'src/components/LinkPreview';
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
      body: application.position,
      metadataTime: application.time,
      placing: 'beginning' 
    },
    { 
      label: 'Application Reviewed', 
      metadataTime: 'Under Review',
      placing: 'middle' 
    },
    { 
      label: 'Recruiter Contacted', 
      metadataLocation: application.recruiter,
      placing: 'middle' 
    },
    { 
      label: 'Interview Scheduled', 
      metadataLocation: application.location,
      placing: 'middle' 
    },
    { 
      label: 'Decision Made', 
      metadataTime: '4 May 2025',
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
        <Divider size="medium" />
        <PillGroup
          filterChips = {[
            {title: "Chip 1", checked: false, type: 'choice'},
            {title: "Chip title", checked: false, type: 'choice'},
            {title: "Chip 3", checked: true, type: 'toggle'},
            {title: "Chip 4", checked: false, type: 'input'},
            {title: "Chipmunks", checked: false, type: 'select'},
          ]}
        />
        <Divider
          size="extraLarge"
        />
        <SegmentedControl
          left={{title: "Control left", active: true}}
          right={{title: "Control right", active: false}}
          onClick={(_segment) => {}}
        />
        <Divider
          size="extraLarge"
        />
        <TabGroup
          tabs={[
            { title: "Tab 1" },
            { title: "Tab 2" },
            { title: "Tab 3" },
            { title: "Tab 4" }
          ]}
          activeIndex={0}
        />
        <Divider
          size="extraLarge"
        />
        <Slider
          onDrop={()=>{}}
        />
        <Slider
          onDrop={()=>{}}
          segmented={10}
          leftLabel="Left"
          rightLabel="Right"
        />
        <Divider
          size="extraLarge"
        />
        <Switch
          checked={false}
          title="Enable notifications"
          helperText="Receive push notifications for important updates"
        />
        <Switch
          checked={true}
          title="Dark mode"
          helperText="Switch to dark theme"
        />
        <Switch
          checked={false}
        />
        <Divider
          size="extraLarge"
        />
        <Timeline rowData={rowData} />
        <Divider
          size="extraLarge"
        />
        <Stepper
          items={[
            { state: 'checked', size: 'large' },
            { state: 'current', size: 'large' },
            { state: 'future', size: 'large' },
          ]}
        />
        <Divider size="large" />
        <Stepper
          items={[
            { state: 'checked', size: 'small' },
            { state: 'current', size: 'small' },
            { state: 'future', size: 'small' },
          ]}
        />
        <Divider
          size="extraLarge"
        />
        <TextInput
          label="Preferred first name"
          body="Choose the name you prefer to be called"
          placeholder="Enter a name"
        />
        <TextInput
          label="Last name"
          body="Your last name must match your legal last name and cannot be edited. Please contact support to change your legal name"
          placeholder="Wright"
        />
        <SelectInput
          label="Country"
          body="Select your country of residence"
          placeholder="Select a country"
        />
        <Divider
          size="extraLarge"
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
          size='medium'
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
          size="extraLarge"
        />
        <LinkPreview
          title="Design better link cards"
          source="product.design"
          metadata="Shared · 1 hour ago"
          size="compact"
        />
        <Divider size="large" />
        <LinkPreview
          title="Five ways to ship faster than you planned"
          source="newsletter.example"
          metadata="Saved by you · 3 min read"
          size="expanded"
          imageSrc={Images.Collaboration}
        />
        <Divider
          size="extraLarge"
        />
        {/* Applet components removed */}
        <Divider size='extraLarge' />
        <SearchInput placeholder="Search" />
        <Divider size="large" />
        {/* DiscoverPromo removed */}
        <Divider size="extraLarge" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0 16px', alignItems: 'center' }}>
          <Badge type="dot" />
          <Badge type="text">99+</Badge>
        </div>
        <Divider size="extraLarge" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0 16px', alignItems: 'center' }}>
          <Tag size="small" type="default">Label</Tag>
          <Tag size="small" type="positive">Label</Tag>
          <Tag size="small" type="negative">Label</Tag>
          <Tag size="small" type="caution">Label</Tag>
          <Tag size="small" type="neutral">Label</Tag>
        </div>
        <Divider size="large" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0 16px', alignItems: 'center' }}>
          <Tag size="large" type="default">Label</Tag>
          <Tag size="large" type="positive">Label</Tag>
          <Tag size="large" type="negative">Label</Tag>
          <Tag size="large" type="caution">Label</Tag>
          <Tag size="large" type="neutral">Label</Tag>
        </div>
        <Divider size="extraLarge" />
        <EntityStack
          entities={[
            { entity: { image: Avatars.Karen } },
            { entity: { image: Avatars.Darren } },
            { entity: { image: Avatars.James } },
          ]}
          stacked={false}
          size="24"
        />
        <Divider size="large" />
        <EntityStack
          entities={[
            { entity: { image: Avatars.Karen } },
            { entity: { image: Avatars.Darren } },
            { entity: { image: Avatars.James } },
          ]}
          stacked={true}
          size="40"
        />
        <Divider size="large" />
        <EntityStack
          entities={[
            { entity: { image: Avatars.Karen } },
            { entity: { image: Avatars.Darren } },
            { entity: { image: Avatars.James } },
            { entity: { image: Avatars.Kevin } },
            { entity: { image: Avatars.Nina } },
            { entity: { image: Avatars.Paul } },
            { entity: { image: Avatars.Isaac } },
            { entity: { image: Avatars.Peter } },
          ]}
          stacked={true}
          size="40"
        />
        <Divider size="extraLarge" />
        <div style={{ padding: '0 16px' }}>
          <EntityLockup
            entity={{ image: Avatars.Karen, size: '40' }}
            title="Firstname Lastname"
            badge={true}
            degree="1st"
            tag={{ label: 'Label', size: 'small', type: 'default' }}
            subtitle="Subheading"
            metadata="Timestamp"
          />
        </div>
        <Divider size="large" />
        <div style={{ padding: '0 16px' }}>
          <EntityLockup
            entity={{ image: Avatars.Darren, size: '40', company: true }}
            title="Firstname Lastname"
            tag={{ label: 'Label', size: 'small', type: 'default' }}
            subtitle="Subheading"
            metadata="Timestamp"
          />
        </div>
        <Divider size="extraLarge" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '0 16px', alignItems: 'center' }}>
          <EntityGrid
            entities={[
              { entity: { image: Avatars.Karen } },
              { entity: { image: Avatars.Darren } }
            ]}
          />
          <EntityGrid
            entities={[
              { entity: { image: Avatars.Karen } },
              { entity: { image: Avatars.Darren } },
              { entity: { image: Avatars.James } }
            ]}
          />
          <EntityGrid
            entities={[
              { entity: { image: Avatars.Karen } },
              { entity: { image: Avatars.Darren } },
              { entity: { image: Avatars.James } },
              { entity: { image: Avatars.Kevin } }
            ]}
          />
          <EntityGrid
            entities={[
              { entity: { image: Avatars.Karen } },
              { entity: { image: Avatars.Darren } },
              { entity: { image: Avatars.James } },
              { entity: { image: Avatars.Kevin } },
              { entity: { image: Avatars.Nina } },
              { entity: { image: Avatars.Paul } }
            ]}
          />
        </div>
        <Divider size="extraLarge" />
        <Accordion heading="Heading">
          <p>Content that shows when open</p>
        </Accordion>
        <Divider size="extraLarge" />
        <InlineFeedback 
          label="Feedback Text. [Link](https://example.com)" 
          type="positive" 
        />
        <Divider size="large" />
        <InlineFeedback 
          label="Feedback Text. [Link](https://example.com)" 
          type="negative" 
        />
        <Divider size="large" />
        <InlineFeedback 
          label="Feedback Text. [Link](https://example.com)" 
          type="neutral" 
        />
        <Divider size="large" />
        <InlineFeedback 
          label="Feedback Text. [Link](https://example.com)" 
          type="caution" 
        />
        <Divider size="extraLarge" />
        <Menu
          sections={[
            {
              heading: "Heading",
              items: [
                { 
                  title: "Menu item", 
                  icon: { icon: System.Placeholder, size: '24', color: 'standard' },
                  onClick: () => {}
                },
                { 
                  title: "Menu item", 
                  icon: { icon: System.Placeholder, size: '24', color: 'standard' },
                  onClick: () => {}
                },
                { 
                  title: "Menu item", 
                  icon: { icon: System.Placeholder, size: '24', color: 'standard' },
                  onClick: () => {}
                }
              ]
            },
            {
              heading: "Heading",
              items: [
                { 
                  title: "Menu item", 
                  icon: { icon: System.Placeholder, size: '24', color: 'standard' },
                  onClick: () => {}
                },
                { 
                  title: "Menu item", 
                  icon: { icon: System.Placeholder, size: '24', color: 'standard' },
                  onClick: () => {}
                }
              ]
            }
          ]}
        />
      </ScrollContainer>
      <ButtonGroup
        buttons={[
          {title: "Save", type: "primary", onClick:()=>{}}
        ]}
      />      
    </PageWrapper>
  );
};

export default ComponentsView;
