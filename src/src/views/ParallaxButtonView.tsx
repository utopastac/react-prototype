import React from 'react';
import { PageWrapper, ScrollContainer } from 'src/containers';
import ParallaxButton from 'src/components/ParallaxButton';
import styles from './ParallaxTest.module.sass';
import Icon, { ICON_24, ICON_WHITE } from 'src/components/Icon';
import * as Icons from "src/data/Icons";

const ParallaxButtonView = () => {
  return (
    <PageWrapper background>
      <ScrollContainer>
        <ParallaxButton text="Security">
          <div className={styles.Main}>
            <Icon icon={Icons.AccountVerified24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Activity} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Add24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Alert24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.AlertReportedFill24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Atm24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Avatar24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.BankAccount24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Bills24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Fast24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Block24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CardAdd24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CardDesign24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryMoving32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryBar32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryEnergy32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryFinance32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryGrocery32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryHomeAuto32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryOnline32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryPetStore32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryCafe32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Decimal24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.DeviceLaptop24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.DeviceMobile24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Family24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Fast24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Hash24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.IdPassport24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Image24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Limits24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Magic24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.NumberPad24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.OfficeExpense24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.PackageTracking24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.PasscodeFill24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Passkey24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.PayInFour16} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryBusinessServices32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryFitness32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.RecurringAutomatic16} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Refresh} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Savings24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.SavingsApy24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.SecurityAlertOutline24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.TeachingExpense24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Taxes24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.TapToPay32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Time24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.TickerUp16} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.TimeHourglass24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Time24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.TimeInfinite24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.Wallet24} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryShoes32} size={ICON_24} color={ICON_WHITE} />
            <Icon icon={Icons.CategoryShopping24} size={ICON_24} color={ICON_WHITE} />
          </div>
        </ParallaxButton>
      </ScrollContainer>
    </PageWrapper>
  );
};

export default ParallaxButtonView; 