const https = require('https');

// Search TRIMS for all Grade 5 textbooks
const searchUrl = 'https://www.trims.edu.az/site/search.php?category_id=c-1&classes_id%5B%5D=5&book_type_id=5&lang_id=1&search=ok';

https.get(searchUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Extract resource IDs and titles
        const regex = /resource\.php\?id=(\d+)[\s\S]*?"([^"]+)"\s+fənni\s+üzrə\s+5-ci\s+sinif/g;
        const simpleRegex = /DETAL.*?resource\.php\?id=(\d+).*?>\s*"?([^<"]+)"?\s+fənni/gs;

        let match;
        const books = new Map();

        // Try to find all book references
        const allMatches = data.match(/resource\.php\?id=\d+/g) || [];
        console.log('Found resource links:', allMatches.length);

        // Extract titles near resource links
        const titlePattern = /"([^"]+)"\s+fənni\s+üzrə\s+5-ci\s+sinif\s+üçün\s+dərslik/g;
        while ((match = titlePattern.exec(data)) !== null) {
            console.log('Title found:', match[1]);
        }

        // Look for specific subjects we need
        const subjects = ['Həyat bilgisi', 'Musiqi', 'Təsviri incəsənət', 'Texnologiya', 'Fiziki tərbiyə'];
        subjects.forEach(subject => {
            const pattern = new RegExp(`resource\\.php\\?id=(\\d+)[\\s\\S]{0,200}${subject}`, 'i');
            const found = data.match(pattern);
            if (found) {
                console.log(`✅ Found ${subject}: ID ${found[1]}`);
            } else {
                console.log(`❌ Not found: ${subject}`);
            }
        });
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
