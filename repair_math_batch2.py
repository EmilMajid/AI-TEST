import json

def repair_math1_batch2(chunks):
    # ID: 3 (Page 34)
    chunks[3]["text"] = """
1.6. Natural ədədlərin vurulması və bölünməsi. Vurmanın xassələri: Yerdəyişmə xassəsi, Qruplaşdırma xassəsi, Paylama xassəsi. Sıfır və vahidə vurma xassəsi. Məsələn: 6 * 1 = 6; 10 * 0 = 0. Hər hansı ədədin 1-ə hasili ədədin özünə, 0-a hasili isə 0-a bərabərdir.
Vurmanın yerdəyişmə xassəsi: Vuruqların yerini dəyişdikdə hasil dəyişmir: a * b = b * a.
Vurmanın qruplaşdırma xassəsi: Üç ədədin hasilini taparkən, birinci iki ədədin hasilini üçüncüyə vurmaq və ya birinci ədədi sonrakı iki ədədin hasilinə vurmaq olar: (a * b) * c = a * (b * c).
Bölmə: Natural ədədlərin bölünmə xassələri. Sıfıra bölmək olmaz! Ədədi 1-ə böldükdə ədədin özü alınır. Sıfırı hər hansı natural ədədə böldükdə qismət 0 olur: 0 : a = 0 (burada a != 0).
Cəmi ədədə bölmək üçün hər bir toplananı həmin ədədə bölmək (əgər bölünürsə) və alınan qismətləri toplamaq olar: (a + b) : c = a : c + b : c.
""".strip()

    # ID: 4 (Page 42)
    chunks[4]["text"] = """
Natural ədədlərin bölünməsi. Natural ədədi natural ədədə böldükdə qalıq 0 olarsa, buna qalıqsız bölmə, qalıq 0-dan fərqli olarsa qalıqlı bölmə deyilir. Bölünən = Bölən * Qismət + Qalıq. Məsələn: 70 : 15 = 4 (qalıq 10). Burada 10 < 15 olmalıdır.
Ən böyük ortaq bölən (EBOB): İki natural ədədin hər birinin böləni olan ədədlər onların ortaq bölənləri adlanır. Bu ortaq bölənlərin ən böyüyü verilmiş ədədlərin ən böyük ortaq böləni (EBOB) adlanır.
Ən kiçik ortaq bölünən (EKOB): Verilmiş natural ədədlərin hər birinə bölünən ən kiçik natural ədəd onların ən kiçik ortaq bölünəni (EKOB) adlanır. 
Bölünmə əlamətləri: Sonu cüt rəqəmlə bitən ədədlər 2-yə bölünür. Rəqəmlərinin cəmi 3-ə bölünən ədədlər 3-ə bölünür. Sonu 0 və ya 5-lə bitən ədədlər 5-ə bölünür. 
""".strip()

    # ID: 5 (Page 51)
    chunks[5]["text"] = """
Məxrəcləri müxtəlif olan kəsərlərin müqayisəsi. Məxrəci bərabər olan kəsərlərdən surəti böyük olan kəsr böyükdür. Məxrəcləri müxtəlif olan kəsərləri müqayisə etmək üçün əvvəlcə onları ortaq məxrəcə gətirmək lazımdır. Bunun üçün məxrəclərin EKOB-u tapılır.
Düzgün kəsrlər: Surəti məxrəcindən kiçik olan kəsrlər düzgün kəsrlər adlanır. Düzgün kəsrlər 1-dən kiçikdir. Məsələn: 4/9, 2/3.
Düzgün olmayan kəsrlər: Surəti məxrəcinə bərabər və ya ondan böyük olan kəsrlər düzgün olmayan kəsrlər adlanır. Düzgün olmayan kəsrlər 1-ə bərabər və ya 1-dən böyükdür. Məsələn: 7/5, 9/9.
Qarışıq ədədlər: Tam və kəsr hissəsi olan ədədlər qarışıq ədədlər adlanır. Məsələn: 2 tam 3/4.
Qarışıq ədədin düzgün olmayan kəsrə çevrilməsi: Tam hissə məxrəcə vurulur, alınan hasilin üzərinə surət əlavə edilir və surətdə yazılır, məxrəc olduğu kimi qalır.
""".strip()

    return chunks

if __name__ == "__main__":
    with open('tmp_math1_full.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data = repair_math1_batch2(data)
    
    with open('tmp_math1_full.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
