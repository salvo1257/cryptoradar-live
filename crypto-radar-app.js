// CryptoRadar - Main App Component
// Central component that integrates all the modules

import React, { useState, useEffect } from 'react';
import WhaleAlerts from './WhaleAlerts';
import LiquidityClusters from './LiquidityClusters';
import SupportResistance from './SupportResistance';
import PatternRecognition from './PatternRecognition';
import PriceAlert from './PriceAlert';
import CryptoNews from './CryptoNews';
import './CryptoRadar.css';

/**
 * Main CryptoRadar App component that integrates all modules
 * and provides global app state and functionality
 */
const CryptoRadarApp = () => {
  // App state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastConnectionStatus, setLastConnectionStatus] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle online/offline status
  const handleConnectionChange = () => {
    setIsOnline(navigator.onLine);
    setLastConnectionStatus(new Date());
  };
  
  // Handle window resize
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  
  // Set up event listeners
  useEffect(() => {
    // Connection status listeners
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    // Window resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Navigation sections
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'whale-alerts', label: 'Whale Alerts', icon: '🔔' },
    { id: 'liquidity', label: 'Cluster di Liquidità', icon: '🧠' },
    { id: 'support-resistance', label: 'Supporti e Resistenze', icon: '📈' },
    { id: 'patterns', label: 'Pattern Grafici', icon: '🧩' },
    { id: 'alerts', label: 'Alert', icon: '🛎️' },
    { id: 'news', label: 'News', icon: '📰' }
  ];
  
  // Render appropriate content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'whale-alerts':
        return <WhaleAlerts />;
      case 'liquidity':
        return <LiquidityClusters />;
      case 'support-resistance':
        return <SupportResistance />;
      case 'patterns':
        return <PatternRecognition />;
      case 'alerts':
        return <PriceAlert />;
      case 'news':
        return <CryptoNews />;
      default:
        return <Dashboard />;
    }
  };
  
  // Dashboard component - shows most important info from each module
  const Dashboard = () => {
    return (
      <div className="dashboard-container">
        <h2>📊 CryptoRadar Dashboard</h2>
        
        <div className="dashboard-explanation">
          <p>
            Benvenuto nella dashboard di CryptoRadar! Qui puoi vedere una panoramica rapida 
            di tutte le funzionalità. Usa la barra di navigazione per accedere alle sezioni 
            complete.
          </p>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card whale-alerts-card">
            <h3>🔔 Ultimi Whale Alerts</h3>
            <WhaleAlertsMini />
          </div>
          
          <div className="dashboard-card liquidity-card">
            <h3>🧠 Cluster di Liquidità</h3>
            <LiquidityClustersMini />
          </div>
          
          <div className="dashboard-card support-resistance-card">
            <h3>📈 Supporti e Resistenze</h3>
            <SupportResistanceMini />
          </div>
          
          <div className="dashboard-card patterns-card">
            <h3>🧩 Pattern Recenti</h3>
            <PatternRecognitionMini />
          </div>
          
          <div className="dashboard-card alerts-card">
            <h3>🛎️ Alert Attivi</h3>
            <PriceAlertMini />
          </div>
          
          <div className="dashboard-card news-card">
            <h3>📰 Ultime News</h3>
            <CryptoNewsMini />
          </div>
        </div>
      </div>
    );
  };
  
  // Mini components for dashboard (these would be simplified versions of the main components)
  const WhaleAlertsMini = () => <div className="mini-component">Caricamento dati Whale Alerts...</div>;
  const LiquidityClustersMini = () => <div className="mini-component">Caricamento dati Cluster...</div>;
  const SupportResistanceMini = () => <div className="mini-component">Caricamento dati Supporti/Resistenze...</div>;
  const PatternRecognitionMini = () => <div className="mini-component">Caricamento Pattern...</div>;
  const PriceAlertMini = () => <div className="mini-component">Caricamento Alert...</div>;
  const CryptoNewsMini = () => <div className="mini-component">Caricamento News...</div>;
  
  return (
    <div className="crypto-radar-app">
      <header className="app-header">
        <div className="app-title">
          <h1>CryptoRadar</h1>
          <div className="connection-status">
            {isOnline ? (
              <span className="status-online">LIVE ✅</span>
            ) : (
              <span className="status-offline">OFFLINE 🔴</span>
            )}
          </div>
        </div>
        
        {isMobile && (
          <button 
            className="mobile-menu-toggle"
            onClick={() => document.body.classList.toggle('menu-open')}
          >
            ☰
          </button>
        )}
      </header>
      
      <div className="app-container">
        <nav className={`app-nav ${isMobile ? 'mobile-nav' : ''}`}>
          <ul>
            {sections.map(section => (
              <li 
                key={section.id}
                className={activeSection === section.id ? 'active' : ''}
              >
                <button onClick={() => {
                  setActiveSection(section.id);
                  if (isMobile) {
                    document.body.classList.remove('menu-open');
                  }
                }}>
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <main className="app-content">
          {renderContent()}
        </main>
      </div>
      
      <footer className="app-footer">
        <div className="connection-info">
          {isOnline ? (
            <span>Connesso - Dati in tempo reale</span>
          ) : (
            <span>Offline - Mostrando ultimi dati salvati</span>
          )}
          <span className="last-status-change">
            Ultimo cambio di stato: {lastConnectionStatus.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="app-copyright">
          CryptoRadar © {new Date().getFullYear()} - App Personale
        </div>
      </footer>
    </div>
  );
};

export default CryptoRadarApp;
        