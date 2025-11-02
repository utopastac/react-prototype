import React from "react";
import styles from "./index.module.sass";
import Icon, { ICON_24, ICON_INVERSE } from "../Icon";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

interface ModalProps {
  icon?: string | React.ReactNode;
  title?: string;
  description?: string;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  icon,
  title,
  description,
  primaryButton,
  secondaryButton,
  onClose,
  children,
}) => {
  return (
    <div className={styles.scrim} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.content}>
          {icon && (
            <div className={styles.icon}>
              {typeof icon === "string" ? <Icon icon={icon} size={ICON_24} color={ICON_INVERSE} /> : icon}
            </div>
          )}
          {title && <div className={styles.title}>{title}</div>}
          {description && <div className={styles.description}>{description}</div>}
          {children}
        </div>
        <div className={styles.buttons}>
          {primaryButton && (
            <ModalButton
              label={primaryButton.label}
              type="primary"
              onClick={primaryButton.onClick}
            />
          )}
          {secondaryButton && (
            <ModalButton
              label={secondaryButton.label}
              type="secondary"
              onClick={secondaryButton.onClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

interface ModalButtonProps {
  label: string;
  type: 'primary' | 'secondary';
  onClick?: () => void;
}

export const ModalButton: React.FC<ModalButtonProps> = ({ label, type, onClick }) => (
  <button
    className={type === 'primary' ? styles.primaryButton : styles.secondaryButton}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

export const ModalButtonPropMeta = {
  label: { type: 'string', label: 'Label' },
  type: {
    type: 'select',
    label: 'Type',
    options: ['primary', 'secondary']
  }
};

export const ModalPropMeta = {
  icon: {
    type: 'string',
    label: 'Icon',
    // Could use IconPropMeta.icon.options if importing
  },
  title: { type: 'string', label: 'Title' },
  description: { type: 'string', label: 'Description' },
  primaryButton: {
    type: 'object',
    label: 'Primary Button',
    fields: {
      label: { type: 'string', label: 'Button 1 label' },
      type: {
        type: 'select',
        label: 'Button 1 Type',
        options: ['primary', 'secondary']
      }
      // onClick is not editable in admin
    }
  },
  secondaryButton: {
    type: 'object',
    label: 'Secondary Button',
    fields: {
      label: { type: 'string', label: 'Button 2 label' },
      type: {
        type: 'select',
        label: 'Button 2 Type',
        options: ['primary', 'secondary']
      }
      // onClick is not editable in admin
    }
  }
};
// For admin usage 