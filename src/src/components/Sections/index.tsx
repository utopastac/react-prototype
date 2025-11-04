import React, { ReactNode, useRef, useState, useEffect } from "react";
import styles from "./index.module.sass";
//
import Image from "src/assets/image.png";
import Image2 from "src/assets/image2.png";
import Image3 from "src/assets/image3.png";
//
import { useLayersDispatch, REMOVE_LAYER } from 'src/containers/LayersContext';
import ModalBacker from "../ModalBacker";
import TextBlock from "src/components/TextBlock";
import { SECTION, BLOCK } from "src/components/TextBlock";
import LinkBlocks from "src/components/LinkBlocks";
// RelatedArticles removed
import Divider, { DIVIDER_BETWEEN_SECTION_LARGE } from "src/components/Divider";

interface ArticleData {
  pageTitle: string;
  title: string;
  image: string;
}

interface ArticleProps {
  data: ArticleData;
}

const Article = ({ data }: ArticleProps) => {
  const { pageTitle, title, image } = data;
  
  const linkBlockData = [
    {
      title: "Our Identity rules",
      onClick: () => {}
    },
    {
      title: "Consequences",
      onClick: () => {}
    },
    {
      title: "Our legal obligations",
      onClick: () => {}
    }
  ];

  return (
    <div style={{ width: '375px', height: '100%', display: 'inline-block', verticalAlign: 'top', padding: '16px' }}>
      <header style={{ marginBottom: '16px' }}>
        <h1>{title}</h1>
      </header>
      <img src={image} style={{ width: '100%', marginBottom: '16px' }} />
      <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
      <TextBlock title="What is it?" body="A government-issued ID is an official document, like a passport or driver's license, used to verify a person's identity." size={BLOCK} />
      <LinkBlocks blocks={linkBlockData} />
      {/* RelatedArticles removed */}
    </div>
  );
};

export default function Sections() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const layersDispatch = useLayersDispatch();

  const sectionWidth = 375;
  const sectionHeight = 812;

  const articleData: ArticleData[] = [
    {
      pageTitle: "Government ID",
      title: "We verify customer identities to prevent fraud, ensure compliance, and maintain secure transactions.", 
      image: Image
    },
    {
      pageTitle: "Money laundering",
      title: "Money laundering is the process of concealing illegal funds' origins, making them appear legitimate through complex transactions.", 
      image: Image2
    },
    {
      pageTitle: "Legal names",
      title: "We use your legal name to verify your identity, comply with regulations, prevent fraud, and ensure accurate account management.", 
      image: Image3
    }
  ];

  const xScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = event.currentTarget;
    setCurrentIndex(Math.round(scrollLeft / sectionWidth));
  }

  const yScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    if(scrollTop === 0 && layersDispatch){
      layersDispatch({
        type: REMOVE_LAYER
      }); 
    }
  }

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);

  function closeLayers() {
    if (layersDispatch) {
      layersDispatch({
        type: REMOVE_LAYER
      }); 
    }
  }

  const articles = articleData.map((data, index) => (
    <Article
      key={index}
      data={data}
    />
  ));

  const indicators = articleData.map((_, index) => (
    <li
      key={`indicator${index}`}
      className={currentIndex === index ? styles.active : ""}
    />
  ));

  return (
    <div className={styles.Main} ref={containerRef} onScroll={yScroll}>
      <ModalBacker />
      <div ref={pickerRef} onScroll={xScroll} className={styles.Picker}>
        {articles}
      </div>
      <ul className={styles.indicators}>
        {indicators}
      </ul>
    </div>
  );
}