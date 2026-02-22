
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import WhyUs from './components/WhyUs';
import Subjects from './components/Subjects';
import Teachers from './components/Teachers';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import ChatBotWidget from './components/ChatBotWidget';
import VacanciesModal from './components/VacanciesModal';
import VacancyApplyModal from './components/VacancyApplyModal';
import OquvchilarFikrlari from './components/OquvchilarFikrlari';
import Results from './components/Results';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedSubject, setPreSelectedSubject] = useState('');
  const [isVacanciesModalOpen, setIsVacanciesModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState('');
  
  const handleOpenModal = (subjectName: string = '') => {
    setPreSelectedSubject(subjectName);
    setIsModalOpen(true);
  };

  const handleOpenApplicationFromVacancies = (vacancyTitle: string) => {
      setSelectedVacancy(vacancyTitle);
      setIsVacanciesModalOpen(false);
      setIsApplyModalOpen(true);
  };
  
  const handleCloseApplyAndOpenVacancies = () => {
      setIsApplyModalOpen(false);
      setIsVacanciesModalOpen(true);
  }

  return (
    <div className="bg-white text-gray-900">
      <Header onOpenModal={() => handleOpenModal()} onOpenVacanciesModal={() => setIsVacanciesModalOpen(true)} />
      <main>
        <Hero onOpenModal={() => handleOpenModal()} />
        <div id="yangiliklar"><SocialProof /></div> 
        <div id="biz-haqimizda"><WhyUs /></div>
        <OquvchilarFikrlari />
        <div id="natijalar"><Results /></div>
        <div id="kurslar">
          <Subjects onOpenModal={(subject) => handleOpenModal(subject)} />
        </div>
        <div id="manzillarimiz"><Teachers /></div>
      </main>
      <Footer />
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialSubject={preSelectedSubject}
      />
      <VacanciesModal 
        isOpen={isVacanciesModalOpen} 
        onClose={() => setIsVacanciesModalOpen(false)} 
        onApplyClick={handleOpenApplicationFromVacancies}
      />
      <VacancyApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        selectedVacancy={selectedVacancy}
        onBack={handleCloseApplyAndOpenVacancies}
      />
      <ChatBotWidget onOpenModal={() => handleOpenModal()} />
    </div>
  );
};

export default App;
