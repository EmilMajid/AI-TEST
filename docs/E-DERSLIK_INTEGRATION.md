# E-derslik Textbook Integration Guide

## Overview
This guide explains how to download textbooks from e-derslik.edu.az and integrate them into the Azerbaijan AI Platform.

## Prerequisites

1. **Node.js** - Already installed
2. **Calibre** - Required for PDF conversion
   - Download: https://calibre-ebook.com/download
   - After installation, ensure `ebook-convert` is in your system PATH

## Step 1: Find Textbook Download URLs

1. Visit https://www.e-derslik.edu.az/portal
2. Navigate to the textbook you want to download
3. Open browser Developer Tools (F12)
4. Go to the Network tab
5. Click the download button for the textbook
6. Find the download request in the Network tab
7. Copy the download URL (usually ends with .zip, .epub, or .html)

## Step 2: Update the Download Script

Edit `scripts/download-textbooks.js` and update the `TEXTBOOKS_TO_PROCESS` array:

```javascript
{
    id: 'geo-8',
    title: 'Coğrafiya 8',
    class: '8',
    subject: 'Coğrafiya',
    downloadUrl: 'https://www.e-derslik.edu.az/path/to/textbook.epub', // Add real URL here
    manualPath: null, // OR set this if you downloaded manually
    outputFilename: 'geo-8.pdf',
    topics: [
        'Topic 1',
        'Topic 2',
        // ... add all topics
    ]
}
```

## Step 3: Run the Download Script

```bash
node scripts/download-textbooks.js
```

The script will:
- Download textbooks (if URL provided)
- Convert them to PDF using Calibre
- Save PDFs to `public/textbooks/`
- Show you the code to add to `lib/education-data.ts`

## Step 4: Manual Download (Alternative)

If automatic download doesn't work:

1. Download the textbook manually from e-derslik.edu.az
2. Save it to a temporary location
3. Update the script with `manualPath`:

```javascript
{
    id: 'geo-8',
    title: 'Coğrafiya 8',
    downloadUrl: null,
    manualPath: 'C:/Users/User/Downloads/geo-8.epub', // Path to downloaded file
    // ... rest of config
}
```

4. Run the script again

## Step 5: Update education-data.ts

The script will output code like this:

```typescript
{
    id: 'geo-8',
    title: 'Coğrafiya 8',
    class: '8',
    subject: 'Coğrafiya',
    pdfUrl: '/textbooks/geo-8.pdf',
    topics: [
        'Topic 1',
        'Topic 2',
        // ...
    ]
}
```

Add this to the `textbooks` array in `lib/education-data.ts`.

## Verification

1. Start the development server: `npm run dev`
2. Login as a student
3. Select the class and subject
4. Verify the textbook appears
5. Click "Read PDF" button
6. Verify the PDF loads correctly

## Troubleshooting

### Calibre not found
- Install Calibre from https://calibre-ebook.com/download
- Add Calibre to your system PATH
- Restart your terminal/command prompt

### Download fails
- Use manual download method
- Check if the URL is correct
- Some textbooks may require authentication

### PDF conversion fails
- Check if the input file format is supported (EPUB, MOBI, HTML, etc.)
- Try converting manually using Calibre GUI first
- Check Calibre error messages

## Current Status

✅ Infrastructure ready:
- `PdfViewer` component created
- API endpoint `/api/textbooks` created
- Dashboard updated with "Read PDF" button
- Download script ready

❌ Pending:
- Actual textbook downloads (requires manual step)
- Real textbook URLs from e-derslik.edu.az
- Calibre installation (user's machine)

## Next Steps

1. Install Calibre
2. Find download URLs for desired textbooks
3. Update `scripts/download-textbooks.js`
4. Run the script
5. Update `lib/education-data.ts` with generated code
