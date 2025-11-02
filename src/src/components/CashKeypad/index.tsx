import React from "react";
import Icon, {ICON_WHITE, ICON_24, ICON_PROMINENT} from "src/components/Icon";
import * as Icons from "src/data/Icons";
import styles from "./index.module.sass";

export const KEYPAD_ACTION_ADD = "KEYPAD_ACTION_ADD";
export const KEYPAD_ACTION_BACKSPACE = "KEYPAD_ACTION_BACKSPACE";

export type KeypadActionType = typeof KEYPAD_ACTION_ADD | typeof KEYPAD_ACTION_BACKSPACE;

export interface KeypadAction {
  type: KeypadActionType;
  value: string | number;
}

export interface KeypadKey {
  label?: string;
  icon?: string;
  action: KeypadAction;
}

export interface CashKeypadProps {
  onClick: (action: KeypadAction) => void;
}

const CashKeypad: React.FC<CashKeypadProps> = ({ onClick }) => {
  const keys: KeypadKey[] = [
    {label: "1", action: {type: KEYPAD_ACTION_ADD, value: "1"}},
    {label: "2", action: {type: KEYPAD_ACTION_ADD, value: "2"}},
    {label: "3", action: {type: KEYPAD_ACTION_ADD, value: "3"}},
    {label: "4", action: {type: KEYPAD_ACTION_ADD, value: "4"}},
    {label: "5", action: {type: KEYPAD_ACTION_ADD, value: "5"}},
    {label: "6", action: {type: KEYPAD_ACTION_ADD, value: "6"}},
    {label: "7", action: {type: KEYPAD_ACTION_ADD, value: "7"}},
    {label: "8", action: {type: KEYPAD_ACTION_ADD, value: "8"}},
    {label: "9", action: {type: KEYPAD_ACTION_ADD, value: "9"}},
    {icon: Icons.Decimal24, action: {type: KEYPAD_ACTION_ADD, value: "."}},
    {label: "0", action: {type: KEYPAD_ACTION_ADD, value: "0"}},
    {icon: Icons.ChevronLeft24, action: {type: KEYPAD_ACTION_BACKSPACE, value: 1}},
  ];

  const keysElements = keys.map((key, index) => {
    return (
      <Key
        {...key}
        key={`Key${index}`}
        index={index}
        onClick={() => onClick(key.action)}
      />
    );
  });

  return (
    <ul className={styles.Main}>
      {keysElements}
    </ul>
  );
};

export interface KeyProps {
  label?: string;
  icon?: string | undefined;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
  index: number;
}

const Key: React.FC<KeyProps> = ({ label, icon, onClick, index }) => {
  const element = label ? <h4>{label}</h4> : icon ? <Icon icon={icon} size={ICON_24} color={ICON_PROMINENT} /> : null;

  return (
    <li className={styles.Key} onClick={onClick}>
      {element}
    </li>
  );
};

export default CashKeypad;
