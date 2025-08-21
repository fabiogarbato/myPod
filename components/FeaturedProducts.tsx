
import React from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

const FeaturedProducts = React.forwardRef<HTMLElement, {}>((props, ref) => {
  return (
    <section id="products" ref={ref} className="py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 tracking-tight">Coleção em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeaturedProducts;
