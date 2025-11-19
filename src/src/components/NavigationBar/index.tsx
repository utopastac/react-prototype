import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTransition, noTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import Text from "src/components/Text";
import * as AllIcons from "src/data/AllIcons";

export interface NavigationBarProps {
  activeIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeIndex }) => {
  const inverse = false;

  const tabData = [
    {icon: AllIcons.Navigation.HomeActive, url: "/flows/discover", label: "Home"},
    {icon: AllIcons.Navigation.Video, url: "/flows/activity", label: "Video"},
    {icon: AllIcons.Navigation.People, url: "/flows/activity", label: "My Network"},
    {icon: AllIcons.Navigation.BellFill, url: "/flows/activity", label: "Notifications"},
    {icon: AllIcons.Navigation.Job, url: "/flows/activity", label: "Jobs"}
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
    <div className={`${styles.Tab} ${active ? styles.active : ""}`} onClick={() => handleNavigation(url)}>
      <Icon icon={icon} size="24" color={inverse ? "prominent" : active ? "prominent" : "extraSubtle"} />
      <p>{label}</p>
    </div>
  );
};

export default NavigationBar;
