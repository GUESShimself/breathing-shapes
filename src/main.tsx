import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import BreathingApp from './components/BreathingApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BreathingApp />
  </React.StrictMode>
);
