import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper, ScrollContainer } from "src/containers";
import { Avatars } from "src/data/Avatars";
// Import components directly
import TopBar from 'src/components/TopBar';
import Header from 'src/components/Header';
import Divider from 'src/components/Divider';
import Cell from 'src/components/Cell';
import UpsellCard from 'src/components/UpsellCard';
import * as Icons from "src/data/Icons";
import Icon, { IconSize, IconColor } from 'src/components/Icon';
import styles from "./index.module.sass";

const ReceiptView = () => {

  const navigate = useNavigate();

  useEffect(()=>{
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
          size="profile"
          accessory={{
            type: "avatar",
            image: Avatars.Starbucks,
            size: "64"
          }}
        />

        <h1 className={styles.bigText}>{transaction.amount}</h1>
        
        <Divider size="betweenSectionExtraLarge" />

        <Header
          title='Details'
          size="section"
        />
        
        <Cell
          title="Date & Time"
          body={`${transaction.date} at ${transaction.time}`}
          left={{
            type: "icon",
            icon: Icons.Time24,
            size: "24" as IconSize,
            color: "standard" as IconColor
          }}
        />
        
        <Cell
          title="Location"
          body={transaction.location}
          left={{
            type: "icon",
            icon: Icons.Location16,
            size: "24" as IconSize,
            color: "standard" as IconColor
          }}
        />
        
        <Cell
          title="Payment Method"
          body={transaction.card}
          left={{
            type: "icon",
            icon: Icons.Card,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Cell
          title="Transaction ID"
          body={transaction.transactionId}
          left={{
            type: "icon",
            icon: Icons.Information16,
            size: ICON_24,
            color: ICON_STANDARD
          }}
        />
        
        <Divider size="betweenSectionExtraLargeCell" />

        <Header
          title='Actions'
          size="section"
        />

        <Divider size="withinSectionMedium" />
        
        <UpsellCard
          title="Need help with this transaction?"
          body="If you notice any issues with this transaction, you can contact the merchant or our support team for assistance."
        />

        <Divider size="withinSectionSmall" />

        <Cell
          title="Contact Merchant"
          left={{
            type: "icon",
            icon: Icons.Business24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: "push"
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="Contact Support"
          left={{
            type: "icon",
            icon: Icons.Help24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: "push"
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="Raise Dispute"
          left={{
            type: "icon",
            icon: Icons.Alert24,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: "push"
          }}
          onClick={() => {}}
        />
        
        <Cell
          title="View All Transactions"
          left={{
            type: "icon",
            icon: Icons.Activity,
            size: ICON_24,
            color: ICON_STANDARD
          }}
          right={{
            type: "push"
          }}
          onClick={() => {}}
        />
      </ScrollContainer>
      
    </PageWrapper>
  );
};

export default ReceiptView;
