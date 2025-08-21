import React from 'react';
import { useOrders } from '../contexts/OrderContext';
import { CloseIcon, ReceiptIcon } from './IconComponents';

interface MyPurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPurchasesModal: React.FC<MyPurchasesModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useOrders();

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-dark-bg/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl h-[80vh] bg-dark-bg border border-brand-cyan/50 rounded-xl shadow-2xl shadow-brand-cyan/10 p-6 md:p-8 relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-7 h-7" />
        </button>
        
        <header className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Minhas Compras</h2>
            <p className="text-gray-400">Aqui está o histórico dos seus pedidos.</p>
        </header>

        <div className="flex-grow overflow-y-auto pr-2">
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <ReceiptIcon className="w-24 h-24 text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white">Nenhuma compra encontrada</h3>
                    <p className="text-gray-400 mt-2">Parece que você ainda não fez nenhum pedido.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {orders.map(order => (
                        <li key={order.id} className="bg-light-dark rounded-lg p-4 border border-gray-700 animate-content-slide-down">
                           <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Pedido de {new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-gray-200">Total: <span className="font-bold text-brand-cyan text-lg">R${order.total.toFixed(2).replace('.', ',')}</span></p>
                                </div>
                           </div>
                           <div className="border-t border-gray-700 pt-4">
                               <h4 className="font-semibold mb-2 text-gray-300">Itens:</h4>
                               <ul className="space-y-3">
                                   {order.items.map(item => (
                                       <li key={item.id} className="flex items-center gap-3 text-sm">
                                           <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                                           <div className="flex-grow">
                                               <p className="font-medium text-white">{item.name}</p>
                                               <p className="text-gray-400">{item.quantity} x R${item.price.toFixed(2).replace('.', ',')}</p>
                                           </div>
                                           <p className="font-semibold text-white">R${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                       </li>
                                   ))}
                               </ul>
                           </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default MyPurchasesModal;
