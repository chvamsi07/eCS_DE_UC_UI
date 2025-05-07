import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App dhl-container">
      <div className="dhl-header">
        <img 
          src="https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg" 
          alt="DHL Logo" 
          className="dhl-logo"
        />
      </div>
      <div className="dhl-content">
        <LandingPage />
      </div>
    </div>
  );
}

export default App; 