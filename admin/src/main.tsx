import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { App } from './App';
import { TOAST_DURATION_MS } from './constants';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminDataProvider>
          <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: TOAST_DURATION_MS,
            className: 'text-sm',
            style: {
              background: '#1a1a2e',
              color: '#f3f4f6',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        </AdminDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
