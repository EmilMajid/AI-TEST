import json

topic_list = """Bölmə 1. Fərd və toplum
Fəsil 1. Söz vermişəm
Sözlərdə saitlərin deyilişi və yazılışı: səsdüşümü və səsartımı
Fəsil 2. Sənin kimi olacağam
Saitlərin uzun tələffüzü
Fəsil 3. Buqələmun
Samitlərin tələffüzü
Fəsil 4. Sadiq dost
Söz ortasında yanaşı gələn samitlərin deyilişi və yazılışı
Ümumiləşdirici təkrar
Bölmə 2. Qədimdə yazı
Fəsil 1. Piktoqramdan hərflərə
Alınma sözlərin bitişik və defislə yazılması
Fəsil 2. Rozetta daşının sirri
Hiperonim və hiponim
Qoşa samitlə bitən sözlərin deyilişi və yazılışı
Fəsil 3. Qədim türk əlifbası
Mürəkkəb adlar (şəxs və yer adları)
Fəsil 4. Qədimdə yazı materialları
Sözlərin təkrarından yaranan mürəkkəb sözlər
Bölmə 3. Milli dəyərlər
Fəsil 1. Vətən sağ olsun!
Sözün başlanğıc forması
Fəsil 2. Sonuncu dərs
Eyniköklü sözlər
Fəsil 3. Şeyx Səfi məqbərəsi necə talan olundu?
Söz birləşmələri
Fəsil 4. Ağdam Çörək Muzeyi
Qeyri-müəyyən yiyəlik hal
Bölmə 4. Qədim dünya: tarix və miflər
Fəsil 1. Fironlar və ehramlar
Qoşma. Qoşmaların orfoqrafiyası
Fəsil 2. Troya müharibəsi
Qoşmanın qrammatik sinonimliyi və omonimliyi
Fəsil 3. Barbarlar və vandallar
Bağlayıcılar
İzahlı sözlük
Bölmə 5. İncəsənət və informasiya
Fəsil 1. Danışan ilmələr
Saylardan sonra isimlərin təkdə və ya cəmdə olması
Fəsil 2. Rəqslərin dili
Numerativ sözlər
Fəsil 3. Heykəltaraş Mirəli Mirqasımov
Tamamlıq
Fəsil 4. Qoca aşpaz
Qeyri-müəyyən təsirlik hal
Bölmə 6. Ədəbiyyatda fantastika
Fəsil 1. Doktor Salvator ittihamları rədd edir
Hal şəkilçisi qəbul etməyən isimlər
Fəsil 2. Görünməz adam
Təyin
Fəsil 3. Skelliq
Zərflik
Fəsil 4. Yaddaş
Söz birləşmələri cümlə üzvü kimi
Bölmə 7. Nəqliyyatda ixtiralar
Fəsil 1. Avtomobil necə yarandı?
Cümlədə söz sırası
Fəsil 2. Havada uçuş
Xəbər vəzifəsində olan feillərin deyilişi və yazılışı
Fəsil 3. Relslər üzərində hərəkət
“L” samiti ilə başlanan bəzi şəkilçilərin tələffüzü
Fəsil 4. Gələcəyin nəqliyyatı
“-la” şəkilçisinin funksiyaları
Bölmə 8. Kitabın tarixi
Fəsil 1. Qədimdə kitab işi
Mənsubiyyət şəkilçisinin yazılışı
Fəsil 2. Kitab çapı
“O” və “bu” əvəzliklərindən sonra vergül
Fəsil 3. Naşirlər və oxucular
Fəsil 4. Müasir kitablar""".split('\n')

with open('data/offline_tests.json', 'r', encoding='utf8') as f:
    db = json.load(f)

tests = db.get('Azərbaycan dili 6', [])

# Create a dictionary to hold the counts
topic_counts = {t.strip(): 0 for t in topic_list if t.strip()}

# Also handle "Ümumiləşdirici təkrar" and "İzahlı sözlük" separately if they repeat, 
# but a standard dict works if we aggregate by exact name.
for t in tests:
    topic = t.get('topic', '').strip()
    if topic in topic_counts:
        topic_counts[topic] += 1
    else:
        # If somehow it's not in the list (e.g. repeated Ümumiləşdirici təkrar)
        if topic:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1

# Output formatted
out = []
for t in topic_list:
    t = t.strip()
    if not t: continue
    out.append(f"{t} - {topic_counts.get(t, 0)} test")

with open('az_dili_6_stats.txt', 'w', encoding='utf8') as f:
    f.write('\n'.join(out))
