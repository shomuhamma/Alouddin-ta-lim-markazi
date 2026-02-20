import React, { useState, useEffect, useRef } from "react";
import { XIcon, CheckCircleIcon, CalendarIcon, ChevronDownIcon } from "./Icons";

const API_URL = "http://127.0.0.1:8000/api/course-application/";

// Mapping of lesson day choice keys to display labels
const LESSON_DAY_OPTIONS = [
  { key: "du_ju", label: "Juft kunlar" },
  { key: "se_pa", label: "Toq kunlar" },
  { key: "sh_yn", label: "Individual" },
  { key: "boshqa", label: "Boshqa" },
];

// Mapping of subject choice keys to display labels
const SUBJECT_OPTIONS = [
  { value: "ingliz", label: "Ingliz tili" },
  { value: "rus", label: "Rus tili" },
  { value: "koreys", label: "Koreys tili" },
  { value: "xitoy", label: "Xitoy tili" },
  { value: "ona", label: "Ona tili" },
  { value: "tarix", label: "Tarix" },
  { value: "pochemuchka", label: "Pochemuchka" },
  { value: "mental", label: "Mental arifmetika" },
  { value: "kompyuter", label: "Kompyuter savodxonligi" },
  { value: "backend", label: "Backend dasturlash" },
  { value: "kimyo", label: "Kimyo" },
  { value: "biologiya", label: "Biologiya" },
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

const ConsultationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialSubject = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    days: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    subject: "",
    days: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setIsSubmitting(false);
      setFormData({
        name: "",
        phone: "",
        subject: initialSubject,
        days: "",
      });
      setErrors({ name: "", phone: "", subject: "", days: "" });

      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [isOpen, initialSubject]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ===================== VALIDATION ===================== */

  const validateForm = () => {
    const newErrors = { name: "", phone: "", subject: "", days: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Ismingizni kiriting";
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon raqamingizni kiriting";
      valid = false;
    } else {
      const phoneDigitCount = formData.phone.replace(/\D/g, "").length;
      if (phoneDigitCount < 9 || phoneDigitCount > 20) {
        newErrors.phone = "Telefon raqami 9-20 raqamdan iborat bo'lishi kerak";
        valid = false;
      }
    }
    if (!formData.subject) {
      newErrors.subject = "Fanni tanlang";
      valid = false;
    }
    if (!formData.days) {
      newErrors.days = "Dars kunlarini tanlang";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* ===================== HANDLERS ===================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Check if the original value starts with "+"
    const hasPlus = value.startsWith("+");
    // Extract only digits
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to 20 digits
    const limitedDigits = digitsOnly.slice(0, 20);
    // Rebuild: add "+" back if it was at the start
    const sanitized = hasPlus ? "+" + limitedDigits : limitedDigits;
    setFormData((prev) => ({ ...prev, phone: sanitized }));
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        full_name: formData.name,
        phone: formData.phone,
        subject: formData.subject,
        days: formData.days,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: await res.text() };
        }
        console.error("Backend error:", errorData);
        
        // Map backend errors to form fields
        const newErrors = { name: "", phone: "", subject: "", days: "" };
        if (errorData.subject) {
          newErrors.subject = "Fanni noto'g'ri. Iltimos, boshqa fanni tanlang.";
        }
        if (errorData.phone) {
          newErrors.phone = typeof errorData.phone === 'string' ? errorData.phone : (Array.isArray(errorData.phone) ? errorData.phone[0] : "Telefon raqami noto'g'ri");
        }
        if (errorData.full_name) {
          newErrors.name = typeof errorData.full_name === 'string' ? errorData.full_name : (Array.isArray(errorData.full_name) ? errorData.full_name[0] : "F.I.Sh noto'g'ri");
        }
        if (errorData.days) {
          newErrors.days = typeof errorData.days === 'string' ? errorData.days : (Array.isArray(errorData.days) ? errorData.days[0] : "Kunlarni noto'g'ri tanlang");
        }
        
        setErrors(newErrors);
        return;
      }

      await res.json();
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Server bilan bog‘lanib bo‘lmadi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormIncomplete =
    !formData.name || !formData.phone || !formData.subject || !formData.days;

  if (!isOpen) return null;

  /* ===================== JSX ===================== */

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <XIcon className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Rahmat!</h2>
              <p className="text-gray-600 mb-6">
                Arizangiz qabul qilindi. Tez orada bog‘lanamiz.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-orange-500 text-white py-3 rounded-lg"
              >
                Yopish
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">
                Ro‘yxatdan o‘tish
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={nameInputRef}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="To‘liq ism"
                  className="w-full border rounded-lg px-4 py-3"
                />
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="\+?[0-9]*"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 000 00 00"
                  className="w-full border rounded-lg px-4 py-3"
                  maxLength={21}
                />

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Fanni tanlang</option>
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}

                <select
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Dars kunlari</option>
                  {LESSON_DAY_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting || isFormIncomplete}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Arizani yuborish"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
