import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { useTabBackgroundDispatch, WHITE } from 'src/containers/TabBackgroundContext';
import { useActivity, ActivityItem } from 'src/containers/ActivityContext';

// Import specific components
import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider, { DIVIDER_WITHIN_SECTION_SMALL, DIVIDER_BETWEEN_SECTION_LARGE } from 'src/components/Divider';
import AvatarCarousel from 'src/components/AvatarCarousel';
import Header, { HEADER_SECTION } from 'src/components/Header';
import CellActivity, { CELL_ACTIVITY_AVATAR, CELL_ACTIVITY_BUTTON, CELL_ACTIVITY_INFO } from 'src/components/CellActivity';
import NavigationBar from 'src/components/NavigationBar';
import Avatar, { AVATAR_64 } from 'src/components/Avatar';

const ActivityView: React.FC = () => {

  const layersDispatch = useLayersDispatch();
  const tabBackgroundDispatch = useTabBackgroundDispatch();


  const activityData = useActivity();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: WHITE
    });
  }, []);


  const activityRows = activityData.map((activity: ActivityItem, index: number)=>{
    const { name, body, date, total, avatar } = activity;
    return (
      <CellActivity
        key={`activityRow${index}`}
        title={name}
        body={body}
        date={date}
        left= {{
          type: CELL_ACTIVITY_AVATAR,
          image: avatar
        }}
        right= {{
          type: CELL_ACTIVITY_INFO,
          title: total
        }}
        onClick={() => {}}
      />
    )
  });

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar
          title="Activity"
          right={{
          }}
        />
        <SearchBar placeholder="Search" />
        <Divider size={DIVIDER_WITHIN_SECTION_SMALL} />
        <AvatarCarousel
          avatars={[
            {
              avatar: { size: AVATAR_64, image: Avatars.Karen },
              title: "Karen"
            },
            {
              avatar: { size: AVATAR_64, initial: "P" },
              title: "Peter"
            },
            {
              avatar: { size: AVATAR_64, image: Avatars.NinaD },
              title: "Nina"
            },
            {
              avatar: { size: AVATAR_64, image: Avatars.Isaac },
              title: "Isaac"
            },
            {
              avatar: { size: AVATAR_64, image: Avatars.Nina },
              title: "Lisa"
            },
            {
              avatar: { size: AVATAR_64, image: Avatars.Darren },
              title: "Darren"
            },
            {
              avatar: { size: AVATAR_64, image: Avatars.Kevin },
              title: "Kevin"
            }
          ]}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
        <Header
          size={HEADER_SECTION}
          title={"Pending"}
        />
        <CellActivity
          title="Chavez P"
          body="$200 for the bad thing"
          date="Oct 1"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            image: Avatars.Chavez
          }}
          right= {{
            type: CELL_ACTIVITY_BUTTON,
            title: "Pay"
          }}
          onClick={() => {}}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
        <Header
          size={HEADER_SECTION}
          title={"Today"}
        />
        <CellActivity
          title="Nina D"
          body="For helping me 💎"
          date="10.40am"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            image: Avatars.NinaD
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$80.22"
          }}
          onClick={() => {}}
        />
        <CellActivity
          title="Sweetgreen"
          body="interventions hub card"
          date="10.42am"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            image: Avatars.Sweetgreen
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$14.00"
          }}
          onClick={() => {}}
        />
        <CellActivity
          title="Isaac"
          body="Blackmail :("
          date="8.42am"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            image: Avatars.Isaac
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$2000.00"
          }}
          onClick={() => {}}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
        <Header
          size={HEADER_SECTION}
          title={"Last 7 days"}
        />
        {/* <CellActivity
          title="Sweetgreen"
          body="interventions hub card"
          date="Sep 29"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            src: Avatars.Sweetgreen
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$14.00"
          }}
        />
        <CellActivity
          title="Lisa Lothian"
          body="for dinner 🍽️"
          date="8.20pm"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            src: Avatars.Nina
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$2000.00"
          }}
        />
        <CellActivity
          title="Apple"
          body="interventions hub card"
          date="Sep 28"
          left= {{
            type: CELL_ACTIVITY_AVATAR,
            src: Avatars.Apple
          }}
          right= {{
            type: CELL_ACTIVITY_INFO,
            title: "$1025.50"
          }}
        /> */}
        { activityRows }
      </ScrollContainer>
      <NavigationBar
        activeIndex={4}
      />
      
    </PageWrapper>
  );
};

export default ActivityView;
