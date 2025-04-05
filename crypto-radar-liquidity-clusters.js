// CryptoRadar - Liquidity Clusters Module
// Identifies and visualizes liquidity clusters based on exchange data

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * LiquidityClusters component that identifies areas where significant 
 * buy/sell orders are concentrated, indicating potential price reversal points
 */
const LiquidityClusters = () => {
  // State variables
  const [clusters, setClusters] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  
  // Available timeframes
  const timeframes = [
    { value: '24h', label: '24 ore' },
    { value: '3D', label: '3 giorni' },
    { value: '1W', label: '1 settimana' },
  ];
  
  // Fetch liquidity data
  const fetchLiquidityClusters = async () => {
    try {
      // In a real app, we would fetch data from Coinglass API or similar
      // For demonstration, we'll simulate with mock data
      const response = await axios.get(`https://api.example.com/liquidity-clusters?timeframe=${selectedTimeframe}`);
      
      // Process the data and update state
      const processedClusters = processClusterData(response.data, selectedTimeframe);
      setClusters(processedClusters);
      setCurrentPrice(response.data.currentPrice || 65000);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error("Failed to fetch liquidity clusters:", error);
      setIsLive(false);
    }
  };
  
  // Process cluster data and calculate strengths
  const processClusterData = (data, timeframe) => {
    // In a real implementation, this would analyze raw order book data
    // to identify price levels with high concentration of orders
    
    // Mock implementation - create sample clusters for demonstration
    const currentPrice = data.currentPrice || 65000;
    
    // Generate more clusters for longer timeframes
    let numClusters;
    switch (timeframe) {
      case '24h': numClusters = 6; break;
      case '3D': numClusters = 8; break;
      case '1W': numClusters = 10; break;
      default: numClusters = 6;
    }
    
    // Calculate cluster price points (some above, some below current price)
    const clustersPricePoints = [];
    for (let i = 0; i < numClusters; i++) {
      // Distribute clusters above and below current price
      const deviation = (Math.random() * 0.15 + 0.01) * currentPrice;
      const price = i % 2 === 0 
        ? currentPrice + deviation 
        : currentPrice - deviation;
      
      clustersPricePoints.push(price);
    }
    
    // Sort clusters by price (ascending)
    clustersPricePoints.sort((a, b) => a - b);
    
    // Create cluster objects with strength, type, and distance
    return clustersPricePoints.map(price => {
      // Higher strength for clusters near round numbers
      const isRoundNumber = Math.round(price / 1000) * 1000 === Math.round(price);
      const isPsychologicalLevel = isRoundNumber || Math.round(price / 500) * 500 === Math.round(price);
      
      // Generate strength based on timeframe and psychological levels
      let baseStrength;
      switch (timeframe) {
        case '24h': baseStrength = Math.random() * 40 + 20; break; // 20-60%
        case '3D': baseStrength = Math.random() * 50 + 30; break;  // 30-80%
        case '1W': baseStrength = Math.random() * 60 + 40; break;  // 40-100%
        default: baseStrength = Math.random() * 40 + 20;
      }
      
      // Boost strength for psychological levels
      const strength = isPsychologicalLevel 
        ? Math.min(baseStrength * 1.5, 100) 
        : baseStrength;
      
      // Calculate distance from current price
      const distance = ((price - currentPrice) / currentPrice) * 100;
      
      // Determine cluster type (buy = support, sell = resistance)
      const type = price < currentPrice ? 'support' : 'resistance';
      
      return {
        price,
        strength: Math.round(strength),
        type,
        distance: distance.toFixed(2),
        isPsychologicalLevel
      };
    });
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };
  
  // Set up initial fetch and periodic updates
  useEffect(() => {
    fetchLiquidityClusters();
    
    // Update every 5 minutes
    const interval = setInterval(fetchLiquidityClusters, 300000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [selectedTimeframe]);
  
  // Separate clusters into support and resistance
  const supportClusters = clusters.filter(cluster => cluster.type === 'support')
    .sort((a, b) => parseFloat(b.strength) - parseFloat(a.strength));
  
  const resistanceClusters = clusters.filter(cluster => cluster.type === 'resistance')
    .sort((a, b) => parseFloat(b.strength) - parseFloat(a.strength));
  
  return (
    <div className="liquidity-clusters-container">
      <div className="section-header">
        <h2>🧠 Cluster di Liquidità</h2>
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
          <strong>Come funziona:</strong> Questa sezione identifica le zone di liquidità, aree dove 
          sono concentrati ordini di acquisto (supporti) o vendita (resistenze). Più alta è la forza 
          del cluster, maggiore è la probabilità che il prezzo reagisca a quel livello. I cluster 
          si aggiornano in base al timeframe selezionato.
        </p>
      </div>
      
      <div className="timeframe-selector">
        <label>Timeframe: </label>
        <select 
          value={selectedTimeframe} 
          onChange={handleTimeframeChange}
          className="timeframe-select"
        >
          {timeframes.map(tf => (
            <option key={tf.value} value={tf.value}>{tf.label}</option>
          ))}
        </select>
      </div>
      
      {currentPrice && (
        <div className="current-price">
          Prezzo attuale BTC: <span className="price-value">${currentPrice.toLocaleString()}</span>
        </div>
      )}
      
      <div className="clusters-visualization">
        {/* Visual representation of clusters */}
        <div className="price-scale">
          {clusters.map((cluster, index) => {
            // Calculate position on scale based on price
            const positionPercent = cluster.type === 'resistance' 
              ? 50 - Math.min(Math.abs(parseFloat(cluster.distance)), 20) * 2.5
              : 50 + Math.min(Math.abs(parseFloat(cluster.distance)), 20) * 2.5;
            
            return (
              <div 
                key={index}
                className={`cluster-marker ${cluster.type}`}
                style={{ 
                  top: `${positionPercent}%`,
                  opacity: cluster.strength / 100,
                  width: `${Math.max(30, cluster.strength)}%`
                }}
                title={`${cluster.type === 'support' ? 'Supporto' : 'Resistenza'} a $${cluster.price.toLocaleString()} (Forza: ${cluster.strength}%)`}
              >
                <span className="cluster-price">${cluster.price.toLocaleString()}</span>
                <div className="cluster-strength-bar">
                  <div 
                    className="cluster-strength-fill" 
                    style={{ width: `${cluster.strength}%` }}
                  ></div>
                  <span className="cluster-strength-label">{cluster.strength}%</span>
                </div>
              </div>
            );
          })}
          
          {/* Current price indicator */}
          {currentPrice && (
            <div className="current-price-line">
              <span className="current-price-label">${currentPrice.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="clusters-tables">
        <div className="resistance-clusters">
          <h3>Resistenze</h3>
          <table>
            <thead>
              <tr>
                <th>Prezzo</th>
                <th>Forza</th>
                <th>Distanza</th>
              </tr>
            </thead>
            <tbody>
              {resistanceClusters.slice(0, 3).map((cluster, index) => (
                <tr key={index}>
                  <td>${cluster.price.toLocaleString()}</td>
                  <td>
                    <div className="strength-indicator">
                      <div 
                        className="strength-bar" 
                        style={{ width: `${cluster.strength}%` }}
                      ></div>
                      <span>{cluster.strength}%</span>
                    </div>
                  </td>
                  <td>{cluster.distance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="support-clusters">
          <h3>Supporti</h3>
          <table>
            <thead>
              <tr>
                <th>Prezzo</th>
                <th>Forza</th>
                <th>Distanza</th>
              </tr>
            </thead>
            <tbody>
              {supportClusters.slice(0, 3).map((cluster, index) => (
                <tr key={index}>
                  <td>${cluster.price.toLocaleString()}</td>
                  <td>
                    <div className="strength-indicator">
                      <div 
                        className="strength-bar" 
                        style={{ width: `${cluster.strength}%` }}
                      ></div>
                      <span>{cluster.strength}%</span>
                    </div>
                  </td>
                  <td>{cluster.distance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default LiquidityClusters;
