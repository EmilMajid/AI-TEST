import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ROOT = r"C:\Users\User\Downloads\azerbaijanaiplatform"
G7_PATH = os.path.join(ROOT, "data", "grades", "grade_7.json")

with open(G7_PATH, 'r', encoding='utf-8') as f:
    d7 = json.load(f)

# 1. Remove Texnologiya 7 if empty
if "Texnologiya 7" in d7 and len(d7["Texnologiya 7"]) == 0:
    del d7["Texnologiya 7"]
    print("Deleted empty Texnologiya 7")

# 2. Fix 8 L2 lazy distractors
# Riyaziyyat 7: 3. Proqnozlaşdırma, Q#8
q = d7["Riyaziyyat 7"]["3. Proqnozlaşdırma"][8]
q["question"] = "Atıcı hədəfə 20 dəfə atəş açdı və 16 dəfə vurdu. Növbəti atəşdə atıcının hədəfi vurmasının statistik ehtimalını tapın."
q["options"] = ["0,2", "0,5", "0,6", "0,8"]
q["correctAnswer"] = 3
q["explanation"] = "Atıcının hədəfi vurma tezliyi: 16/20 = 4/5 = 0,8 təşkil edir."

# Riyaziyyat 7: 10. Rasional ədədlərin ədəd oxunda göstərilməsi, Q#14
q = d7["Riyaziyyat 7"]["10. Rasional ədədlərin ədəd oxunda göstərilməsi"][14]
q["options"] = ["-1", "2", "0", "1"]
q["correctAnswer"] = 2
q["explanation"] = "0 ədədi nə müsbət, nə də mənfi ədəddir, koordinat başlanğıcında yerləşir."

# Riyaziyyat 7: 33. Üçbucağın elementləri: tənbölən, median, hündürlük, Q#8
q = d7["Riyaziyyat 7"]["33. Üçbucağın elementləri: tənbölən, median, hündürlük"][8]
q["options"] = ["3", "1", "0", "2"]
q["correctAnswer"] = 3
q["explanation"] = "Korbucaqlı üçbucaqda iti bucaqların təpəsindən çəkilən 2 hündürlük üçbucağın xaricində yerləşir."

# Riyaziyyat 7: 57. Bərabəryanlı və bərabərtərəfli üçbucağın xassələri, Q#6
q = d7["Riyaziyyat 7"]["57. Bərabəryanlı və bərabərtərəfli üçbucağın xassələri"][6]
q["options"] = ["Həm median, həm də tənböləndir", "Yalnız tərəfləri yarıya bölür", "Yalnız median rolunu oynayır", "Yalnız tənbölən rolunu oynayır"]
q["correctAnswer"] = 0
q["explanation"] = "Bərabəryanlı üçbucaqda oturacağa çəkilmiş hündürlük həm median, həm də tənböləndir."

# Fizika 7: Elm, texnologiya, həyat (Bölmə 1), Q#1
q = d7["Fizika 7"]["Elm, texnologiya, həyat (Bölmə 1)"][1]
q["options"] = ["Lazer texnologiyalarının və optik rabitənin", "Mexaniki saatların", "Sadə buxar dəyirmanlarının", "Qədim su çarxlarının"]
q["correctAnswer"] = 0
q["explanation"] = "Fizikanın optika və kvant sahəsinin inkişafı lazerlərin və müasir yüksək texnologiyaların yaranmasına səbəb olmuşdur."

# Kimya 7: 1.5 Qeyri-metallar və onların xassələri. Allotropiya, Q#13
q = d7["Kimya 7"]["1.5 Qeyri-metallar və onların xassələri. Allotropiya"][13]
q["options"] = ["Koks", "Qrafit", "Karbin", "Almaz"]
q["correctAnswer"] = 1
q["explanation"] = "Qrafit laylı kristal quruluşuna və sərbəst elektronlara malik olduğu üçün elektrik cərəyanını yaxşı keçirir."

# Kimya 7: 2.3 İzotoplar və ionlar, Q#10
q = d7["Kimya 7"]["2.3 İzotoplar və ionlar"][10]
q["options"] = ["Protium", "Tritium", "Deyterium", "Litium"]
q["correctAnswer"] = 2
q["explanation"] = "Ağır su (D2O) hidrogenin deyterium izotopunun oksigenlə birləşməsindən yaranır."

# Kimya 7: 5.3 Durultma üsulu, Q#7
q = d7["Kimya 7"]["5.3 Durultma üsulu"][7]
q["options"] = ["Kerosin", "Spirt", "Su", "Benzin"]
q["correctAnswer"] = 2
q["explanation"] = "Suyun sıxlığı benzindən böyük olduğu üçün ayırıcı qıfın aşağısında toplanır və kranı açdıqda ilk olaraq su axır."

print("Fixed 8 lazy distractors successfully!")

# 3. Fix simple single/duplicate options in Info, Fizika, Kimya
# Info Q#2 in 14. Say sistemləri
q = d7["İnformatika 7"]["14. Say sistemləri"][2]
q["options"] = ["Əsası 2-dir (0 və 1)", "Əsası 8-dir (0-7)", "Əsası 10-dur (0-9)", "Əsası 16-dır (0-15)"]
q["correctAnswer"] = 0
q["explanation"] = "İkilik say sisteminin əsası 2-dir və yalnız 0 və 1 rəqəmlərindən istifadə olunur."

# Fizika Q#7 in Xülasə (Bölmə 5)
q = d7["Fizika 7"]["Xülasə (Bölmə 5)"][7]
q["options"] = ["η = (A_faydalı / A_tam) · 100%", "η = (A_tam / A_faydalı) · 100%", "η = (A_faydalı · A_tam) / 100%", "η = (A_tam - A_faydalı) · 100%"]
q["correctAnswer"] = 0
q["explanation"] = "Faydalı iş əmsalı (η), faydalı işin tam işə nisbətinin faizlə ifadəsidir: η = (A_faydalı / A_tam) · 100%."

# Fizika Q#11 in Ümumiləşdirici tapşırıqlar (Bölmə 7)
q = d7["Fizika 7"]["Ümumiləşdirici tapşırıqlar (Bölmə 7)"][11]
q["options"] = ["η hərfi ilə, η = (A_faydalı / A_tam) · 100%", "N hərfi ilə, N = A / t", "A hərfi ilə, A = F · s", "p hərfi ilə, p = F / S"]
q["correctAnswer"] = 0
q["explanation"] = "FİƏ yunan hərfi η (eta) ilə işarə olunur və faydalı işin tam işə nisbətinin faizlə ifadəsinə bərabərdir."

# Kimya Q#5 in 1.5
q = d7["Kimya 7"]["1.5 Qeyri-metallar və onların xassələri. Allotropiya"][5]
q["options"] = ["2 allotropik şəkildəyişmə: oksigen və ozon", "3 allotropik şəkildəyişmə: almaz, qrafit, fulleren", "1 şəkildəyişmə: yalnız molekulyar qaz", "4 allotropik şəkildəyişmə"]
q["correctAnswer"] = 0
q["explanation"] = "Oksigen elementi iki allotropik şəkildəyişmə - oksigen qazı (O2) və ozon (O3) əmələ gətirir."

# Kimya Q#6 in 3.1
q = d7["Kimya 7"]["3.1 Kimyəvi birləşmələr, onların formulları və adları"][6]
q["options"] = ["Fosfor(V) oksid", "Fosfor(III) oksid", "Fosfor(IV) oksid", "Fosfor(II) oksid"]
q["correctAnswer"] = 0
q["explanation"] = "P2O5 birləşməsində oksigen II, fosfor isə V valentlidir: fosfor(V) oksid."

# Kimya Q#13 in 3.1
q = d7["Kimya 7"]["3.1 Kimyəvi birləşmələr, onların formulları və adları"][13]
q["options"] = ["Mis(I) oksid", "Mis(II) oksid", "Mis(III) oksid", "Mis(IV) oksid"]
q["correctAnswer"] = 0
q["explanation"] = "Cu2O birləşməsində mis birvalentlidir: mis(I) oksid."

# Kimya Q#8 in Ümumiləşdirici tapşırıqlar (Bölmə 3)
q = d7["Kimya 7"]["Ümumiləşdirici tapşırıqlar (Bölmə 3)"][8]
q["options"] = ["Dəmir(III) oksid", "Dəmir(II) oksid", "Dəmir(IV) oksid", "Dəmir(VI) oksid"]
q["correctAnswer"] = 0
q["explanation"] = "Fe2O3 birləşməsində dəmir 3 valentlidir: dəmir(III) oksid."

# Kimya Q#4 in Ümumiləşdirici tapşırıqlar (Bölmə 7)
q = d7["Kimya 7"]["Ümumiləşdirici tapşırıqlar (Bölmə 7)"][4]
q["options"] = ["ω = (m_maddə / m_məhlul) · 100%", "ω = (m_məhlul / m_maddə) · 100%", "ω = (m_maddə · m_su) / 100%", "ω = (m_məhlul · m_su) · 100%"]
q["correctAnswer"] = 0
q["explanation"] = "Həllolan maddənin kütlə payı (ω) = (m_maddə / m_məhlul) · 100% düsturu ilə hesablanır."

# 4. Fix Russian duplicate option 3 in 23 topics
for sname in ["Rus dili 7", "Русский язык - 7 (əsas xarici dil)", "rus-dili-7"]:
    if sname in d7:
        for tname, qs in d7[sname].items():
            for q_idx, q in enumerate(qs):
                opts = q.get("options", [])
                clean_opts = [str(o).strip().lower() for o in opts]
                if len(set(clean_opts)) < len(opts) and len(opts) == 4:
                    # Fix option 3 (which was duplicated from option 0)
                    # Option 0 is correct, option 1 has no comma, option 2 has double comma
                    # Make option 3 have comma after first word
                    w = opts[0].split()
                    if len(w) > 3:
                        opts[3] = f"{w[0]}, {' '.join(w[1:])}".replace(",,", ",")
                    q["options"] = opts

print("Fixed Russian duplicates!")

with open(G7_PATH, 'w', encoding='utf-8') as f:
    json.dump(d7, f, ensure_ascii=False, indent=2)

print("Saved baseline cleanup!")
