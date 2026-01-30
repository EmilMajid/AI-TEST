// Təhsil Nazirliyinin vahid fənn siyahısı (19 fənn)
export const UNIFIED_SUBJECTS = [
    "Azərbaycan dili",
    "Ədəbiyyat",
    "Xarici dil",
    "İngilis dili",
    "Alman dili",
    "Fransız dili",
    "Rus dili",
    "İkinci xarici dil",
    "Riyaziyyat",
    "İnformatika",
    "Azərbaycan tarixi",
    "Ümumi tarix",
    "Fizika",
    "Kimya",
    "Biologiya",
    "Coğrafiya",
    "Təbiət",
    "Həyat bilgisi",
    "Texnologiya",
    "Təsviri İncəsənət",
    "Musiqi",
    "Fiziki tərbiyə",
    "Çağırışaqədərki hazırlıq"
] as const;

export type SubjectName = typeof UNIFIED_SUBJECTS[number];

export const subjectsByClass: Record<string, string[]> = {
    "1": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "2": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "3": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "4": ["Azərbaycan dili", "Xarici dil", "Riyaziyyat", "İnformatika", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Təbiət", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "6": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Coğrafiya", "Təbiət", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "7": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "9": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Həyat bilgisi", "Texnologiya", "Təsviri İncəsənət", "Musiqi", "Fiziki tərbiyə"],
    "10": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"],
    "11": ["Azərbaycan dili", "Ədəbiyyat", "Xarici dil", "İkinci xarici dil", "Riyaziyyat", "İnformatika", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "Fiziki tərbiyə", "Çağırışaqədərki hazırlıq"]
};


// 11-ci sinif ixtisar qrupları
export const groups = {
    "1": ["Riyaziyyat", "Fizika", "Kimya", "İnformatika", "Azərbaycan dili"],
    "2": ["Riyaziyyat", "Coğrafiya", "Tarix", "Azərbaycan dili", "Xarici dil"],
    "3": ["Azərbaycan dili", "Tarix", "Ədəbiyyat", "Riyaziyyat", "Xarici dil"],
    "4": ["Biologiya", "Kimya", "Fizika", "Azərbaycan dili", "Riyaziyyat"]
}

export const TOPICS: Record<string, string[]> = {
    "Azərbaycan dili": ["Orfoqrafiya", "Qrammatika", "Ədəbiyyat"],
    "Riyaziyyat": ["Cəbr", "Həndəsə", "Trigonometriya"],
    "Fizika": ["Mexanika", "Optika", "Elektromagnetizm"],
    "Kimya": ["Kimya əsasları", "Üzvi kimya", "Qeyri-üzvi kimya"],
    "Biologiya": ["Botanika", "Zoologiya", "Genetika"],
    "Coğrafiya": ["Fiziki coğrafiya", "İqtisadi coğrafiya", "Azərbaycanın coğrafiyası"],
    "Azərbaycan tarixi": ["Qədim dövr", "Orta əsrlər", "Yeni dövr", "Müasir dövr"],
    "Ümumi tarix": ["Qədim dünya", "Orta əsrlər", "Yeni dövr", "Ən yeni tarix"],
    "İnformatika": ["Proqramlaşdırma", "Verilənlər bazası", "Şəbəkələr", "Alqoritmlər"],
    "Həyat bilgisi": ["Sağlam həyat tərzi", "İnsan və cəmiyyət", "Mədəniyyət və incəsənət"],
    "Təsviri incəsənət": ["Rəsm texnikaları", "Bəzək sənəti", "Rəng nəzəriyyəsi"],
    "Musiqi": ["Musiqi tarixi", "Nəzəriyyə", "Azərbaycan musiqisi"],
}

import { getAllTextbooks, getTextbooksByClass, Textbook } from './textbook-service';

export type { Textbook };

export const textbooks = getAllTextbooks();

export function getTextbooks(classNum: string, subject: string) {
    return getTextbooksByClass(classNum).filter(t => t.subject === subject);
}
