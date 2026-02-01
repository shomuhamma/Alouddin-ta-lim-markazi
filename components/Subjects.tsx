
import React from 'react';
import * as Icons from './Icons';
import AnimatedSection from './AnimatedSection';
import { subjects } from '../lib/subjects';

interface SubjectsProps {
    onOpenModal: (subjectName: string) => void;
}

const SubjectCard: React.FC<{ subject: typeof subjects[0], onClick: () => void }> = ({ subject, onClick }) => {
    // Dynamically get the icon component
    const IconComponent = (Icons as any)[subject.iconName] || Icons.BrainCircuitIcon;

    return (
        <div 
            onClick={onClick}
            className="group cursor-pointer bg-white rounded-[20px] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-[400ms] cubic-bezier-[0.4, 0, 0.2, 1] transform hover:-translate-y-2 flex flex-col items-center text-center"
        >
            <div className="mb-6 p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-500 transition-colors duration-300">
                <IconComponent className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{subject.name}</h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
                {subject.description}
            </p>
            <div className="mt-auto w-full">
                <span className="inline-flex items-center text-orange-600 font-bold group-hover:gap-2 transition-all">
                    Batafsil ma'lumot 
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </span>
            </div>
        </div>
    );
};

const Subjects: React.FC<SubjectsProps> = ({ onOpenModal }) => {
  return (
    <>
      <style>{`
        @keyframes fanlar-highlight-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7), inset 0 0 30px rgba(249, 115, 22, 0.1);
            border-color: rgb(249, 115, 22);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(249, 115, 22, 0), inset 0 0 30px rgba(249, 115, 22, 0.2);
            border-color: rgb(249, 115, 22);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0), inset 0 0 30px rgba(249, 115, 22, 0.1);
            border-color: rgb(249, 115, 22);
          }
        }
        #fanlar.fanlar-highlight {
          animation: fanlar-highlight-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1);
          border: 3px solid rgb(249, 115, 22);
          border-radius: 12px;
          padding: 2rem;
        }
      `}</style>
      <section id="fanlar" className="py-20 md:py-32 bg-white overflow-hidden transition-all duration-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                    Biz o‘rgatadigan fanlar
                </h2>
                <div className="w-20 h-1.5 bg-orange-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg md:text-xl text-gray-600">
                    Har bir yo‘nalish bo‘yicha tajribali ustozlar va natijaga yo‘naltirilgan ta’lim
                </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {subjects.map((subject, index) => (
                    <AnimatedSection key={subject.id} className="h-full">
                        <SubjectCard 
                            subject={subject} 
                            onClick={() => onOpenModal(subject.name)} 
                        />
                    </AnimatedSection>
                ))}
            </div>

            
        </div>
    </section>
    </>
  );
};

export default Subjects;
