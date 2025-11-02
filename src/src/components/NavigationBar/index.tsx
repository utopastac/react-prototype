import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTransition, noTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";
import Icon, { ICON_EXTRA_SUBTLE } from "src/components/Icon";
import * as Icons from "src/data/Icons";
import { ICON_24, ICON_WHITE, ICON_PROMINENT } from "src/components/Icon";
import { useTabBackground, BRAND } from 'src/containers/TabBackgroundContext';

export interface NavigationBarProps {
  activeIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeIndex }) => {
  const tabBackground = useTabBackground();
  const inverse = tabBackground === BRAND;

  const tabData = [
    {icon: Icons.Discover, url: "/discover"},
    {icon: Icons.Activity, url: "/activity"}
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
    <div className={`${styles.Main} ${inverse ? styles.brand : ""}`}>
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
        <Icon icon={icon} size={ICON_24} color={inverse ? ICON_PROMINENT : active ? ICON_PROMINENT : ICON_EXTRA_SUBTLE} />
      </div>
    </div>
  );
};

export default NavigationBar;
