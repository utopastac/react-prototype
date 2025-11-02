import React, { useState, useEffect } from "react";
import styles from "./index.module.sass";
import AppletHeader from "src/components/AppletHeader";
import * as Icons from "src/data/Icons";
import Icon, {ICON_16, ICON_SUCCESS, ICON_FAILURE} from "src/components/Icon";
import Applet from "src/components/Applet";
import Sparkline from "src/components/Sparkline";
import { useUser } from 'src/containers/UserContext';
import * as Utils from "src/helpers/Utils";

// Interface for Bitcoin price data
export interface BitcoinData {
  currentPrice: number;
  priceChange24h: number;
}

const BitcoinApplet: React.FC = () => {
  const userObject = useUser();
  const { bitcoinBalance } = userObject;

  // State for bitcoin price data
  const [bitcoinData, setBitcoinData] = useState<BitcoinData>({
    currentPrice: 10000,
    priceChange24h: 500
  });

  // Fetch bitcoin price data
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        setBitcoinData({
          currentPrice: data.bitcoin.usd,
          priceChange24h: data.bitcoin.usd_24h_change
        });
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        // Use fallback values if API fails
        setBitcoinData({
          currentPrice: 45000, // Fallback price
          priceChange24h: 0
        });
      }
    };

    fetchBitcoinPrice();
    // Refresh price every 5 minutes
    const interval = setInterval(fetchBitcoinPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  // Calculate USD value of user's bitcoin
  const bitcoinValue = (parseFloat(bitcoinBalance) * bitcoinData.currentPrice).toFixed(2);
  const priceChangePercent = parseFloat(bitcoinData.priceChange24h.toFixed(2));
  const isPriceUp = priceChangePercent > 0;

  return (
    <div className={styles.Main}>
      <Applet>
        <AppletHeader
          title="Bitcoin"
          label={`${bitcoinBalance} BTC`}
        />
        <div className={styles.balance}>
          <div>
            <h2>{`$${Utils.formatMoney(bitcoinValue)}`}</h2>
            <div className={styles.change}>
              <Icon 
                icon={isPriceUp ? Icons.TickerUp16 : Icons.TickerDown16} 
                size={ICON_16} 
                color={isPriceUp ? ICON_SUCCESS : ICON_FAILURE} 
              />
              <p><span className={isPriceUp ? '' : styles.priceDown}>{`${isPriceUp ? '+' : ''}${priceChangePercent}%`}</span> today</p>
            </div>
          </div>
          <Sparkline progress={0.5} />
        </div>
      </Applet>
    </div>
  );
};

export default BitcoinApplet;
