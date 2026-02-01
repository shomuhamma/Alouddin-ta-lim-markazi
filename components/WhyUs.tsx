
import React from 'react';
import { CheckCircleIcon } from './Icons';
import AnimatedSection from './AnimatedSection';

const reasons = [
  'Kichik guruhlar (har bir o\'quvchiga e\'tibor)',
  'Individual yondashuv (shaxsiy o\'quv rejasi)',
  'Natijaga yo‘naltirilgan darslar (yuqori o\'zlashtirish)',
  'Professional ustozlar (soha mutaxassislari)',
];

const WhyUs: React.FC = () => {
  return (
    <AnimatedSection>
        <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Nima uchun o‘quvchilar bizni tanlaydi?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Bizning yondashuvimiz har bir o'quvchining shaxsiy salohiyatini to'liq ochishga va maksimal natijaga erishishga qaratilgan.
                    </p>
                </div>
                <div className="space-y-5">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <CheckCircleIcon className="w-7 h-7 text-green-500 mr-4 flex-shrink-0" />
                            <span className="text-lg text-gray-800">{reason}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </section>
    </AnimatedSection>
  );
};

export default WhyUs;
