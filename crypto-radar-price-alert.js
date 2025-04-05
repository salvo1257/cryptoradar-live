// CryptoRadar - Price Alert Module
// Manual alert system for Bitcoin price levels

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * PriceAlert component allows setting manual alerts for Bitcoin price levels
 * with loud audio notifications
 */
const PriceAlert = () => {
  // State variables
  const [alerts, setAlerts] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [alertSound, setAlertSound] = useState('alarm1');
  const [testingSound, setTestingSound] = useState(false);
  
  // Available alert sounds
  const alertSounds = [
    { value: 'alarm1', label: 'Allarme Forte' },
    { value: 'alarm2', label: 'Sirena' },
    { value: 'alarm3', label: 'Campana Trading' },
    { value: 'alarm4', label: 'Notification' }
  ];
  
  // Create refs for audio elements
  const audioElements = {
    alarm1: useRef(null),
    alarm2: useRef(null),
    alarm3: useRef(null),
    alarm4: useRef(null)
  };
  
  // Fetch current BTC price
  const fetchCurrentPrice = async () => {
    try {
      // In a real app, fetch from a crypto price API
      const response = await axios.get('https://api.example.com/bitcoin-price');
      
      // Update state with current price
      setCurrentPrice(response.data.price || 65000);
      setLastUpdated(new Date());
      setIsLive(true);
      
      // Check if any alerts should be triggered
      checkAlerts(response.data.price || 65000);
    } catch (error) {
      console.error("Failed to fetch Bitcoin price:", error);
      setIsLive(false);
    }
  };
  
  // Check if any alerts should be triggered
  const checkAlerts = (price) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        // Alert not yet triggered and condition is met
        if (!alert.triggered) {
          let shouldTrigger = false;
          
          if (alert.type === 'above' && price >= alert.price) {
            shouldTrigger = true;
          } else if (alert.type === 'below' && price <= alert.price) {
            shouldTrigger = true;
          }
          
          if (shouldTrigger) {
            // Play alert sound
            if (audioElements[alert.sound].current) {
              audioElements[alert.sound].current.volume = 1.0; // Full volume
              audioElements[alert.sound].current.play();
            }
            
            // Return triggered alert
            return { ...alert, triggered: true, triggeredAt: new Date() };
          }
        }
        
        return alert;
      })
    );
  };
  
  // Handle adding a new alert
  const handleAddAlert = (e) => {
    e.preventDefault();
    
    const priceValue = parseFloat(alertPrice);
    
    // Validate price
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Per favore inserisci un prezzo valido');
      return;
    }
    
    // Create new alert
    const newAlert = {
      id: Date.now(),
      price: priceValue,
      type: alertType,
      sound: alertSound,
      created: new Date(),
      triggered: false
    };
    
    // Add to alerts list
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
    
    // Reset form
    setAlertPrice('');
  };
  
  // Handle deleting an alert
  const handleDeleteAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };
  
  // Handle testing a sound
  const handleTestSound = (sound) => {
    setTestingSound(true);
    
    if (audioElements[sound].current) {
      audioElements[sound].current.volume = 1.0;
      audioElements[sound].current.play();
      
      // Reset testing state after sound finishes
      audioElements[sound].current.onended = () => {
        setTestingSound(false);
      };
    }
  };
  
  // Format price with thousand separators
  const formatPrice = (price) => {
    return price.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Set up initial fetch and periodic updates
  useEffect(() => {
    fetchCurrentPrice();
    
    // Update every 30 seconds
    const interval = setInterval(fetchCurrentPrice, 30000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="price-alert-container">
      <div className="section-header">
        <h2>🛎️ Alert Sonoro</h2>
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
          <strong>Come funziona:</strong> Imposta un alert personalizzato su un livello di prezzo specifico. 
          Quando il prezzo raggiunge il livello impostato, verrà riprodotto un suono ad alto volume anche se hai altre schede 
          aperte. Gli alert già attivati vengono mantenuti nella lista con timestamp di attivazione.
        </p>
      </div>
      
      {currentPrice && (
        <div className="current-price">
          Prezzo attuale BTC: <span className="price-value">${formatPrice(currentPrice)}</span>
        </div>
      )}
      
      <div className="alert-form">
        <form onSubmit={handleAddAlert}>
          <div className="form-group">
            <label htmlFor="alertPrice">Prezzo ($):</label>
            <input
              type="number"
              id="alertPrice"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              placeholder="es. 65000"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="alertType">Condizione:</label>
            <select
              id="alertType"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="above">Quando il prezzo sale sopra</option>
              <option value="below">Quando il prezzo scende sotto</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="alertSound">Suono:</label>
            <select
              id="alertSound"
              value={alertSound}
              onChange={(e) => setAlertSound(e.target.value)}
            >
              {alertSounds.map(sound => (
                <option key={sound.value} value={sound.value}>{sound.label}</option>
              ))}
            </select>
            <button
              type="button"
              className="test-sound-btn"
              onClick={() => handleTestSound(alertSound)}
              disabled={testingSound}
            >
              {testingSound ? 'Riproducendo...' : 'Test 🔊'}
            </button>
          </div>
          
          <button type="submit" className="add-alert-btn">
            Aggiungi Alert
          </button>
        </form>
      </div>
      
      <div className="alerts-list">
        <h3>I tuoi Alert ({alerts.length})</h3>
        
        {alerts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Prezzo</th>
                <th>Condizione</th>
                <th>Suono</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => {
                const soundLabel = alertSounds.find(s => s.value === alert.sound)?.label;
                
                return (
                  <tr key={alert.id} className={alert.triggered ? 'triggered-alert' : ''}>
                    <td>${formatPrice(alert.price)}</td>
                    <td>
                      {alert.type === 'above' ? 'Sopra' : 'Sotto'}
                    </td>
                    <td>{soundLabel}</td>
                    <td>
                      {alert.triggered ? (
                        <span className="alert-triggered">
                          Attivato alle {alert.triggeredAt.toLocaleTimeString()}
                        </span>
                      ) : (
                        <span className="alert-pending">In attesa</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="delete-alert-btn"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-alerts">
            Nessun alert impostato
          </div>
        )}
      </div>
      
      {/* Hidden audio elements */}
      <audio ref={audioElements.alarm1} src="/sounds/alarm1.mp3" preload="auto"></audio>
      <audio ref={audioElements.alarm2} src="/sounds/alarm2.mp3" preload="auto"></audio>
      <audio ref={audioElements.alarm3} src="/sounds/alarm3.mp3" preload="auto"></audio>
      <audio ref={audioElements.alarm4} src="/sounds/notification.mp3" preload="auto"></audio>
      
      {lastUpdated && (
        <div className="last-updated">
          Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default PriceAlert;