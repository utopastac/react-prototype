import React from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import { useLayersDispatch } from 'src/containers/LayersContext';

// Direct component imports
import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider from 'src/components/Divider';
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
        {/* DiscoverPromo removed */}
      </ScrollContainer>
      <NavigationBar
        activeIndex={3}
      />
      
    </PageWrapper>
  );
};

export default DiscoverView;
