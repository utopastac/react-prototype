import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { useLayersDispatch } from 'src/containers/LayersContext';
import { useFeed, FeedItem } from 'src/containers/FeedContext';

import TitleBar from 'src/components/TitleBar';
import SearchBar from 'src/components/SearchBar';
import Divider from 'src/components/Divider';
import CellActivity from 'src/components/CellActivity';
import NavigationBar from 'src/components/NavigationBar';

const FeedView: React.FC = () => {

  const layersDispatch = useLayersDispatch();
  const feedData = useFeed();

  useEffect(()=>{
  }, []);

  const feedRows = feedData.map((post: FeedItem, index: number)=>{
    const { author, content, createdAt, stats } = post;
    return (
      <CellActivity
        key={`feedRow${index}`}
        title={author.name}
        body={content}
        date={new Date(createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric' })}
        left={{
          type: "avatar",
          image: author.avatar
        }}
        right={{
          type: "info",
          title: `${stats.likes} likes`
        }}
        onClick={() => {}}
      />
    )
  });

  return (
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar
          title="Feed"
          right={{}}
        />
        <SearchBar placeholder="Search" />
        <Divider size="withinSectionSmall" />
        { feedRows }
      </ScrollContainer>
      <NavigationBar
        activeIndex={4}
      />
    </PageWrapper>
  );
};

export default FeedView;


