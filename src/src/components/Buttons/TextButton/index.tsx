import React from "react";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
import styles from "./index.module.sass";

export interface TextButtonProps {
  title: string;
  action?: ButtonAction;
  onClick?: () => void;
  small?: boolean;
}

export default function TextButton({ title, action, onClick, small }: TextButtonProps) {
  const clickHandler = useButtonAction({ action, onClick });
  return (
    <div className={`${styles.Main} ${small ? styles.small : ''}`} onClick={clickHandler}>
      <span>{title}</span>
    </div>
  );
}
