
import React from 'react';
import { LogoIcon, PhoneIcon, MapPinIcon, ClockIcon, InstagramIcon, TelegramIcon, YouTubeIcon } from './Icons';
import AnimatedSection from './AnimatedSection';

const Footer: React.FC = () => {
    
    const quickLinks = [
        { href: "#home", label: "Bosh sahifa" },
        { href: "#kurslar", label: "Kurslar" },
        { href: "#natijalar", label: "Natijalar" },
        { href: "#manzillarimiz", label: "Ustozlar" },
        { href: "#aloqa", label: "Aloqa" },
    ];

    const socialLinks = [
        { href: "https://www.instagram.com/alouddin_talim_markaz1/", icon: <InstagramIcon className="w-6 h-6" />, label: "Instagram" },
        { href: "https://t.me/Alouddin_Talim_Markazi", icon: <TelegramIcon className="w-6 h-6" />, label: "Telegram" },
        { href: "https://www.youtube.com/@AlouddinTalimMarkazi", icon: <YouTubeIcon className="w-6 h-6" />, label: "YouTube" },
    ];

  return (
    <AnimatedSection>
        <footer id="aloqa" className="bg-white text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="border-t border-gray-200 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                        {/* Column 1: Brand */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                <LogoIcon className="w-12 h-12" />
                                <span className="font-bold text-xl text-gray-900">Alouddin_Talim_Markazi</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Biz yosh avlodning intellektual salohiyatini yuksaltirish, ularga sifatli va zamonaviy ta'lim berish orqali mustahkam va porloq kelajak qurishga hissa qo‘shamiz.
                            </p>
                        </div>
                        
                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Tezkor havolalar</h3>
                            <ul className="space-y-3">
                                {quickLinks.map(link => (
                                    <li key={link.href}>
                                        <a href={link.href} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 relative group">
                                            {link.label}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Contact */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Aloqa ma’lumotlari</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start justify-center md:justify-start">
                                    <PhoneIcon className="w-5 h-5 mt-1 mr-3 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-700">Telefon</p>
                                        <a href="tel:+998930086766" className="text-gray-600 hover:text-orange-500 transition-colors">+998 93 008 67 66</a>
                                    </div>
                                </li>
                                <li className="flex items-start justify-center md:justify-start">
                                    <MapPinIcon className="w-5 h-5 mt-1 mr-3 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-700">Manzil</p>
                                        <a href="https://t.me/Alouddin_Talim_Markazi/605?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnK400xutMhv95Qk7mTP5vJ7GLv3rDUX7K8umf_8tUsrOXJF8YUUrIyXpj4Kw_aem_wfq_Bg9jF_-2hBBn6L7Dzg" className="text-gray-600 hover:text-orange-500 transition-colors">Toshkent vil, Yuqorichirchiq tumani,<br /> Yangibozor shaharchasi, Mustaqillik ko‘chasi</a>
                                    </div>
                                </li>
                                 <li className="flex items-start justify-center md:justify-start">
                                    <ClockIcon className="w-5 h-5 mt-1 mr-3 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-700">Ish vaqti</p>
                                        <p className="text-gray-600">Dushanba – Shanba: 09:00 – 19:00</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Column 4: Social Media */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Bizni kuzatib boring</h3>
                            <div className="flex space-x-4 justify-center md:justify-start">
                                {socialLinks.map(social => (
                                    <a 
                                        key={social.label}
                                        href={social.href} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        aria-label={social.label}
                                        className="text-gray-500 hover:text-orange-500 transition-all duration-300 transform hover:scale-110"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Alouddin_Talim_Markazi. Barcha huquqlar himoyalangan.
                    </p>
                </div>
            </div>
        </footer>
    </AnimatedSection>
  );
};

export default Footer;
