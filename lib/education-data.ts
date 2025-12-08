export const subjectsByClass: Record<string, string[]> = {
    "1": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "2": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "3": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "4": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Tarix", "İnformatika", "Təbiət", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "6": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "7": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Texnologiya", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Ortaq türk tarixi", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "İkinci xarici dil", "Texnologiya", "Fiziki tərbiyə", "Həyat bilgisi", "Təsviri incəsənət", "Musiqi"],
    "9": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Həyat bilgisi"],
    "10": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Gənclərin çağırışaqədərki hazırlığı"],
    "11": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Gənclərin çağırışaqədərki hazırlığı"]
}

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
    "Tarix": ["Qədim dövr", "Orta əsrlər", "Yeni dövr", "Müasir dövr"],
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
