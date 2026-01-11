const { updateBook } = require('./metadata_helper');

const NEW_BOOKS = [
    {
        id: "tesviri-incesenet-6",
        title: "Təsviri incəsənət 6",
        subject: "Təsviri İncəsənət",
        type: "pdf",
        path: "/textbooks/6/tesviri-incesenet/book.pdf",
        contentPath: "public/textbooks/6/tesviri-incesenet",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "musiqi-6",
        title: "Musiqi 6",
        subject: "Musiqi",
        type: "pdf",
        path: "/textbooks/6/musiqi/book.pdf",
        contentPath: "public/textbooks/6/musiqi",
        topics: "Mövzular (Auto-TOC pending)"
    },
    {
        id: "texnologiya-6",
        title: "Texnologiya 6",
        subject: "Texnologiya",
        type: "pdf",
        path: "/textbooks/6/texnologiya/book.pdf",
        contentPath: "public/textbooks/6/texnologiya",
        topics: "Mövzular (Auto-TOC pending)"
    }
];

NEW_BOOKS.forEach(book => {
    updateBook(6, book.id, book);
    console.log(`Registered: ${book.title}`);
});
