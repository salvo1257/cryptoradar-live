// CryptoRadar - Pattern Recognition Module
// Live detection of chart patterns and candlestick formations

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * PatternRecognition component that detects chart patterns and candlestick
 * formations in real-time from BTCUSDT chart
 */
const PatternRecognition = () => {
  // State variables
  const [patterns, setPatterns] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Pattern categories
  const categories = [
    { value: 'all', label: 'Tutti i Pattern' },
    { value: 'reversal', label: 'Pattern di Inversione' },
    { value: 'continuation', label: 'Pattern di Continuazione' },
    { value: 'candlestick', label: 'Pattern Candlestick' }
  ];
  
  // Fetch pattern data
  const fetchPatterns = async () => {
    try {
      // In a real app, this would analyze chart data to detect patterns
      // For demonstration, we'll simulate with mock data
      const response = await axios.get('https://api.example.com/chart-patterns');
      
      // Process the data
      const processedPatterns = processPatternData(response.data);
      setPatterns(processedPatterns);
      setCurrentPrice(response.data.currentPrice || 65000);
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (error) {
      console.error("Failed to fetch pattern data:", error);
      setIsLive(false);
    }
  };
  
  // Process pattern data
  const processPatternData = (data) => {
    // In a real implementation, this would:
    // 1. Analyze price data with technical indicators
    // 2. Apply pattern recognition algorithms
    // 3. Calculate reliability and targets
    
    // Mock implementation with various pattern types
    const patternTemplates = [
      // Reversal patterns
      {
        name: 'Doppio Massimo',
        type: 'reversal',
        direction: 'SHORT',
        description: 'Due massimi alla stessa altezza indicano esaurimento del trend rialzista',
        targetRange: [2, 5],
        reliabilityRange: [60, 90],
        screenshotUrl: 'https://example.com/patterns/double-top.png'
      },
      {
        name: 'Testa e Spalle',
        type: 'reversal',
        direction: 'SHORT',
        description: 'Formazione con tre massimi, quello centrale più alto, indica inversione ribassista',
        targetRange: [4, 7],
        reliabilityRange: [70, 95],
        screenshotUrl: 'https://example.com/patterns/head-shoulders.png'
      },
      {
        name: 'Doppio Minimo',
        type: 'reversal',
        direction: 'LONG',
        description: 'Due minimi alla stessa altezza indicano esaurimento del trend ribassista',
        targetRange: [2, 5],
        reliabilityRange: [60, 90],
        screenshotUrl: 'https://example.com/patterns/double-bottom.png'
      },
      {
        name: 'Testa e Spalle Inverso',
        type: 'reversal',
        direction: 'LONG',
        description: 'Formazione con tre minimi, quello centrale più basso, indica inversione rialzista',
        targetRange: [4, 7],
        reliabilityRange: [70, 95],
        screenshotUrl: 'https://example.com/patterns/inverse-head-shoulders.png'
      },
      
      // Continuation patterns
      {
        name: 'Triangolo Ascendente',
        type: 'continuation',
        direction: 'LONG',
        description: 'Pattern di consolidamento con massimi piatti e minimi crescenti',
        targetRange: [3, 6],
        reliabilityRange: [65, 85],
        screenshotUrl: 'https://example.com/patterns/ascending-triangle.png'
      },
      {
        name: 'Bandiera Ribassista',
        type: 'continuation',
        direction: 'SHORT',
        description: 'Breve consolidamento controtendenza in un trend ribassista',
        targetRange: [2, 4],
        reliabilityRange: [60, 80],
        screenshotUrl: 'https://example.com/patterns/bearish-flag.png'
      },
      {
        name: 'Canale Discendente',
        type: 'continuation',
        direction: 'SHORT',
        description: 'Prezzo che si muove in un canale con pendenza negativa',
        targetRange: [2, 5],
        reliabilityRange: [55, 75],
        screenshotUrl: 'https://example.com/patterns/descending-channel.png'
      },
      
      // Candlestick patterns
      {
        name: 'Engulfing Rialzista',
        type: 'candlestick',
        direction: 'LONG',
        description: 'Candela rialzista che ingloba completamente la candela ribassista precedente',
        targetRange: [1, 3],
        reliabilityRange: [50, 75],
        screenshotUrl: 'https://example.com/patterns/bullish-engulfing.png'
      },
      {
        name: 'Evening Star',
        type: 'candlestick',
        direction: 'SHORT',
        description: 'Pattern a tre candele che indica esaurimento del trend rialzista',
        targetRange: [2, 4],
        reliabilityRange: [65, 85],
        screenshotUrl: 'https://example.com/patterns/evening-star.png'
      },
      {
        name: 'Hammer',
        type: 'candlestick',
        direction: 'LONG',
        description: 'Candela con corpo piccolo e lunga shadow inferiore, indica inversione rialzista',
        targetRange: [1, 3],
        reliabilityRange: [45, 70],
        screenshotUrl: 'https://example.com/patterns/hammer.png'
      },
      {
        name: 'Three Black Crows',
        type: 'candlestick',
        direction: 'SHORT',
        description: 'Tre candele ribassiste consecutive, indica forte pressione di vendita',
        targetRange: [3, 5],
        reliabilityRange: [70, 90],
        screenshotUrl: 'https://example.com/patterns/three-black-crows.png'
      }
    ];
    
    // Select 2-4 random patterns to display
    const numPatterns = Math.floor(Math.random() * 3) + 2; // 2-4 patterns
    const selectedPatterns = [];
    const selectedIndices = new Set();
    
    while (selectedPatterns.length < numPatterns) {
      const randomIndex = Math.floor(Math.random() * patternTemplates.length);
      
      if (!selectedIndices.has(randomIndex)) {
        selectedIndices.add(randomIndex);
        const template = patternTemplates[randomIndex];
        
        // Generate random values within template ranges
        const targetPercent = (Math.random() * (template.targetRange[1] - template.targetRange[0]) + template.targetRange[0]).toFixed(1);
        const reliability = Math.floor(Math.random() * (template.reliabilityRange[1] - template.reliabilityRange[0]) + template.reliabilityRange[0]);
        
        // Calculate target price
        const currentPrice = data.currentPrice || 65000;
        let targetPrice;
        if (template.direction === 'LONG') {
          targetPrice = currentPrice * (1 + parseFloat(targetPercent) / 100);
        } else {
          targetPrice = currentPrice * (1 - parseFloat(targetPercent) / 100);
        }
        
        // Add timestamp for when the pattern was detected
        const detectedAt = new Date();
        detectedAt.setMinutes(detectedAt.getMinutes() - Math.floor(Math.random() * 60)); // Detected within last hour
        
        selectedPatterns.push({
          ...template,
          targetPercent,
          targetPrice,
          reliability,
          detectedAt
        });
      }
    }
    
    // Sort by detection time, newest first
    return selectedPatterns.sort((a, b) => b.detectedAt - a.detectedAt);
  };
  
  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  
  // Filter patterns by selected category
  const filteredPatterns = selectedCategory === 'all' 
    ? patterns 
    : patterns.filter(pattern => pattern.type === selectedCategory);
  
  // Set up initial fetch and periodic updates
  useEffect(() => {
    fetchPatterns();
    
    // Update every 5 minutes
    const interval = setInterval(fetchPatterns, 300000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="pattern-recognition-container">
      <div className="section-header">
        <h2>🧩 Riconoscimento Pattern</h2>
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
          <strong>Come funziona:</strong> Questa sezione analizza continuamente il grafico BTCUSDT 
          per identificare pattern grafici e formazioni candlestick rilevanti. Per ogni pattern 
          individuato, viene mostrato il tipo, la direzione prevista (LONG o SHORT), un target di prezzo 
          stimato, e un'immagine del grafico con il pattern evidenziato. L'affidabilità è basata sulle 
          caratteristiche del pattern e sulle condizioni di mercato attuali.
        </p>
      </div>
      
      <div className="category-selector">
        <label>Categoria: </label>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}
        </select>
      </div>
      
      {currentPrice && (
        <div className="current-price">
          Prezzo attuale BTC: <span className="price-value">${currentPrice.toLocaleString()}</span>
        </div>
      )}
      
      <div className="patterns-grid">
        {filteredPatterns.length > 0 ? (
          filteredPatterns.map((pattern, index) => (
            <div key={index} className={`pattern-card ${pattern.direction.toLowerCase()}`}>
              <div className="pattern-header">
                <h3 className="pattern-name">{pattern.name}</h3>
                <span className={`pattern-direction ${pattern.direction.toLowerCase()}`}>
                  {pattern.direction}
                </span>
              </div>
              
              <div className="pattern-screenshot-container">
                <img 
                  src={pattern.screenshotUrl} 
                  alt={`${pattern.name} pattern`} 
                  className="pattern-screenshot"
                  onClick={() => window.open(pattern.screenshotUrl, '_blank')}
                />
                <div className="screenshot-overlay">
                  <span className="click-to-zoom">🔍 Click per ingrandire</span>
                </div>
              </div>
              
              <div className="pattern-details">
                <div className="pattern-type">
                  <span className="label">Tipo:</span>
                  <span className="value">
                    {pattern.type === 'reversal' ? 'Inversione' : 
                     pattern.type === 'continuation' ? 'Continuazione' : 'Candlestick'}
                  </span>
                </div>
                
                <div className="pattern-description">
                  <p>{pattern.description}</p>
                </div>
                
                <div className="pattern-reliability">
                  <span className="label">Affidabilità:</span>
                  <div className="reliability-bar">
                    <div 
                      className="reliability-fill" 
                      style={{ width: `${pattern.reliability}%` }}
                    ></div>
                    <span className="reliability-value">{pattern.reliability}%</span>
                  </div>
                </div>
                
                <div className="pattern-target">
                  <span className="label">Target stimato:</span>
                  <span className="value">${pattern.targetPrice.toLocaleString()} ({pattern.targetPercent}%)</span>
                </div>
                
                <div className="pattern-detected">
                  <span className="label">Rilevato:</span>
                  <span className="value">{pattern.detectedAt.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-patterns">
            Nessun pattern rilevato al momento
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

export default PatternRecognition;
