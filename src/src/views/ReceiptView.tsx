import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
import { AVATAR_64 } from "src/components/Avatar";
import { useTabBackgroundDispatch, WHITE } from 'src/containers/TabBackgroundContext';
// Import components directly
import TopBar from 'src/components/TopBar';
import Header, { HEADER_PAGE, HEADER_ICON, HEADER_AVATAR, HEADER_SECTION, HEADER_PROFILE } from 'src/components/Header';
import Divider, { 
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL, 
  DIVIDER_BETWEEN_SECTION_EXTRA_LARGE,
  DIVIDER_WITHIN_SECTION_MEDIUM,
  DIVIDER_BETWEEN_SECTION_LARGE,
  DIVIDER_WITHIN_SECTION_SMALL
} from 'src/components/Divider';
import Cell, { CELL_ICON, CELL_PUSH } from 'src/components/Cell';
import UpsellCard from 'src/components/UpsellCard';
import * as Icons from "src/data/Icons";
import Icon, { ICON_24, ICON_STANDARD } from 'src/components/Icon';
import styles from "./index.module.sass";

const ReceiptView = () => {

  const tabBackgroundDispatch = useTabBackgroundDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    tabBackgroundDispatch({
      type: WHITE
    });
  }, []);

  // Dummy transaction data
  const transaction = {
    merchant: "Starbucks",
    amount: "$4.50",
    date: "March 15, 2024",
    time: "2:30 PM",
    location: "123 Main St, San Francisco, CA",
    card: "Interventions Hub Card",
    status: "Completed",
    transactionId: "TX123456789"
  };

  return (
    <PageWrapper background>
      <TopBar
        left={{
          onClick: () => navigate(-1),
        }}
        isBackNavigation
        title="Transaction Details"
        right={{}}
      />
      <ScrollContainer>
        <Header
          title={transaction.merchant}
          body={`${transaction.date} at ${transaction.time}`}
          size={HEADER_PROFILE}
          accessory={{
            type: HEADER_AVATAR,
            image: Avatars.Starbucks,
            size: AVATAR_64
          }}
        />

        <h1 className={styles.bigText}>{transaction.amount}</h1>
        
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE} />

        <Header
          title='Details'
          size={HEADER_SECTION}
        />
        
        <Cell
          title="Date & Time"
          body={`${transaction.date} at ${transaction.time}`}
          left={{
            type: CELL_ICON,
            icon: Icons.Time24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Cell
          title="Location"
          body={transaction.location}
          left={{
            type: CELL_ICON,
            icon: Icons.Location16,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Cell
          title="Payment Method"
          body={transaction.card}
          left={{
            type: CELL_ICON,
            icon: Icons.Card,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Cell
          title="Transaction ID"
          body={transaction.transactionId}
          left={{
            type: CELL_ICON,
            icon: Icons.Information16,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Divider size={DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL} />

        <Header
          title='Actions'
          size={HEADER_SECTION}
        />

        <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
        
        <UpsellCard
          title="Need help with this transaction?"
          body="If you notice any issues with this transaction, you can contact the merchant or our support team for assistance."
        />

        <Divider size={DIVIDER_WITHIN_SECTION_SMALL} />

        <Cell
          title="Contact Merchant"
          left={{
            type: CELL_ICON,
            icon: Icons.Business24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="Contact Support"
          left={{
            type: CELL_ICON,
            icon: Icons.Help24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="Raise Dispute"
          left={{
            type: CELL_ICON,
            icon: Icons.Alert24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="View All Transactions"
          left={{
            type: CELL_ICON,
            icon: Icons.Activity,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={() => {}}
        />
      </ScrollContainer>
      
    </PageWrapper>
  );
};

export default ReceiptView;
