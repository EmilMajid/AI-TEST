const fs = require('fs');

const currentTopics = "Təsviri sənət və həyat\nTəsviri sənətin növləri\nRəngkarlıq\nQrafika\nHeykəltəraşlıq\nDekorativ-tətbiqi sənət\nMemarlıq\nDizayn\nİncəsənət muzeyləri\nAzərbaycan incəsənəti\nDünya incəsənəti\nMənzərə\nPortret\nNatürmort\nOrnament və naxışlar";

const realTopics = `XALQ SƏNƏTİNİN YARADICILIQ MƏNBƏYİ
1. Dekorativ-tətbiqi sənət və zaman
2. Simvollara çevrilmiş təbiət
3. Azərbaycan daxmasının daxili dünyası
4. Xalq məişət əşyaları — forma və dekor
5. Xalça naxışları
6. Azərbaycan tikmələrində kompozisiya
7. Tarix və Etnoqrafiya Muzeyləri
ULU İRSİMİZ — XALQ GEYİMLƏRİ VƏ AZƏRBAYCAN XALÇALARI
8-9. Xalq geyimləri
10-11. Xovsuz xalçalar
12. Azərbaycan Xalça Muzeyi
DEKOR — İNSAN, CƏMİYYƏT, ZAMAN
13. İnsanlara bəzək nə üçün lazımdır
14. Qədim Misir — geyim və dekor
15. Qədim Misirin dekorativ-tətbiqi sənəti — simvollarda forma, dekor və rəng
16. Qədim Çin geyim ənənələri — simvol və rəng
17. Qərbi Avropanın dekorativ-tətbiqi sənəti. 17-ci əsr
18. Heraldika — gerb və emblemlər
19-20. Müxtəlif dövr sənətkarlarının yaradıcılığı
MÜASİR DEKORATİV-TƏTBİQİ SƏNƏT
21. Müasir incəsənət sərgisi
22. Keramika
23. Bədii şüşə
24. Bədii metal — döymə və tökmə
25. Qobelen
26. Zərif batika
27. Biz “sənətkarıq”`;

console.log("=== ART 5 TOPIC GAP ANALYSIS ===\n");
console.log(`Current (Placeholder) Count: ${currentTopics.split('\n').length}`);
console.log(`Real (Orphaned) Count: ${realTopics.split('\n').filter(l => /^\d/.test(l.trim())).length}`);

console.log("\n--- DISCREPANCY REASON ---");
console.log("1. The current data contains generic, non-sequenced Art subjects (e.g., 'Rəngkarlıq', 'Qrafika').");
console.log("2. The real data is highly structured with Chapters and numbered Lessons.");
console.log("3. The extraction script ignored this PDF because it's a 'Pure PDF' without an electronic TOC, and our fallback was a static placeholder list.");

console.log("\n--- ACTION PLAN ---");
console.log("1. Update manual-topics.json with the real structure.");
console.log("2. Upgrade Universal Audit to flag books with < 20 topics as 'SUSPICIOUS'.");
console.log("3. Apply this fix to Music, Tech, PE, and Foreign Languages.");
