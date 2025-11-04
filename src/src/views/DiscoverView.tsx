import React from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import { useLayersDispatch } from 'src/containers/LayersContext';

// Direct component imports
import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider, { 
  DIVIDER_WITHIN_SECTION_SMALL,
  DIVIDER_BETWEEN_SECTION_LARGE 
} from 'src/components/Divider';
import AvatarCarousel from 'src/components/AvatarCarousel';
// DiscoverPromo removed
import NavigationBar from 'src/components/NavigationBar';
import { AVATAR_64 } from 'src/components/Avatar';

const DiscoverView = () => {

  const layersDispatch = useLayersDispatch();

  

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar title="Discover" />
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
        {/* DiscoverPromo removed */}
      </ScrollContainer>
      <NavigationBar
        activeIndex={3}
      />
      
    </PageWrapper>
  );
};

export default DiscoverView;
