export const subjectsByClass: Record<string, string[]> = {
    "1": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "2": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "3": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "4": ["Azərbaycan dili", "Riyaziyyat", "Həyat bilgisi", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "5": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Tarix", "İnformatika", "Təbiət", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "6": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Təsviri incəsənət", "Texnologiya", "Fiziki tərbiyə", "Musiqi"],
    "7": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Texnologiya", "Fiziki tərbiyə"],
    "8": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Texnologiya", "Fiziki tərbiyə"],
    "9": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Həyat bilgisi"],
    "10": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Gənclərin çağırışaqədərki hazırlığı"],
    "11": ["Azərbaycan dili", "Ədəbiyyat", "Riyaziyyat", "Azərbaycan tarixi", "Ümumi tarix", "Fizika", "Kimya", "Biologiya", "Coğrafiya", "İnformatika", "Xarici dil", "Fiziki tərbiyə", "Gənclərin çağırışaqədərki hazırlığı"]
}

import { getAllTextbooks, getTextbooksByClass, Textbook } from './textbook-service';

export type { Textbook };

export const textbooks = getAllTextbooks();

export function getTextbooks(classNum: string, subject: string) {
    return getTextbooksByClass(classNum).filter(t => t.subject === subject);
}

