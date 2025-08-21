import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { CloseIcon, LoadingSpinnerIcon, CheckCircleIcon } from './IconComponents';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 'form' | 'loading' | 'success';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [stage, setStage] = useState<Stage>('form');
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [errors, setErrors] = useState({ name: '', address: '' });

  useEffect(() => {
    if (isOpen) {
      setStage('form');
      setFormData({ name: '', address: '' });
      setErrors({ name: '', address: '' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (value.trim()) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', address: '' };
    if (!formData.name.trim()) {
      newErrors.name = 'O nome completo é obrigatório.';
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'O endereço de entrega é obrigatório.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStage('loading');
    
    setTimeout(() => {
      addOrder(cart, cartTotal, formData);
      clearCart();
      setStage('success');
    }, 2500);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (stage) {
      case 'form':
        return (
          <div className="animate-content-slide-down">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Finalizar Compra</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna do Formulário */}
              <div>
                <h3 className="text-xl font-semibold text-brand-cyan mb-4">Informações de Entrega</h3>
                <form onSubmit={handleCheckout} noValidate>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`w-full bg-light-dark border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all`} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Endereço de Entrega</label>
                      <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`w-full bg-light-dark border ${errors.address ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition-all`}></textarea>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                  </div>
                </form>
              </div>
              {/* Coluna do Resumo */}
              <div className="bg-light-dark p-6 rounded-lg border border-gray-700 flex flex-col">
                <h3 className="text-xl font-semibold text-brand-cyan mb-4">Resumo do Pedido</h3>
                <div className="flex-grow space-y-3 overflow-y-auto max-h-48 pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                            <span className="text-white font-medium">R${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span className="text-gray-300">Total</span>
                        <span className="text-brand-cyan">R${cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button onClick={handleCheckout} className="w-full max-w-sm bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-brand-cyan/20 hover:scale-105 transition-transform duration-300">
                  Confirmar Pedido
              </button>
            </div>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center py-16">
            <LoadingSpinnerIcon className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white animate-pulse">Processando seu pedido...</h3>
            <p className="text-gray-400 mt-2">Só um momento, estamos confirmando tudo!</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-16 animate-content-slide-down">
            <CheckCircleIcon className="h-20 w-20 mx-auto mb-6 text-brand-cyan" />
            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">Pedido Confirmado!</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Agradecemos a sua compra! Em breve você receberá um e-mail com os detalhes do seu pedido.
            </p>
             <button onClick={onClose} className="mt-8 bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-300">
               Continuar Comprando
             </button>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-dark-bg/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl bg-dark-bg border border-brand-purple/50 rounded-xl shadow-2xl shadow-brand-purple/10 p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-7 h-7" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default CheckoutModal;
