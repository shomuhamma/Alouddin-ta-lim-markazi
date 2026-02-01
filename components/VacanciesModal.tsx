
import React, { useEffect } from 'react';
import { XIcon, TeacherIcon, BriefcaseIcon, HeadsetIcon, FinanceIcon, MarketingIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyClick: (vacancyTitle: string) => void;
}

const vacancies = [
    {
        icon: <TeacherIcon className="w-16 h-16 text-orange-500" />,
        title: 'ESL Teacher',
    },
    {
        icon: <TeacherIcon className="w-16 h-16 text-orange-500" />,
        title: 'Umumiy fanlar bo‘yicha o‘qituvchi',
    },
    {
        icon: <BriefcaseIcon className="w-16 h-16 text-orange-500" />,
        title: 'Ofis menejeri',
    },
    {
        icon: <HeadsetIcon className="w-16 h-16 text-orange-500" />,
        title: 'Call Center operatori',
    },
    {
        icon: <FinanceIcon className="w-16 h-16 text-orange-500" />,
        title: 'Moliya menejeri',
    },
    {
        icon: <MarketingIcon className="w-16 h-16 text-orange-500" />,
        title: 'SMM Mutaxassisi',
    },
];

const VacanciesModal: React.FC<ModalProps> = ({ isOpen, onClose, onApplyClick }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
        <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transition-transform duration-300 scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="p-6 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
                 <h2 className="text-2xl font-bold" style={{color: '#1E2835'}}>Ochiq vakansiyalar</h2>
                 <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full -mr-2">
                    <XIcon className="w-6 h-6" />
                    <span className="sr-only">Yopish</span>
                </button>
            </header>
            
            <main className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vacancies.map((vacancy, index) => (
                        <div key={index} className="group bg-white rounded-xl border border-gray-200 p-8 text-center flex flex-col items-center justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-2">
                            <div className="mb-6 transition-transform duration-300 group-hover:scale-110">{vacancy.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex-grow">{vacancy.title}</h3>
                            <button onClick={() => onApplyClick(vacancy.title)} className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:bg-orange-600 transform hover:-translate-y-0.5" style={{backgroundColor: '#F97316'}}>
                                ARIZA YUBORISH →
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
        <style>{`
            @keyframes scale-in {
                0% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
            @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default VacanciesModal;
