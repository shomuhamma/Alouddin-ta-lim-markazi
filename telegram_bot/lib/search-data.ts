
import { subjects } from './subjects';

export interface SearchableItem {
    title: string;
    category: string;
    keywords: string[];
    description: string;
    targetId: string; // The ID of the element to scroll to
    isActive: boolean;
    score?: number;
}

// Build searchable data from real sources
const buildSearchableData = (): SearchableItem[] => {
    const data: SearchableItem[] = [];

    // Add courses from subjects.ts
    subjects.forEach(subject => {
        data.push({
            title: subject.name,
            category: "Fanlar",
            keywords: [subject.name.toLowerCase(), ...subject.name.toLowerCase().split(' ')],
            description: subject.description,
            targetId: `kurs-${subject.id}`,
            isActive: true,
        });
    });

    // Add general info
    data.push({
        title: "Biz haqimizda",
        category: "Ma'lumot",
        keywords: ["biz haqimizda", "markaz haqida", "nega biz", "afzalliklar"],
        description: "Bizning yondashuvimiz har bir o'quvchining shaxsiy salohiyatini to'liq ochishga qaratilgan.",
        targetId: "biz-haqimizda",
        isActive: true,
    });

    data.push({
        title: "Manzillarimiz",
        category: "Kontakt",
        keywords: ["manzil", "adres", "filial", "joylashuv", "qayerda"],
        description: "Bizning filiallarimiz manzillari va joylashuvi haqida ma'lumot.",
        targetId: "manzillarimiz",
        isActive: true,
    });

    data.push({
        title: "Vakansiyalar",
        category: "Karyera",
        keywords: ["vakansiya", "ish", "ishga kirish", "jamoa", "bo'sh ish o'rni"],
        description: "Bizning jamoamizga qo'shiling! O'qituvchi, menejer va boshqa ochiq vakansiyalar.",
        targetId: "vakansiyalar",
        isActive: true,
    });

    data.push({
        title: "Statistika va Natijalar",
        category: "Ma'lumot",
        keywords: ["natija", "statistika", "kafolat", "ishonch", "tajriba"],
        description: "10,000+ o'quvchi ishonchi, 98% kafolatlangan natija, 15+ yillik tajriba.",
        targetId: "yangiliklar",
        isActive: true,
    });

    data.push({
        title: "Aloqa ma'lumotlari",
        category: "Aloqa",
        keywords: ["aloqa", "telefon", "manzil", "kontakt", "bog'lanish"],
        description: "Telefon raqam: +998 93 008 67 66. Manzil: Toshkent sh., Yunusobod tumani, A.Temur ko'ch., 123-uy.",
        targetId: "aloqa",
        isActive: true,
    });

    data.push({
        title: "Kursga yozilish",
        category: "Aloqa",
        keywords: ["kursga yozilish", "ro'yxatdan o'tish", "konsultatsiya", "ariza"],
        description: "Bepul konsultatsiya olish yoki kursga yozilish uchun ariza qoldiring.",
        targetId: "home",
        isActive: true,
    });

    return data;
};

export const searchableData: SearchableItem[] = buildSearchableData();
