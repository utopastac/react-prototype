import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTransition, noTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import * as Icons from "src/data/Icons";

export interface NavigationBarProps {
  activeIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeIndex }) => {
  const inverse = false;

  const tabData = [
  {icon: Icons.Back, url: "discover", label: "Discover"},
  {icon: Icons.Push, url: "activity", label: "Activity"}
  ];

  const tabs = tabData.map((tab, index) => (
    <Tab 
      key={`NavigationTab${index}`} 
      icon={tab.icon} 
      url={tab.url} 
      label={tab.label}
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
  label: string;
  active: boolean;
  inverse: boolean;
}

const Tab: React.FC<TabProps> = ({ icon, url, label, active, inverse }) => {
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
        <p>{label}</p>
      </div>
    </div>
  );
};

export default NavigationBar;
