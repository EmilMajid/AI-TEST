import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

# Define new/updated books
updates = [
    {
        "id": "tesviri-incesenet-6",
        "title": "Təsviri incəsənət 6",
        "subject": "Təsviri incəsənət",
        "grade": 6,
        "type": "ederslik_html",
        "book_id": 557,
        "topics": "1. TƏSVİRİ SƏNƏTİN NÖVLƏRİ\nQrafika\n1. İnsan və təsviri sənət\n2. Rəsm - təsviri yaradıcılığın əsasıdır\n3. Rəsmdə xətt və onun ifadə imkanları\n4. Çap qrafikası\n5. Rəssam yaradıcılığında reallıq və fantaziya\nRəngkarlıq\n6. Qədim dünya rəngkarlığı\n7. Spektr və rəng dairəsi\n8. Rəngkarlıq əsərlərində kolorit\n9. Miniatür rəngkarlığı\nHeykəltəraşlıq\n10. Heykəltəraşlığın növləri\n11. Heykəltəraşlıqda material və obraz\n2. QƏDİM DÜNYA MEMARLIĞI\n12. Tikililərdə forma və konstruksiya\n13. Şərq memarlığının inci\n14. Memarlıqda ornament sənəti\n15. Qədim sütunlarda təbiət formaları\n3. TƏSVİRİ SƏNƏTDƏ JANRLAR\n16. Təsviri sənət əsərlərində məzmun\n17. Rəssam yaradıcılığında insan obrazı\n18. Zəriflik və mərhəmət simvolu\n19. Əşyalar aləmi\n20. Təbiət motivləri\n4. DEKORATİV-TƏTBİQİ SƏNƏT NÖVLƏRİ\n21. Qədim dünyanın keramika sənəti\n22. Keramika üzərində rəngkarlıq\n23. Metalın bədii emal üsulları\n24. Zərgərlik sənəti\n25. Dünyanın təsviri sənət xəzinəsi"
    },
    {
        "id": "alman-dili-6-2",
        "title": "Alman dili 6 (ikinci xarici dil)",
        "subject": "Alman dili",
        "grade": 6,
        "type": "ederslik_html",
        "book_id": 917,
        "topics": "LEKTION 1. Schüler*innen in der Schule\nStunde 1. Was machen sie?\nStunde 2. In der Schule\nStunde 3. Kann oder kannst?\nStunde 4. Wiederholung\nLEKTION 2. Das finde ich super!\nStunde 1. Sprichst du Deutsch?\nStunde 2. Mein Lieblingsfach\nStunde 3. Mit der Schere schneide ich.\nStunde 4. Wiederholung\nLEKTION 3. Einkäufen\nStunde 1. Doch, ich mag Eis.\nStunde 2. Was ist im Angebot?\nStunde 3. Bazar oder Markt?\nStunde 4. Wiederholung\nDas kannst du jetzt!\nLEKTION 4. Meine Lieblingsjahreszeit\nStunde 1. Das Wetter und die Jahreszeiten\nStunde 2. Kalt oder kälter?\nStunde 3. Denn ich liebe den Regen\nStunde 4. Wiederholung\nLEKTION 5. Meine Lieblingsstadt Baku\nStunde 1. Orte in der Stadt\nStunde 2. Wo oder wohin?\nStunde 3. In meiner Stadt gibt es ....\nStunde 4. Wiederholung\nLEKTION 6. Roboter und Menschen\nStunde 1. Roboter im Alltag\nStunde 2. Interessante Roboter\nStunde 3. Ich helfe meinem Opa.\nStunde 4. Wiederholung"
    },
    {
        "id": "fransiz-dili-6-2",
        "title": "Fransız dili 6 (ikinci xarici dil)",
        "subject": "Fransız dili",
        "grade": 6,
        "type": "ederslik_html",
        "book_id": 918,
        "topics": "Étape I Bonjour les amis !\nLeçon 1 Bonne rentrée !\nLeçon 2 Qui suis-je ?\nLeçon 3 Mon prof,ce héros\nJe révise\nÉtape II J’aime ça !\nLeçon 1 C’est la récré !\nLeçon 2 J’aime les animaux\nLeçon 3 Qu’est-ce que tu fais ?\nJe révise\nÉtape III Ma ville\nLeçon 1 C’est où ça ?\nLeçon 2 Dans mon quartier, il y a\nLeçon 3 Et voilà ma chambre\nJe révise\nÉtape IV Ça va mieux !\nLeçon 1 Je mange bien !\nLeçon 2 Merci, Docteur !\nLeçon 3 Mes règles d’hygiène\nJe révise\nÉtape V On va célébrer !\nLeçon 1 C’est la fête !\nLeçon 2 C’est très gentil !\nLeçon 3 Célébrons ensemble !\nJe révise\nÉtape VI Vivement les vacances vertes !\nLeçon 1 La France, c’est ici !\nLLeçon 2 Vacances nature\nLeçon 3 Je protège la nature\nJe révise\nDico visuel\nPrécis de grammaire"
    },
    {
        "id": "rus-dili-6-2",
        "title": "Rus dili 6 (ikinci xarici dil)",
        "subject": "Rus dili",
        "grade": 6,
        "type": "ederslik_html",
        "book_id": 563,
        "topics": "1 Разде́л I. Наста́ла о́сень золота́я!\nУро́к 1. Пора́! в шко́лу!\nУро́к 2. Но́вый однокла́ссник\nУро́к 3. Как краси́во о́сенью в лесу́!\nУро́к 4. На́ши учителя́!\nУро́к 5. На́ше расписа́ние\n2 Разде́л II. Мои́ интере́сы и увлече́ния\nУро́к 6. Чте́ние - вот лу́чшее уче́нье\nУро́к 7. Му́зыка мое́й души́\nУро́к 8. В здоро́вом те́ле - здоро́вый дух\nУро́к 9. Мой четвероно́гий друг\nУро́к 10. Вре́мя высо́ких техноло́гий\n3 Разде́л III. Здра́вствуй, го́стья-зима́!\nУро́к 11. Волше́бница-зима́\nУро́к 12. Чуде́сный о́тдых в Габале́\nУро́к 13. Но́вый год - вре́мя волшебства́\nУро́к 14. Помоги́те пти́цам!\n4 Разде́л IV. Е́сли хо́чешь быть здоро́в\nУро́к 15. Здоро́вое пита́ние\nУро́к 16. Режи́м дня\nУро́к 17. О́вощи и фру́кты - поле́зные проду́кты\nУро́к 18. Движе́ние - э́to жизнь\nУро́к 19. Чистота́ - зало́г здоро́вья\n5 Разде́л V. Хорошо́ в краю́ родно́м!\nУро́к 20. Я и моя́ Ро́дина\nУро́к 21. Тради́ции Новру́за\nУро́к 22. В Шушу́ пришла́ весна́!\nУróк 23. Караба́х - Азербайджа́н!\nУróк 24. Геро́и не умира́ют\n6 Разде́л VI. Тепло́ души́ и со́лнца\nУróк 25. Моя́ семья́\nУróк 26. Мои́ друзья́\nУróк 27. Мо́ре позити́ва\nУróк 28. Ско́ro ле́to!"
    }
]

for up in updates:
    # Update existing by ID or book_id, or append
    found = False
    for i, b in enumerate(d["6"]):
        if b["id"] == up["id"]:
            d["6"][i].update(up)
            found = True
            break
    if not found:
        # Check by book_id to avoid duplication if user changed the ID string
        for i, b in enumerate(d["6"]):
            if b.get("book_id") == up["book_id"]:
                d["6"][i].update(up)
                found = True
                break
    if not found:
        d["6"].append(up)

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated for Grade 6 Phase 5.")
