
import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon } from './IconComponents';

const SocialIcon: React.FC<{ children: React.ReactNode, 'aria-label': string }> = ({ children, 'aria-label': ariaLabel }) => (
  <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors duration-300" aria-label={ariaLabel}>
    {children}
  </a>
);

interface FooterProps {
  heroRef: React.RefObject<HTMLElement>;
  productsRef: React.RefObject<HTMLElement>;
}

const Footer: React.FC<FooterProps> = ({ heroRef, productsRef }) => {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const currentRef = footerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const handleScrollTo = (ref: React.RefObject<HTMLElement>) => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <footer ref={footerRef} className={`bg-light-dark border-t border-gray-800 mt-20 fade-in ${isVisible ? 'visible' : ''}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <button onClick={() => handleScrollTo(heroRef)} className="flex items-center gap-2 mb-4">
              <LogoIcon className="h-8 w-8 text-brand-cyan" />
              <span className="text-2xl font-bold tracking-tighter text-white">VibeVapes</span>
            </button>
            <p className="text-gray-400 text-sm">O Futuro do Sabor.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Loja</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleScrollTo(productsRef)} className="text-gray-400 hover:text-white text-left transition-colors duration-300">Lançamentos</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Descartáveis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">E-Líquidos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Termos de Serviço</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Siga-nos</h4>
            <div className="flex space-x-4">
               <SocialIcon aria-label="Facebook">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" /></svg>
               </SocialIcon>
               <SocialIcon aria-label="Twitter">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.29 9.31C17.29 9.46 17.29 9.61 17.29 9.76C17.29 14.63 13.78 20.08 6.94 20.08C5.08 20.08 3.32 19.55 1.83 18.61C2.08 18.64 2.33 18.65 2.59 18.65C4.16 18.65 5.6 18.11 6.74 17.18C5.27 17.15 4.02 16.16 3.6 14.77C3.81 14.81 4.02 14.83 4.24 14.83C4.54 14.83 4.84 14.79 5.12 14.71C3.59 14.41 2.51 12.98 2.51 11.3V11.24C2.97 11.51 3.51 11.68 4.08 11.7C3.05 11.02 2.38 9.87 2.38 8.58C2.38 7.85 2.57 7.18 2.91 6.6C4.55 8.52 6.89 9.83 9.57 9.97C9.48 9.7 9.43 9.41 9.43 9.12C9.43 7.49 10.72 6.2 12.35 6.2C13.2 6.2 13.97 6.58 14.54 7.15C15.22 7.02 15.86 6.77 16.44 6.44C16.21 7.14 15.75 7.74 15.17 8.11C15.78 8.04 16.36 7.87 16.9 7.63C16.49 8.22 15.95 8.76 15.34 9.19L17.29 9.31Z" /></svg>
               </SocialIcon>
               <SocialIcon aria-label="Instagram">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9a2 2 0 100-4 2 2 0 000 4zm4 0a2 2 0 100-4 2 2 0 000 4zm-2 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
               </SocialIcon>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} VibeVapes. Todos os Direitos Reservados.</p>
          <p className="mt-1">Aviso: Este produto contém nicotina. A nicotina é uma substância química viciante.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
