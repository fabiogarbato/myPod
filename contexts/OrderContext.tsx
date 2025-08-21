import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, customer: { name: string; address: string; }) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('vibeVapesOrders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
      localStorage.removeItem('vibeVapesOrders');
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
        localStorage.setItem('vibeVapesOrders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (items: CartItem[], total: number, customer: { name: string; address: string; }) => {
    const newOrder: Order = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      items,
      total,
      customer,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
