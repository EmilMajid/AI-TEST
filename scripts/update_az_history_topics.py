import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

topics_text = """AZƏRBAYCAN ERKƏN ORTA ƏSRLƏRDƏ
1. Feodal münasibətlərinin inkişafı
2. Ərəb işğalına qarşı mübarizə. Cavanşir
3. Xilafət dövründə idarəetmə, torpaq və vergi siyasəti
4. Xürrəmilər hərəkatı. Babək
5. İslamın milli və mədəni inkişafa təsiri.
AZƏRBAYCAN DÖVLƏTÇİLİYİNİN DİRÇƏLİŞİ
6. Müstəqil dövlətçiliyin bərpası
7. Azərbaycan vahid dövlət tərkibində
8. Xudafərin körpüsünün birləşdirdiyi iki Azərbaycan dövləti
9. Slavyanların hücumları
10. Əhalinin məşğuliyyəti və həyat tərzi
11. IX-XI əsrlərdə Azərbaycan mədəniyyəti
OĞUZ-SƏLCUQ AXINLARI VƏ AZƏRBAYCAN
12. Oğuz-səlcuq axınları
13. Azərbaycan XII-XIII əsrin əvvəllərində
14. XI əsrin ortaları - XII əsrdə mədəniyyət
YADELLİ İŞĞALÇILARA QARŞI MÜBARİZƏ
15. Monqol yürüşlərinə qarşı mübarizə
16. Azərbaycan Elxanilər dövlətinin mərkəzi kimi.
17. Azərbaycan uğrunda mübarizə
18. Şirvanşahlar dövləti və Şəki hakimliyi
XIII-XIV əsrin başlanğıcında
19. XIII-XIV əsrlərdə mədəniyyətin inkişafı
VAHİD AZƏRBAYCAN UĞRUNDA
20. Qara Yusif və varisləri
21. Həsən padşah və varisləri
22. Ərdəbil hakimliyi
23. XV əsrdə ictimai-siyasi və iqtisadi vəziyyət
24. Mərkəzləşdirilmiş vahid Azərbaycan dövləti
25. Səfəvi-Osmanlı müharibələrinin başlanması
26. XV-XVI əsrlərdə Azərbaycan mədəniyyəti"""

found = False
if "7" in d:
    for i, b in enumerate(d["7"]):
        if b["id"] == "azerbaycan-tarixi-7":
            d["7"][i]["topics"] = topics_text
            found = True
            break

if found:
    with open(p, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    print("textbooks.json updated with Azerbaijan History 7 topics.")
else:
    print("Azerbaijan History 7 not found in registry.")
