import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runMigration } from './utils/runMigration';

// Make migration function available globally for easy access
(window as any).runMigration = runMigration;

// Suppress React DevTools warning if not installed
if (typeof window !== 'undefined') {
  const suppressDevToolsWarning = () => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('Download the React DevTools')) {
        return; // Suppress this specific warning
      }
      originalConsoleLog.apply(console, args);
    };
  };
  suppressDevToolsWarning();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
