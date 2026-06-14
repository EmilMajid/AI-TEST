const fs = require('fs');
const data = fs.readFileSync('temp_index.html', 'utf8');
const matches = data.match(/[^\"\'\s>]+\.(xhtml|xml|json)/gi);
if (matches) {
    console.log(matches.slice(0, 20));
} else {
    console.log("No xhtml/xml/json URLs found!");
}
