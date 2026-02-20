
export interface Subject {
    id: string;
    name: string;
    description: string;
    iconName: string;
}

export const subjects: Subject[] = [
    {
        id: 'ingliz-tili',
        name: 'Ingliz tili',
        description: 'Xalqaro imkoniyatlar eshigini oching va dunyo bilan erkin muloqot qiling.',
        iconName: 'LanguagesIcon',
    },
    {
        id: 'rus-tili',
        name: 'Rus tili',
        description: 'Ikkinchi xorijiy tilni o‘rganing va o‘z imkoniyatlaringizni yanada kengaytiring.',
        iconName: 'MessageCircleIcon',
    },
    {
        id: 'koreys-tili',
        name: 'Koreys tili',
        description: 'Zamonaviy koreys tilini o‘rganing va xalqaro imkoniyatlarga yo‘l oching.',
        iconName: 'TranslateIcon',
    },
    {
        id: 'xitoy-tili',
        name: 'Xitoy tili',
        description: 'Dunyoning eng talabgir tillaridan birini o‘rganib, global muloqotga chiqing.',
        iconName: 'TranslateIcon',
    },
    {
        id: 'ona-tili',
        name: 'Ona tili',
        description: 'O‘z ona tilingizni mukammal o‘rganing va imtihonlarga tayyorlaning.',
        iconName: 'BookOpenIcon',
    },
    {
        id: 'tarix',
        name: 'Tarix',
        description: 'O‘tmishni o‘rganib, kelajakni anglang va dunyoqarashingizni kengaytiring.',
        iconName: 'ScrollIcon',
    },
    {
        id: 'pochemuchka',
        name: 'Pochemuchka',
        description: 'Farzandingizning qiziquvchanligini rag\'batlantiring va dunyoni kashf eting.',
        iconName: 'LightbulbIcon',
    },
    {
        id: 'mental-arifmetika',
        name: 'Mental arifmetika',
        description: 'Tezkor hisoblash ko\'nikmalarini rivojlantiring va aqliy salohiyatni kuchaytiring.',
        iconName: 'CalculatorIcon',
    },
    {
        id: 'kompyuter-savodxonligi',
        name: 'Kompyuter savodxonligi',
        description: 'Ofis dasturlari va internetdan samarali foydalanishni o‘rganing.',
        iconName: 'MonitorIcon',
    },
    {
        id: 'backend',
        name: 'Backend dasturlash',
        description: 'Server, ma’lumotlar bazasi va API bilan ishlashni professional o‘rganing.',
        iconName: 'CodeIcon',
    },
    {
        id: 'kimyo',
        name: 'Kimyo',
        description: 'Kimyo fanidan mustahkam bilim olib, testlar va imtihonlarga puxta tayyorlaning.',
        iconName: 'FlaskConicalIcon',
    },
    {
        id: 'biologiya',
        name: 'Biologiya',
        description: 'Biologiya fanini chuqur o‘rganib, tirik organizmlar va hayot jarayonlarini tushuning.',
        iconName: 'DnaIcon',
    },
];
