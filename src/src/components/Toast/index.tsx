import React from "react";
import Icon, { IconPropMeta } from "src/components/Icon";
import Button from "src/components/Buttons/Button";
import * as Icons from "src/data/AllIcons";
import styles from "./index.module.sass";

export interface ToastProps {
  headline: string;
  body?: string;
  onClose?: () => void;
  icon?: string
}

const Toast: React.FC<ToastProps> = ({ headline, body, onClose, icon }) => {

  return (
    <div className={styles.Main}>
      <div>
        { icon && (
          <div className={styles.icon}><Icon icon={icon} size="24" color="standard" /></div>
        )}
        <div className={styles.content}>
          <h4>{headline}</h4>
          {body && <p>{body}</p> }
        </div>
        <div className={styles.closeButton}>
          <Button
            type="ghost"
            size="small"
            icon={{ icon: Icons.System.CloseSmall, size: "16", color: "standard" }}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;

export const ToastPropMeta = {
  headline: { type: 'string', label: 'Headline' },
  body: { type: 'string', label: 'Body' },
  onClose: { type: 'function', label: 'onClose (not editable)' },
  icon: IconPropMeta.icon
};
