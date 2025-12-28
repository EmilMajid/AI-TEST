try {
    const pkg = require('pdf-parse/package.json');
    console.log('Installed version:', pkg.version);
    console.log('Main file:', pkg.main);
} catch (e) {
    console.error('Could not read package.json:', e.message);
}

const pdf = require('pdf-parse');
console.log('Export type:', typeof pdf);
if (typeof pdf === 'object') {
    console.log('Keys:', Object.keys(pdf));
}
