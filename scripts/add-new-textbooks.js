const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/textbooks.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newBooks = [
    {
        id: "hayat-bilgisi-8",
        title: "Həyat bilgisi 8",
        subject: "Həyat bilgisi",
        type: "html",
        path: "/textbooks/8/hayat-bilgisi/Heyat-bilgisi-8/baslat.html",
        topics: ["Sağlam həyat tərzi", "İnsan və cəmiyyət", "Mədəniyyət və incəsənət"]
    },
    {
        id: "tesviri-incesenet-8",
        title: "Təsviri incəsənət 8",
        subject: "Təsviri incəsənət",
        type: "html",
        path: "/textbooks/8/tesviri-incesenet/Tesviri-incesenet-8/baslat.html",
        topics: ["Rəsm texnikaları", "Bəzək sənəti", "Rəng nəzəriyyəsi"]
    },
    {
        id: "musiqi-8",
        title: "Musiqi 8",
        subject: "Musiqi",
        type: "html",
        path: "/textbooks/8/musiqi/index.html", // Assuming standard path, will verify if needed
        topics: ["Musiqi tarixi", "Nəzəriyyə", "Azərbaycan musiqisi"]
    }
];

if (!data['8']) {
    data['8'] = [];
}

let addedCount = 0;
newBooks.forEach(newBook => {
    // Check if book already exists
    const exists = data['8'].some(b => b.title === newBook.title || b.subject === newBook.subject);
    if (!exists) {
        data['8'].push(newBook);
        console.log(`Added: ${newBook.title}`);
        addedCount++;
    } else {
        console.log(`Skipped (already exists): ${newBook.title}`);
    }
});

if (addedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully added ${addedCount} textbooks.`);
} else {
    console.log("No new textbooks added.");
}
