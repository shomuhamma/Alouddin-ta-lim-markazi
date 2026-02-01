
import { subjects } from './subjects';

export interface KnowledgeItem {
    id: string;
    title: string;
    category: string;
    keywords: string[];
    details: string;
    targetId?: string;
    actions?: { label: string; action: string; payload?: any }[];
    form?: 'consultation';
}

export const knowledgeBase: KnowledgeItem[] = [
    // --- GREETINGS & GENERAL ---
    {
        id: 'salom',
        title: "Salomlashish",
        category: "Umumiy",
        keywords: ["salom", "assalomu alaykum", "xayrli kun", "yaxshimisiz", "qaleysiz"],
        details: "Assalomu alaykum! 👋 Sizga qanday yordam bera olaman?",
        actions: [
            { label: 'Kurslar haqida', action: 'query', payload: 'kurslar' },
            { label: 'Manzilimiz', action: 'query', payload: 'manzil' },
        ]
    },
    {
        id: 'konsultatsiya',
        title: "Bepul konsultatsiya",
        category: "Umumiy",
        keywords: ["konsultatsiya", "bepul", "yozilish", "ro'yxatdan o'tish", "maslahat", "ariza", "ro'yxat"],
        details: "Albatta! Bepul konsultatsiyaga yozilish uchun, iltimos, quyidagi formani to'ldiring. Menejerlarimiz tez orada siz bilan bog'lanishadi. 👇",
        form: 'consultation',
    },

    // --- COURSES ---
    {
        id: 'kurslar',
        title: "Barcha kurslar",
        category: "Fanlar",
        keywords: ["kurslar", "fanlar", "qanaqa kurslar bor", "o'qish", "kurs"],
        details: "Bizda quyidagi kurslar mavjud. Qaysi biri haqida batafsil ma'lumot kerak?",
        actions: [
            { label: 'Ingliz tili (IELTS)', action: 'query', payload: 'course:ielts' },
            { label: 'Rus tili', action: 'query', payload: 'course:rus-tili' },
            { label: 'Koreys tili', action: 'query', payload: 'course:koreys-tili' },
            { label: 'Xitoy tili', action: 'query', payload: 'course:xitoy-tili' },
            { label: 'Ona tili', action: 'query', payload: 'course:ona-tili' },
            { label: 'Tarix', action: 'query', payload: 'course:tarix' },
            { label: 'Pochemuchka', action: 'query', payload: 'course:pochemuchka' },
            { label: 'Mental arifmetika', action: 'query', payload: 'course:mental-arifmetika' },
            { label: 'Kompyuter savodxonligi', action: 'query', payload: 'course:kompyuter-savodxonligi' },
            { label: 'Backend dasturlash', action: 'query', payload: 'course:backend' },
            { label: 'Kimyo', action: 'query', payload: 'course:kimyo' },
            { label: 'Biologiya', action: 'query', payload: 'course:biologiya' },
        ]
    },
    {
        id: 'narxlar',
        title: "Narxlar",
        category: "Ma'lumot",
        keywords: ["narx", "narxlar", "to'lov", "qancha", "pul"],
        details: "Kurslarimiz narxlari yo'nalishga qarab farq qiladi:\n\n• Fanlar (Matematika, Fizika): 450,000 so'm/oy\n• Ingliz tili: 550,000 so'm/oy\n• IT kurslari: 600,000 so'm/oy\n\nTo'lovlar uchun chegirmalarimiz ham mavjud!",
        actions: [
            { label: 'Konsultatsiya olish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'ielts',
        title: "Ingliz tili (IELTS) kursi",
        category: "Fanlar",
        keywords: ["ielts", "ingliz tili", "english", "grammar", "speaking"],
        details: subjects.find(s => s.id === 'ingliz-tili')?.description || '',
        targetId: "kurs-ingliz-tili",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-ingliz-tili' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },

    {
        id: 'rus-tili',
        title: "Rus tili kursi",
        category: "Fanlar",
        keywords: ["rus tili", "russian", "ruscha"],
        details: subjects.find(s => s.id === 'rus-tili')?.description || '',
        targetId: "kurs-rus-tili",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-rus-tili' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'koreys-tili',
        title: "Koreys tili kursi",
        category: "Fanlar",
        keywords: ["koreys tili", "korean", "koreyscha"],
        details: subjects.find(s => s.id === 'koreys-tili')?.description || '',
        targetId: "kurs-koreys-tili",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-koreys-tili' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'xitoy-tili',
        title: "Xitoy tili kursi",
        category: "Fanlar",
        keywords: ["xitoy tili", "chinese", "xitoycha"],
        details: subjects.find(s => s.id === 'xitoy-tili')?.description || '',
        targetId: "kurs-xitoy-tili",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-xitoy-tili' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'ona-tili',
        title: "Ona tili kursi",
        category: "Fanlar",
        keywords: ["ona tili", "uzbek tili", "ona til"],
        details: subjects.find(s => s.id === 'ona-tili')?.description || '',
        targetId: "kurs-ona-tili",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-ona-tili' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'tarix',
        title: "Tarix kursi",
        category: "Fanlar",
        keywords: ["tarix", "history", "o'tmish"],
        details: subjects.find(s => s.id === 'tarix')?.description || '',
        targetId: "kurs-tarix",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-tarix' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'pochemuchka',
        title: "Pochemuchka kursi",
        category: "Fanlar",
        keywords: ["pochemuchka", "qiziquvchanlik", "bolalar"],
        details: subjects.find(s => s.id === 'pochemuchka')?.description || '',
        targetId: "kurs-pochemuchka",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-pochemuchka' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'mental-arifmetika',
        title: "Mental arifmetika kursi",
        category: "Fanlar",
        keywords: ["mental arifmetika", "hisoblash", "aql"],
        details: subjects.find(s => s.id === 'mental-arifmetika')?.description || '',
        targetId: "kurs-mental-arifmetika",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-mental-arifmetika' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'kompyuter-savodxonligi',
        title: "Kompyuter savodxonligi kursi",
        category: "Fanlar",
        keywords: ["kompyuter savodxonligi", "computer", "ofis dasturlari"],
        details: subjects.find(s => s.id === 'kompyuter-savodxonligi')?.description || '',
        targetId: "kurs-kompyuter-savodxonligi",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-kompyuter-savodxonligi' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'backend',
        title: "Backend dasturlash kursi",
        category: "Fanlar",
        keywords: ["backend", "dasturlash", "programming", "server"],
        details: subjects.find(s => s.id === 'backend')?.description || '',
        targetId: "kurs-backend",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-backend' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'kimyo',
        title: "Kimyo kursi",
        category: "Fanlar",
        keywords: ["kimyo", "chemistry", "kimyoviy reaksiyalar"],
        details: subjects.find(s => s.id === 'kimyo')?.description || '',
        targetId: "kurs-kimyo",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-kimyo' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },
    {
        id: 'biologiya',
        title: "Biologiya kursi",
        category: "Fanlar",
        keywords: ["biologiya", "biology", "tirik organizmlar"],
        details: subjects.find(s => s.id === 'biologiya')?.description || '',
        targetId: "kurs-biologiya",
        actions: [
            { label: 'Batafsil ko\'rish', action: 'scroll', payload: 'kurs-biologiya' },
            { label: 'Ro\'yxatdan o\'tish', action: 'query', payload: 'konsultatsiya' },
        ]
    },

    // --- OTHER INFO ---
    {
        id: 'manzil',
        title: "Manzil va Aloqa",
        category: "Ma'lumot",
        keywords: ["manzil", "adres", "qayerda", "telefon", "kontakt", "aloqa", "ish vaqti"],
        details: "📍Bizning manzil: Toshkent viloyati, Yuqorichirchiq tumani, Yangibozor shaharchasi, Mustaqillik ko‘chasi\n📞 Telefon: +998 93 008 67 66\n⏰ Ish vaqti: 09:00 - 19:00 (Du-Sha)",
        targetId: "aloqa",
        actions: [
            { label: 'Xaritada ko\'rsatish', action: 'scroll', payload: 'aloqa' },
        ]
    },
];
