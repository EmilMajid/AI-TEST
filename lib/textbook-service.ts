import textbooksData from '@/data/textbooks.json';

export interface Textbook {
    id: string;
    title: string;
    class: string;
    subject: string;
    topics: string[];
    fileUrl?: string; // For HTML books
    pdfUrl?: string;  // For PDF books
    type: 'pdf' | 'html';
    contentPath?: string; // For AI reading
}

import { TOPICS } from './education-data';

// Helper to get all textbooks
export function getAllTextbooks(): Textbook[] {
    const allBooks: Textbook[] = [];

    Object.entries(textbooksData).forEach(([grade, books]) => {
        if (!Array.isArray(books)) return; // Skip non-array entries (e.g. subject-keyed single book objects)
        (books as any[]).forEach(book => {
            let topics: string[] = [];
            if (Array.isArray(book.topics)) {
                topics = book.topics;
            } else if (typeof book.topics === 'string') {
                // Split multi-line strings into individual topics
                topics = book.topics.split('\n').filter((t: string) => t.trim().length > 0);
            }

            allBooks.push({
                id: book.id,
                title: book.title,
                class: grade,
                subject: book.subject,
                topics: topics,
                type: book.type,
                fileUrl: book.type === 'html' ? book.path : undefined,
                pdfUrl: book.type === 'pdf' ? book.path : undefined,
                contentPath: book.contentPath
            });
        });
    });

    return allBooks;
}

export function getTextbooksByClass(grade: string): Textbook[] {
    const books = (textbooksData as any)[grade];
    if (!books) return [];

    return books.map((book: any) => {
        let topics: string[] = [];
        if (Array.isArray(book.topics)) {
            topics = book.topics;
        } else if (typeof book.topics === 'string') {
            topics = book.topics.split('\n').filter((t: string) => t.trim().length > 0);
        }

        return {
            id: book.id,
            title: book.title,
            class: grade,
            subject: book.subject,
            topics: topics,
            type: book.type,
            fileUrl: book.type === 'html' ? book.path : undefined,
            pdfUrl: book.type === 'pdf' ? book.path : undefined,
            contentPath: book.contentPath
        };
    });
}
