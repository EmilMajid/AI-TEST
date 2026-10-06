import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_sentences = [
    "Bir neçə musiqiçinin birgə ifasına ansambl deyilir.",
    "Bu hadisəyə işığın sınması deyilir.",
    "Maddənin tərkibində dəyişikliyin müşahidə olunmadığı hadisələrə fiziki hadisələr deyilir.",
    "Enerjinin bu xüsusiyyətinə enerjinin saxlanması qanunu deyilir.",
    "İşığın yayıldığı maddələrə optik mühit deyilir.",
    "İşığın sınmasının səbəb olduğu bu göz aldanmasına ilğım deyilir.",
    "Ovlanan və yırtıcı tərəfindən yeyilən heyvana isə şikar deyilir.",
    "Bir cisim işığı keçirmirsə, ona qeyri-şəffaf cisim deyilir.",
    "Kompüterə verilən komandalar toplusuna proqram deyilir.",
    "ax² + bx + c = 0 şəklində olan tənliyə kvadrat tənlik deyilir.",
    "Düzbucaqlı üçbucaqda katetlərin kvadratları cəmi hipotenuzun kvadratına bərabərdir.",
    "Cümlənin baş üzvləri mübtəda və xəbər adlanır."
]

def extract_term_precise(sentence):
    # Clean sentence
    s = sentence.strip(' .')
    words = s.split()
    if len(words) < 3:
        return None
    verb = words[-1].lower()
    if verb not in ['deyilir', 'adlanır', 'adlandırılır', 'bərabərdir', 'hesab', 'olunur']:
        # If verb is 'hesab olunur'
        if len(words) >= 2 and words[-2].lower() == 'hesab' and words[-1].lower() == 'olunur':
            verb_len = 2
        else:
            return None
    else:
        verb_len = 1
        
    term_words = []
    dative_sfx = re.compile(r'(?:[yn]?[aə]|[ld]?[aə]r[aə])$', re.I)
    
    # Scan backwards from verb
    for w in reversed(words[:-verb_len]):
        clean_w = w.strip('.,:;()[]"\'')
        if clean_w.lower() in ['isə', 'həm', 'də', 'da', 'artıq', 'buna', 'belə', 'yəni']:
            continue
        if dative_sfx.search(clean_w):
            # We reached the dative antecedent!
            break
        term_words.insert(0, clean_w)
        if len(term_words) >= 4:
            break
            
    if not term_words:
        # Fallback: take last 1-2 words before verb
        term_words = [words[-verb_len-1].strip('.,:;()[]"\'')]
        
    term = ' '.join(term_words).strip()
    # Normalize capital
    if term:
        term = term[0].upper() + term[1:]
    return term

print("Testing backward dative boundary scanner:")
for s in test_sentences:
    t = extract_term_precise(s)
    print(f"  Statement: {s}")
    print(f"  -> Precise Term: '{t}'\n")
