---
description: Add and Integrate a New Textbook
---

This workflow guides you through adding a new textbook to the system and ensuring its topics are correctly extracted and registered.

1. **Verify Folder Structure**
   - Check if the textbook exists in `public/textbooks/[class]/[subject-slug]`.
   - Ensure `OEBPS` folder exists.
   - Example: `ls public/textbooks/8/informatika/OEBPS`

2. **Register Subject (If New)**
   - Check `lib/education-data.ts`. Is the subject listed in `subjectsByClass`? If not, add it.
     - **Critial**: The name in `subjectsByClass` must match the `SUBJECT_MAPPING` display name.
   - Check `app/api/textbooks/topics/route.ts`. Is the directory slug mapped in `SUBJECT_MAPPING`? If not, add it.

3. **Check Extraction Status**
   - Use `read_url_content` (or `browser`) to hit `/api/textbooks/topics?class=[class]`.
   - Look for the subject in the response.
   - If topics are missing or look like garbage:
     - Run `node scripts/extract-topics-from-pages.js` to attempt auto-extraction.
     - Re-check the API.

4. **Manual Override (If needed)**
   - If extraction is still poor, edit `scripts/manual-topics.json`.
   - Add an entry for the `subject-slug` manually defining chapters and topics.
   - Run `node scripts/extract-topics-from-pages.js` again (it merges manual topics).

5. **Verify**
   - Use the `browser_subagent` to check `/admin/test-bank/topics`.
   - Filter by Class and Subject.
   - Confirm topics populate the dropdown or table.
