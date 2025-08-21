
import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  productsRef: React.RefObject<HTMLElement>;
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(({ productsRef }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Aciona a visibilidade com base se o elemento está na tela
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = ref && (ref as React.RefObject<HTMLElement>).current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        // Limpa o observador quando o componente é desmontado
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-transparent to-brand-cyan/20 opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-purple rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-cyan rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>

      <div className={`container mx-auto px-6 relative fade-in ${isVisible ? 'visible' : ''}`}>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan">
          O Futuro do Sabor.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Experimente um sabor incomparável com nossos vapes de última geração.
          Liberte a vibe, um puff de cada vez.
        </p>
        <button onClick={handleScrollToProducts} className="bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-brand-cyan/20 hover:scale-105 transition-transform duration-300">
          Ver Lançamentos
        </button>
      </div>
    </section>
  );
});

export default HeroSection;
