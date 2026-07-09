import json
import os
import random
import sys
import io

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def generate_passport(topic_idx, q_idx, bloom, difficulty):
    bloom_codes = {
        "bilmə": "01", "anlama": "02", "tətbiq": "03", "təhlil": "04", "qiymətləndirmə": "05", "yaratma": "06"
    }
    bloom_code = bloom_codes.get(bloom, "02")
    diff_codes = {
        "sadə": "01", "orta": "02", "çətin": "03"
    }
    diff_code = diff_codes.get(difficulty, "02")
    tc = f"B01AM{str(topic_idx + 1).zfill(2)}"
    q_num = str(q_idx + 1).zfill(4)
    return f"11-008-0101-{tc}-{bloom_code}-{diff_code}-{q_num}"

questions_data = [
    # Topic 0: 1.1
    {
        "topic_idx": 0, "bloom": "bilmə", "difficulty": "sadə",
        "text": "İnformasiya sisteminin əsas məqsədi nədir?",
        "options": {
            "A": "İnformasiyanın toplanması, saxlanması, emalı və istifadəçiyə çatdırılması",
            "B": "Yalnız aparat təminatının fiziki idarə edilməsi",
            "C": "Kompüter şəbəkələrinin məlumat ötürmə sürətinin artırılması",
            "D": "İnternet provayderlərinin fəaliyyətini tənzimləmək",
            "E": "Əməliyyat sisteminin fayllarını zərərli proqramlardan qorumaq"
        },
        "correct_answer": "A",
        "explanation": "İnformasiya sistemləri istifadəçilərin informasiya tələbatını ödəmək məqsədilə verilənlərin toplanması, saxlanması, axtarışı, emalı və ötürülməsini həyata keçirən sistemlərdir."
    },
    {
        "topic_idx": 0, "bloom": "anlama", "difficulty": "orta",
        "text": "İnformasiya sisteminin tam tərkib hissələrinə (elementlərinə) hansılar daxildir?",
        "options": {
            "A": "Klaviatura, monitor, prosessor və yaddaş",
            "B": "Yalnız proqram təminatı və verilənlər bazası",
            "C": "İnternet bağlantısı, brauzer və axtarış sistemləri",
            "D": "Aparat, proqram təminatı, verilənlər, istifadəçilər və prosedurlar",
            "E": "Elektron cədvəllər və qrafik redaktorlar"
        },
        "correct_answer": "D",
        "explanation": "İnformasiya sistemi özlüyündə yalnız kompüterləri yox, həm də aparat, proqram təminatını, verilənləri (məlumatları), prosedurları və insan faktoru olan istifadəçiləri özündə birləşdirir."
    },
    # Topic 1: 1.2
    {
        "topic_idx": 1, "bloom": "anlama", "difficulty": "orta",
        "text": "Obyektlər üzrə dövri və ardıcıl müşahidələr aparılmaqla tərtib olunan, torpaq, iqlim və su ehtiyatları haqqında məlumatları özündə saxlayan sistemlər necə adlanır?",
        "options": {
            "A": "Ekspert sistemləri",
            "B": "Kadastr informasiya sistemləri",
            "C": "Təhsil informasiya sistemləri",
            "D": "Avtomatlaşdırılmış layihələndirmə sistemləri",
            "E": "Korporativ kompüter şəbəkələri"
        },
        "correct_answer": "B",
        "explanation": "Dərslikdə də qeyd olunduğu kimi, təbii obyektlərin və resursların (su, torpaq, iqlim, meşə və s.) dövri müşahidələri əsasında kadastr informasiya sistemləri yaradılır."
    },
    # Topic 2: 1.3
    {
        "topic_idx": 2, "bloom": "bilmə", "difficulty": "sadə",
        "text": "Coğrafi informasiya sistemlərinin (CİS) əsas təyinatı hansı variantda doğru göstərilmişdir?",
        "options": {
            "A": "Kompüter oyunlarının 3D qrafikasının və animasiyalarının yaradılması",
            "B": "Coğrafi və fəza (məkan) verilənlərinin toplanması, saxlanması, emalı və analizi",
            "C": "Yalnız müxtəlif dillər arasında tərcümə proqramlarının işini təmin etmək",
            "D": "Qlobal şəbəkədə mətn sənədlərinin sürətli axtarışı",
            "E": "Riyazi tənliklərin və bərabərsizliklərin həlli"
        },
        "correct_answer": "B",
        "explanation": "CİS (Coğrafi İnformasiya Sistemləri və ya GIS) xüsusi olaraq məkanla bağlı olan, coğrafi və fəza verilənlərinin emalı üçün nəzərdə tutulmuş proqram-aparat kompleksidir."
    },
    {
        "topic_idx": 2, "bloom": "təhlil", "difficulty": "çətin",
        "text": "CİS (Coğrafi İnformasiya Sistemləri) texnologiyalarının tətbiq sahələrinə aid olmayan fəaliyyət hansıdır?",
        "options": {
            "A": "Nəqliyyatın hərəkət marşrutlarının optimallaşdırılması",
            "B": "Fövqəladə halların nəticələrinin proqnozlaşdırılması",
            "C": "Torpaq kadastrının tərtibi və ekoloji monitorinq",
            "D": "Mətn prosessorlarında sözlərin qrammatik səhvlərinin yoxlanılması",
            "E": "Naviqasiya və interaktiv xəritəçəkmə işləri"
        },
        "correct_answer": "D",
        "explanation": "Nəqliyyat, fövqəladə hallar, torpaq kadastrı və naviqasiya birbaşa coğrafi məkan verilənləri tələb etdiyi halda, qrammatik xətaların yoxlanılması təbii dilin emalı və mətn redaktorlarına aiddir."
    },
    # Topic 3: 1.4
    {
        "topic_idx": 3, "bloom": "anlama", "difficulty": "orta",
        "text": "Süni intellektin tədqiqat sahəsi olan 'Maşın öyrənməsi' (Machine Learning) konsepsiyası nədən ibarətdir?",
        "options": {
            "A": "Kompüter hissələrinin robot qolları tərəfindən avtomatik yığılması prosesi",
            "B": "İnsanın fiziki hərəkətlərinin sensorlar vasitəsilə kompüterə ötürülməsi texnologiyası",
            "C": "Kompüter sistemlərinin böyük verilənlər əsasında öz-özünə öyrənərək qərar qəbuletmə qabiliyyətinə malik olması",
            "D": "Kompüterin yalnız alqoritmdə verilmiş dəqiq riyazi addımlarla işləməsi",
            "E": "Proqram kodlarının digər proqramlaşdırma dillərinə tərcümə edilməsi (kompilyasiya)"
        },
        "correct_answer": "C",
        "explanation": "Maşın öyrənməsi, kompüterlərə hər bir addım üçün konkret proqram yazılmadan, verilənlər (məlumatlar) üzərində təhlil apararaq öyrənmək və təcrübə qazanmaq imkanı verən süni intellekt sahəsidir."
    },
    {
        "topic_idx": 3, "bloom": "bilmə", "difficulty": "sadə",
        "text": "Aşağıdakılardan hansı süni intellektin tətbiq sahələrinə misal ola bilməz?",
        "options": {
            "A": "Səsin tanınması və mətndən səsə çevrilmə (TTS)",
            "B": "Mexaniki daktilo (yazı maşını) vasitəsilə mətnlərin kağıza çap olunması",
            "C": "Avtopilot və pilotsuz idarə olunan nəqliyyat vasitələri",
            "D": "Üz tanıma və biometrik identifikasiya sistemləri",
            "E": "Təbii dilin emalı və maşın tərcüməsi proqramları"
        },
        "correct_answer": "B",
        "explanation": "Mexaniki yazı maşınları tamamilə fiziki mexanizmlə işləyir və heç bir elektron və ya intellektual emal qabiliyyətinə malik deyil, bu səbəbdən süni intellektə aid edilə bilməz."
    },
    # Topic 4: 1.5
    {
        "topic_idx": 4, "bloom": "anlama", "difficulty": "orta",
        "text": "Ekspert sistemlərinin əsas yaradılma məqsədi nədən ibarətdir?",
        "options": {
            "A": "Mətnlərin qrammatik və orfoqrafik xətalarını avtomatik düzəltmək üçün",
            "B": "Müəyyən bir ixtisas sahəsi üzrə təcrübəli mütəxəssislərin qərar qəbuletmə və mühakimə prosesini modelləşdirmək üçün",
            "C": "Kompüter şəbəkələrini kənar müdaxilələrdən və viruslardan qorumaq üçün",
            "D": "Mürəkkəb funksiyaların və riyazi tənliklərin üçölçülü qrafikini qurmaq üçün",
            "E": "Elektron poçtların kütləvi göndərilməsini təşkil etmək üçün"
        },
        "correct_answer": "B",
        "explanation": "Ekspert sistemləri konkret bir fənn sahəsində insan-ekspertin bilik və təcrübəsini özündə saxlayaraq onun məntiqi mühakimə yürütmə qaydalarını təqlid edir və istifadəçiyə qərarlar qəbul etməkdə kömək edir."
    },
    {
        "topic_idx": 4, "bloom": "təhlil", "difficulty": "çətin",
        "text": "Ekspert sisteminin əsas komponenti olan 'Biliklər bazası' (Knowledge base) hansı elementləri özündə birləşdirir?",
        "options": {
            "A": "İstifadəçilərin şəxsi profil məlumatlarını və axtarış tarixçəsini",
            "B": "Proqramın icra olunan maşın kodlarını və kompilyator xətalarını",
            "C": "Həmin sahəyə aid dəqiq faktları və yeni nəticələr çıxarmaq üçün zəruri olan məntiqi qaydaları",
            "D": "İnternetdə olan bütün informasiya saytlarının URL ünvanlarını",
            "E": "Kompüterin periferiya qurğularını idarə edən sistem drayverlərini"
        },
        "correct_answer": "C",
        "explanation": "Biliklər bazası adi verilənlər bazasından fərqlənir; o özündə həm sahəyə aid faktları, həm də bu faktlar arasında əlaqə quran və nəticə çıxaran if-then (əgər-onda) tipli məntiqi qaydaları cəmləşdirir."
    },
    # Topic 5: 1.6
    {
        "topic_idx": 5, "bloom": "bilmə", "difficulty": "sadə",
        "text": "Aşağıda verilmiş sistemlərdən hansı axtarış sisteminə (Search Engine) aiddir?",
        "options": {
            "A": "Windows, Linux, macOS",
            "B": "MS Word, MS Excel, MS PowerPoint",
            "C": "Google Chrome, Mozilla Firefox, Opera",
            "D": "Google, Bing, Yahoo",
            "E": "Gmail, Outlook, Yahoo Mail"
        },
        "correct_answer": "D",
        "explanation": "Axtarış sistemləri internetdəki veb-səhifələri indeksləyərək axtarış aparmağa imkan verən xidmətlərdir. Google, Bing və Yahoo bu sistemlərə ən məşhur nümunələrdir. (C variantındakılar brauzerlərdir)."
    },
    {
        "topic_idx": 5, "bloom": "anlama", "difficulty": "orta",
        "text": "Axtarış sistemlərində daha dəqiq nəticələr əldə etmək üçün istifadə olunan 'məntiqi axtarış' zamanı hansı əməllərdən istifadə olunur?",
        "options": {
            "A": "IF, THEN, ELSE (ƏGƏR, ONDA, ƏKS HALDA)",
            "B": "AND, OR, NOT (VƏ, VƏ YA, DEYİL)",
            "C": "FOR, WHILE, DO (DÖVRƏLƏR)",
            "D": "PLUS, MINUS, DIV (TOPLAMA, ÇIXMA, BÖLMƏ)",
            "E": "TRUE, FALSE, NULL (DOĞRU, YALAN, BOŞ)"
        },
        "correct_answer": "B",
        "explanation": "Məntiqi axtarış sorğularında açar sözləri birləşdirmək və ya istisna etmək üçün AND, OR, NOT kimi Bul məntiqi əməllərindən istifadə olunur ki, bu da axtarışın miqyasını daraldır və ya genişləndirir."
    },
    # Topic 6: 1.7
    {
        "topic_idx": 6, "bloom": "anlama", "difficulty": "orta",
        "text": "'Böyük verilənlər' (Big Data) konsepsiyası dedikdə, ilk növbədə, nə başa düşülür?",
        "options": {
            "A": "Kompüterin sərt diskində (HDD) saxlanılan bütün stasionar sistem faylları",
            "B": "Çap üçün nəzərdə tutulmuş iri həcmli, çoxsəhifəli mətn sənədləri",
            "C": "Çox böyük həcmli, sürətlə yenilənən, müxtəlif formalı və ənənəvi üsullarla emalı çətin olan məlumatlar toplusu",
            "D": "Bütün növ şəbəkə protokollarının və İP ünvanların qlobal siyahısı",
            "E": "Smartfonların yaddaşında olan minlərlə istifadəçi kontaktlarının bazası"
        },
        "correct_answer": "C",
        "explanation": "Böyük verilənlər (Big Data) dedikdə həcmi çox böyük olan, sürətlə daxil olan və növ müxtəlifliyi ilə seçilən, standart relyasion verilənlər bazaları vasitəsilə effektiv emal edilə bilməyən informasiya massivi nəzərdə tutulur."
    },
    {
        "topic_idx": 6, "bloom": "bilmə", "difficulty": "sadə",
        "text": "Dərslikdəki hesablamalara görə, hazırda dünyada toplanmış 'böyük verilənlər'in (Big Data) təxminən neçə faizindən faydalı məqsədlər üçün istifadə edilir?",
        "options": {
            "A": "50%-dən çoxundan",
            "B": "Təxminən 1-2%-dən",
            "C": "Demək olar ki, 100%-dən",
            "D": "Dəqiq olaraq 25%-dən",
            "E": "75-80%-dən"
        },
        "correct_answer": "B",
        "explanation": "İnformatika 11 dərsliyində qeyd olunduğu kimi, hazırda dünyada toplanmış nəhəng informasiyanın çox az bir hissəsindən (təxminən 1-2%-dən) real faydalı nəticələr çıxarmaq üçün istifadə edilir, qalan hissəsi hələ tam emal olunmamış qalır."
    },
    # Topic 7: 1.8
    {
        "topic_idx": 7, "bloom": "təhlil", "difficulty": "çətin",
        "text": "Aşağıdakılardan hansı 'İnformasiya cəmiyyəti'nin əsas xüsusiyyətlərindən biri deyildir?",
        "options": {
            "A": "Məlumatlara və qlobal şəbəkəyə sürətli, asan çıxışın təmin olunması",
            "B": "İnformasiya və biliklərin iqtisadiyyatın əsas hərəkətverici qüvvəsinə çevrilməsi",
            "C": "İqtisadiyyatda əl əməyinin və kənd təsərrüfatı istehsalının mütləq üstünlük təşkil etməsi",
            "D": "Kompüter savadlılığının və fasiləsiz təhsilin mühüm əhəmiyyət kəsb etməsi",
            "E": "Elektron xidmətlərin və e-hökumət texnologiyalarının cəmiyyətdə geniş yayılması"
        },
        "correct_answer": "C",
        "explanation": "İnformasiya cəmiyyətində iqtisadiyyatın əsasını xidmət, bilik və informasiya sektoru təşkil edir. Əl əməyinin və aqrar sektorun üstünlük təşkil etməsi isə aqrar və ya ənənəvi sənaye cəmiyyətlərinə xasdır."
    },
    {
        "topic_idx": 7, "bloom": "anlama", "difficulty": "orta",
        "text": "İnsanların davamlı olaraq yeni bilik, bacarıq və texnologiyaları mənimsəməsi, informasiya cəmiyyətindəki hansı mühüm anlayışla birbaşa bağlıdır?",
        "options": {
            "A": "İnformasiya asimmetriyası",
            "B": "Fasiləsiz təhsil (Lifelong learning)",
            "C": "Kiber cinayətkarlıq və rəqəmsal təhlükəsizlik",
            "D": "Süni neyron şəbəkələr və alqoritmlər",
            "E": "Məlumatların asimmetrik şifrələnməsi"
        },
        "correct_answer": "B",
        "explanation": "İnformasiya cəmiyyətində texnologiyalar və biliklər çox sürətlə yeniləndiyi üçün peşəkarlığı qorumaq məqsədilə fərdin həyatı boyu öyrənməyə davam etməsi - fasiləsiz təhsil prinsiplərinə uyğun gəlir."
    }
]

def format_question(q, q_idx):
    opts = list(q["options"].items())
    correct_text = q["options"][q["correct_answer"]]
    
    random.seed(hash(q["text"]) + q_idx)
    random.shuffle(opts)
    
    new_options = {}
    letters = ["A", "B", "C", "D", "E"]
    new_correct_answer = "A"
    
    for i, (_, text) in enumerate(opts):
        new_options[letters[i]] = text
        if text == correct_text:
            new_correct_answer = letters[i]
            
    return {
        "id": generate_passport(q["topic_idx"], q_idx, q["bloom"], q["difficulty"]),
        "text": q["text"],
        "options": new_options,
        "correct_answer": new_correct_answer,
        "explanation": q["explanation"],
        "difficulty": q["difficulty"],
        "bloom_level": q["bloom"]
    }

def main():
    file_path = 'data/offline_tests.json'
    
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}
    else:
        data = {}
        
    subject = "İnformatika 11"
    if subject not in data:
        data[subject] = {}
        
    chapter_key = "1"
    data[subject][chapter_key] = []
        
    formatted_questions = []
    for idx, q in enumerate(questions_data):
        fq = format_question(q, idx)
        formatted_questions.append(fq)
        
    data[subject][chapter_key] = formatted_questions
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Successfully injected {len(formatted_questions)} zero-error questions to offline_tests.json for {subject} Chapter {chapter_key}!")

if __name__ == "__main__":
    main()
