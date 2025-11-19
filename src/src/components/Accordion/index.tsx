import { useState } from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import { System } from "src/data/AllIcons";

export interface AccordionProps {
  heading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ heading, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.Main}>
      <div className={styles.header} onClick={toggleOpen}>
        <span className={styles.heading}>{heading}</span>
        <Icon 
          icon={isOpen ? System.ChevronUp : System.ChevronDown} 
          size="24" 
          color="standard"
          className={styles.chevron}
        />
      </div>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;

export const AccordionPropMeta = {
  heading: { type: 'string', label: 'Heading' },
  defaultOpen: { type: 'boolean', label: 'Default Open' },
  children: { type: 'reactNode', label: 'Content' },
};

