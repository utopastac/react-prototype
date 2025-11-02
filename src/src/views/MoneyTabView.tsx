import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { useTabBackgroundDispatch, GREY } from 'src/containers/TabBackgroundContext';
import styles from "./index.module.sass";

// Direct component imports
import TitleBar from 'src/components/TitleBar';
import Divider, { 
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL
} from 'src/components/Divider';
import BalanceApplet from 'src/components/BalanceApplet';
import SavingsApplet from 'src/components/SavingsApplet';
import BitcoinApplet from 'src/components/BitcoinApplet';
import SecondaryApplet from 'src/components/SecondaryApplet';
import TertiaryApplet from 'src/components/TertiaryApplet';
import NavigationBar from 'src/components/NavigationBar';
import { AVATAR_32 } from 'src/components/Avatar';

const MoneyTabView = () => {

  const layersDispatch = useLayersDispatch();
  const tabBackgroundDispatch = useTabBackgroundDispatch();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: GREY
    });
  }, []);  

  function openLayer(){
    if (layersDispatch) {
      layersDispatch({
        type: ADD_LAYER,
        component: Sections,
        props: {}
      });
    }
  }

  return (
    <PageWrapper>
      <ScrollContainer>
        <TitleBar
          title="Money"
          right={{
            size: AVATAR_32
          }}
        />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <BalanceApplet />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <SavingsApplet />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <BitcoinApplet />
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} onBackground={true} />
        <SecondaryApplet
          title="Paychecks"
          avatar={Avatars.Walmart}
          total="$515.23"
          detail="deposited Aug 5"
        />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <SecondaryApplet
          title="Bills"
          avatar={Avatars.TMobile}
          total="$23.12"
          detail="due in 3 days"
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} onBackground={true} />
        <div className={styles.grid2}>
          <TertiaryApplet
            title="Savings"
            icon={Icons.Savings24}
            color="#00D64F"
            detail="Save for a goal"
          />
          <TertiaryApplet
            title="Taxes"
            icon={Icons.Taxes24}
            color="#5D00E8"
            detail="File for free"
          />
          <TertiaryApplet
            title="Borrow"
            icon={Icons.Borrow24}
            color="#3399FF"
            detail="$200 available"
          />
          <TertiaryApplet
            title="Bills"
            icon={Icons.Bills24}
            color="#3F6AFF"
            detail="Manage & pay"
          />
        </div>
      </ScrollContainer>
      <NavigationBar
        activeIndex={0}
      />
      
    </PageWrapper>
  );
};

export default MoneyTabView;
