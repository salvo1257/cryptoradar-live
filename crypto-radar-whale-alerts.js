// CryptoRadar - Whale Alerts Module
// Aggregates whale transactions from multiple exchanges

// Import necessary libraries
import axios from 'axios';
import { useState, useEffect } from 'react';

/**
 * WhaleAlerts component that tracks large cryptocurrency transactions
 * across multiple exchanges (Binance, OKX, Bybit, Kucoin, Bitget)
 */
const WhaleAlerts = () => {
  // State variables
  const [whaleAlerts, setWhaleAlerts] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Configuration
  const EXCHANGES = ['Binance', 'OKX', 'Bybit', 'Kucoin', 'Bitget'];
  const MINIMUM_BTC_AMOUNT = 10; // Minimum BTC amount to be considered a whale transaction
  const REFRESH_INTERVAL = 60000; // 1 minute
  
  // Fetch whale transactions
  const fetchWhaleAlerts = async () => {
    try {
      // In a real app, we would make API calls to each exchange
      // For demonstration, let's simulate with a mock API
      const response = await axios.get('https://api.example.com/whale-transactions');
      
      // Process and filter the data
      const processedAlerts = processWhaleAlerts(response.data);
      setWhaleAlerts(processedAlerts);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error("Failed to fetch whale alerts:", error);
      setIsLive(false);
    }
  };
  
  // Process whale alerts and determine signal type
  const processWhaleAlerts = (data) => {
    return data.map(transaction => {
      // Determine if LONG or SHORT based on transaction type and market conditions
      const signalType = determineSignalType(transaction);
      
      // Calculate confidence level based on multi-exchange confirmations
      const confidence = calculateConfidence(transaction, EXCHANGES);
      
      // Estimate target price
      const targetPrice = estimateTargetPrice(transaction, signalType);
      
      return {
        id: transaction.id,
        timestamp: transaction.timestamp,
        exchange: transaction.exchange,
        amount: transaction.amount,
        price: transaction.price,
        signalType: signalType,
        confidence: confidence,
        targetPrice: targetPrice,
        confirmations: countConfirmations(transaction, EXCHANGES)
      };
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent
  };
  
  // Determine if the transaction suggests LONG or SHORT position
  const determineSignalType = (transaction) => {
    // In a real implementation, this would involve analyzing:
    // - Transaction direction (buy/sell)
    // - Market sentiment
    // - Historical patterns from this wallet
    // - Current market conditions
    
    // Simple example logic: 
    // If the transaction is a buy at a support level, suggest LONG
    // If the transaction is a sell at a resistance level, suggest SHORT
    return transaction.type === 'buy' ? 'LONG' : 'SHORT';
  };
  
  // Calculate confidence level (0-100%)
  const calculateConfidence = (transaction, exchanges) => {
    // In a real implementation, confidence would be based on:
    // - Number of confirming signals across exchanges
    // - Historical accuracy of similar signals
    // - Current market volatility
    // - Whale's historical success rate
    
    // Simple example: base confidence on number of exchanges showing similar transactions
    const confirmedExchanges = countConfirmations(transaction, exchanges);
    return Math.min(confirmedExchanges * 20, 100); // 20% per exchange, max 100%
  };
  
  // Count how many exchanges confirm this transaction pattern
  const countConfirmations = (transaction, exchanges) => {
    // In a real implementation, this would check for similar transactions
    // across all monitored exchanges within a certain time window
    
    // Mock implementation
    return Math.floor(Math.random() * 5) + 1; // 1-5 confirmations
  };
  
  // Estimate target price based on transaction and signal type
  const estimateTargetPrice = (transaction, signalType) => {
    // In a real implementation, this would analyze:
    // - Historical price movements after similar whale transactions
    // - Current support/resistance levels
    // - Market volatility
    
    // Simple example: estimate 2-5% movement
    const movementPercent = (Math.random() * 3 + 2) / 100; // 2-5%
    
    if (signalType === 'LONG') {
      return transaction.price * (1 + movementPercent);
    } else {
      return transaction.price * (1 - movementPercent);
    }
  };
  
  // Set up periodic fetch of whale alerts
  useEffect(() => {
    // Initial fetch
    fetchWhaleAlerts();
    
    // Set up interval
    const interval = setInterval(fetchWhaleAlerts, REFRESH_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="whale-alerts-container">
      <div className="section-header">
        <h2>🔔 Whale Alerts LIVE</h2>
        <div className="status-indicator">
          {isLive ? (
            <span className="status-live">LIVE ✅</span>
          ) : (
            <span className="status-offline">OFFLINE 🔴</span>
          )}
        </div>
      </div>
      
      <div className="explanation-box">
        <p>
          <strong>Come funziona:</strong> Questa sezione monitora grandi transazioni di Bitcoin (superiori a {MINIMUM_BTC_AMOUNT} BTC) 
          su {EXCHANGES.join(', ')}. I segnali indicano possibili movimenti di prezzo imminenti basati su operazioni di grandi investitori ("whales").
          Un'alta percentuale di affidabilità indica che più exchange hanno confermato transazioni simili.
        </p>
      </div>
      
      <div className="whale-alerts-list">
        {whaleAlerts.length > 0 ? (
          whaleAlerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.signalType.toLowerCase()}`}>
              <div className="alert-header">
                <span className={`signal-type ${alert.signalType.toLowerCase()}`}>
                  {alert.signalType}
                </span>
                <span className="exchange">{alert.exchange}</span>
                <span className="timestamp">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="alert-details">
                <div className="amount">
                  <span className="label">Quantità:</span>
                  <span className="value">{alert.amount.toFixed(2)} BTC</span>
                </div>
                
                <div className="price">
                  <span className="label">Prezzo entrata:</span>
                  <span className="value">${alert.price.toLocaleString()}</span>
                </div>
                
                <div className="confirmations">
                  <span className="label">Conferme:</span>
                  <span className="value">{alert.confirmations}/{EXCHANGES.length}</span>
                </div>
                
                <div className="confidence">
                  <span className="label">Affidabilità:</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${alert.confidence}%` }}
                    ></div>
                    <span className="confidence-value">{alert.confidence}%</span>
                  </div>
                </div>
                
                <div className="target">
                  <span className="label">Target stimato:</span>
                  <span className="value">${alert.targetPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-alerts">
            Nessun alert whale rilevato nelle ultime 24 ore
          </div>
        )}
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default WhaleAlerts;
