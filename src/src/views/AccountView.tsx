import React, { useEffect } from "react";
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useUser } from 'src/containers/UserContext';
import { useTransitionNavigate, transitions } from 'src/hooks/useTransitionNavigate';
import styles from "./index.module.sass";

// Import components directly
import TopBar from 'src/components/TopBar';
import Header, { HEADER_PAGE, HEADER_SECTION, HEADER_AVATAR } from 'src/components/Header';
import Divider, { DIVIDER_WITHIN_SECTION_MEDIUM, DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL } from 'src/components/Divider';
import Button, { BUTTON_COMPACT_SIZE, BUTTON_DESTRUCTIVE } from 'src/components/Buttons/Button';
import Cell, { CELL_ICON_BG, CELL_NONE, CELL_PUSH, CELL_ICON } from 'src/components/Cell';
import AvatarRow from 'src/components/AvatarRow';
import ButtonGroup from 'src/components/ButtonGroup';
import Disclaimer from 'src/components/Disclaimer';
import AccountSwitcherHalfsheet from 'src/views/halfsheets/AccountSwitcherHalfsheet';
import { AVATAR_48 } from 'src/components/Avatar';
import { ICON_BG_BRAND } from 'src/components/IconBg';
import Icon, { ICON_16, ICON_SUBTLE } from 'src/components/Icon';
import { BUTTON_ACTION_HALFSHEET } from 'src/hooks/useButtonAction';

const AccountView = () => {

  const transitionNavigate = useTransitionNavigate();

  const userObject = useUser();
  const { name, cashtag, avatar, balance } = userObject;


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
          title={name}t
          size={HEADER_PAGE}
          accessory={{
            type: HEADER_AVATAR,
            size: AVATAR_48,
            image: avatar
          }}
        />
        <Divider
          size={DIVIDER_WITHIN_SECTION_MEDIUM}
        />
        <div className={styles.buttonRow}>
          <Button 
            title={cashtag}
            size={BUTTON_COMPACT_SIZE}
            action={{
              type: BUTTON_ACTION_HALFSHEET,
              halfSheet: AccountSwitcherHalfsheet
            }}
            //onClick={openLayer}
            icon={{
              type: Icons.SubtleExpand16,
              size: ICON_16,
              color: ICON_SUBTLE
            }}
          />
          <Button 
            title="Edit profile"
            size={BUTTON_COMPACT_SIZE}
          />
        </div>
        <Cell
          title="Invite friends"
          body="Get $5"
          left={{
            type: CELL_ICON_BG,
            icon: Icons.Add24,
            theme: ICON_BG_BRAND
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL}
        />
        <Cell
          title="Linked Banks"
          left={{
            type: CELL_ICON,
            icon: Icons.BankAccount24
          }}
          right={{
            type: CELL_PUSH,
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Security"
          left={{
            type: CELL_ICON,
            icon: Icons.SecurityLockOutline24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Privacy"
          left={{
            type: CELL_ICON,
            icon: Icons.SensitiveVisible24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Favorites"
          left={{
            type: CELL_ICON,
            icon: Icons.Favorite24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Families"
          left={{
            type: CELL_ICON,
            icon: Icons.Family24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Shopping"
          left={{
            type: CELL_ICON,
            icon: Icons.CategoryShopping24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Linked apps & businesses"
          left={{
            type: CELL_ICON,
            icon: Icons.BankLinked24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Themes"
          left={{
            type: CELL_ICON,
            icon: Icons.CustomizeBrushFill24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Documents & statements"
          left={{
            type: CELL_ICON,
            icon: Icons.Document24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Support"
          left={{
            type: CELL_ICON,
            icon: Icons.Help24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Divider
          size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL}
        />
        <Header
          title="Interventions Hub settings"
          body="These settings apply to all your connected accounts on Interventions Hub."
          size={HEADER_SECTION}
        />
        <Divider
          size={DIVIDER_WITHIN_SECTION_MEDIUM}
        />
        <AvatarRow
          avatars={[
            {
              avatar: {size: AVATAR_48, image: Avatars.Darren}
            },
            {
              avatar: {size: AVATAR_48, image: Avatars.Nina}
            }
          ]}
        />
        <Cell
          title="2 connected accounts"
          body="$dmartinez, $dbarber1"
          left={{type: CELL_NONE}}
          right={{type: CELL_NONE}}
        />
        <Cell
          title="Personal information"
          left={{
            type: CELL_ICON,
            icon: Icons.Avatar24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Notifications"
          left={{
            type: CELL_ICON,
            icon: Icons.Notifications24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Your devices"
          left={{
            type: CELL_ICON,
            icon: Icons.DeviceDesktop24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Cell
          title="Limits"
          left={{
            type: CELL_ICON,
            icon: Icons.Limits24
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{}}
        />
        <Divider
          size={DIVIDER_WITHIN_SECTION_MEDIUM}
        />
        <ButtonGroup
          buttons={[
            {title: "Create a business account", onClick: ()=>{}},
            {title: "Sign out all accounts", type: BUTTON_DESTRUCTIVE, onClick:()=>{}}
          ]}
        />
        <Disclaimer />
      </ScrollContainer>
    </PageWrapper>
    
  );
};

export default AccountView;
