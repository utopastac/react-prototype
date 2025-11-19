import React from "react";
import StepperItem, { StepperItemProps, StepperItemPropMeta } from "./StepperItem";
import styles from "./index.module.sass";

export interface StepperProps {
  items: StepperItemProps[];
}

const Stepper: React.FC<StepperProps> = ({ items }) => {

  const stepperItems = items.map((item: StepperItemProps, index: number) => {
    const title = item.title || `Step ${index + 1}`;
    return (
      <StepperItem {...item} title={title} key={`StepperItem${index}`} />
    );
  });

  return (
    <div className={styles.Main}>
      {stepperItems}
    </div>
  );
};

export default Stepper;

export const StepperPropMeta = {
  items: {
    type: 'array',
    label: 'Items',
    itemFields: StepperItemPropMeta,
  }
};

