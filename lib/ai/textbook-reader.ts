import fs from 'fs';
import path from 'path';
import { getTextbooksByClass } from '../textbook-service';

// Simple HTML tag stripper
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export async function getTextbookContent(grade: string, subject: string): Promise<string> {
    const books = getTextbooksByClass(grade);
    const book = books.find(b => b.subject.toLowerCase() === subject.toLowerCase());

    if (!book || !book.contentPath) {
        throw new Error(`Textbook not found for Grade ${grade} ${subject}`);
    }

    const fullPath = path.join(process.cwd(), book.contentPath);

    try {
        // Read all HTML files in the directory recursively
        const files = await getHtmlFiles(fullPath);
        let allContent = "";

        for (const file of files) {
            const content = await fs.promises.readFile(file, 'utf-8');
            allContent += stripHtml(content) + "\n\n";
        }

        return allContent;
    } catch (error) {
        console.error("Error reading textbook content:", error);
        throw error;
    }
}

async function getHtmlFiles(dir: string): Promise<string[]> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getHtmlFiles(res) : res;
    }));
    return Array.prototype.concat(...files).filter(f => f.endsWith('.html') || f.endsWith('.xhtml'));
}
