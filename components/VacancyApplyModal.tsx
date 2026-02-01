
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, UploadCloudIcon, CheckCircleIcon } from './Icons';

// --- Types and Constants ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedVacancy: string;
    onBack: () => void;
}

const ALL_VACANCIES = [
    'ESL Teacher',
    'Umumiy fanlar bo‘yicha o‘qituvchi',
    'Ofis menejeri',
    'Call Center operatori',
    'Moliya menejeri',
    'SMM Mutaxassisi',
];

const initialFormState = {
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    birthDate: '',
    university: '',
    status: '',
    eduStartDate: '',
    eduEndDate: '',
    experience: '',
    languages: '',
    ielts: '',
    branch: '',
    position: '',
    about: '',
    workHours: '',
    cvFile: null as File | null,
};

type FormState = typeof initialFormState;
type FormErrors = { [K in keyof FormState]?: string };

// --- Main Component ---
const VacancyApplyModal: React.FC<ModalProps> = ({ isOpen, onClose, selectedVacancy, onBack }) => {
    const [activeVacancy, setActiveVacancy] = useState(selectedVacancy);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // --- Effects ---
    useEffect(() => {
        if (isOpen) {
            setActiveVacancy(selectedVacancy);
            setFormData(prev => ({ ...prev, position: selectedVacancy }));
            setIsSubmitted(false); // Reset submission status
            setTimeout(() => firstInputRef.current?.focus(), 300); // Auto-focus
        }
    }, [isOpen, selectedVacancy]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleNameChange = (fieldName: 'firstName' | 'lastName') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Keep only alphabetic characters (A-Z, a-z) and Uzbek Latin letters (o', g', sh, ch)
        // Using regex: allow letters and apostrophe for Uzbek letters
        const sanitized = value.replace(/[^a-zA-Z']/g, "").slice(0, 30);
        setFormData(prev => ({ ...prev, [fieldName]: sanitized }));
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: undefined }));
        }
    };

    const handleVacancyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Check if the original value starts with "+"
        const hasPlus = value.startsWith("+");
        // Extract only digits
        const digitsOnly = value.replace(/\D/g, "");
        // Limit to 20 digits
        const limitedDigits = digitsOnly.slice(0, 20);
        // Rebuild: add "+" back if it was at the start
        const sanitized = hasPlus ? "+" + limitedDigits : limitedDigits;
        setFormData(prev => ({ ...prev, phone: sanitized }));
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: undefined }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({...prev, cvFile: "Fayl hajmi 5MB dan oshmasligi kerak."}));
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                setErrors(prev => ({...prev, cvFile: "Faqat PDF, JPG, yoki PNG formatlari qabul qilinadi."}));
                return;
            }
            setFormData(prev => ({ ...prev, cvFile: file }));
            setErrors(prev => ({ ...prev, cvFile: undefined }));
        }
    };

    const handleClearForm = () => {
        setFormData(initialFormState);
        setActiveVacancy(selectedVacancy);
        setErrors({});
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstName) {
            newErrors.firstName = "Ism kiritilishi shart.";
        } else if (formData.firstName.length < 2 || formData.firstName.length > 30) {
            newErrors.firstName = "Ism 2-30 belgi oralig'ida bo'lishi kerak.";
        }
        if (!formData.lastName) {
            newErrors.lastName = "Familiya kiritilishi shart.";
        } else if (formData.lastName.length < 2 || formData.lastName.length > 30) {
            newErrors.lastName = "Familiya 2-30 belgi oralig'ida bo'lishi kerak.";
        }
        if (!formData.phone) newErrors.phone = "Telefon raqam kiritilishi shart.";
        if (!formData.gender) newErrors.gender = "Jins tanlanmadi.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const mapBackendErrorsToForm = (backendErrors: any) => {
        const mappedErrors: FormErrors = {};
        const errorMap: { [key: string]: string } = {
            'full_name': 'firstName',
            'phone': 'phone',
            'gender': 'gender',
            'birth_date': 'birthDate',
            'about': 'about',
            'certificates': 'cvFile',
        };

        const fieldMessageMap: { [key: string]: (msg: string) => string } = {
            'gender': () => "Iltimos, jinsni tanlang.",
            'phone': (msg) => msg.includes('phone') ? "Telefon raqami noto'g'ri." : msg,
            'full_name': (msg) => msg.includes('full_name') ? "F.I.Sh noto'g'ri." : msg,
        };

        for (const [backendKey, frontendKey] of Object.entries(errorMap)) {
            if (backendErrors[backendKey]) {
                const errorMsg = Array.isArray(backendErrors[backendKey]) 
                    ? backendErrors[backendKey][0] 
                    : backendErrors[backendKey];
                
                const customMapper = fieldMessageMap[backendKey];
                mappedErrors[frontendKey as keyof FormErrors] = customMapper 
                    ? customMapper(errorMsg)
                    : errorMsg;
            }
        }
        return mappedErrors;
    };

    const scrollToFirstError = () => {
        setTimeout(() => {
            const formElement = document.querySelector('form');
            if (formElement) {
                const firstErrorInput = formElement.querySelector('[class*="border-red"]');
                if (firstErrorInput) {
                    firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            scrollToFirstError();
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('full_name', `${formData.firstName} ${formData.lastName}`);
            formDataToSubmit.append('phone', formData.phone);
            formDataToSubmit.append('gender', formData.gender);
            if (formData.birthDate) {
                formDataToSubmit.append('birth_date', formData.birthDate);
            }
            formDataToSubmit.append('about', formData.about || '');
            if (formData.cvFile) {
                formDataToSubmit.append('certificates', formData.cvFile);
            }

            const res = await fetch('http://127.0.0.1:8000/api/vacancy-application/', {
                method: 'POST',
                body: formDataToSubmit,
            });

            if (!res.ok) {
                let errorData;
                try {
                    errorData = await res.json();
                } catch {
                    errorData = { error: await res.text() };
                }
                console.error("Backend error:", errorData);
                const mappedErrors = mapBackendErrorsToForm(errorData);
                setErrors(mappedErrors);
                setIsSubmitting(false);
                scrollToFirstError();
                return;
            }

            await res.json();
            setIsSubmitting(false);
            setIsSubmitted(true);
            handleClearForm();
        } catch (error) {
            console.error(error);
            alert("Server bilan bog'lanib bo'lmadi.");
            setIsSubmitting(false);
        }
    };

    // --- Render ---
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col transition-transform duration-300 animate-slide-up-scale"
                onClick={(e) => e.stopPropagation()}
            >
                {isSubmitted ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mb-6"/>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Ariza yuborildi!</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-md">Ma'lumotlaringiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
                        <div className="flex gap-4">
                            <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                Boshqa vakansiyalar
                            </button>
                            <button onClick={onClose} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors" style={{backgroundColor: '#F97316'}}>
                                Yopish
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="p-6 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-2xl font-bold" style={{ color: '#1E2835' }}>Vakansiyaga ariza</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full -mr-2">
                                <XIcon className="w-6 h-6" />
                                <span className="sr-only">Yopish</span>
                            </button>
                        </header>

                        <main className="p-8 overflow-y-auto">
                            <form onSubmit={handleSubmit}>
                                {/* Section 1: Vacancy Selection */}
                                <section className="mb-8 p-6 border border-gray-200 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4" style={{ color: '#1E2835' }}>Maqbul joylarni tanlash</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {ALL_VACANCIES.map(vacancy => (
                                            <button
                                                type="button"
                                                key={vacancy}
                                                onClick={() => {
                                                    setActiveVacancy(vacancy);
                                                    setFormData(prev => ({...prev, position: vacancy}));
                                                }}
                                                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-200 ${activeVacancy === vacancy ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}
                                            >
                                                {vacancy}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Section 2: Main Form Fields */}
                                <section className="mb-8 p-6 border border-gray-200 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-6" style={{ color: '#1E2835' }}>Maydonni to‘ldiring</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        {/* Simple Inputs */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ism*</label>
                                            <input ref={firstInputRef} type="text" inputMode="text" pattern="[a-zA-Z']*" name="firstName" value={formData.firstName} onChange={handleNameChange('firstName')} className={`w-full p-2.5 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} maxLength={30}/>
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Familiya*</label>
                                            <input type="text" inputMode="text" pattern="[a-zA-Z']*" name="lastName" value={formData.lastName} onChange={handleNameChange('lastName')} className={`w-full p-2.5 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} maxLength={30}/>
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                        </div>
                                         <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Jinsi</label>
                                            <div className={`flex gap-6 p-3 rounded-md border-2 transition-colors ${errors.gender ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                                                <label className="flex items-center"><input type="radio" name="gender" value="female" onChange={handleInputChange} checked={formData.gender === 'female'} className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500"/> Ayol</label>
                                                <label className="flex items-center"><input type="radio" name="gender" value="male" onChange={handleInputChange} checked={formData.gender === 'male'} className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500"/> Erkak</label>
                                            </div>
                                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami*</label>
                                            <input type="tel" inputMode="numeric" pattern="\+?[0-9]*" name="phone" value={formData.phone} onChange={handleVacancyPhoneChange} placeholder="+998 93 008 67 66" className={`w-full p-2.5 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} maxLength={21}/>
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tug‘ilgan kuni</label>
                                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-md"/>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">O‘zingiz haqingizda</label>
                                            <textarea name="about" value={formData.about} onChange={handleInputChange} rows={4} className="w-full p-2.5 border border-gray-300 rounded-md"></textarea>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: File Upload */}
                                <section className="p-6 border border-gray-200 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4 text-center" style={{ color: '#1E2835' }}>Sertifikat va diplomlarni yuklang!</h3>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                                    <span>Fayl tanlang</span>
                                                    <input id="file-upload" name="cvFile" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                                                </label>
                                                <p className="pl-1">yoki bu yerga tortib olib keling</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF, PNG, JPG (maks. 5MB)</p>
                                            {formData.cvFile && <p className="text-sm text-green-600 pt-2 font-medium">{formData.cvFile.name}</p>}
                                            {errors.cvFile && <p className="text-red-500 text-sm mt-1">{errors.cvFile}</p>}
                                        </div>
                                    </div>
                                </section>
                            </form>
                        </main>
                        
                        <footer className="p-6 flex justify-end items-center gap-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-2xl">
                            <button type="button" onClick={handleClearForm} className="bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                O‘chirish
                            </button>
                            <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="bg-orange-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-wait flex items-center" style={{backgroundColor: '#F97316'}}>
                               {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Yuborilmoqda...
                                    </>
                                ) : 'Yuborish'}
                            </button>
                        </footer>
                    </>
                )}
            </div>
            <style>{`
                @keyframes slide-up-scale {
                    0% { transform: translateY(20px) scale(0.98); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-slide-up-scale { animation: slide-up-scale 0.3s ease-out forwards; }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default VacancyApplyModal;