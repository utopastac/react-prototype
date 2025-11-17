import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useUser } from 'src/containers/UserContext';
import { useTransitionNavigate, transitions } from 'src/hooks/useTransitionNavigate';
import styles from "./index.module.sass";

// Import components directly
import TopBar from 'src/components/TopBar';
import Header from 'src/components/Header';
import Divider from 'src/components/Divider';
import Button from 'src/components/Buttons/Button';
import Cell from 'src/components/Cell';
import ButtonGroup from 'src/components/ButtonGroup';
import AccountSwitcherHalfsheet from 'src/views/halfsheets/AccountSwitcherHalfsheet';
import { BUTTON_ACTION_HALFSHEET } from 'src/hooks/useButtonAction';

const AccountView = () => {

  const transitionNavigate = useTransitionNavigate();

  const userObject = useUser();
  const { name, headline, avatar } = userObject;


  useEffect(()=>{
  }, []);

  return (
    <PageWrapper background>
      <TopBar
        left={{
          onClick: ()=>{transitionNavigate(-1, transitions.closeModal)},
          icon: Icons.Close
        }}
        title="Account"
        right={{
        }}
      />
      <ScrollContainer>
        <Header
          title={name}
          size="page"
          accessory={{
            type: "avatar",
            size: "48",
            image: avatar
          }}
        />
        <Divider
          size="withinSectionMedium"
        />
        <div className={styles.buttonRow}>
          <Button 
            title={headline}
            size="small"
            action={{
              type: BUTTON_ACTION_HALFSHEET,
              halfSheet: AccountSwitcherHalfsheet
            }}
            //onClick={openLayer}
            icon={{
              type: Icons.Expand16,
              size: "16",
              color: "subtle"
            }}
          />
          <Button 
            title="Edit profile"
            size="small"
          />
        </div>
        <Divider
          size="betweenSectionExtraLargeCell"
        />
        <Cell
          title="Linked apps & businesses"
          left={{
            type: "icon",
            icon: Icons.Alert24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Divider
          size="betweenSectionExtraLargeCell"
        />
       
        <Divider
          size="withinSectionMedium"
        />
        <ButtonGroup
          buttons={[
            {title: "Create a jobs account", onClick: ()=>{}},
            {title: "Sign out", type: "secondary", onClick:()=>{}}
          ]}
        />
      </ScrollContainer>
    </PageWrapper>
    
  );
};

export default AccountView;
