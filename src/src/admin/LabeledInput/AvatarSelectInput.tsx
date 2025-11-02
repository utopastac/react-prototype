import React, { useState } from 'react';
import styles from './index.module.sass';
import { AvatarsArray } from 'src/data/Avatars';
import Avatar, { AVATAR_24, AVATAR_48 } from 'src/components/Avatar';
import Modal from '../DevTools/Modal';

interface AvatarSelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
}

const AvatarSelectInput: React.FC<AvatarSelectInputProps> = ({ 
  label, 
  value, 
  onChange, 
  inputStyle 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    if (showModal) {
      setShowModal(false);
    } else {
      setModalPosition({ x: e.pageX, y: e.pageY });
      setShowModal(true);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    onChange(avatar);
    setShowModal(false);
  };

  const selectedAvatar = value || AvatarsArray[0];

  const avatarList = AvatarsArray.map((av, index) => {
    return (
      <li
        className={`${styles.avatarSelector} ${value === av ? styles.active : ""}`}
        key={`avatar${index}`}
        onClick={() => handleAvatarSelect(av)}
      >
        <Avatar
          image={av}
          size={AVATAR_48}
          key={`Avatar${index}`}
        />
      </li>
    );
  });

  return (
    <>
      <div className={styles.Input}>
        <label>{label}</label>
        <div 
          className={styles.selectInput}
          onClick={handleClick}
          style={inputStyle}
        >
          <Avatar
            image={selectedAvatar}
            size={AVATAR_24}
          />
        </div>
      </div>
      
      {showModal && (
        <Modal 
          title="Select Avatar" 
          x={modalPosition.x} 
          y={modalPosition.y} 
          close={() => setShowModal(false)}
        >
          <ul className={styles.avatarList}>{avatarList}</ul>
        </Modal>
      )}
    </>
  );
};

export default AvatarSelectInput; 