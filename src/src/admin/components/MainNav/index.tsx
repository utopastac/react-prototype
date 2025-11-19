import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.sass';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import Link from 'src/admin/components/Link';
import { IconProps } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import Logo from 'src/components/Logo';

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
  buttonTitle = 'Slack',
  buttonIcon,
  buttonOnClick,
  path,
  buttonIconSize = "16",
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
      <div className={styles.logoContainer}>
        <Logo type="In" size={4} forceTheme="light" />
        <h1>Interventions Hub</h1>
      </div>
      <ul className={styles.list}>
        <li>
          <Link
            title="Platform"
            path="/platform"
            size="large"
          />
        </li>
        <li>
          <Link
            title="Patterns"
            path="/patterns"
            size="large"
          />
        </li>
        <li>
          <Link
            title="Flows"
            path="/flows"
            size="large"
          />
        </li>
        <li className={styles.right}>
          <Link
            title="Builder"
            path="/builder"
            size="large"
          />
        </li>
      </ul>
      <Signature
        contact="Contact @pwright"
        buttonTitle="Slack"
        buttonIcon={Icons.Slack16}
        buttonIconSize={"16"}
      />
    </nav>
  );
};

export default MainNav;


