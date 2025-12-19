
const https = require('https');

const URL = 'https://www.e-derslik.edu.az/portal/index.php?class_id=5'; // 5-ci sinif filtri

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Look for book links like: <a href="book.php?id=502" class="we">...alt="Music 5"...</a>
        // OR better yet, search for the ID followed by title in the vicinity

        // Let's grab all occurrences of book indices
        const regex = /href="book\.php\?id=(\d+)"[^>]*>.*?alt="([^"]+)"/g;
        let match;
        const books = [];

        while ((match = regex.exec(data)) !== null) {
            books.push({ id: match[1], title: match[2] });
        }

        console.log("Found Books:", JSON.stringify(books, null, 2));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
