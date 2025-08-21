import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <CartProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </CartProvider>
  </React.StrictMode>
);
