import json

def repair_math1_batch3(chunks):
    # ID: 6 (Page 62)
    chunks[6]["text"] = """
1.4. Məxrəcləri müxtəlif olan kəsərlərin toplanması və çıxılması. Məxrəcləri müxtəlif olan kəsərləri toplamaq (çıxmaq) üçün: 1. Onları ən kiçik ortaq məxrəcə gətirmək lazımdır (EKOB). 2. Məxrəcləri bərabər olan kəsərlər kimi toplamaq (çıxmaq) lazımdır.
Məsələn: 1/4 + 1/6. EKOB(4, 6) = 12. 1/4 = 3/12, 1/6 = 2/12. 3/12 + 2/12 = 5/12.
Qarışıq ədədlərin toplanması: Tam hissələr bir toplanır, kəsr hissələr bir toplanır. Əgər kəsr hissələrin cəmi düzgün olmayan kəsr olarsa, onun tam hissəsi ayrılır və tam hissənin üzərinə əlavə edilir.
""".strip()

    # ID: 7 (Page 72)
    chunks[7]["text"] = """
1.7. Kəsrin natural ədədə vurulması. Kəsri natural ədədə vurmaq üçün: Kəsrin surətini həmin ədədə vurub surətdə yazmaq, məxrəci isə olduğu kimi saxlamaq lazımdır.
Məsələn: 2/9 * 4 = (2 * 4) / 9 = 8/9.
Hər hansı ədədi 1-ə vurduqda ədədin özü, 0-a vurduqda isə 0 alınır.
İki kəsrin hasili: Sürətlərin hasili surətdə, məxrəclərin hasili isə məxrəcdə yazılır. a/b * c/d = (a * c) / (b * d).
Qarışıq ədədlərin vurulması: Əvvəlcə qarışıq ədədləri düzgün olmayan kəsrə çevirmək, sonra vurma qaydasını tətbiq etmək lazımdır.
""".strip()

    # ID: 8 (Page 82)
    chunks[8]["text"] = """
1.8. Kəsrin bölünməsi. Bir ədədi digərinə bölmək, onu bölənin tərsinə vurmaq deməkdir. a/b : c/d = a/b * d/c.
Natural ədədin kəsrə bölünməsi: Natural ədədi bölənin tərsi olan kəsrə vurmaq lazımdır.
Onluq kəsrlər. Onluq kəsrlərin oxunuşu və yazılışı. Məxrəci 10, 100, 1000 və s. olan kəsrləri vergüllə yazmaq olar. Vergüldən solda tam hissə, sağda isə kəsr hissə yazılır.
Tam hissə verilməyibsə, 0 yazılır. Məsələn: 0,7; 1,25; 15,37.
Onluq kəsrlərin müqayisəsi: Əvvəlcə tam hissələr müqayisə olunur. Tam hissəsi böyük olan kəsr böyükdür. Tam hissələr bərabərdirsə, vergüldən sonrakı mərtəbə vahidləri (onda birliklər, yüzdə birliklər və s.) müqayisə olunur.
""".strip()

    # ID: 9 (Page 91)
    chunks[9]["text"] = """
Onluq kəsrlərin toplanması və çıxılması. Onluq kəsrləri toplamaq və ya çıxmaq üçün: 1. Vergül-vergülün altında olmaqla alt-alta yazılır. 2. Lazım gələrsə, kəsr hissənin sonuna sıfırlar əlavə edilməklə rəqəmlərin sayı bərabərləşdirilir. 3. Natural ədədlər kimi toplanır (çıxılır), vergül isə olduğu yerdən qoyulur.
Onluq kəsrlərin yuvarlaqlaşdırılması: Natural ədədlərdə olduğu kimi, tələb olunan mərtəbə rəqəmindən sağdakı ilk rəqəmə baxılır. Əgər 5-dən kiçikdirsə mərtəbə rəqəmi dəyişmir, 5 və ya daha böyükdürsə 1 vahid artır. Sağdakı rəqəmlər sıfırla əvəz olunur (kəsr hissənin sonundakı sıfırlar atıla bilər).
""".strip()

    # ID: 10 (Page 100)
    chunks[10]["text"] = """
Onluq kəsrlərin vurulması. Onluq kəsri natural ədədə vurmaq üçün: 1. Vergülə məhəl qoymadan natural ədədlər kimi vurulur. 2. Verilmiş onluq kəsrdə vergüldən sonra neçə rəqəm varsa, hasildə də sağdan o qədər rəqəm sayılıb vergül qoyulur.
Məsələn: 2,56 * 3. 256 * 3 = 768. Vergüldən sonra 2 rəqəm olduğu üçün hasil: 7,68.
Onluq kəsri onluq kəsrə vurmaq üçün: Vergülə məhəl qoymadan natural ədədlər kimi vurulur. Hər iki vuruqda vergüldən sonrakı rəqəmlərin cəmi qədər hasildə sağdan sayılıb vergül qoyulur.
""".strip()

    # ID: 11 (Page 108)
    chunks[11]["text"] = """
Onluq kəsrlərin bölünməsi. Onluq kəsri natural ədədə bölmək üçün: 1. Əvvəlcə tam hissə bölünür və qismətdə vergül qoyulur. 2. Sonra kəsr hissə bölünür. Bölmə zamanı bölünən bitərsə lakin qalıq qalarsa, bölünənin sonuna sıfırlar əlavə edib bölməni davam etdirmək olar.
Onluq kəsri onluq kəsrə bölmək üçün: 1. Böləni natural ədədə çevirmək üçün böləndəki vergülü sağa çəkirik. 2. Bölünəndə də vergülü eyni sayda sağa çəkirik (əgər rəqəm çatmazsa sıfır əlavə edirik). 3. Alınan ədədləri bölünmə qaydasına uyğun bölürük.
Onluq kəsrin 10, 100, 1000-ə vurulması və bölünməsi: Vurduqda vergül sıfırların sayı qədər SAĞA, böldükdə isə SOLA çəkilir.
""".strip()

    return chunks

if __name__ == "__main__":
    with open('tmp_math1_full.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data = repair_math1_batch3(data)
    
    with open('tmp_math1_full.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
