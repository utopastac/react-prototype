import styles from "./index.module.sass";
import Button, { ButtonProps, ButtonPropMeta } from "src/components/Buttons/Button";

export interface ButtonGroupProps {
  buttons: ButtonProps[];
  horizontal?: boolean;
  inComponent?: boolean;
  showHairline?: boolean;
  disclaimer?: string;
  size?: 'small' | 'medium';
}

const ButtonGroup = ({ 
  buttons, 
  horizontal = true, 
  inComponent, 
  showHairline, 
  disclaimer, 
  size = "medium" 
}: ButtonGroupProps) => {
  const buttonsRender = buttons.map((button, index) => {
    return <Button {...button} key={`ButtonGroup${index}`} size={size} />
  });

  return (
    <div className={`${styles.Main} ${horizontal ? styles.horizontal : ""} ${inComponent ? styles.inComponent : ""} ${showHairline ? styles.showHairline : ""}`}>
      {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
      <div className={styles.buttons}>{buttonsRender}</div>
    </div>
  );
  };
 
export default ButtonGroup;

// Omit 'size' from ButtonPropMeta for use in button group fields
const { size: _buttonSize, ...ButtonPropMetaNoSize } = ButtonPropMeta;

export const ButtonGroupPropMeta = {
  buttons: {
    type: 'array',
    label: 'Buttons',
    itemFields: ButtonPropMetaNoSize
  },
  horizontal: { type: 'boolean', label: 'Horizontal' },
  inComponent: { type: 'boolean', label: 'In Component' },
  showHairline: { type: 'boolean', label: 'Show Hairline' },
  disclaimer: { type: 'string', label: 'Disclaimer' },
  size: { 
    type: 'select', 
    label: 'Button Size',
    options: [
      'small',
      'medium',
    ]
  },
};
