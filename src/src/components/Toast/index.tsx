import React from "react";
import ReactMarkdown from "react-markdown";
import Icon, { IconPropMeta } from "src/components/Icon";
import Button from "src/components/Buttons/Button";
import * as Icons from "src/data/AllIcons";
import styles from "./index.module.sass";

export interface ToastProps {
  headline: string;
  timestamp?: string;
  currentIndex?: string | number;
  totalCount?: string | number;
  onClose?: () => void;
  icon?: string
}

const Toast: React.FC<ToastProps> = ({ 
  headline, 
  timestamp, 
  currentIndex, 
  totalCount, 
  onClose, 
  icon 
}) => {
  const hasBottomLine = timestamp !== undefined || (currentIndex !== undefined && totalCount !== undefined);

  return (
    <div className={styles.Main}>
      <div>
        <div className={styles.topLine}>
          { icon && (
            <div className={styles.icon}>
              <Icon icon={icon} size="24" color="standard" />
            </div>
          )}
          <div className={styles.headline}>
            <ReactMarkdown>{headline}</ReactMarkdown>
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
        {hasBottomLine && (
          <div className={styles.bottomLine}>
            {timestamp !== undefined && (
              <div className={styles.timestamp}>
                {timestamp}
              </div>
            )}
            {currentIndex !== undefined && totalCount !== undefined && (
              <div className={styles.counter}>
                {currentIndex} / {totalCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;

export const ToastPropMeta = {
  headline: { type: 'string', label: 'Headline' },
  timestamp: { type: 'string', label: 'Timestamp' },
  currentIndex: { type: 'string', label: 'Current Index' },
  totalCount: { type: 'string', label: 'Total Count' },
  onClose: { type: 'function', label: 'onClose (not editable)' },
  icon: IconPropMeta.icon
};
