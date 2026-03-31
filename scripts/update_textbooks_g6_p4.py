import json
from pathlib import Path

p = Path(r"c:\Users\User\Downloads\azerbaijanaiplatform\data\textbooks.json")
with open(p, "r", encoding="utf-8") as f:
    d = json.load(f)

updates = {
    "informatika-6": {
        "id": "912",
        "topics": "1. KOMPÜTER\n1. Kompüter necə işləyir\n2. İnformasiya harada saxlanılır\n3. Ədədi informasiya necə kodlaşdırılır\n4. İnformasiya nə qədər yer tutur\n2. PROQRAM TƏMİNATI\n5. Proqramı başlatmağın bir neçə üsulu\n6. Şəklin kompüterdə saxlanması və çapı\n7. Mətnin görünüşünün yaxşılaşdırılması\n8. Abzasın formatlanması\n9. Elektron təqdimatlar\n10. Slaydlarla iş\n11. Obyektin informasiya modeli\n3. ALQORİTM\n12. Alqoritmin xassələri\n13. Alqoritmin növləri\n14. Dövri alqoritmlər\n15. Əyləncəli məsələlər\n4. PROQRAMLAŞDIRMA\n16. Proqramda dəyişənlər\n17. Proqramlaşdırma mühitində seçim\n18. Proqramlaşdırma mühitində dövr\n19. Dövrlər və naxışlar\n20. Proqramlaşdırma mühitində musiqi\n5. İNTERNET\n21. İnformasiya resursları ilə iş mərhələləri\n22. Dünya hörümçək torunda gəzişmə\n23. İnternetdə axtarış\n24. Elektron poçt\n25. Elektron poçtla məktublaşma\nALPLogo proqramlaşdırma mühitinin komandaları\nDərslikdə işlənmiş ingiliscə söz və ifadələr\nDərslikdə işlənmiş qısaltmalar"
    },
    "ingilis-dili-6": {
        "id": "916",
        "topics": "UNIT 1. About Town\nPlaces in Town\nThere is/are (Affirmative, Negative, Yes/No Questions and Short Answers)\nPrepositions of Place\nAdverbs of Frequency\nUNIT 2. Delicious Diversity\nFood\nCan for Permission (Affirmative, Negative, Yes/No Questions and Short Answers)\nCooking\nMaking Suggestions and Responding\nSubject and Object Pronouns\nReview\nUNIT 3. What a Holiday!\nOn Holiday\nPast Simple of be (Affirmative and Negative)\nThere was/were\nFacilities, People and Activities\nUNIT 4. We all have a story\nStory Verbs\nPast Simple of Regular Verbs (Affirmative)\nTime Expressions\nPast Simple of Irregular Verbs (Affirmative and Negative), Past Simple of Regular Verbs (Negative)\nReview\nUNIT 5. Incredible Journeys\nTransport\nPast Simple of Regular and Irregular Verbs (Questions and Answers)\nTransport Verbs\nCould for Ability in the Past (Affirmative, Negative, Yes/No Questions and Short Answers)\nUNIT 6. Heroes Make a Difference\nPersonality Adjectives\nPast Continuous (Affirmative and Negative)\nFeelings\nPast Continuous (Questions and Answers)\nReview\nUNIT 7. Great Ideas\nInnovation Verbs\nPast Continuous and Past Simple\nTechnology\nPossessive Pronouns\nUNIT 8. Our Natural World\nNature\nVerbs to Express Likes, Wants and Needs\nThe Weather\nConnectors (After And, Before, But, However and So)\nReview"
    },
    "alman-dili-6": {
        "id": "917",
        "topics": "LEKTION 1. Schüler*innen in der Schule\nStunde 1. Was machen sie?\nStunde 2. In der Schule\nStunde 3. Kann oder kannst?\nStunde 4. Wiederholung\nLEKTION 2. Das finde ich super!\nStunde 1. Sprichst du Deutsch?\nStunde 2. Mein Lieblingsfach\nStunde 3. Mit der Schere schneide ich.\nStunde 4. Wiederholung\nLEKTION 3. Einkäufen\nStunde 1. Doch, ich mag Eis.\nStunde 2. Was ist im Angebot?\nStunde 3. Bazar oder Markt?\nStunde 4. Wiederholung\nDas kannst du jetzt!\nLEKTION 4. Meine Lieblingsjahreszeit\nStunde 1. Das Wetter und die Jahreszeiten\nStunde 2. Kalt oder kälter?\nStunde 3. Denn ich liebe den Regen\nStunde 4. Wiederholung\nLEKTION 5. Meine Lieblingsstadt Baku\nStunde 1. Orte in der Stadt\nStunde 2. Wo oder wohin?\nStunde 3. In meiner Stadt gibt es ....\nStunde 4. Wiederholung\nLEKTION 6. Roboter und Menschen\nStunde 1. Roboter im Alltag\nStunde 2. Interessante Roboter\nStunde 3. Ich helfe meinem Opa.\nStunde 4. Wiederholung"
    },
    "fransiz-dili-6": {
        "id": "918",
        "topics": "Étape I Bonjour les amis !\nLeçon 1 Bonne rentrée !\nLeçon 2 Qui suis-je ?\nLeçon 3 Mon prof,ce héros\nJe révise\nÉtape II J’aime ça !\nLeçon 1 C’est la récré !\nLeçon 2 J’aime les animaux\nLeçon 3 Qu’est-ce que tu fais ?\nJe révise\nÉtape III Ma ville\nLeçon 1 C’est où ça ?\nLeçon 2 Dans mon quartier, il y a\nLeçon 3 Et voilà ma chambre\nJe révise\nÉtape IV Ça va mieux !\nLeçon 1 Je mange bien !\nLeçon 2 Merci, Docteur !\nLeçon 3 Mes règles d’hygiène\nJe révise\nÉtape V On va celebrar !\nLeçon 1 C’est la fête !\nLeçon 2 C’est très gentil !\nLeçon 3 Célébrons ensemble !\nJe révise\nÉtape VI Vivement les vacances vertes !\nLeçon 1 La France, c’est ici !\nLLeçon 2 Vacances nature\nLeçon 3 Je protège la nature\nJe révise\nDico visuel\nPrécis de grammaire"
    },
    "rus-dili-6": {
        "id": "591",
        "topics": "01 Разде́л I. Уче́нье - свет, а неуче́нье - тьма\nУро́к 1. Пора́ в шко́лу!\nУро́к 2. На́ше «ма́ленькое óбщество»\nУро́к 3. Мой люби́мый кабине́т\nУро́к 4. Э́тот удиви́тельный мир!\nУро́к 5. День распи́сан по часа́м\nУро́к 6. Челове́к без друзе́й, что де́рево без корне́й\nУро́к 7. «Борода́тый ребёнок» (По Дж.Мамедгулузаде́)\n02 Разде́л II. В здоро́вом те́ле - здоро́вый дух!\nУро́к 8. Ли́чная гигие́на\nУро́к 9. Неви́димый враг\nУро́к 10. У врача́\nУро́к 11. Спорт - зало́г здоро́вья\nУро́к 12. Мой люби́мый вид спо́рта\nУро́к 13. Спорти́вное насле́диe\nУро́к 14. Спорти́вные соревнова́ния в Азербайджа́не\nУро́к 15. Изве́стный арби́тр\nУро́к 16. «В любо́м де́ле ну́жно уме́ть рабо́тать» (По В.Голя́вкину)\n03 Разде́л III. Мир вокру́г меня́\nУро́к 17. В теа́тре\nУро́к 18. В кино́\nУро́к 19. В ци́рке\nУро́к 20. В зоопа́рке\nУро́к 21. На по́чте\nУро́к 22. В кни́жном магази́не\nУро́к 23. В музе́е\nУро́к 24. В обсервато́рии\nУро́к 25. «Почто́вый я́щик» (По Дж.Мамедгулузаде́)\n04 Разде́л IV. Пра́здники и па́мятные да́ты мое́й страны́\nУро́к 26. Вме́сте мы - си́ла!\nУро́к 27. Быть шехи́дом почётно!\nУро́к 28. День незави́симости\nУро́к 29. Под зна́менем Ро́дины\nУро́к 30. День вооружённых сил Азербайджа́на\nУро́к 31. По́двиг геро́ев\nУро́к 32. Караба́х - э́то Азербайджа́н!\nУро́к 33. «Деде́ Корку́т» (отры́вок)\n05 Разде́л V. Азербайджа́н - мой край родно́й!\nУро́к 34. Страна́ огне́й\nУро́к 35. Атешгя́х\nУро́к 36. Мавзоле́й Момине-хату́н\nУро́к 37. Ро́дина Низами́\nУро́к 38. Дворе́ц шеки́нских ха́нов\nУро́к 39. Вели́кий компози́тор\nУро́к 40. Лаги́ч\nУро́к 41. «Азербайджа́н» (С.Вургу́н)\n06 Разде́л VI. Э́то интере́сно знать\nУро́к 42. Го́лубь - пти́ца ми́ра\nУро́к 43. Дельфи́ны\nУро́к 44. «Джуджаля́рим»\nУро́к 45. Пчёлы\nУро́к 46. Почему́ ду́ет ве́тер?\nУро́к 47. Краси́вое явле́ние приро́ды\nУро́к 48. Ха́ры-бюльбю́ль\nУро́к 49. «Караба́хский конь» (Б.Вагабзаде́)\nОтве́ты\nТолко́вый слова́рь\nЛитература"
    }
}

for book in d["6"]:
    if book["id"] in updates:
        book.update({
            "type": "ederslik_html",
            "e_derslik_id": updates[book["id"]]["id"],
            "topics": updates[book["id"]]["topics"]
        })

# Special case for 'rus-dili-6' which might not be in the list if it was only ever placeholder
ids_found = [b["id"] for b in d["6"]]
for book_id, up in updates.items():
    if book_id not in ids_found:
        d["6"].append({
            "id": book_id,
            "title": book_id.replace("-", " ").title(),
            "subject": book_id.split("-")[0].title(),
            "grade": 6,
            "type": "ederslik_html",
            "e_derslik_id": up["id"],
            "topics": up["topics"],
            "chunks": 0
        })

with open(p, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print("textbooks.json updated successfully for Phase 4.")
