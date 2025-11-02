import { React, useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { useTabBackgroundDispatch, WHITE } from 'src/containers/TabBackgroundContext';
import styles from "./index.module.sass";

// Direct component imports
import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider, { 
  DIVIDER_WITHIN_SECTION_SMALL,
  DIVIDER_BETWEEN_SECTION_LARGE 
} from 'src/components/Divider';
import AvatarCarousel from 'src/components/AvatarCarousel';
import DiscoverPromo from 'src/components/DiscoverPromo';
import NavigationBar from 'src/components/NavigationBar';
import Avatar, { AVATAR_64 } from 'src/components/Avatar';

const DiscoverView = () => {

  const layersDispatch = useLayersDispatch();
  const tabBackgroundDispatch = useTabBackgroundDispatch();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: WHITE
    });
  }, []);

  function openLayer(){
    layersDispatch({
      type: ADD_LAYER,
      component: Sections,
      props: {}
    })
  }

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar
          title="Discover"
          right={{
          }}
        />
        <SearchBar placeholder="Search" />
        <Divider size={DIVIDER_WITHIN_SECTION_SMALL} />
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
        <DiscoverPromo
          title="New Interventions Hub Card"
          body="Glitter card is here - and it's radiant"
          button="Learn more"
        />
      </ScrollContainer>
      <NavigationBar
        activeIndex={3}
      />
      
    </PageWrapper>
  );
};

export default DiscoverView;
