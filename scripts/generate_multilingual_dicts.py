
# generate_multilingual_dicts.py
import os
from pathlib import Path

# Basic dictionaries for validation coverage (Top 300-500 words per language)

WORDS_EN = """
the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us
study book school student teacher lesson page chapter section question answer text language science history geography math education learn read write speak listen understanding knowledge information computer system program file data
"""

WORDS_RU = """
и в не на я быть он с что а по это она этот к но они мы как из у то за свой вы весь год от так о для ты же все тот кто этот мочь человек такой все его сказать только или себя ещё бы какой дело жизнь сам очень два день её ли при надо один раз тут там ж хотеть под где много ну глаз давать большой тут
школа класс ученик учитель урок страница глава раздел вопрос ответ текст язык наука история география математика образование читать писать говорить слушать знание информация компьютер система программа файл данные
"""

WORDS_DE = """
der die das und in den von zu das mit sich des auf für ist im dem nicht ein eine als auch es an werden aus er hat dass sie nach wird bei einer um am sind noch wie einem über einen so zum war haben nur oder aber vor zur bis mehr durch man seine sei prohzent wenn kann sehr schon hier doch wieder
schule klasse schüler lehrer lektion seite kapitel abschnitt frage antwort text sprache wissenschaft geschichte geographie mathematik bildung lernen lesen schreiben sprechen hören wissen information computer system programm datei daten
"""

WORDS_FR = """
le de la et les à en que du des est un une pour dans ce qui il a ne sur pas au par son plus se avec mais nous ou elle comme sa tout faire leur on bien dire aussi aux me mon ma mes ils sans si an
école classe élève enseignant leçon page chapitre section question réponse texte langue science histoire géographie mathématiques éducation apprendre lire écrire parler écouter connaissance information ordinateur système programme fichier données
"""

def generate_dictionaries():
    base_dir = Path(__file__).parent / "data" / "dictionaries"
    base_dir.mkdir(parents=True, exist_ok=True)
    
    dicts = {
        "en.txt": WORDS_EN,
        "ru.txt": WORDS_RU,
        "de.txt": WORDS_DE,
        "fr.txt": WORDS_FR
    }
    
    for filename, content in dicts.items():
        file_path = base_dir / filename
        unique_words = sorted(set(w.lower() for w in content.split() if w.strip()))
        
        with open(file_path, "w", encoding="utf-8") as f:
            for word in unique_words:
                f.write(word + "\n")
        
        print(f"Generated {len(unique_words)} words in {filename}")

if __name__ == "__main__":
    generate_dictionaries()
