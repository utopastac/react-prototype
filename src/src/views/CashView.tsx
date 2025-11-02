import { React, useEffect, useState } from "react";
import { PageWrapper } from "src/containers";
import { AVATAR_32 } from "src/components/Avatar";
import TitleBar from "src/components/TitleBar";
import MoneyInputDisplay from "src/components/MoneyInputDisplay";
import CashKeypad, { KEYPAD_ACTION_ADD, KEYPAD_ACTION_BACKSPACE, KeypadAction } from "src/components/CashKeypad";
import Divider, { DIVIDER_WITHIN_SECTION_MEDIUM } from "src/components/Divider";
import ButtonGroup from "src/components/ButtonGroup";
import NavigationBar from "src/components/NavigationBar";
import { BUTTON_PROMINENT } from "src/components/Buttons/Button";
import * as Icons from "src/data/Icons";
import Sections from "src/components/Sections";
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { useTabBackgroundDispatch, BRAND } from 'src/containers/TabBackgroundContext';
import styles from "./index.module.sass";
import * as Utils from "src/helpers/Utils";
//

const CashView = () => {

  const [total, setTotal] = useState("0");

  const layersDispatch = useLayersDispatch();
  const tabBackgroundDispatch = useTabBackgroundDispatch();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: BRAND
    });
  }, []);

  function openLayer(){
    layersDispatch({
      type: ADD_LAYER,
      component: Sections,
      props: {}
    })
  }

  function formatDecimal(amount: string): string {
    const [whole, decimal = "00"] = amount.split(".");
    return `${whole}.${decimal.padEnd(2, "0")}`;
  }

  function handleNumericInput(currentTotal: string, newDigit: string): string {
    // Handle numbers after decimal point
    if (currentTotal.includes(".")) {
      const [whole, decimal] = currentTotal.split(".");
      
      // If first decimal place is 0, replace it
      if (decimal[0] === "0") {
        return `${whole}.${newDigit}0`;
      }
      
      // If second decimal place is 0, replace it
      if (decimal[1] === "0") {
        return `${whole}.${decimal[0]}${newDigit}`;
      }
      
      // If both decimal places are filled, don't add more
      return currentTotal;
    }

    // Don't allow more than 5 digits for the whole number part
    const [whole] = currentTotal.split(".");
    if (whole.length >= 5) return currentTotal;

    // Handle initial zero
    if (currentTotal === "0") return newDigit;

    // Add digit to whole number
    return currentTotal + newDigit;
  }

  function handleDecimalInput(currentTotal: string): string {
    // If already has decimal, return current total
    if (currentTotal.includes(".")) return currentTotal;
    
    // Add decimal point with two zeros
    return formatDecimal(currentTotal);
  }

  function handleBackspace(currentTotal: string): string {
    // Handle empty or single digit
    if (currentTotal.length <= 1) return "0";

    const [whole, decimal] = currentTotal.split(".");
    
    // If we have decimals
    if (decimal) {
      // If first decimal digit is 0, remove decimal part entirely
      if (decimal[0] === "0") return whole;
      // If second decimal digit is 0, reset to .00
      if (decimal[1] === "0") return formatDecimal(whole);
      // Otherwise, remove last decimal digit and pad with 0
      return `${whole}.${decimal[0]}0`;
    }

    // No decimals, just remove last digit
    return currentTotal.slice(0, -1);
  }

  function getTotal(action: KeypadAction): string {
    if (!action) return total;

    let newTotal = total;

    switch(action.type) {
      case KEYPAD_ACTION_ADD:
        if (!action.value) return total;
        
        newTotal = action.value === "."
          ? handleDecimalInput(total)
          : handleNumericInput(total, action.value.toString());
        break;

      case KEYPAD_ACTION_BACKSPACE:
        newTotal = handleBackspace(total);
        break;
    }

    setTotal(newTotal);
    return newTotal;
  }

  return (
    <PageWrapper>
      <div className={styles.fillContainer}>
        <TitleBar
          icon={Icons.ScanQR}
          right={{
            size: AVATAR_32,
            border: true
          }}
          
        />
        <MoneyInputDisplay total={total} />
        <CashKeypad onClick={getTotal}/>
        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        <ButtonGroup buttons={[
            {title: "Request", onClick: ()=>{}, type: BUTTON_PROMINENT},
            {title: "Pay", onClick:()=>{}, type: BUTTON_PROMINENT}
          ]}
          horizontal={true}
          inComponent={false}
        />
      </div>
      <NavigationBar
        activeIndex={2}
      />
      
    </PageWrapper>
  );
};

export default CashView;
