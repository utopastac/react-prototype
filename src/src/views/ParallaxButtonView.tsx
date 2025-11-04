import React from 'react';
import { PageWrapper, ScrollContainer } from 'src/containers';
import ParallaxButton from 'src/components/ParallaxButton';
import styles from './ParallaxTest.module.sass';
import Icon from 'src/components/Icon';
import * as Icons from "src/data/Icons";

const ParallaxButtonView = () => {
  return (
    <PageWrapper background>
      <ScrollContainer>
        <ParallaxButton text="Security">
          <div className={styles.Main}>
            
          </div>
        </ParallaxButton>
      </ScrollContainer>
    </PageWrapper>
  );
};

export default ParallaxButtonView; 