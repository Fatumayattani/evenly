import { PrivyProvider } from '@privy-io/react-auth';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider appId={PRIVY_APP_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrivyProvider>
  </React.StrictMode>
);
