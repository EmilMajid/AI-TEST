const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'offline_tests.json');
let tests = {};
if (fs.existsSync(dbPath)) {
  tests = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

if (!tests['Riyaziyyat']) {
  tests['Riyaziyyat'] = [];
}

const newTests = [
  {
    "id": 50001,
    "category": "Riyaziyyat 5",
    "question": "Aşağıdakı kəsrlərdən hansı düzgün kəsrdir?",
    "options": ["5/4", "3/3", "7/8", "9/2"],
    "correctAnswer": 2,
    "explanation": "Düzgün kəsr o kəsrə deyilir ki, sürəti məxrəcindən kiçik olsun. Burada 7 < 8 olduğuna görə, 7/8 düzgün kəsrdir.",
    "passport_id": "05-004-0101-B2AM01-01-01-001"
  },
  {
    "id": 50002,
    "category": "Riyaziyyat 5",
    "question": "Düzgün olmayan kəsri seçin:",
    "options": ["1/5", "4/9", "11/12", "6/5"],
    "correctAnswer": 3,
    "explanation": "Düzgün olmayan kəsr o kəsrə deyilir ki, sürəti məxrəcinə bərabər və ya ondan böyük olsun. 6 > 5 olduğuna görə, 6/5 düzgün olmayan kəsrdir.",
    "passport_id": "05-004-0101-B2AM01-01-01-002"
  },
  {
    "id": 50003,
    "category": "Riyaziyyat 5",
    "question": "Aşağıdakı fikirlərdən hansı həmişə doğrudur?",
    "options": [
      "Bütün düzgün olmayan kəsrlər 1-dən kiçikdir.",
      "Bütün düzgün kəsrlər 1-dən böyükdür.",
      "Bütün düzgün kəsrlər 1-dən kiçikdir.",
      "Düzgün kəsrin sürəti həmişə məxrəcindən böyük olur."
    ],
    "correctAnswer": 2,
    "explanation": "Düzgün kəsrin sürəti məxrəcindən kiçik olduğu üçün o, həmişə vahiddən (1-dən) kiçikdir.",
    "passport_id": "05-004-0101-B2AM01-02-02-003"
  },
  {
    "id": 50004,
    "category": "Riyaziyyat 5",
    "question": "Məxrəci 7 olan neçə düzgün kəsr var?",
    "options": ["5", "6", "7", "8"],
    "correctAnswer": 1,
    "explanation": "Məxrəci 7 olan düzgün kəsrlərin sürəti 7-dən kiçik natural ədədlər olmalıdır: 1, 2, 3, 4, 5, 6. Deməli, cəmi 6 belə kəsr var.",
    "passport_id": "05-004-0101-B2AM01-03-02-004"
  },
  {
    "id": 50005,
    "category": "Riyaziyyat 5",
    "question": "x/8 kəsri düzgün olmayan kəsrdirsə, x-in ala biləcəyi ən kiçik natural qiymət neçədir?",
    "options": ["7", "8", "9", "1"],
    "correctAnswer": 1,
    "explanation": "Düzgün olmayan kəsrin sürəti məxrəcinə bərabər və ya ondan böyük olmalıdır (x ≥ 8). x-in ala biləcəyi ən kiçik natural qiymət 8-dir.",
    "passport_id": "05-004-0101-B2AM01-03-03-005"
  }
];

tests['Riyaziyyat'] = [...tests['Riyaziyyat'], ...newTests];
fs.writeFileSync(dbPath, JSON.stringify(tests, null, 2), 'utf8');
console.log('Successfully generated and appended 5 tests for 5th grade Riyaziyyat to offline_tests.json');
