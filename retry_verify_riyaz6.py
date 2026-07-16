"""
Riyaziyyat 6 Test Yoxlama - Təkrar Cəhd Skripti
Yalnız API limiti (429) səbəbindən "AI cavab vermədi" xətası alan testləri yenidən yoxlayır.
Limitləri aşmamaq üçün kiçik həcmlər (2 test/batch) və uzun fasilələrlə işləyir.
"""
import json
import re
import time
import os
from openai import OpenAI

NVIDIA_KEY = "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"
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_KEY,
    timeout=300.0
)

OFFLINE_TESTS = "data/offline_tests.json"
REPORT_FILE = r"C:\Users\User\.gemini\antigravity\scratch\riyaz6_yoxlama_hesabat.json"

# Riyaziyyat 6 mövzu kontekst bilgisi (dərslik əsasında)
TOPIC_CONTEXT = {
    "1.1. Natural ədədin qüvvəti": "a^n = a×a×...×a (n dəfə). Əsas, göstərici. Xüsusi hallar: a^1=a, a^0=1 (a≠0). Onluq yazılış. Kvadrat, kub qüvvət.",
    "1.2. Sadə və mürəkkəb ədədlər": "Sadə ədəd - yalnız 1 və özünə bölünən natural ədəd (2,3,5,7,11...). Mürəkkəb ədəd - başqa bölənləri var. 1 nə sadə, nə mürəkkəb. Eratosfen ələği. Mürəkkəb ədədin sadə çarpanlara ayrılması.",
    "1.3. Ən böyük ortaq bölən (ƏBOB)": "ƏBOB(a,b) - a və b-nin ümumi bölənlərinin ən böyüyü. Tapma üsulları: sadə çarpanlara ayırma, Evklid alqoritmi. ƏBOB(a,b)×ƏKOB(a,b)=a×b.",
    "1.4. Ən kiçik ortaq bölünən (ƏKOB)": "ƏKOB(a,b) - a və b-yə bölünən ən kiçik müsbət tam ədəd. Tapma: sadə çarpanlar. ƏKOB=a×b/ƏBOB(a,b).",
    "2.1. Nisbət": "a/b nisbəti (b≠0). Nisbətin qiyməti. Əvvəl və axır həddlər. Nisbətin sadələşdirilməsi. Tərslənmiş nisbət.",
    "2.2. Kəmiyyətlərin nisbəti": "Eyni cinsli kəmiyyətlərin nisbəti. Ölçü vahidlərinin birləşdirilməsi. m/n formasında nisbət.",
    "2.3. Kəmiyyətin verilən nisbətdə bölünməsi": "a kəmiyyətinin m:n nisbətində bölünməsi: birinci hissə = a×m/(m+n), ikinci hissə = a×n/(m+n).",
    "2.4. Tənasüb": "a:b = c:d tənasübu. Əsas xüsusiyyət: a×d = b×c. Əvvəl, axır, orta həddlər. Dördüncü mütənasib ədədin tapılması.",
    "2.5. Miqyas": "Miqyas = xəritədəki məsafə / həqiqi məsafə. 1:n, 1/n. Miqyas üzrə məsafənin hesablanması.",
    "2.6. Düz mütənasib asılılıq": "y = kx (k>0). Bir kəmiyyət artdıqca digəri eyni nisbətdə artar. y/x = const.",
    "2.7. Tərs mütənasib asılılıq": "y = k/x (k>0). Bir kəmiyyət artdıqca digəri azalar. x×y = const.",
    "2.8. Nisbətin faizlə ifadəsi": "Faiz = 1/100. a%-in tapılması: S×a/100. Bütünün faizlə tapılması.",
    "2.9. Kəmiyyətin dəyişməsinin faizlə ifadəsi": "Artım faizi = (yeni-köhnə)/köhnə × 100%. Azalma faizi. Faizlə artım/azalmadan sonra yeni qiymətin tapılması.",
    "3.1. Tam ədədlər": "Tam ədədlər: ...-3,-2,-1,0,1,2,3... Mənfi ədədlər. Tam ədədlər oxu. Müsbət, mənfi, sıfır.",
    "3.2. Tam ədədlərin müqayisəsi və sıralanması": "Ədədlər oxunda solda olan kiçikdir. Mənfi ədədlərin müqayisəsi. Modul. Sıralama.",
    "3.3. Ədədin mütləq qiyməti": "|a| = a (a≥0), |a| = -a (a<0). Mütləq qiymətin xüsusiyyətləri. |a|≥0, |a|=|-a|.",
    "3.4. Tam ədədlərin toplanması": "Eyni işarəli: modulları toplanır, işarə saxlanılır. Fərqli işarəli: modulların fərqi, böyük modulun işarəsi.",
    "3.5. Tam ədədlərin çıxılması": "a-b = a+(-b). Əks ədəd. Çıxma toplamayla əvəzlənir.",
    "3.6. Tam ədədlərin vurulması və bölünməsi": "Eyni işarəli: müsbət nəticə. Fərqli işarəli: mənfi nəticə. (+)×(+)=+, (-)×(-)=+, (+)×(-)=-.",
    "3.7. Tam ədədlər üzərində əməllər": "Toplama, çıxma, vurma, bölmə. Mötərizənin açılması. Əməllərin ardıcıllığı.",
    "4.1. Düzbucaqlı koordinat sistemi": "x-ox, y-ox. Koordinat müstəvisi. Koordinat (x;y). Nöqtənin koordinatları. Çeyrəklər (I, II, III, IV).",
    "4.2. Düzbucaqlı koordinat sistemində məsafə": "İki nöqtə arasındakı məsafə: d = √((x₂-x₁)²+(y₂-y₁)²). Koordinat oxlarındakı məsafə.",
    "4.3. Düzbucaqlı koordinat sistemində simmetriya və yerdəyişmə": "x-oxuna görə simmetriya: (x;y)→(x;-y). y-oxuna görə: (x;y)→(-x;y). Orijinə görə: (x;y)→(-x;-y). Paralel yerdəyişmə.",
    "5.1. Çoxluq": "Çoxluq anlayışı. Element. Boş çoxluq. Çoxluğun təsviri (sadalama, xarakteristik). Alt çoxluq. ∈, ∉, ⊂, ⊃.",
    "5.2. Çoxluqlar üzərində əməllər": "Birləşmə (∪): A∪B. Kəsişmə (∩): A∩B. Fərq: A\\B. Tamamlayan çoxluq.",
    "5.3. Eyler-Venn diaqramının köməyi ilə məsələ həlli": "Eyler-Venn diaqramı. Çoxluqların sxematik təsviri. |A∪B| = |A| + |B| - |A∩B|.",
    "6.1. Dəyişəni olan ifadələr": "Dəyişən, sabit. Ədədi ifadə, hərf ifadəsi. İfadənin qiyməti. Standart forma.",
    "6.2. Riyazi ifadələrdə mötərizələrin açılması": "+(a+b) = a+b. -(a+b) = -a-b. a(b+c) = ab+ac. Paylama qanunu.",
    "6.3. Dəyişənli ifadələrin sadələşdirilməsi": "Oxşar həddlər. Oxşar həddlərin birləşdirilməsi. İfadənin standart forması.",
    "6.4. Tənliklər": "Tənlik - dəyişəni olan bərabərlik. Kök (həll). Tənliyin həll üsulu: eyni əməlləri tətbiq etmə. Ekvivalent tənliklər.",
    "6.5. Tənlik qurmaqla məsələ həlli": "Məsələnin şərtini tənliklə ifadə etmə. Bilinməyəni x ilə işarə etmə. Tənliyin həlli. Cavabın yoxlanması.",
    "6.6. Bərabərsizliklər": "Bərabərsizlik: a<b, a>b, a≤b, a≥b. Xassələri: monotonluq. Bərabərsizliyin həll çoxluğu. Ədəd oxunda göstərmə.",
    "7.1. Üçbucağın medianı, tənböləni və hündürlüyü": "Median - təpədən əks tərəfin orta nöqtəsinə. Tənbölən - bucağı iki bərabər hissəyə bölür. Hündürlük - təpədən əks tərəfə perpendikulyar.",
    "7.2. Üçbucaqların konqruyentlik əlamətləri": "1-ci: üç tərəf (TTT). 2-ci: iki tərəf və aralarındakı bucaq (TBT). 3-cü: bir tərəf və iki bucaq (BTB). Konqruyent üçbucaqlar ≅.",
    "7.3. Düz xətlərin paralelliyi": "Paralel xətlər: a∥b. Kəsici xətt. Müvafiq bucaqlar, növbəli daxili bucaqlar, daxili birtərəfli bucaqlar. Parallellik əlamətləri.",
    "7.4. Üçbucağın bucaqlarının cəmi": "Üçbucağın daxili bucaqlarının cəmi 180°. Xarici bucaq - bitişik olmayan iki daxili bucağın cəminə bərabər.",
    "7.5. Üç tərəfinə görə üçbucağın qurulması": "Üçbucaq qurulma şərti: hər tərəf digər iki tərəfin cəmindən kiçik. Sirkuldan istifadə.",
    "8.1. Üçbucağın sahəsi": "S = (a×h)/2. Heron düsturu: S = √(p(p-a)(p-b)(p-c)), p=(a+b+c)/2. Düzbucaqlı üçbucaq: S = (a×b)/2.",
    "8.2. Paraleloqram və rombun sahəsi": "Paraleloqram: S = a×h. Romb: S = (d₁×d₂)/2. Düzbucaqlı: S = a×b.",
    "8.3. Çevrənin uzunluğu. Dairənin sahəsi": "Çevrə uzunluğu: C = 2πr = πd. Dairənin sahəsi: S = πr². π ≈ 3.14.",
    "8.4. Düz üçbucaqlı prizmanın və silindrin səthinin sahəsi": "Prizma: S = 2×S_əsas + P_əsas×h. Silindr: S = 2πr² + 2πrh = 2πr(r+h).",
    "8.5. Düz üçbucaqlı prizmanın və silindrin həcmi": "Prizma: V = S_əsas × h. Silindr: V = πr²h.",
    "9.1. Median və moda": "Median - sıralanmış məlumatların orta qiyməti. Moda - ən çox təkrarlanan qiymət. Arifmetik orta = cəm/say.",
    "9.2. Təsadüfi hadisə": "Təsadüfi təcrübə. Nəticə. Hadisə: mümkün, qeyri-mümkün, mütləq. Nümunə fəzası.",
    "9.3. Hadisənin ehtimalı": "P(A) = m/n. m - əlverişli nəticələr, n - bütün nəticələr. 0 ≤ P(A) ≤ 1. P(mütləq)=1, P(qeyri-mümkün)=0.",
    "9.4. Məlumatların təsviri": "Cədvəl, sütunlu diaqram, sektor diaqramı, xətti diaqram. Tezlik. Nisbi tezlik = tezlik/ümumi say."
}

def check_content_with_ai(tests_batch, topic, context):
    tests_str = json.dumps([{
        "id": t.get("id","?"),
        "q": t.get("question",""),
        "opts": t.get("options",[]),
        "correct": t.get("correctAnswer","?"),
        "explanation": t.get("explanation","")
    } for t in tests_batch], ensure_ascii=False)
    
    prompt = f"""Sən Azərbaycan riyaziyyat müəllimisinə (6-cı sinif) yardımçısın.

MÖVZU: "{topic}"
MÖVZU KONTEKSTI: {context}

Aşağıdakı {len(tests_batch)} testi yoxla:
{tests_str}

HƏR TEST ÜÇÜN YOXLA:
1. Sual bu mövzuya aiddir? (mövzudan kənar konsept varmı?)
2. Riyazi düzgünlük: göstərilən cavab həqiqətən doğrudur?
3. Distraktorlar məqbuldur? (açıq-aşkar absurd variantlar?)
4. Mövzuya aid olmayan simvol/işarə/anlayış istifadə olunub?

JSON cavab ver (heç bir başqa mətn olmadan):
{{
  "results": [
    {{
      "id": "test id",
      "topic_ok": true/false,
      "math_ok": true/false,
      "distractor_ok": true/false,
      "issues": ["problem varsa siyahı"],
      "verdict": "KEÇƏR" / "XƏTERLİ" / "RƏDD"
    }}
  ]
}}"""

    for attempt in range(5): # Up to 5 retries on 429
        try:
            r = client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                top_p=0.95,
                max_tokens=2048,
                extra_body={"chat_template_kwargs": {"thinking": False}},
                stream=False
            )
            raw = r.choices[0].message.content.strip()
            m = re.search(r'\{.*\}', raw, re.DOTALL)
            if m:
                return json.loads(m.group())
        except Exception as e:
            err_msg = str(e)
            print(f"      API xəta (Cəhd {attempt+1}): {err_msg[:80]}")
            if "429" in err_msg or "Too Many Requests" in err_msg:
                print("      [!] Limit aşıldı, 60 saniyə gözləyirik...")
                time.sleep(60) # Long backoff
            else:
                time.sleep(10)
    return None

def main():
    print("Yenidən yoxlama başlayır (limit-friendly)...")
    
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        report = json.load(f)
        
    with open(OFFLINE_TESTS, 'r', encoding='utf-8') as f:
        db = json.load(f)
        
    all_tests = {t["id"]: t for t in db.get("Riyaziyyat 6", []) if "id" in t}
    
    # AI cavab vermədiyi üçün xəbərdarlıq alan testləri tapmaq
    to_retry = []
    for w in list(report.get("warning_tests", [])):
        if "AI yoxlaması alınmadı" in w.get("issues", []) or "AI cavab vermədi" in w.get("issues", []):
            if w.get("id"):
                to_retry.append((w["topic"], w["id"]))
            elif "id" not in w:
                # bəzi testlərin batch xətası olduqda id düşməyib, ümumi topic üzrə bax
                pass

    # Batch failing without ID logic:
    # When an entire batch failed, the previous script logged one warning per test with id
    # So to_retry list has tuples of (topic, id)
    
    print(f"Yenidən yoxlanacaq test sayı (əvvəl AI-dən keçə bilməyən): {len(to_retry)}")
    if not to_retry:
        print("Bütün testlər artıq AI tərəfindən uğurla yoxlanıb.")
        return

    # Group by topic
    from collections import defaultdict
    retry_groups = defaultdict(list)
    for topic, tid in to_retry:
        if tid in all_tests:
            retry_groups[topic].append(all_tests[tid])
            
    BATCH_SIZE = 2 # Very small batch to be safe
    
    total_fixed = 0
    
    for topic, tests in retry_groups.items():
        print(f"\n🔍 Mövzu: {topic} ({len(tests)} test yenidən yoxlanır)")
        context = TOPIC_CONTEXT.get(topic, f"Riyaziyyat 6, {topic} mövzusu.")
        
        for batch_start in range(0, len(tests), BATCH_SIZE):
            batch = tests[batch_start:batch_start+BATCH_SIZE]
            print(f"   ⏳ Batch {batch_start//BATCH_SIZE+1} göndərilir...")
            
            ai_result = check_content_with_ai(batch, topic, context)
            
            if ai_result and "results" in ai_result:
                for r in ai_result["results"]:
                    tid = r.get("id")
                    verdict = r.get("verdict", "XƏTERLİ")
                    
                    # Remove from warning_tests
                    report["warning_tests"] = [w for w in report["warning_tests"] if w.get("id") != tid]
                    
                    # Update summary and specific lists
                    if verdict == "KEÇƏR":
                        report["summary"]["passed"] += 1
                        report["summary"]["warning"] -= 1
                        total_fixed += 1
                    elif verdict == "XƏTERLİ":
                        # Add it back but with actual issues
                        report["warning_tests"].append({"topic": topic, **r})
                    else:  # RƏDD
                        report["summary"]["failed"] += 1
                        report["summary"]["warning"] -= 1
                        report["failed_tests"].append({"topic": topic, **r})
                        
                print(f"      ✅ Batch uğurla bitdi: {[r.get('verdict','?') for r in ai_result['results']]}")
            else:
                print(f"      ❌ Yenə AI cavab vermədi, keçilir.")
            
            # Save intermediate progress
            with open(REPORT_FILE, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
                
            print("   ⏸️ 15 saniyə fasilə (limit üçün)...")
            time.sleep(15)

    print("\n" + "="*40)
    print("YENİDƏN YOXLANMA BİTDİ!")
    s = report["summary"]
    print(f"✅ Keçən       : {s['passed']}")
    print(f"⚠️ Xəbərdarlıq : {s['warning']}")
    print(f"❌ Rədd         : {s['failed']}")
    print("="*40)

if __name__ == "__main__":
    main()
