import json
import re

db = json.load(open('data/offline_tests.json', 'r', encoding='utf8'))
tests = db.get('Texnologiya 5', [])

keywords = [
    # Qrafik Savad
    (r'eskiz|qrafik|çertyoj|təsvir|şkalası', '2-ci mövzu: Məmulatın qrafik təsviri'),
    (r'ölçmə|nişanlama|xətkeş|pərgar|metrə', '3-cü mövzu: Ölçmə və nişanlama alətləri'),
    (r'mərhələ|texnologiya sözü', '1-ci mövzu: İnsan həyatında texnologiya. Məmulatların hazırlanma mərhələləri'),
    
    # Məişət
    (r'tərəvəz|becərilmə|bitki|toxum', '4-cü mövzu: Tərəvəzlərin becərilmə texnologiyası'),
    (r'təmir|suyun axması|kran|şurup', '5-ci mövzu: Məişətdə sadə təmir işləri'),
    (r'davranış|ünsiyyət|ailə|qonaq', '6-cı mövzu: Ailədə davranış və ünsiyyət mədəniyyəti'),
    (r'büdcə|gəlir|xərc|qənaət', '7-ci mövzu: Ailə büdcəsinin formalaşması'),
    
    # Oduncaq
    (r'yonulma|yonqar|rəndə', '11-ci mövzu: Oduncağın yonulması'),
    (r'burğu|deşik|deşilmə', '12-ci mövzu: Oduncağın əl alətləri ilə burğulanması'),
    (r'birləşdirilməsi|mıx|yapışqan.*oduncaq', '13-cü mövzu: Oduncaq hissələrinin birləşdirilməsi'),
    (r'mişar|mişarlanma|təmizlənmə.*oduncaq', '10-cu mövzu: Oduncaq materialların mişarlanması və təmizlənməsi'),
    (r'iş yeri|verstak|alət.*oduncaq', '9-cu mövzu: Oduncağın emalı üçün iş yeri və alətlər'),
    (r'oduncaq|ağac|taxta|mişar materialı', '8-ci mövzu: Oduncaq və mişar materialları'),
    
    # Metal
    (r'düzəldilmə|əyilmə.*metal', '16-cı mövzu: Təbəqə metalın və məftilin düzəldilməsi'),
    (r'təmizlənmə.*metal|əyilməsi.*metal', '17-ci mövzu: Nazik təbəqə metalın və məftilin təmizlənməsi, əyilməsi'),
    (r'birləşdirilməsi.*metal|pərçim', '18-ci mövzu: Nazik təbəqə metal hissələrinin birləşdirilməsi'),
    (r'metal ilə işləmək|məngənə.*metal', '15-ci mövzu: Metal ilə işləmək üçün iş yeri, alət və tərtibatlar'),
    (r'metal|məftil|dəmir|polad|alüminium', '14-cü mövzu: Metallar haqqında ümumi məlumat. Nazik təbəqə metal və məftil'),
    (r'elektrik|cərəyan|led|batareya|akkumulyator', '19-cu mövzu: Elektrik enerjisi və sadə elektrik dövrəsi'),
    
    # Parça
    (r'muncuq|hörmə|biser', '23-cü mövzu: Muncuq. Muncuqhörmə texnikası'),
    (r'nəm-isti|ütü|tutqac', '22-ci mövzu: Nəm-isti emal və parça qırıntılarından tutqacın hazırlanma texnologiyası'),
    (r'ülgü|biçilmə', '21-ci mövzu: Ülgünün hazırlanması və parçanın biçilməsi texnologiyaları'),
    (r'parça|sap|tikiş|iynə|geyim', '20-ci mövzu: Parçadan məmulat hazırlamaq üçün iş yeri, alətlər və tərtibatlar'),
    
    # Ərzaq
    (r'buterbrod|içki|çay|qəhvə', '24-25-ci mövzu: Buterbrodların və isti içkilərin hazırlanma texnologiyası'),
    (r'yumurta|qayğanaq', '26-cı mövzu: Yumurtadan yeməklərin hazırlanma texnologiyası'),
    (r'qida|ərzaq|yemək|mətbəx|süd|pendir|meyvə', 'Ərzaq Məhsullarının Emalı Texnologiyası (Ümumi)')
]

unmapped_list = []
mapped_count = 0
for t in tests:
    text = (t.get('question', '') + ' ' + t.get('explanation', '')).lower()
    mapped = False
    for pattern, top in keywords:
        if re.search(pattern, text):
            t['topic'] = top
            mapped = True
            mapped_count += 1
            break
    if not mapped:
        t['topic'] = 'Təyin edilməyib'
        unmapped_list.append(t)

print(f'Mapped: {mapped_count}')
print(f'Unmapped: {len(unmapped_list)}')

with open('data/offline_tests.json', 'w', encoding='utf8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

topics = {}
for t in tests:
    tp = t.get('topic')
    topics[tp] = topics.get(tp, 0) + 1
for k, v in sorted(topics.items(), key=lambda x: -x[1]):
    print(f'- {k}: {v} test')
