"""
Riyaziyyat 6 Test Yoxlama Skripti (Gold Standart 2.1)
NVIDIA DeepSeek V4 Pro modeli ilə hər mövzu testlərini yoxlayır.

Yoxlama meyarları:
1. Mövzuya uyğunluq - testin mövzudan kənar məlumat ehtiva edib-etmədiyi
2. Riyazi düzgünlük - düzgün cavabın həqiqətən doğru olması
3. Distraktor keyfiyyəti - yanlış variantların məqbul olması
4. Gold Standart 2.1 - bütün sahələrin mövcudluğu (passport_id, pedagogical_explanation, bloom_level, difficulty)
5. Dil keyfiyyəti - Azərbaycan dilinin düzgün istifadəsi

Nəticə: JSON hesabat faylı
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
PROGRESS_FILE = r"C:\Users\User\.gemini\antigravity\scratch\riyaz6_yoxlama_progress.json"

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

GS21_REQUIRED_FIELDS = ["question", "options", "correctAnswer", "pedagogical_explanation", "topic", "difficulty", "bloom_level", "passport_id"]
BLOOM_LEVELS = ["bilmə", "anlama", "tətbiq", "təhlil", "sintez", "qiymətləndirmə"]
DIFFICULTY_LEVELS = ["sadə", "orta", "çətin"]
PASSPORT_PATTERN = re.compile(r'^06-RİY-\d{4}H\d-B\d+-M\d+-BL\d+-[A-Z]+-\d+$')

def check_gs21_structure(test):
    """Struktural yoxlama - API çağrışı olmadan"""
    issues = []
    
    # 1. Məcburi sahələr
    for field in GS21_REQUIRED_FIELDS:
        if field not in test or test[field] is None or test[field] == "":
            issues.append(f"❌ Sahə yoxdur/boşdur: {field}")
    
    # 2. Options - 4 variant
    opts = test.get("options", [])
    if not isinstance(opts, list) or len(opts) != 4:
        issues.append(f"❌ Options: 4 variant lazımdır, {len(opts) if isinstance(opts,list) else 'N/A'} var")
    
    # 3. correctAnswer - 0-3 arası
    ca = test.get("correctAnswer")
    if ca not in [0, 1, 2, 3]:
        issues.append(f"❌ correctAnswer: 0-3 arası olmalıdır, '{ca}' var")
    
    # 4. Bloom səviyyəsi
    bl = test.get("bloom_level", "")
    if bl not in BLOOM_LEVELS:
        issues.append(f"⚠️ bloom_level: '{bl}' məqbul deyil (məqbullar: {BLOOM_LEVELS})")
    
    # 5. Çətinlik
    diff = test.get("difficulty", "")
    if diff not in DIFFICULTY_LEVELS:
        issues.append(f"⚠️ difficulty: '{diff}' məqbul deyil (məqbullar: {DIFFICULTY_LEVELS})")
    
    # 6. Passport ID formatı
    pid = test.get("passport_id", "")
    if not PASSPORT_PATTERN.match(pid):
        issues.append(f"⚠️ passport_id: '{pid}' formatı düzgün deyil")
    
    # 7. Sualın minimum uzunluğu
    q = test.get("question", "")
    if len(q) < 10:
        issues.append(f"❌ Sual çox qısadır: '{q}'")
    
    # 8. pedagogical_explanation minimum uzunluğu
    pe = test.get("pedagogical_explanation", "")
    if len(pe) < 20:
        issues.append(f"⚠️ pedagogical_explanation çox qısadır")
    
    # 9. Dublikat cavablar
    if isinstance(opts, list) and len(opts) == len(set(opts)):
        pass
    elif isinstance(opts, list):
        issues.append(f"⚠️ Variantlarda dublikat var: {opts}")
    
    return issues

def check_content_with_ai(tests_batch, topic, context):
    """AI ilə məzmun yoxlaması - bir qrup test üçün"""
    
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

    for attempt in range(2):
        try:
            r = client.chat.completions.create(
                model="deepseek-ai/deepseek-v4-pro",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                top_p=0.95,
                max_tokens=4096,
                extra_body={"chat_template_kwargs": {"thinking": False}},
                stream=False
            )
            raw = r.choices[0].message.content.strip()
            m = re.search(r'\{.*\}', raw, re.DOTALL)
            if m:
                return json.loads(m.group())
        except Exception as e:
            print(f"      API xəta ({attempt+1}): {str(e)[:80]}")
            time.sleep(10)
    return None

def main():
    print("Riyaziyyat 6 Test Yoxlama Başlayır...")
    print("="*60)
    
    with open(OFFLINE_TESTS, 'r', encoding='utf-8') as f:
        db = json.load(f)
    tests = db.get('Riyaziyyat 6', [])
    print(f"Cəmi {len(tests)} test yükləndi.\n")
    
    # Load progress if exists
    progress = {}
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            progress = json.load(f)
        print(f"Əvvəlki yoxlama davam etdirilir: {len(progress)} mövzu tamamlanıb.\n")
    
    # Group tests by topic
    from collections import defaultdict
    topic_groups = defaultdict(list)
    for t in tests:
        topic_groups[t.get('topic','Bilinməyən')].append(t)
    
    all_results = {
        "summary": {"total": len(tests), "topics": len(topic_groups), "checked": 0, "passed": 0, "warning": 0, "failed": 0},
        "topic_reports": {},
        "failed_tests": [],
        "warning_tests": []
    }
    
    # Load existing results if any
    if os.path.exists(REPORT_FILE):
        with open(REPORT_FILE, 'r', encoding='utf-8') as f:
            all_results = json.load(f)
    
    for topic_idx, (topic, topic_tests) in enumerate(sorted(topic_groups.items())):
        if topic in progress.get("done_topics", []):
            print(f"[{topic_idx+1:2d}/46] ⏭️  Keçildi (artıq yoxlanıb): {topic}")
            continue
        
        print(f"\n[{topic_idx+1:2d}/46] 🔍 Mövzu: {topic}")
        print(f"       Test sayı: {len(topic_tests)}")
        
        context = TOPIC_CONTEXT.get(topic, f"Riyaziyyat 6, {topic} mövzusu.")
        
        topic_result = {
            "total": len(topic_tests),
            "structural_issues": [],
            "ai_results": [],
            "passed": 0, "warning": 0, "failed": 0
        }
        
        # STEP 1: Structural check (no API needed)
        print(f"       📋 Struktural yoxlama...")
        for test in topic_tests:
            issues = check_gs21_structure(test)
            if issues:
                topic_result["structural_issues"].append({
                    "id": test.get("id","?"),
                    "issues": issues
                })
        
        struct_bad = len(topic_result["structural_issues"])
        print(f"       Struktural xəta: {struct_bad}/{len(topic_tests)}")
        
        # STEP 2: AI Content check - batch of 5
        print(f"       🤖 AI məzmun yoxlaması...")
        BATCH_SIZE = 5
        for batch_start in range(0, len(topic_tests), BATCH_SIZE):
            batch = topic_tests[batch_start:batch_start+BATCH_SIZE]
            ai_result = check_content_with_ai(batch, topic, context)
            
            if ai_result and "results" in ai_result:
                for r in ai_result["results"]:
                    topic_result["ai_results"].append(r)
                    verdict = r.get("verdict", "XƏTERLİ")
                    if verdict == "KEÇƏR":
                        topic_result["passed"] += 1
                    elif verdict == "XƏTERLİ":
                        topic_result["warning"] += 1
                        all_results["warning_tests"].append({"topic": topic, **r})
                    else:  # RƏDD
                        topic_result["failed"] += 1
                        all_results["failed_tests"].append({"topic": topic, **r})
                print(f"         Batch {batch_start//BATCH_SIZE+1}: {[r.get('verdict','?') for r in ai_result.get('results',[])]}")
            else:
                print(f"         Batch {batch_start//BATCH_SIZE+1}: ❌ AI cavab vermədi")
                for t in batch:
                    topic_result["warning"] += 1
                    all_results["warning_tests"].append({"topic": topic, "id": t.get("id","?"), "verdict": "XƏTERLİ", "issues": ["AI yoxlaması alınmadı"]})
            
            time.sleep(2)  # Rate limiting
        
        all_results["topic_reports"][topic] = topic_result
        all_results["summary"]["checked"] += len(topic_tests)
        all_results["summary"]["passed"] += topic_result["passed"]
        all_results["summary"]["warning"] += topic_result["warning"]
        all_results["summary"]["failed"] += topic_result["failed"]
        
        print(f"       ✅ Keçən: {topic_result['passed']} | ⚠️ Xəbərdarlıq: {topic_result['warning']} | ❌ Rədd: {topic_result['failed']}")
        
        # Save progress
        if "done_topics" not in progress:
            progress["done_topics"] = []
        progress["done_topics"].append(topic)
        
        os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
        with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
            json.dump(progress, f, ensure_ascii=False)
        
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, ensure_ascii=False, indent=2)
        
        time.sleep(3)  # Rate limiting between topics
    
    # Final summary
    print("\n" + "="*60)
    print("📊 YEKUNİ HESABAT")
    print("="*60)
    s = all_results["summary"]
    print(f"Cəmi test      : {s['total']}")
    print(f"Yoxlanan       : {s['checked']}")
    print(f"✅ Keçən       : {s['passed']}")
    print(f"⚠️ Xəbərdarlıq : {s['warning']}")
    print(f"❌ Rədd         : {s['failed']}")
    print(f"\nHesabat saxlandı: {REPORT_FILE}")

if __name__ == "__main__":
    main()
