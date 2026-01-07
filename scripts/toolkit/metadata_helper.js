/**
 * UIS Metadata Helper
 * Standardizes read/write operations for textbooks.json and manual-topics.json
 */
const fs = require('fs');
const path = require('path');

const TEXTBOOKS_FILE = path.join(__dirname, '../../data/textbooks.json');

function getGradeData(grade) {
    const data = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, 'utf8'));
    return data[grade.toString()] || [];
}

function updateBook(grade, bookId, updates) {
    const data = JSON.parse(fs.readFileSync(TEXTBOOKS_FILE, 'utf8'));
    const gradeStr = grade.toString();
    if (!data[gradeStr]) data[gradeStr] = [];

    const index = data[gradeStr].findIndex(b => b.id === bookId);
    if (index !== -1) {
        data[gradeStr][index] = { ...data[gradeStr][index], ...updates };
    } else {
        data[gradeStr].push({ id: bookId, ...updates });
    }

    fs.writeFileSync(TEXTBOOKS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { getGradeData, updateBook };
