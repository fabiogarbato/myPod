import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { CloseIcon, SearchIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100); 
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.flavors.some(flavor => flavor.toLowerCase().includes(lowerCaseQuery))
    );
  }, [query]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-dark-bg/90 backdrop-blur-md z-[100] flex flex-col items-center p-4 pt-[10vh] animate-modal-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl animate-content-slide-down" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
          aria-label="Fechar pesquisa"
        >
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você está procurando?"
            className="w-full bg-light-dark border border-gray-700 text-white text-xl placeholder-gray-500 rounded-lg py-4 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all"
          />
        </div>
        
        <div className="mt-8 max-h-[60vh] overflow-y-auto">
          {query && filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-gray-500 text-sm mt-2">Tente procurar por um sabor ou nome de produto.</p>
            </div>
          )}
          
          <ul className="space-y-4">
            {filteredProducts.map((product, index) => (
              <li 
                key={product.id}
                className="bg-light-dark/50 hover:bg-light-dark rounded-lg p-4 flex items-center gap-4 transition-all duration-300 animate-result-item-fade-in"
                style={{ animationDelay: `${index * 75}ms`, opacity: 0 }}
              >
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="font-bold text-white">{product.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{product.flavors.join(', ')}</p>
                </div>
                <div className="text-right flex flex-col items-end justify-center gap-2">
                    <p className="font-bold text-brand-cyan text-lg">R${product.price.toFixed(2).replace('.', ',')}</p>
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-brand-purple hover:bg-brand-pink text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-300"
                    >
                        Adicionar
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;