import React from "react";
import Icon, { ICON_24, ICON_INVERSE, IconPropMeta } from "src/components/Icon";
import styles from "./index.module.sass";

export interface ToastProps {
  headline: string;
  body?: string;
  button?: string;
  icon?: string
}

const Toast: React.FC<ToastProps> = ({ headline, body, button, icon }) => {

  return (
    <div className={styles.Main}>
      <div>
        { icon && (
          <div className={styles.icon}><Icon icon={icon} size={ICON_24} color={ICON_INVERSE} /></div>
        )}
        <div className={styles.content}>
          <h4>{headline}</h4>
          {body && <p>{body}</p> }
        </div>
        {button && <h5>{button}</h5>}
      </div>
    </div>
  );
};

export default Toast;

export const ToastPropMeta = {
  headline: { type: 'string', label: 'Headline' },
  body: { type: 'string', label: 'Body' },
  button: { type: 'string', label: 'Button' },
  icon: IconPropMeta.icon
};
