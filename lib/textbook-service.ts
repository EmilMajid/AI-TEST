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
        (books as any[]).forEach(book => {
            let topics: string[] = [];
            if (Array.isArray(book.topics)) {
                topics = book.topics;
            } else if (typeof book.topics === 'string') {
                // If it's a string, it might be corrupted data from JSON.
                // Try to fallback to the static TOPICS list if available for this subject.
                if (TOPICS[book.subject]) {
                    topics = TOPICS[book.subject];
                } else {
                    // Worst case: try to just make it a single item or empty
                    topics = [book.topics];
                }
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
            if (TOPICS[book.subject]) {
                topics = TOPICS[book.subject];
            } else {
                topics = [book.topics];
            }
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
