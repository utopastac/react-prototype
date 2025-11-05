import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTransition, noTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";
import Icon, { IconSize, IconColor } from "src/components/Icon";
import * as Icons from "src/data/Icons";

export interface NavigationBarProps {
  activeIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeIndex }) => {
  const inverse = false;

  const tabData = [
  {icon: Icons.Discover, url: "discover"},
  {icon: Icons.Activity, url: "activity"}
  ];

  const tabs = tabData.map((tab, index) => (
    <Tab 
      key={`NavigationTab${index}`} 
      icon={tab.icon} 
      url={tab.url} 
      active={index === activeIndex} 
      inverse={inverse} 
    />
  ));

  return (
    <div className={`${styles.Main}`}>
      <div>
        {tabs}
      </div>
    </div>
  );
};

export interface TabProps {
  icon: string;
  url: string;
  active: boolean;
  inverse: boolean;
}

const Tab: React.FC<TabProps> = ({ icon, url, active, inverse }) => {
  const navigate = useNavigate();
  const { setTransition } = useTransition();

  const handleNavigation = (url: string) => {
    setTransition(noTransition);
    navigate(url);
  };

  return (
    <div onClick={() => handleNavigation(url)}>
      <div className={`${styles.Tab} ${active ? styles.active : ""}`}>
        <Icon icon={icon} size="24" color={inverse ? "prominent" : active ? "prominent" : "extraSubtle"} />
      </div>
    </div>
  );
};

export default NavigationBar;
