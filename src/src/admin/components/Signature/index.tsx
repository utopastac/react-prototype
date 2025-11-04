import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.sass';
import ToolbarButton from '../ToolbarButton';
import { IconSize } from 'src/components/Icon';

interface SignatureProps {
  contact?: string;
  buttonTitle?: string;
  buttonIcon?: any;
  buttonOnClick?: () => void;
  path?: string;
  buttonIconSize?: IconSize;
  children?: React.ReactNode;
}

const Signature: React.FC<SignatureProps> = ({
  contact = 'Contact @peterwright',
  buttonTitle = 'App preview',
  buttonIcon,
  buttonOnClick,
  path,
  buttonIconSize = "24" as IconSize,
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

export default Signature; 