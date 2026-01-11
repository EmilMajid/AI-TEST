const { updateBook } = require('./metadata_helper');

const NEW_BOOKS = [
    {
        id: "cografiya-6-h1",
        title: "Coğrafiya 6 (hissə 1)",
        subject: "Coğrafiya",
        type: "pdf",
        path: "/textbooks/6/cografiya-hisse-1/book.pdf",
        contentPath: "public/textbooks/6/cografiya-hisse-1",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "informatika-6",
        title: "İnformatika 6",
        subject: "İnformatika",
        type: "pdf",
        path: "/textbooks/6/informatika/book.pdf",
        contentPath: "public/textbooks/6/informatika",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "edebiyyat-6",
        title: "Ədəbiyyat 6",
        subject: "Ədəbiyyat",
        type: "pdf",
        path: "/textbooks/6/edebiyyat/book.pdf",
        contentPath: "public/textbooks/6/edebiyyat",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "azerbaycan-tarixi-6",
        title: "Azərbaycan tarixi 6",
        subject: "Azərbaycan tarixi",
        type: "pdf",
        path: "/textbooks/6/azerbaycan-tarixi/book.pdf",
        contentPath: "public/textbooks/6/azerbaycan-tarixi",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "umumi-tarix-6",
        title: "Ümumi tarix 6",
        subject: "Ümumi tarix",
        type: "pdf",
        path: "/textbooks/6/umumi-tarix/book.pdf",
        contentPath: "public/textbooks/6/umumi-tarix",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "riyaziyyat-6-h1",
        title: "Riyaziyyat 6 (hissə 1)",
        subject: "Riyaziyyat",
        type: "pdf",
        path: "/textbooks/6/riyaziyyat-hisse-1/book.pdf",
        contentPath: "public/textbooks/6/riyaziyyat-hisse-1",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "azerbaycan-dili-6-h1",
        title: "Azərbaycan dili 6 (hissə 1)",
        subject: "Azərbaycan dili",
        type: "pdf",
        path: "/textbooks/6/azerbaycan-dili-hisse-1/book.pdf",
        contentPath: "public/textbooks/6/azerbaycan-dili-hisse-1",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "azerbaycan-dili-6-h2",
        title: "Azərbaycan dili 6 (hissə 2)",
        subject: "Azərbaycan dili",
        type: "pdf",
        path: "/textbooks/6/azerbaycan-dili-hisse-2/book.pdf",
        contentPath: "public/textbooks/6/azerbaycan-dili-hisse-2",
        topics: "Mövzular (Auto-TOC pending)"
    }
];

NEW_BOOKS.forEach(book => {
    updateBook(6, book.id, book);
    console.log(`Registered: ${book.title}`);
});
