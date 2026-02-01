
import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, SearchIcon, ChevronDownIcon, ChevronRightIcon, MenuIcon, XIcon, InstagramIcon, TelegramIcon, YouTubeIcon } from './Icons';
import SearchPanel from './SearchPanel';

interface HeaderProps {
    onOpenModal: () => void;
    onOpenVacanciesModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, onOpenVacanciesModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isYangiliklarExpanded, setIsYangiliklarExpanded] = useState(false);
  const [isBizHaqimizdaExpanded, setIsBizHaqimizdaExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const dropdownRef = useRef<HTMLLIElement>(null);

  const navLinks = [
    { id: 'biz-haqimizda', label: 'Biz haqimizda', action: 'scroll', dropdown: true },
    { id: 'kurslar', label: 'Kurslar', action: 'scroll' },
    { id: 'yangiliklar', label: 'Yangiliklar', action: 'scroll', dropdown: true },
    { id: 'vakansiyalar', label: 'Vakansiya', action: 'modal' },
    { id: 'manzillarimiz', label: 'Manzillarimiz', action: 'scroll' },
  ];

  const subItems = [
    { label: "Natijalar", href: "#natijalar" },
  ];

  const subItemsBizHaqimizda = [
    { label: "O‘quvchilar fikrlari", href: "#oquvchilar-fikrlari" },
  ];

  const handleNavLinkClick = (e: React.MouseEvent, action: string, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (action === 'scroll') {
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (action === 'modal') {
      setTimeout(() => onOpenVacanciesModal(), 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);

    const sections = navLinks.filter(l => l.action === 'scroll').map(link => document.getElementById(link.id));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(sec => sec && observer.observe(sec));

    if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
      sections.forEach(sec => sec && observer.unobserve(sec));
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg border-b border-gray-100 h-[72px] md:h-[84px]' : 'h-[80px] md:h-[92px]'}`}>
        <div className="container mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo Section */}
            <a href="#home" onClick={(e) => handleNavLinkClick(e, 'scroll', 'home')} className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-orange-100 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <LogoIcon className="w-12 h-12 transition-transform group-hover:scale-110 relative" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-lg md:text-xl text-gray-900 tracking-tight uppercase">Alouddin_Talim_Markazi</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden xl:block">
              <ul className="flex items-center gap-7">
                {navLinks.map((link) => (
                    link.dropdown ? (
                      <li key={link.id} className="relative" ref={dropdownRef}
                          onMouseEnter={() => setIsDropdownOpen(true)}
                          onMouseLeave={() => setIsDropdownOpen(false)}>
                        <button className={`flex items-center gap-1.5 font-bold text-[15px] tracking-wide transition-all duration-200 relative py-2 ${activeSection === link.id ? 'text-orange-500' : 'text-gray-900 hover:text-orange-600'}`}
                          onClick={() => {
                            const target = document.getElementById(link.id);
                            if (target) {
                              target.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}>
                          {link.label}
                          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </button>
                        <div className={`transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                          <ul className="py-2">
                            {(link.id === 'yangiliklar' ? subItems : link.id === 'biz-haqimizda' ? subItemsBizHaqimizda : []).map((item, i) => (
                              <li key={i}>
                                <a href={item.href} className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full text-left font-bold">{item.label}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ) : (
                      <li key={link.id}>
                        <a 
                          href={`#${link.id}`} 
                          onClick={(e) => handleNavLinkClick(e, link.action, link.id)} 
                          className={`font-bold text-[15px] tracking-wide transition-all duration-200 relative py-2 ${activeSection === link.id && link.action === 'scroll' ? 'text-orange-500' : 'text-gray-900 hover:text-orange-600'}`}
                        >
                          {link.label}
                          <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0 hover:w-full'}`}></span>
                        </a>
                      </li>
                    )
                ))}
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="https://ieltsregistration.britishcouncil.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold py-3 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95 text-center flex items-center justify-center text-[15px] min-w-[140px] whitespace-nowrap"
              >
                IELTS
              </a>
              
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-3 rounded-full hover:bg-gray-100 transition-all group"
              >
                <SearchIcon className="w-5 h-5 text-gray-700 group-hover:text-orange-600" />
              </button>

              <button 
                onClick={onOpenModal} 
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-extrabold py-3 px-8 rounded-full shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95 text-center flex items-center justify-center text-[15px] min-w-[140px] whitespace-nowrap"
              >
                Kursga Yozilish
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
                  <SearchIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Menu">
                <MenuIcon className="w-6 h-6 text-gray-900" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[380px] bg-white shadow-2xl flex flex-col transform transition-transform duration-400 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <LogoIcon className="w-10 h-10 shrink-0" />
                    <span className="font-bold text-[17px] text-gray-900 tracking-tight leading-tight">Alouddin_Talim_Markazi</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0">
                  <XIcon className="w-6 h-6 text-gray-500" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">
                <nav>
                    <ul className="flex flex-col">
                        {navLinks.map((link) => (
                            <li key={link.id} className="border-b border-gray-50 last:border-0">
                                {link.dropdown ? (
                                    <div className="flex flex-col">
                                        <button onClick={() => { if (link.id === 'yangiliklar') setIsYangiliklarExpanded(!isYangiliklarExpanded); else if (link.id === 'biz-haqimizda') setIsBizHaqimizdaExpanded(!isBizHaqimizdaExpanded); }} className="flex items-center justify-between px-6 py-4 w-full text-left group active:bg-gray-50 transition-colors">
                                            <span className={`text-[17px] font-bold transition-colors ${(link.id === 'yangiliklar' ? isYangiliklarExpanded : link.id === 'biz-haqimizda' ? isBizHaqimizdaExpanded : false) ? 'text-orange-500' : 'text-gray-900'}`}>{link.label}</span>
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${(link.id === 'yangiliklar' ? isYangiliklarExpanded : link.id === 'biz-haqimizda' ? isBizHaqimizdaExpanded : false) ? 'rotate-180 text-orange-500' : ''}`} />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${(link.id === 'yangiliklar' ? isYangiliklarExpanded : link.id === 'biz-haqimizda' ? isBizHaqimizdaExpanded : false) ? 'max-h-[300px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                                            {(link.id === 'yangiliklar' ? subItems : link.id === 'biz-haqimizda' ? subItemsBizHaqimizda : []).map((item, idx) => (
                                                <a key={idx} href={item.href} onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setTimeout(() => { const targetId = item.href.startsWith('#') ? item.href.slice(1) : item.href; const target = document.getElementById(targetId); if (target) target.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="flex items-center justify-between px-10 py-3 text-gray-600 hover:text-orange-500 transition-colors text-[16px] font-bold">{item.label}<ChevronRightIcon className="w-4 h-4 opacity-50" /></a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <a href={`#${link.id}`} onClick={(e) => handleNavLinkClick(e, link.action, link.id)} className="flex items-center justify-between px-6 py-4 group active:bg-gray-50 transition-colors">
                                        <span className={`text-[17px] font-bold transition-colors ${activeSection === link.id ? 'text-orange-500' : 'text-gray-900 group-hover:text-orange-500'}`}>{link.label}</span>
                                        <ChevronRightIcon className={`w-5 h-5 transition-colors ${activeSection === link.id ? 'text-orange-500' : 'text-gray-300 group-hover:text-orange-500'}`} />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="mt-auto px-6 py-8 border-t border-gray-100 bg-white">
                <button onClick={() => { onOpenModal(); setIsMenuOpen(false); }} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all mb-8">Kursga yozilish</button>
                <div className="flex flex-col gap-4">
                    <a href="tel:+998930086766" className="flex items-center gap-3 text-gray-900 font-bold text-lg hover:text-orange-500 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                        +998 93 008 67 66
                    </a>
                    <div className="flex items-center gap-5 pl-1 text-gray-400">
                        <a href="https://t.me/Alouddin_Talim_Markazi" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><TelegramIcon className="w-6 h-6" /></a>
                        <a href="https://www.instagram.com/alouddin_talim_markaz1/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                        <a href="https://www.youtube.com/@AlouddinTalimMarkazi" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors"><YouTubeIcon className="w-6 h-6" /></a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
