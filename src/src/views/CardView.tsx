import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import TitleBar from "src/components/TitleBar";
import Divider, {
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_BETWEEN_SECTION_LARGE,
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL,
  DIVIDER_WITHIN_SECTION_SMALL
} from "src/components/Divider";
import ButtonGroup from "src/components/ButtonGroup";
import Cell, {
  CELL_AVATAR,
  CELL_ICON,
  CELL_PUSH,
  CELL_LABEL_PUSH
} from "src/components/Cell";
import Header, { HEADER_SECTION } from "src/components/Header";
import NavigationBar from "src/components/NavigationBar";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import Card from "src/assets/card.png";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { useTabBackgroundDispatch, WHITE } from 'src/containers/TabBackgroundContext';
import styles from "./index.module.sass";
import { BUTTON_STANDARD } from "src/components/Buttons/Button";
import { AVATAR_32 } from "src/components/Avatar";
//

const CardView = () => {

  const layersDispatch = useLayersDispatch();
  const tabBackgroundDispatch = useTabBackgroundDispatch();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: WHITE
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
    <PageWrapper background>
      <ScrollContainer>
        <TitleBar
          title="Card"
          right={{
            size: AVATAR_32
          }}
        />
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <div className={styles.cashCard}>
          <img src={Card} />
        </div>
        <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
        <div className={styles.marginContainer}>
          <ButtonGroup buttons={[
              {title: "Request", onClick: ()=>{}, type: BUTTON_STANDARD},
              {title: "Pay", onClick:()=>{}, type: BUTTON_STANDARD}
            ]}
            horizontal={true}
            inComponent={true}
          />
          
        </div>
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <Cell
          title="Starbucks"
          body="10% off one purchase"
          left={{
            type: CELL_AVATAR,
            image: Avatars.Starbucks
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="DoorDash gift card"
          body="$70 remaining"
          left={{
            type: CELL_AVATAR,
            image: Avatars.DoorDash
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} />
        <Header
          size={HEADER_SECTION}
          title={"Your spending"}
        />
        <Divider size={DIVIDER_WITHIN_SECTION_SMALL} />
        <Cell
          title="Insights & activity"
          left={{
            type: CELL_ICON,
            icon: Icons.Insights24
          }}
          right={{
            type: CELL_LABEL_PUSH,
            title: "$364 in Nov"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Round Ups"
          left={{
            type: CELL_ICON,
            icon: Icons.RoundUps24
          }}
          right={{
            type: CELL_LABEL_PUSH,
            title: "Savings"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Free overdraft coverage"
          left={{
            type: CELL_ICON,
            icon: Icons.OverdraftProtection24
          }}
          right={{
            type: CELL_LABEL_PUSH,
            title: "On"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Find an ATM"
          left={{
            type: CELL_ICON,
            icon: Icons.Atm24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} />
        <Header
          size={HEADER_SECTION}
          title={"Manage card"}
        />
        <Divider size={DIVIDER_WITHIN_SECTION_SMALL} />
        <Cell
          title="Add card to Apple Pay"
          left={{
            type: CELL_ICON,
            icon: Icons.CardAdd24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Design a new card"
          left={{
            type: CELL_ICON,
            icon: Icons.CardDesign24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Blocked businesses"
          left={{
            type: CELL_ICON,
            icon: Icons.Block24
          }}
          right={{
            type: CELL_LABEL_PUSH,
            title: "3"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Change PIN"
          left={{
            type: CELL_ICON,
            icon: Icons.PasscodeFill24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Interventions Hub Card support"
          left={{
            type: CELL_ICON,
            icon: Icons.CardSupport24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
      </ScrollContainer>
      <NavigationBar
        activeIndex={1}
      />
      
    </PageWrapper>
  );
};

export default CardView;
