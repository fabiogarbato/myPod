import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { TrashIcon, CloseIcon } from './IconComponents';
import CheckoutModal from './CheckoutModal';

const CartSidebar: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckoutClick = () => {
    toggleCart(); // Fecha o carrinho
    setIsCheckoutOpen(true); // Abre o modal de checkout
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ease-in-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-light-dark z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col shadow-2xl shadow-black/50`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 id="cart-heading" className="text-xl font-bold text-white">Seu Carrinho ({cartItemCount})</h2>
          <button onClick={toggleCart} className="text-gray-400 hover:text-white" aria-label="Fechar carrinho">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h3 className="text-xl font-semibold text-white">Seu carrinho está vazio</h3>
            <p className="text-gray-400 mt-2">Adicione alguns produtos para começar!</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6">
            <ul className="space-y-4">
              {cart.map(item => (
                <li key={item.id} className="flex items-start gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-sm text-gray-400">R${item.price.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-lg font-bold flex items-center justify-center transition-colors" aria-label={`Diminuir quantidade de ${item.name}`}>-</button>
                      <span className="w-8 text-center" aria-live="polite">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-lg font-bold flex items-center justify-center transition-colors" aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-white">R${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-brand-pink mt-4" aria-label={`Remover ${item.name}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cart.length > 0 && (
          <footer className="p-6 border-t border-gray-700 bg-dark-bg">
            <div className="flex justify-between items-center mb-4">
               <span className="font-semibold text-gray-300 text-lg">Subtotal</span>
               <span className="font-bold text-white text-xl">R${cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105 mb-2">
              Finalizar Compra
            </button>
            <button 
              onClick={clearCart}
              className="w-full text-center text-gray-400 hover:text-brand-pink text-sm py-2 transition-colors duration-300"
            >
              Esvaziar Carrinho
            </button>
          </footer>
        )}
      </aside>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

export default CartSidebar;