// CryptoRadar - Support & Resistance Module
// Automatically detects key support and resistance levels

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * SupportResistance component that automatically detects and displays
 * key support and resistance levels from 4H and 1D timeframes
 */
const SupportResistance = () => {
  // State variables
  const [levels, setLevels] = useState({
    supports: [],
    resistances: []
  });
  const [isLive, setIsLive] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('4H');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  
  // Available timeframes
  const timeframes = [
    { value: '4H', label: '4 ore' },
    { value: '1D', label: '1 giorno' },
  ];
  
  // Fetch support and resistance data
  const fetchSupportResistanceLevels = async () => {
    try {
      // In a real app, we would analyze price data to detect levels
      // For demonstration, we'll simulate with mock data
      const response = await axios.get(`https://api.example.com/support-resistance?timeframe=${selectedTimeframe}`);
      
      // Process the data
      const processedLevels = processLevelsData(response.data);
      setLevels(processedLevels);
      setCurrentPrice(response.data.currentPrice || 65000);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error("Failed to fetch support and resistance levels:", error);
      setIsLive(false);
    }
  };
  
  // Process levels data and calculate reliability
  const processLevelsData = (data) => {
    // In a real implementation, this would:
    // 1. Analyze price history to identify significant pivot points
    // 2. Cluster nearby levels
    // 3. Rank levels by number of touches, volume at level, etc.
    
    const currentPrice = data.currentPrice || 65000;
    
    // Generate mock support levels (below current price)
    const supports = [];
    for (let i = 0; i < 4; i++) { // Generate 4, will select top 2 later
      const deviation = (Math.random() * 0.12 + 0.02) * currentPrice;
      const price = currentPrice - deviation;
      
      // Calculate reliability based on various factors
      const reliability = calculateReliability(price, currentPrice, 'support');
      
      // Calculate distance from current price
      const distance = ((currentPrice - price) / currentPrice) * 100;
      
      // Determine if this level might be a trap/fakeout
      const isTrap = Math.random() > 0.7; // 30% chance of being a trap
      
      supports.push({
        price,
        reliability,
        distance: distance.toFixed(2),
        timesTested: Math.floor(Math.random() * 5) + 1, // 1-5 tests
        isTrap,
        trapReason: isTrap ? generateTrapReason('support') : null
      });
    }
    
    // Generate mock resistance levels (above current price)
    const resistances = [];
    for (let i = 0; i < 4; i++) { // Generate 4, will select top 2 later
      const deviation = (Math.random() * 0.12 + 0.02) * currentPrice;
      const price = currentPrice + deviation;
      
      // Calculate reliability based on various factors
      const reliability = calculateReliability(price, currentPrice, 'resistance');
      
      // Calculate distance from current price
      const distance = ((price - currentPrice) / currentPrice) * 100;
      
      // Determine if this level might be a trap/fakeout
      const isTrap = Math.random() > 0.7; // 30% chance of being a trap
      
      resistances.push({
        price,
        reliability,
        distance: distance.toFixed(2),
        timesTested: Math.floor(Math.random() * 5) + 1, // 1-5 tests
        isTrap,
        trapReason: isTrap ? generateTrapReason('resistance') : null
      });
    }
    
    // Sort by reliability and take top 2 for each
    const sortedSupports = supports.sort((a, b) => b.reliability - a.reliability).slice(0, 2);
    const sortedResistances = resistances.sort((a, b) => b.reliability - a.reliability).slice(0, 2);
    
    return {
      supports: sortedSupports,
      resistances: sortedResistances
    };
  };
  
  // Calculate level reliability
  const calculateReliability = (levelPrice, currentPrice, type) => {
    // In a real implementation, this would be based on:
    // - Number of times the level was tested
    // - Volume at the level
    // - Time since last test
    // - Proximity to round numbers
    
    // Mock implementation - more reliable if near round numbers
    const isRoundNumber = Math.round(levelPrice / 1000) * 1000 === Math.round(levelPrice);
    const isPsychologicalLevel = isRoundNumber || Math.round(levelPrice / 500) * 500 === Math.round(levelPrice);
    
    let baseReliability = Math.random() * 50 + 30; // 30-80%
    
    // Boost for psychological levels
    if (isPsychologicalLevel) {
      baseReliability = Math.min(baseReliability * 1.25, 100);
    }
    
    return Math.round(baseReliability);
  };
  
  // Generate reason for potential trap/fakeout
  const generateTrapReason = (type) => {
    const reasons = {
      support: [
        "Volume in calo durante i test",
        "Livello testato troppe volte in poco tempo",
        "Presenza di un gap di prezzo appena sotto",
        "Pattern di divergenza con RSI"
      ],
      resistance: [
        "Basso volume durante i rimbalzi",
        "Formazione di pinbar al test",
        "Livello non testato da lungo tempo",
        "Divergenza nascosta con oscillatori"
      ]
    };
    
    return reasons[type][Math.floor(Math.random() * reasons[type].length)];
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };
  
  // Set up initial fetch and periodic updates
  useEffect(() => {
    fetchSupportResistanceLevels();
    
    // Update every 15 minutes
    const interval = setInterval(fetchSupportResistanceLevels, 900000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [selectedTimeframe]);
  
  return (
    <div className="support-resistance-container">
      <div className="section-header">
        <h2>📊 Supporti e Resistenze</h2>
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
          <strong>Come funziona:</strong> Questa sezione identifica automaticamente i livelli di supporto e resistenza 
          più significativi dal grafico BTC/USDT. Vengono mostrati solo i 2 livelli più affidabili per 
          categoria. L'affidabilità è calcolata in base al numero di test, al volume, e altri fattori tecnici. 
          I livelli sono identificati come possibili trappole quando presentano caratteristiche specifiche.
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
      
      <div className="levels-visualization">
        {/* Visual representation of price levels */}
        <div className="price-scale">
          {levels.resistances.map((level, index) => {
            // Calculate position on scale based on distance from current price
            const positionPercent = 50 - Math.min(parseFloat(level.distance), 15) * 3;
            
            return (
              <div 
                key={`resistance-${index}`}
                className={`level-marker resistance ${level.isTrap ? 'trap' : ''}`}
                style={{ 
                  top: `${positionPercent}%`,
                  opacity: level.reliability / 100,
                  width: `${Math.max(30, level.reliability)}%`
                }}
              >
                <span className="level-price">${level.price.toLocaleString()}</span>
                <div className="level-reliability-bar">
                  <div 
                    className="level-reliability-fill" 
                    style={{ width: `${level.reliability}%` }}
                  ></div>
                  <span className="level-reliability-label">{level.reliability}%</span>
                </div>
                {level.isTrap && (
                  <div className="trap-indicator">⚠️ Possibile trappola</div>
                )}
              </div>
            );
          })}
          
          {/* Current price indicator */}
          {currentPrice && (
            <div className="current-price-line">
              <span className="current-price-label">${currentPrice.toLocaleString()}</span>
            </div>
          )}
          
          {levels.supports.map((level, index) => {
            // Calculate position on scale based on distance from current price
            const positionPercent = 50 + Math.min(parseFloat(level.distance), 15) * 3;
            
            return (
              <div 
                key={`support-${index}`}
                className={`level-marker support ${level.isTrap ? 'trap' : ''}`}
                style={{ 
                  top: `${positionPercent}%`,
                  opacity: level.reliability / 100,
                  width: `${Math.max(30, level.reliability)}%`
                }}
              >
                <span className="level-price">${level.price.toLocaleString()}</span>
                <div className="level-reliability-bar">
                  <div 
                    className="level-reliability-fill" 
                    style={{ width: `${level.reliability}%` }}
                  ></div>
                  <span className="level-reliability-label">{level.reliability}%</span>
                </div>
                {level.isTrap && (
                  <div className="trap-indicator">⚠️ Possibile trappola</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="levels-tables">
        <div className="resistances-table">
          <h3>Resistenze</h3>
          <table>
            <thead>
              <tr>
                <th>Prezzo</th>
                <th>Affidabilità</th>
                <th>Distanza</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {levels.resistances.map((level, index) => (
                <tr key={index} className={level.isTrap ? 'trap-row' : ''}>
                  <td>${level.price.toLocaleString()}</td>
                  <td>
                    <div className="reliability-indicator">
                      <div 
                        className="reliability-bar" 
                        style={{ width: `${level.reliability}%` }}
                      ></div>
                      <span>{level.reliability}%</span>
                    </div>
                  </td>
                  <td>+{level.distance}%</td>
                  <td>
                    {level.isTrap && (
                      <div className="trap-warning">
                        ⚠️ <span className="trap-reason">{level.trapReason}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="supports-table">
          <h3>Supporti</h3>
          <table>
            <thead>
              <tr>
                <th>Prezzo</th>
                <th>Affidabilità</th>
                <th>Distanza</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {levels.supports.map((level, index) => (
                <tr key={index} className={level.isTrap ? 'trap-row' : ''}>
                  <td>${level.price.toLocaleString()}</td>
                  <td>
                    <div className="reliability-indicator">
                      <div 
                        className="reliability-bar" 
                        style={{ width: `${level.reliability}%` }}
                      ></div>
                      <span>{level.reliability}%</span>
                    </div>
                  </td>
                  <td>-{level.distance}%</td>
                  <td>
                    {level.isTrap && (
                      <div className="trap-warning">
                        ⚠️ <span className="trap-reason">{level.trapReason}</span>
                      </div>
                    )}
                  </td>
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

export default SupportResistance;
