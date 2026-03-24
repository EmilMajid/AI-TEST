import json

def repair_math1_batch4(chunks):
    # ID: 12 (Page 116)
    chunks[12]["text"] = """
Onluq kəsrlərin natural ədədə bölünməsi. Onluq kəsri natural ədədə bölmək üçün: 1. Əvvəlcə tam hissə bölünür və qismətdə vergül qoyulur. 2. Sonra kəsr hissənin rəqəmləri ardıcıl endirilib bölmə davam etdirilir. Bölünən bitdikdə qalıq qalarsa, bölünənin sonuna sıfırlar əlavə edib bölməni davam etdirmək olar.
Məsələn: 59,4 : 22. 59-un içində 22 iki dəfədir (44). 59 - 44 = 15. İndi vergül qoyulur. 4 endirilir: 154. 154 : 22 = 7. Cavab: 2,7. 
Onluq kəsrin onluq kəsrə bölünməsi: Böləndəki vergülü o qədər sağa çəkin ki, o, natural ədədə çevrilsin. Bölünəndə də vergülü eyni sayda sağa çəkin (çatmazsa sıfır əlavə edin). Sonra alınan natural ədədləri bölün.
""".strip()

    # ID: 13 (Page 124)
    chunks[13]["text"] = """
4.1. Faiz. Adi kəsr, onluq kəsr və faiz. Kəmiyyətin hissələrinin faizlə ifadə edilməsi gündəlik həyatda çox vacibdir. Məsələn, bank faizləri, məhsulun qiymətindəki endirimlər, statistika və s. Faiz '%' simvolu ilə işarə olunur.
Faiz - bütünün yüzdə bir hissəsidir. 1% = 0,01 = 1/100.
Faizin onluq kəsrə və adi kəsrə çevrilməsi: Faizi onluq kəsrə çevirmək üçün faiz göstərən ədədi 100-ə bölmək lazımdır. Məsələn, 17% = 17/100 = 0,17.
Adi kəsrin və ya onluq kəsrin faizlə ifadəsi: Ədədi 100-ə vurub yanına '%' işarəsi yazmaq lazımdır. Məsələn, 0,25 = 0,25 * 100% = 25%.
""".strip()

    # ID: 14 (Page 134)
    chunks[14]["text"] = """
Ədədin faizinin tapılması. Məbləğin və ya kəmiyyətin müəyyən faizini tapmaq üçün: Ədədi 100-ə bölüb 1%-i tapmaq, sonda isə faiz göstəricisinə vurmaq lazımdır.
Məsələn: 60-ın 25%-ini tapaq. 60 : 100 = 0,6 (bu 1%-dir). 0,6 * 25 = 15.
Faizləri onluq kəsrlə ifadə edərək də ədədin faizini tapmaq olar. Məsələn, 60-ın 25%-i həm də 60 * 0,25 deməkdir.
Riyaziyyat tarixində faiz: 'Faiz' sözünün yaranması onluq say sistemi ilə bağlıdır. Qədim Romada vergi hesablamaları zamanı yüzdə bir hissədən istifadə olunurdu. Uzun illər faiz 1/100 vuruğu ilə əvəzlənirdi. '%' işarəsi isə təxminən XVII əsrdə italyanca 'per cento' sözünün ixtisarından yarandığı ehtimal olunur.
""".strip()

    # ID: 15 (Page 141)
    chunks[15]["text"] = """
Kəmiyyətin qiymətinin müəyyən faiz artırılması və azaldılması. Bəzən müəyyən qiyməti artırmaq və ya azaltmaq lazımdır. Bunun üçün əvvəlcə verilmiş faiz hesablanır, sonra əvvəlki məbləğin üzərinə əlavə olunur və ya ondan çıxılır.
NÜMUNƏ: Mağazada 150 manatlıq paltoya 20% endirim edildi. Yeni qiyməti tapaq. 150 * 0,20 = 30 manat endirim. 150 - 30 = 120 manat yeni qiymət.
Faizınə görə ədədin tapılması: Ədədin faiz göstəricisi məlumdursa, onun özünü tapmaq olar. Məsələn, 40%-i 24 olan ədədi tapaq. Bunun üçün 24-ü 40-a bölüb 1%-i tapırıq (0,6), sonda 100-ə vururuq (60).
Məsələ: Lalə kitabın 45%-ni (80 səhifəlik kitabın) oxudu. Onun nə qədər oxuduğunu yoxlayın.
""".strip()

    # ID: 16 (Page 144)
    chunks[16]["text"] = """
Ümumiləşdirici təkrar. Natural ədədlər, onluq kəsrlər və faizlərə aid ümumi tapşırıqlar. Riyazi anlayışlar və tətbiqlər.
BURAXILIŞ MƏLUMATI. Ümumi təhsil müəssisələrinin 5-ci sinifləri üçün Riyaziyyat fənni üzrə Dərslik (1-ci hissə).
Tərtibçi heyət: Müəlliflər: Zaur İsayev, Mənsur Məhərrəmov, Məhəmməd Kərimov, Günay Hüseynzadə, Vüqar Musayev, Aqşin Abdullayev.
Müəlliflik hüquqları qorunur. ISBN: 978-9952-563-71-0. Pulsuz. Bakı 2024.
Tiraj: 149450. Ofset çapı. Azərbaycan Respublikasının Təhsil İnstitutu.
""".strip()

    # ID: 17 (Page 144)
    chunks[17]["text"] = """
Pulsuz RİYAZİYYAT DƏRSLİK. 5-ci sinif. Əziz məktəbli! Bu dərslik sizə Azərbaycan dövləti tərəfindən bir dərs ilində istifadə üçün verilir. O, dərs ili müddətində nəzərdə tutulmuş bilikləri qazanmaq üçün sizə etibarlı dost və yardımçı olacaq. Ümid edirik ki, ondan sizin kimi növbəti məktəbli yoldaşınız da rahat istifadə edə bilsin. Sizin təhsildə uğurlarınızı arzulayırıq!
""".strip()

    return chunks

if __name__ == "__main__":
    with open('tmp_math1_full.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data = repair_math1_batch4(data)
    
    with open('tmp_math1_full.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
