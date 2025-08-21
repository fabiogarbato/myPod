import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import { getVibeRecommendation } from '../services/geminiService';
import { CloseIcon, LoadingSpinnerIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';

interface VibeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quizQuestions = [
  {
    question: "Qual a vibe do seu rolê ideal?",
    answers: [
      "Festa na praia com amigos até o amanhecer.",
      "Noite tranquila em casa, jogando ou vendo série.",
      "Balada eletrônica com luzes neon e batida forte.",
    ],
  },
  {
    question: "Quando se trata de sabor, você prefere:",
    answers: [
      "Uma explosão de frutas doces e tropicais.",
      "Algo refrescante e gelado, que desperta os sentidos.",
      "Um sabor clássico e ousado, com um toque diferente.",
    ],
  },
  {
    question: "Escolha uma cor que te representa:",
    answers: [
      "Azul Ciano - Elétrico e vibrante.",
      "Roxo - Misterioso e profundo.",
      "Rosa Pink - Ousado e divertido.",
    ],
  }
];

type Stage = 'quiz' | 'loading' | 'result' | 'error';

const VibeFinderModal: React.FC<VibeFinderModalProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>('quiz');
  const [result, setResult] = useState<{ recommendedProduct: Product; reason: string } | null>(null);
  const [error, setError] = useState<string>('');
  const { addToCart } = useCart();
  
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStage('quiz');
    setResult(null);
    setError('');
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetQuiz();
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, resetQuiz]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      fetchRecommendation(newAnswers);
    }
  };

  const fetchRecommendation = async (finalAnswers: string[]) => {
    setStage('loading');
    try {
      const recommendation = await getVibeRecommendation(finalAnswers, PRODUCTS);
      setResult(recommendation);
      setStage('result');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
      setStage('error');
    }
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onClose();
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  if (!isOpen) return null;
  
  const colorVariants = {
    cyan: { button: 'from-brand-cyan to-blue-400' },
    purple: { button: 'from-brand-purple to-brand-pink' },
    pink: { button: 'from-brand-pink to-orange-400' },
  };

  const renderContent = () => {
    switch (stage) {
      case 'quiz':
        const question = quizQuestions[currentQuestionIndex];
        return (
          <div key={currentQuestionIndex} className="animate-content-slide-down">
            <p className="text-sm font-bold text-brand-cyan mb-2">PERGUNTA {currentQuestionIndex + 1} DE {quizQuestions.length}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">{question.question}</h3>
            <div className="grid grid-cols-1 gap-4">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  className="w-full text-left p-4 bg-light-dark border border-gray-700 rounded-lg hover:bg-brand-purple hover:border-brand-purple transition-all duration-300 text-gray-300 hover:text-white"
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center">
            <LoadingSpinnerIcon className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white animate-pulse">Analisando sua vibe... ✨</h3>
            <p className="text-gray-400 mt-2">Nossa IA está consultando os oráculos do sabor!</p>
          </div>
        );
      case 'result':
        if (!result) return null;
        const { recommendedProduct, reason } = result;
        const selectedColor = colorVariants[recommendedProduct.color];
        return (
             <div className="animate-content-slide-down text-center">
                <h2 className="text-3xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan">Encontramos sua Vibe Perfeita!</h2>
                <div className="bg-light-dark rounded-xl border border-gray-700 p-6 mt-6 max-w-md mx-auto">
                    <img src={recommendedProduct.imageUrl} alt={recommendedProduct.name} className="w-full h-56 object-cover rounded-lg mb-4" />
                    <h3 className="text-2xl font-bold text-white">{recommendedProduct.name}</h3>
                    <p className="text-2xl font-bold text-brand-cyan mb-4">R${recommendedProduct.price.toFixed(2).replace('.', ',')}</p>
                    <div className="text-left bg-dark-bg/50 p-4 rounded-lg border-l-4 border-brand-cyan">
                        <p className="text-gray-300 italic">"{reason}"</p>
                    </div>
                    <button 
                        onClick={() => handleAddToCart(recommendedProduct)}
                        className={`w-full mt-6 bg-gradient-to-r ${selectedColor.button} text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105 active:scale-100`}>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        );
      case 'error':
        return (
          <div className="text-center">
             <h3 className="text-2xl font-bold text-red-500 mb-4">Oops! Algo deu errado.</h3>
             <p className="text-gray-400 mb-6">{error}</p>
             <button
               onClick={resetQuiz}
               className="bg-brand-cyan text-dark-bg font-bold py-2 px-6 rounded-lg"
             >
               Tentar Novamente
             </button>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-dark-bg/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-2xl bg-dark-bg border border-brand-purple/50 rounded-xl shadow-2xl shadow-brand-purple/10 p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
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

export default VibeFinderModal;
