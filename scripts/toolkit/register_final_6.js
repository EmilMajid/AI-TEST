const { updateBook } = require('./metadata_helper');

const NEW_BOOKS = [
    { id: "alman-dili-6-2", title: "Alman dili 6 (ikinci xarici dil)", subject: "İkinci xarici dil", type: "pdf", path: "/textbooks/6/alman-dili-2/book.pdf", contentPath: "public/textbooks/6/alman-dili-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "alman-dili-6", title: "Alman dili 6 (əsas xarici dil)", subject: "Xarici dil", type: "pdf", path: "/textbooks/6/alman-dili/book.pdf", contentPath: "public/textbooks/6/alman-dili", topics: "Mövzular (Auto-TOC pending)" },
    { id: "tebiet-6-h1", title: "Təbiət 6 (hissə 1)", subject: "Təbiət", type: "pdf", path: "/textbooks/6/tebiet-hisse-1/book.pdf", contentPath: "public/textbooks/6/tebiet-hisse-1", topics: "Mövzular (Auto-TOC pending)" },
    { id: "tebiet-6-h2", title: "Təbiət 6 (hissə 2)", subject: "Təbiət", type: "pdf", path: "/textbooks/6/tebiet-hisse-2/book.pdf", contentPath: "public/textbooks/6/tebiet-hisse-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "fiziki-terbiye-6", title: "Fiziki tərbiyə 6", subject: "Fiziki tərbiyə", type: "pdf", path: "/textbooks/6/fiziki-terbiye/book.pdf", contentPath: "public/textbooks/6/fiziki-terbiye", topics: "Mövzular (Auto-TOC pending)" },
    { id: "cografiya-6-h2", title: "Coğrafiya 6 (hissə 2)", subject: "Coğrafiya", type: "pdf", path: "/textbooks/6/cografiya-hisse-2/book.pdf", contentPath: "public/textbooks/6/cografiya-hisse-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "riyaziyyat-6-h2", title: "Riyaziyyat 6 (hissə 2)", subject: "Riyaziyyat", type: "pdf", path: "/textbooks/6/riyaziyyat-hisse-2/book.pdf", contentPath: "public/textbooks/6/riyaziyyat-hisse-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "rus-dili-6", title: "Rus dili 6 (əsas xarici dil)", subject: "Xarici dil", type: "pdf", path: "/textbooks/6/rus-dili/book.pdf", contentPath: "public/textbooks/6/rus-dili", topics: "Mövzular (Auto-TOC pending)" },
    { id: "rus-dili-6-2", title: "Rus dili 6 (ikinci xarici dil)", subject: "İkinci xarici dil", type: "pdf", path: "/textbooks/6/rus-dili-2/book.pdf", contentPath: "public/textbooks/6/rus-dili-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "fransiz-dili-6", title: "Fransız dili 6 (əsas xarici dil)", subject: "Xarici dil", type: "pdf", path: "/textbooks/6/fransiz-dili/book.pdf", contentPath: "public/textbooks/6/fransiz-dili", topics: "Mövzular (Auto-TOC pending)" },
    { id: "fransiz-dili-6-2", title: "Fransız dili 6 (ikinci xarici dil)", subject: "İkinci xarici dil", type: "pdf", path: "/textbooks/6/fransiz-dili-2/book.pdf", contentPath: "public/textbooks/6/fransiz-dili-2", topics: "Mövzular (Auto-TOC pending)" },
    { id: "ingilis-dili-6", title: "İngilis dili 6 (əsas xarici dil)", subject: "Xarici dil", type: "pdf", path: "/textbooks/6/ingilis-dili/book.pdf", contentPath: "public/textbooks/6/ingilis-dili", topics: "Mövzular (Auto-TOC pending)" }
];

NEW_BOOKS.forEach(book => {
    updateBook(6, book.id, book);
    console.log(`Registered: ${book.title}`);
});
