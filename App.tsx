import React, { useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

const App: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      <Header heroRef={heroRef} productsRef={productsRef} />
      <CartSidebar />
      <main>
        <HeroSection ref={heroRef} productsRef={productsRef} />
        <FeaturedProducts ref={productsRef} />
      </main>
      <Footer heroRef={heroRef} productsRef={productsRef} />
    </div>
  );
};

export default App;