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
import AvatarRow from 'src/components/AvatarRow';
import ButtonGroup from 'src/components/ButtonGroup';
import Disclaimer from 'src/components/Disclaimer';
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
            size="compact"
            action={{
              type: BUTTON_ACTION_HALFSHEET,
              halfSheet: AccountSwitcherHalfsheet
            }}
            //onClick={openLayer}
            icon={{
              type: Icons.SubtleExpand16,
              size: "16",
              color: "subtle"
            }}
          />
          <Button 
            title="Edit profile"
            size="compact"
          />
        </div>
        <Divider
          size="betweenSectionExtraLargeCell"
        />
        <Cell
          title="Security"
          left={{
            type: "icon",
            icon: Icons.SecurityLockOutline24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Privacy"
          left={{
            type: "icon",
            icon: Icons.SensitiveVisible24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Favorites"
          left={{
            type: "icon",
            icon: Icons.Favorite24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Linked apps & businesses"
          left={{
            type: "icon",
            icon: Icons.BankLinked24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Themes"
          left={{
            type: "icon",
            icon: Icons.CustomizeBrushFill24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Documents & statements"
          left={{
            type: "icon",
            icon: Icons.Document24,
            size: '24',
            color: 'standard'
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Support"
          left={{
            type: "icon",
            icon: Icons.Help24,
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
            {title: "Sign out", type: "destructive", onClick:()=>{}}
          ]}
        />
        <Disclaimer />
      </ScrollContainer>
    </PageWrapper>
    
  );
};

export default AccountView;
