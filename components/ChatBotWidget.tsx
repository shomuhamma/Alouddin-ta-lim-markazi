import React, { useState, useEffect, useRef } from 'react';
import { knowledgeBase, KnowledgeItem } from '../lib/chatbot-knowledge';
import { subjects } from '../lib/subjects';
import { ChatBubbleIcon, XIcon, SendIcon, LogoIcon } from './Icons';

// --- COURSE MAP ---
const COURSE_MAP: Record<string, { title: string; description: string }> = {};
subjects.forEach(subject => {
  let key = subject.id;
  if (subject.id === 'ingliz-tili') key = 'ielts'; // special case for IELTS
  COURSE_MAP[key] = { title: subject.name, description: subject.description };
});

// --- TYPES ---
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  options?: { label: string; action: string; payload?: any }[];
  form?: 'consultation';
};

type ConsultationForm = {
  name: string;
  phone: string;
  subject: string;
};

// --- PROPS ---
interface ChatBotWidgetProps {
  onOpenModal: () => void;
}

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // NOTE: form state qoldi (kodning boshqa joylariga tegmaslik uchun),
  // lekin endi chat ichida form render qilinmaydi.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<ConsultationForm | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<ConsultationForm>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initial message on open & auto-focus
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: Date.now(),
            sender: 'bot',
            text:
              "Assalomu alaykum! 👋\nMen Alouddin_Talim_Markazi yordamchi botiman.\nSizga qanday yordam bera olaman?",
            options: [
              { label: 'Kurslar', action: 'query', payload: 'kurslar' },
              { label: 'Bepul konsultatsiya', action: 'open_modal' },
            ],
          },
        ]);
      }, 600);
    }

    if (isOpen) {
      setTimeout(() => textAreaRef.current?.focus(), 150);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height =
        Math.min(textAreaRef.current.scrollHeight, 100) + 'px';
    }
  }, [inputValue]);

  // --- Logic Helpers ---
  const findResponse = (query: string): KnowledgeItem | null => {
    const lowerQuery = query.toLowerCase();
    let bestMatch: KnowledgeItem | null = null;
    let maxScore = 0;

    knowledgeBase.forEach(item => {
      let score = 0;
      if (item.title.toLowerCase().includes(lowerQuery)) score += 3;
      item.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) score += 2;
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });
    return bestMatch;
  };

  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;

    let displayText = text;
    let isCourseQuery = false;
    let courseKey = '';
    let courseData: { title: string; description: string } | null = null;

    if (text.startsWith('course:')) {
      courseKey = text.replace('course:', '');
      courseData = COURSE_MAP[courseKey];
      if (courseData) {
        displayText = courseData.title;
        isCourseQuery = true;
      }
    } else {
      // Check if user typed a course name
      const lowerText = text.toLowerCase();
      for (const [key, data] of Object.entries(COURSE_MAP)) {
        if (data.title.toLowerCase() === lowerText) {
          courseKey = key;
          courseData = data;
          isCourseQuery = true;
          break;
        }
      }
    }

    const userMessage: Message = { id: Date.now(), text: displayText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: Message;

      if (isCourseQuery && courseData) {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Siz ${courseData.title} haqida ma’lumot tanladingiz. ${courseData.description}`,
          options: [
            { label: "Batafsil ko'rish", action: 'scroll', payload: `kurs-${courseKey}` },
            { label: 'Konsultatsiya', action: 'open_modal' },
          ],
        };
      } else {
        const response = findResponse(text);
        if (response) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: response.details,
            options: response.actions,
          };

          // 🔥 CHAT ICHIDAGI FORMNI O'CHIRDIK:
          // Agar knowledgeBase response.form bo'lsa ham, endi form ko'rsatmaymiz.
          // Buning o'rniga modal ochish tugmasini qo'shamiz.
          if (response.form) {
            botResponse.form = undefined;

            botResponse.options = [
              ...(botResponse.options || []),
              { label: "Ro'yxatdan o'tish", action: 'open_modal' },
            ];

            setFormState(null);
            setFormErrors({});
            setIsSubmitting(false);
          }
        } else {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: "Kechirasiz, savolingizni tushunmadim. Iltimos, quyidagi variantlardan birini tanlang 👇",
            options: [
              { label: 'Barcha kurslar', action: 'query', payload: 'kurslar' },
              { label: 'Manzilimiz', action: 'query', payload: 'manzil' },
            ],
          };
        }
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickAction = (label: string, action: string, payload?: any) => {
    if (action === 'query') {
      handleSendMessage(payload || label);
    } else if (action === 'scroll') {
      const el = document.getElementById(payload);
      if (el) {
        setIsOpen(false);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-search-result');
        setTimeout(() => el.classList.remove('highlight-search-result'), 2000);
      }
    } else if (action === 'open_modal') {
      setIsOpen(false);
      onOpenModal();
    } else if (action === 'open_link') {
      window.open(payload, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes crisp-slide-up {
          0% { transform: translateY(8px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-crisp-in {
          animation: crisp-slide-up 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* --- Launcher Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        style={{ backgroundColor: '#F97316' }}
        aria-label={isOpen ? 'Chatni yopish' : 'Yordamchi botni ochish'}
      >
        {isOpen ? (
          <XIcon className="w-7 h-7 sm:w-8 h-8 text-white opacity-100" />
        ) : (
          <ChatBubbleIcon className="w-7 h-7 sm:w-8 h-8 text-white opacity-100" />
        )}
      </button>

      {/* --- Chat Window --- */}
      <div
        ref={chatWindowRef}
        className={`fixed right-6 z-[90] w-full max-w-[calc(100vw-48px)] h-[550px] sm:h-[620px] sm:w-[380px] bg-white rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 animate-crisp-in' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }`}
        style={{
          bottom: 'calc(24px + 64px + 30px)',
        }}
      >
        {/* Header */}
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-100 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0 shadow-inner">
              <LogoIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 text-[15px] leading-tight">Yordamchi bot</h3>
              <p className="text-[12px] text-gray-400 font-medium">Onlayn muloqot</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-all text-gray-900 opacity-100 active:scale-90 border-none outline-none"
            aria-label="Close chat"
          >
            <XIcon className="w-5 h-5 text-gray-900 opacity-100" />
          </button>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide bg-white">
          <div className="flex flex-col gap-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col items-start max-w-[88%] ${msg.sender === 'user' ? 'self-end items-end' : ''}`}
              >
                <div
                  className={`px-4 py-3 rounded-[18px] text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                  style={msg.sender === 'user' ? { backgroundColor: '#F97316' } : {}}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Quick Action Pills */}
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          opt.action === 'close_chat'
                            ? setIsOpen(false)
                            : handleQuickAction(opt.label, opt.action, opt.payload)
                        }
                        className="text-[13px] bg-white text-gray-700 border border-gray-200 font-bold px-4 py-2 rounded-full hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95 shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* ✅ FORM BLOKI OLIB TASHLANDI */}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 ml-2">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Panel */}
        <footer className="shrink-0 px-4 pt-2 pb-6 sm:pb-8 bg-white border-t border-gray-100 sticky bottom-0 z-30">
          <div className="relative flex items-end gap-2 bg-gray-50 border border-transparent rounded-[26px] p-2 transition-all focus-within:bg-white focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/5">
            <textarea
              ref={textAreaRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Savolingizni yozing..."
              rows={1}
              className="flex-1 bg-transparent border-none py-2.5 px-4 text-[15px] text-gray-800 placeholder:text-gray-400 resize-none outline-none scrollbar-hide"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
                inputValue.trim()
                  ? 'bg-orange-500 text-white shadow-md active:scale-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={inputValue.trim() ? { backgroundColor: '#F97316' } : {}}
            >
              <SendIcon className="w-5 h-5 translate-x-0.5" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ChatBotWidget;
