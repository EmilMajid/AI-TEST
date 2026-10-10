import json
import glob
import os
import re

DOMAIN_MAPPINGS = {
    'biologiya': {
        'target_phrases': ['fiziki/riyazi', 'kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə'],
        'replacement': 'bioloji anlayışı, orqanoid funksiyasını və ya ekoloji prosesi oxşar bioloji qanunauyğunluqlarla'
    },
    'kimya': {
        'target_phrases': ['fiziki/riyazi', 'kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə'],
        'replacement': 'maddənin kimyəvi xassələrini, reaksiya tipini və ya tərkibini oxşar birləşmələrlə'
    },
    'informatika': {
        'target_phrases': ['fiziki/riyazi', 'kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə'],
        'replacement': 'alqoritmik addımı, aparat parametrini və ya proqram strukturunu oxşar İKT anlayışları ilə'
    },
    'təbiət': {
        'target_phrases': ['fiziki/riyazi', 'kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə'],
        'replacement': 'təbiət hadisəsini və ya canlı orqanizm xüsusiyyətini digər təbiət qanunları ilə'
    },
    'coğrafiya': {
        'target_phrases': ['fiziki/riyazi', 'kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə'],
        'replacement': 'coğrafi obyekti, təbii zonanı və ya geosiyasi prosesi oxşar qanunauyğunluqlarla'
    }
}

def normalize_key(k: str) -> str:
    return k.replace('İ', 'i').replace('I', 'ı').lower()

def clean_diagnostic_text(text: str, subject_key: str) -> str:
    subj_norm = normalize_key(subject_key)
    for domain, conf in DOMAIN_MAPPINGS.items():
        if domain in subj_norm:
            res = text
            res = re.sub(
                r'bu kəmiyyəti və ya düsturu oxşar fiziki/riyazi xassələrlə',
                f'bu {conf["replacement"]}',
                res,
                flags=re.IGNORECASE
            )
            res = re.sub(
                r'fiziki/riyazi',
                domain,
                res,
                flags=re.IGNORECASE
            )
            return res
    return text

def process_file(fpath: str):
    print(f"Processing {fpath}...")
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    changed = 0
    if isinstance(data, dict):
        for subject, content in data.items():
            subj_norm = normalize_key(subject)
            matched_domain = any(d in subj_norm for d in DOMAIN_MAPPINGS.keys())
            if not matched_domain:
                continue

            if isinstance(content, list):
                for q in content:
                    diag = q.get('distractor_diagnostics')
                    if isinstance(diag, dict):
                        for k, v in diag.items():
                            if isinstance(v, str) and ('fiziki/riyazi' in v or 'kəmiyyəti və ya düsturu' in v):
                                diag[k] = clean_diagnostic_text(v, subject)
                                changed += 1
            elif isinstance(content, dict):
                for topic, qlist in content.items():
                    if isinstance(qlist, list):
                        for q in qlist:
                            diag = q.get('distractor_diagnostics')
                            if isinstance(diag, dict):
                                for k, v in diag.items():
                                    if isinstance(v, str) and ('fiziki/riyazi' in v or 'kəmiyyəti və ya düsturu' in v):
                                        diag[k] = clean_diagnostic_text(v, subject)
                                        changed += 1

    if changed > 0:
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  -> Successfully updated {changed} diagnostics in {fpath}")
    else:
        print(f"  -> No changes needed in {fpath}")

def main():
    for fpath in sorted(glob.glob('data/grades/grade_*.json')):
        process_file(fpath)
    print("\n[COMPLETE] Domain-specific taxonomy restoration complete.")

if __name__ == '__main__':
    main()
