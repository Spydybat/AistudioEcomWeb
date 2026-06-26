import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ShopProvider } from './context/ShopContext';
import { AdminProvider } from './context/AdminContext';
import { CurrencyProvider } from './context/CurrencyContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyProvider>
      <ShopProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </ShopProvider>
    </CurrencyProvider>
  </StrictMode>,
);
