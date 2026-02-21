
# generate_az_dictionary.py
import os
from pathlib import Path

# Common Azerbaijani words (Top 500+ and textbook terms)
COMMON_WORDS = """
və bir bu da ilə o üçün ki çox hər nə kimi mən onun daha
amma ya olar qədər var idi onu ancaq öz biz həm buna necə on
lazım başqa zaman elə bütün sonra iki yer deyil sənin böyük
belə edir indi iş onu çünki tək gün adam gərək il bizə
bəzi yaxşı söz gəlir bəlkə dur harda mənim yenə sən hara
çoxlu pul heç özü uşaq görə dedim əsas hər şeyi nədir
hansı deyir bizim istəyir yoxdur bura artıq birinci bir neçə
həmin onlarla edə bilər əgər sizin olsun bilsin həmişə
burada olacaq buna görə eləmişəm gəl bax hələ lap deyə
yeni qədər heç məhz demək olmaz olub hətta indi məsələ
adını gələn onu gəlib elə bil özüm dəfə kiçik ondan
bunu səni məncə lazım olan ona heç kim yoxdur edə bilməz
onlar yerə edib oldu deyə bilərəm bütün bunlar uzun
sonra həmin adamlar qalıb uşaqlar gəliblər yəni
sözügedən nəticə əksinə əslində əlbəttə xüsusi
mümkün vacib maraqlı müxtəlif eyni daxil
ümumi təhsil müəssisə məktəb sinif şagird müəllim
dərslik fənn mövzu bölmə hissə səhifə tapşırıq
məlumat sual cavab həll izah qayda nümunə
şəkil cədvəl xəritə sxem diaqram qrafik
tarix ədəbiyyat riyaziyyat fizika kimya biologiya
coğrafiya informatika ingilis rus fransız alman
musiqi təsviri incəsənət texnologiya həyat bilgisi
idman fiziki tərbiyə şahmat məntiq
Azərbaycan Bakı Respublika dövlət bayraq gerb himn
prezident nazir nazirlik ordu əsgər şəhid qəhrəman
vətən torpaq millət xalq dil din mədəniyyət
təbiət dünya yer günəş ay ulduz səma göy
dəniz çay göl dağ meşə ağac gül çiçək
heyvan quş balıq həşərat insan bədən sağlamlıq
ailə ata ana bacı qardaş nənə baba dost
ev kənd şəhər rayon ölkə qitə materik
zaman saat dəqiqə saniyə gün həftə ay il əsr
fəsil yaz yay payız qış hava külək yağış qar
rəng ağ qara qırmızı yaşıl mavi sarı narıncı
say bir iki üç dörd beş altı yeddi səkkiz doqquz on
yüz min milyon milyard birinci ikinci üçüncü dördüncü
böyük kiçik orta hündür alçaq uzun qısa qalın nazik
ağır yüngül isti soyuq bərk yumşaq dadlı acı
gözəl qəşəng pis yaxşı doğru yalan səhv düz
tez gec tezliklə həmişə heç vaxt hərdən bəzən
oxumaq yazmaq saymaq hesablamaq düşünmək bilmək
öyrənmək öyrətmək işləmək düzəltmək yaratmaq qurmaq
baxmaq görmək eşitmək danışmaq demək soruşmaq
getmək gəlmək qaçmaq yerimək durmaq oturmaq
yemək içmək yatmaq durmaq oynamaq gülmək
sevmək istəmək arzulamaq kömək etmək qorumaq
başlamaq qurtarmaq bitirmək davam etdirmək
açmaq bağlamaq almaq satmaq vermək götürmək
tapmaq itirmək axtarmaq gizlətmək göstərmək
qalib gəlmək məğlub olmaq uğur qazanmaq
fikir fikirliğı ağıllı savadlı bilikli
qüvvə enerji sürət hərəkət istiqamət məsafə
kütlə həcm sahə temperatur təzyiq sıxlıq
maddə atom molekul element tərkib xassə
orqanizm hüceyrə toxuma orqan sistem
tarixi hadisə döyüş müharibə sülh müqavilə
dövlətçilik müstəqillik azadlıq suverenlik
iqtisadiyyat sənaye kənd təsərrüfatı ticarət
nəqliyyat rabitə informasiya texnologiya
kompüter proqram internet şəbəkə sayt
fayl qovluq sənəd mətn şəkil video səs
klaviatura siçan monitor ekran printer
alqoritm kod əmr sistem yaddaş
ədəd rəqəm toplama çıxma vurma bölmə
tənlik bərabərsizlik funksiya qrafik
həndəsə fiqur üçbucaq kvadrat düzbucaqlı
çevrə dairə bucaq dərəcə ölçü vahid
metr santimetr kilometr kiloqram qram litr
saniyə dəqiqə saat dərəcə faiz
müsbət mənfi natural tam rasional
kəsr onluq dövri qarışıq hissə
""".split()

# Textbook specific terms (extracted from typical headers/footers)
TEXTBOOK_TERMS = """
müəllif redaktor rəyçi dizayner rəssam
məsləhətçi elmi metodik vəsait
nəşriyyat çap poliqrafiya tiraj format
sifariş lisenziya hüquq qorunur
resurs portal elektron ünvan mail
""".split()

def generate_dictionary():
    base_dir = Path(__file__).parent / "data" / "dictionaries"
    base_dir.mkdir(parents=True, exist_ok=True)
    
    az_file = base_dir / "az.txt"
    
    unique_words = sorted(set(w.lower() for w in COMMON_WORDS + TEXTBOOK_TERMS if w.strip()))
    
    with open(az_file, "w", encoding="utf-8") as f:
        for word in unique_words:
            f.write(word + "\n")
            
    print(f"Generated {len(unique_words)} words in {az_file}")

if __name__ == "__main__":
    generate_dictionary()
