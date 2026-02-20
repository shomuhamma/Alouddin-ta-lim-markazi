
import React from 'react';
import AnimatedSection from './AnimatedSection';

const plans = [
  {
    name: 'Matematika',
    price: "450,000",
    features: ['Haftasiga 3 marta dars', 'Har dars 90 daqiqa', 'Doimiy test sinovlari', 'Qo\'shimcha materiallar'],
    popular: false,
  },
  {
    name: 'Ingliz tili (IELTS)',
    price: "550,000",
    features: ['Haftasiga 3 marta dars', 'Har dars 120 daqiqa', 'Speaking Club', 'Mock imtihonlari'],
    popular: true,
  },
  {
    name: 'Kimyo / Biologiya',
    price: "500,000",
    features: ['Haftasiga 3 marta dars', 'Har dars 90 daqiqa', 'Laboratoriya ishlari', 'DTM darajasidagi testlar'],
    popular: false,
  },
];

interface PricingProps {
    onOpenModal: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onOpenModal }) => {
  return (
    <AnimatedSection>
        <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shaffof va qulay narxlar
            </h2>
            <p className="text-lg text-gray-600 mb-12 md:mb-16">
                Sifatli ta'lim uchun eng yaxshi sarmoya. Biz sizning byudjetingizni ham o'ylaymiz.
            </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {plans.map((plan, index) => (
                <div key={index} className={`bg-white rounded-2xl p-8 border ${plan.popular ? 'border-orange-500 transform lg:scale-105 shadow-2xl shadow-orange-100' : 'border-gray-200'} transition-transform duration-300`}>
                {plan.popular && (
                    <div className="text-center mb-6">
                    <span className="bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">Eng Mashhur</span>
                    </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                <p className="text-center text-gray-500 mb-6">Oylik to'lov</p>
                <p className="text-5xl font-extrabold text-gray-900 text-center mb-6">
                    {plan.price} <span className="text-lg font-medium text-gray-500">so'm</span>
                </p>
                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                    </li>
                    ))}
                </ul>
                <button onClick={onOpenModal} className={`w-full group text-center block font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                    Hoziroq yozilish
                </button>
                </div>
            ))}
            </div>
        </div>
        </section>
    </AnimatedSection>
  );
};

export default Pricing;
