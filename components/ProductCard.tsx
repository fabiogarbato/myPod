import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Product } from '../types';
import { generateFlavorDescription } from '../services/geminiService';
import { WandIcon, LoadingSpinnerIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );
    
    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const colorVariants = {
    cyan: {
      shadow: 'shadow-glow-cyan',
      border: 'border-brand-cyan/50',
      button: 'from-brand-cyan to-blue-400',
    },
    purple: {
      shadow: 'shadow-glow-purple',
      border: 'border-brand-purple/50',
      button: 'from-brand-purple to-brand-pink',
    },
    pink: {
      shadow: 'shadow-glow-pink',
      border: 'border-brand-pink/50',
      button: 'from-brand-pink to-orange-400',
    }
  };

  const selectedColor = colorVariants[product.color];

  const handleGenerateDescription = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setDescription('');
    try {
      const generatedDesc = await generateFlavorDescription(product.name, product.flavors);
      setDescription(generatedDesc);
    } catch (err) {
      setError("Falha ao gerar a descrição.");
    } finally {
      setIsLoading(false);
    }
  }, [product.name, product.flavors]);

  const handleAddToCart = () => {
    const imgElement = imgRef.current;
    const cartIcon = document.getElementById('cart-icon-button');

    if (!imgElement || !cartIcon) {
      addToCart(product);
      return;
    }

    const imgRect = imgElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = imgElement.src;
    flyer.style.position = 'fixed';
    flyer.style.left = `${imgRect.left}px`;
    flyer.style.top = `${imgRect.top}px`;
    flyer.style.width = `${imgRect.width}px`;
    flyer.style.height = `${imgRect.height}px`;
    flyer.style.objectFit = 'cover';
    flyer.style.borderRadius = '0.5rem';
    flyer.style.zIndex = '9999';
    flyer.style.transition = 'all 1s cubic-bezier(0.5, -0.5, 0.25, 1)';
    
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      flyer.style.left = `${cartRect.left + cartRect.width / 2}px`;
      flyer.style.top = `${cartRect.top + cartRect.height / 2}px`;
      flyer.style.width = '0px';
      flyer.style.height = '0px';
      flyer.style.opacity = '0';
      flyer.style.transform = 'rotate(180deg) scale(0.2)';
    });
    
    flyer.addEventListener('transitionend', () => {
      flyer.remove();
    });

    setTimeout(() => {
        addToCart(product);
    }, 100);
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-light-dark rounded-xl border ${selectedColor.border} p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${selectedColor.shadow} fade-in ${isVisible ? 'visible' : ''}`}
      style={{ transitionDuration: '0.6s', transitionDelay: `${isVisible ? index * 100 : 0}ms` }}
    >
      <div className="relative mb-4">
        <img ref={imgRef} src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-white">{product.name}</h3>
        <p className="text-2xl font-bold text-brand-cyan">R${product.price.toFixed(2).replace('.',',')}</p>
      </div>
      <div className="flex-grow min-h-[6rem] mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinnerIcon />
          </div>
        ) : description ? (
          <p className="text-gray-400 text-sm break-words">{description}</p>
        ) : (
          <p className="text-gray-500 text-sm italic">Clique abaixo para ver as notas de sabor da IA...</p>
        )}
        {error && <p className="text-red-500 text-sm mt-2 break-words">{error}</p>}
      </div>
      
      <div className="mt-auto flex flex-col gap-2">
         <button 
           onClick={handleGenerateDescription}
           disabled={isLoading}
           className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <WandIcon className="w-5 h-5"/>
            Gerar Notas de Sabor
         </button>
        <button 
          onClick={handleAddToCart}
          className={`w-full bg-gradient-to-r ${selectedColor.button} text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105 active:scale-100`}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;