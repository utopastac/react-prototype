import Icon, { IconPropMeta, IconProps } from "src/components/Icon";
import styles from "./index.module.sass";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
//

export interface ButtonProps {
  title?: string;
  onClick?: () => void;
  action?: ButtonAction;
  type?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium';
  icon?: Omit<IconProps, 'className'>;
  disabled?: boolean;
  emphasised?: boolean;
}

export default function Button({ title, type='secondary', size, onClick, action, icon, disabled, emphasised }: ButtonProps) {

  const buttonActionHandler = useButtonAction({ action, onClick });

  const clickHandler = () => {
    if (disabled) return;
    buttonActionHandler();
  };

  const styleClass = () =>{
    switch(type){
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.secondary;
    }
  } 

  const sizeClass = () => {
    switch(size){
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      default:
        return styles.medium;
    }
  }

  const isIconOnly = icon && !title;

  return (
    <div className={`${styles.Main} ${styleClass()} ${sizeClass()} ${disabled ? styles.disabled : ''} ${emphasised ? styles.emphasised : ''} ${isIconOnly ? styles.iconOnly : ''}`} onClick={clickHandler}>
      {title && <span>{title}</span>}
      {icon &&
        <Icon icon={icon.icon} size={icon.size} color={icon.color} />
      }
    </div>
  );
}

export const ButtonPropMeta = {
  title: { type: 'string', label: 'Title' },
  onClick: { type: 'function', label: 'onClick (not editable)' },
  action: { type: 'string', label: 'Action' },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      'primary',
      'secondary',
      'ghost',
    ],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [
      'small',
      'medium',
    ],
  },
  disabled: { type: 'boolean', label: 'Disabled' },
  emphasised: { type: 'boolean', label: 'Emphasised' },
  icon: {
    type: 'object',
    label: 'Icon',
    options: [
      {
        type: 'none',
        label: 'No Icon',
        fields: {}
      },
      {
        type: 'withIcon',
        label: 'With Icon',
        fields: IconPropMeta
      }
    ]
  },
};


