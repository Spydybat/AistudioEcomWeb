import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ShopProvider } from './context/ShopContext';
import { AdminProvider } from './context/AdminContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShopProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </ShopProvider>
  </StrictMode>,
);
