import React from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import { useLayersDispatch } from 'src/containers/LayersContext';

// Direct component imports
import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider from 'src/components/Divider';
import AvatarCarousel from 'src/components/AvatarCarousel';
// DiscoverPromo removed
import NavigationBar from 'src/components/NavigationBar';

const DiscoverView = () => {

  const layersDispatch = useLayersDispatch();

  

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar title="Discover" />
        <SearchBar placeholder="Search" />
        <Divider size="small" />
        <AvatarCarousel
          avatars={[
            {
              avatar: {size: "64"},
              title: "Jane"
            },
            {
              avatar: {size: "64"},
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
        {/* DiscoverPromo removed */}
      </ScrollContainer>
      <NavigationBar
        activeIndex={3}
      />
      
    </PageWrapper>
  );
};

export default DiscoverView;
