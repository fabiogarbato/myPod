import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, CartIcon, SearchIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';
import SearchModal from './SearchModal';

interface HeaderProps {
  heroRef: React.RefObject<HTMLElement>;
  productsRef: React.RefObject<HTMLElement>;
}

const Header: React.FC<HeaderProps> = ({ heroRef, productsRef }) => {
  const { toggleCart, cartItemCount } = useCart();
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const prevCartItemCount = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCartItemCount.current) {
        setIsItemAdded(true);
        const timer = setTimeout(() => setIsItemAdded(false), 300); // Duração da animação pop
        
        return () => clearTimeout(timer);
    }
    prevCartItemCount.current = cartItemCount;
  }, [cartItemCount]);

  const handleScrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-sm border-b border-light-dark">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => handleScrollTo(heroRef)} className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8 text-brand-cyan" />
            <span className="text-2xl font-bold tracking-tighter text-white">VibeVapes</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleScrollTo(productsRef)} className="text-gray-300 hover:text-brand-cyan transition-colors duration-300">Loja</button>
            <a href="#" className="text-gray-300 hover:text-brand-cyan transition-colors duration-300">Descartáveis</a>
            <a href="#" className="text-gray-300 hover:text-brand-cyan transition-colors duration-300">Pods</a>
            <a href="#" className="text-gray-300 hover:text-brand-cyan transition-colors duration-300">Sobre</a>
          </nav>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-300 hover:text-brand-cyan transition-colors duration-300" 
              aria-label="Buscar"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            <button 
              id="cart-icon-button"
              onClick={toggleCart} 
              className={`relative text-gray-300 hover:text-brand-cyan transition-transform duration-300 ${isItemAdded ? 'animate-pop' : ''}`}
              aria-label="Carrinho de compras"
            >
              <CartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;