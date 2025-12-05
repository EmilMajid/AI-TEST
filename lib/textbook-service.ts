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
    language?: string; // For foreign languages (e.g., "İngilis dili", "Rus dili")
}

// Helper to get all textbooks
export function getAllTextbooks(): Textbook[] {
    const allBooks: Textbook[] = [];

    Object.entries(textbooksData).forEach(([grade, books]) => {
        (books as any[]).forEach(book => {
            allBooks.push({
                id: book.id,
                title: book.title,
                class: grade,
                subject: book.subject,
                topics: book.topics || [], // Use topics from JSON
                type: book.type,
                fileUrl: book.type === 'html' ? book.path : undefined,
                pdfUrl: book.type === 'pdf' ? book.path : undefined,
                contentPath: book.contentPath,
                language: book.language
            });
        });
    });

    return allBooks;
}

export function getTextbooksByClass(grade: string): Textbook[] {
    const books = (textbooksData as any)[grade];
    if (!books) return [];

    return books.map((book: any) => ({
        id: book.id,
        title: book.title,
        class: grade,
        subject: book.subject,
        topics: book.topics || [], // Use topics from JSON
        type: book.type,
        fileUrl: book.type === 'html' ? book.path : undefined,
        pdfUrl: book.type === 'pdf' ? book.path : undefined,
        contentPath: book.contentPath,
        language: book.language
    }));
}
