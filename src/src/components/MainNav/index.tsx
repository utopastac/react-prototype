import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './index.module.sass';
import ToolbarButton from 'src/builder/components/ToolbarButton';
import { IconProps } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';

interface SignatureProps {
  contact?: string;
  buttonTitle?: string;
  buttonIcon?: any;
  buttonOnClick?: () => void;
  path?: string;
  buttonIconSize?: IconProps['size'];
  children?: React.ReactNode;
}

const Signature: React.FC<SignatureProps> = ({
  contact = 'Contact @peterwright',
  buttonTitle = 'App preview',
  buttonIcon,
  buttonOnClick,
  path,
  buttonIconSize = "24",
  children,
}) => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (buttonOnClick) {
      buttonOnClick();
    } else {
      navigate(path ? path : '/');
    }
  };

  return (
    <div className={styles.Signature}>
      <h5>
        <span>{contact}</span>
        <ToolbarButton
          onClick={handleButtonClick}
          title={buttonTitle}
          icon={buttonIcon}
          position="left"
          iconSize={buttonIconSize}
        />
      </h5>
      {children}
    </div>
  );
};

const MainNav: React.FC = () => {
  return (
    <nav className={styles.nav} aria-label="Main">
      <h1>Interventions Hub</h1>
      <ul className={styles.list}>
        <li>
          <NavLink
            to="/platform"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Platform
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/patterns"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Patterns
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/flows"
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Flows
          </NavLink>
        </li>
        <li className={styles.right}
        >
          <a href="#/builder" className={styles.link}>Builder</a>
        </li>
      </ul>
      <Signature
        contact="Contact @pwright"
        buttonTitle="App preview"
        buttonIcon={Icons.DeviceMobile24}
        buttonIconSize={"24"}
      />
    </nav>
  );
};

export default MainNav;


