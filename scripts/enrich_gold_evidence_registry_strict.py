import json
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("reports/gold_rules_pedagogical_evidence_registry.json", "r", encoding="utf-8") as f:
    registry = json.load(f)

# Epistemic necessity classification according to KAG Level 4 Constitution
# Distinguishes STRICT_NECESSITY vs HELPFUL_PREPARATION vs ALTERNATIVE_PATH
EPISTEMIC_CRITERIA = {
    "GOLD-M01": {
        "source": "Xətti tənlik", "target": "Kvadrat tənlik",
        "strict_necessity": False,
        "helpful_preparation": True,
        "alternative_path_exists": True,
        "alternative_path_details": "Kvadrat tənliyin qrafik həlli, Viyet teoremi və ya tam kvadrata ayırma üsulu birbaşa xətti tənliklər sistemi olmadan da tətbiq edilə bilər. Lakin vuruqlara ayırma üsulunda xətti tənlik tətbiq olunur.",
        "curriculum_bridge": False,
        "epistemic_tier": "HELPFUL_PREPARATION_WITH_ALTERNATIVE_PATHS",
        "adjudication_verdict": "UNRESOLVED_REQUIRES_SCOPING"
    },
    "GOLD-M02": {
        "source": "İntervallar metodu", "target": "Kvadrat bərabərsizlik",
        "strict_necessity": False,
        "helpful_preparation": True,
        "alternative_path_exists": True,
        "alternative_path_details": "Kvadrat bərabərsizlik parabola qrafikinin yerləşməsi (parabola metodu) ilə də həll edilir; intervallar metodu yeganə yol deyil.",
        "curriculum_bridge": False,
        "epistemic_tier": "HELPFUL_PREPARATION_WITH_ALTERNATIVE_PATHS",
        "adjudication_verdict": "UNRESOLVED_REQUIRES_SCOPING"
    },
    "GOLD-M03": {
        "source": "Triqonometrik eyniliklər", "target": "Triqonometrik tənliklər",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Triqonometrik tənliklərin eynigüclü çevrilməsi əsas eyniliklər (sin^2 + cos^2 = 1 və s.) olmadan riyazi olaraq icra edilə bilməz.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-M04": {
        "source": "Ədədi silsilə", "target": "Həndəsi silsilə",
        "strict_necessity": False,
        "helpful_preparation": True,
        "alternative_path_exists": True,
        "alternative_path_details": "Həndəsi silsilə ardıcıllıq və qüvvət anlayışından birbaşa tərif edilə bilər; ədədi silsilə konseptual analoqdur, riyazi önşərt deyil.",
        "curriculum_bridge": False,
        "epistemic_tier": "HELPFUL_PREPARATION_CONCEPTUAL_ANALOG",
        "adjudication_verdict": "UNRESOLVED_CONCEPTUAL_ANALOG_NOT_PREREQUISITE"
    },
    "GOLD-M05": {
        "source": "Üstlü tənlik", "target": "Loqarifmik tənlik",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Loqarifmin tərifi birbaşa üstlü ifadəyə əsaslanır (a^x = b <=> x = log_a b); üstlü münasibət dərk edilmədən loqarifmik tənlik həll edilə bilməz.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-A01": {
        "source": "Söz birləşməsi", "target": "Sadə cümlə",
        "strict_necessity": False,
        "helpful_preparation": True,
        "alternative_path_exists": True,
        "alternative_path_details": "Sadə cümlə təksözlü cümlələrdən də ibarət ola bilər (məs: 'Gecədir.'); söz birləşməsi bütün sadə cümlələr üçün məcburi deyil.",
        "curriculum_bridge": False,
        "epistemic_tier": "HELPFUL_PREPARATION_WITH_ALTERNATIVE_PATHS",
        "adjudication_verdict": "UNRESOLVED_REQUIRES_SCOPING"
    },
    "GOLD-A02": {
        "source": "Cümlə üzvləri", "target": "Mürəkkəb cümlə",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Mürəkkəb cümlənin müəyyənləşdirilməsi iki və daha çox predikativ mərkəzin (mübtəda-xəbər) ayrılmasını zəruri tələb edir.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-A03": {
        "source": "Vasitəsiz nitq", "target": "Dialoq sintaksisi",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Dialoq vasitəsiz nitqin xüsusi dialoji formasıdır və onun durğu işarələri birbaşa vasitəsiz nitq qaydalarından törəyir.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-P01": {
        "source": "Nyutonun birinci qanunu", "target": "Nyutonun ikinci qanunu",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Nyutonun II qanunu yalnız inersial hesablama sistemlərində doğrudur; bu sistemlərin varlığı isə I qanunla postulatlaşdırılır.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-P02": {
        "source": "Mexaniki iş", "target": "Kinetik enerji",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Kinetik enerjinin fiziki mənası və düsturu (mv^2/2) görülən mexaniki iş inteqralı vasitəsilə dərk edilir.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-P03": {
        "source": "Coulomb qanunu", "target": "Elektrik sahəsinin intensivliyi",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "İntensivlik sınaq yükünə təsir edən Kulon qüvvəsinin yükə nisbətidir (E = F/q); qüvvə qanunu olmadan intensivlik təyin edilə bilməz.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-C01": {
        "source": "Atom quruluşu", "target": "Dövri qanun",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Müasir dövri qanun elementlərin xassələrinin nüvə yükündən və elektron konfiqurasiyasından dövri asılılığıdır.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-C02": {
        "source": "Oksidləşmə dərəcəsi", "target": "Oksidləşmə-reduksiya reaksiyaları",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "ORR elektron keçidi və oksidləşmə dərəcəsinin dəyişməsi ilə gedən reaksiyalardır; bu anlayış olmadan reaksiya təsnif edilə bilməz.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-B01": {
        "source": "Hüceyrə membranı", "target": "Maddələr mübadiləsi (Osmos)",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Bioloji osmos yarımkeçirici hüceyrə membranı vasitəsilə suyun passiv diffuziyasıdır.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-B02": {
        "source": "Mitoz bölünmə", "target": "Meyoz bölünmə",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Meyoz hüceyrə tsiklinin iki ardıcıl bölünməsindən ibarətdir; onun mərhələləri mitozun profaza, metafaza mexanizminə əsaslanır.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-H01": {
        "source": "İlk insan məskənləri", "target": "Qədim dövlət qurumları",
        "strict_necessity": False,
        "helpful_preparation": True,
        "alternative_path_exists": True,
        "alternative_path_details": "Dövlət qurumlarının yaranması sinfi cəmiyyət və xüsusi mülkiyyətin yaranması ilə izah olunur; paleolit məskənləri birbaşa zəruri önşərt deyil, xronoloji zəmindir.",
        "curriculum_bridge": False,
        "epistemic_tier": "CHRONOLOGICAL_FOUNDATION_NOT_PREREQUISITE",
        "adjudication_verdict": "UNRESOLVED_CHRONOLOGICAL_SEQUENCE_NOT_KG_PREREQUISITE"
    },
    "GOLD-H02": {
        "source": "Feodal münasibətləri", "target": "Səfəvilər dövləti idarəçiliyi",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Səfəvi idarəçiliyində hərbi-inzibati sistem feodal torpaq sahibliyi (tiyul, soyurqal) münasibətləri üzərində qurulmuşdur.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-G01": {
        "source": "Yer kürəsinin daxili quruluşu", "target": "Litosfer tavaları",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Litosfer tavalarının astenosfer qatı üzərində hərəkəti yer qabığı və yuxarı mantiyanın daxili qat quruluşu olmadan anlaşıla bilməz.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-G02": {
        "source": "Atmosfer təzyiqi", "target": "Küləklərin yaranması",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Külək havanın təzyiq fərqi nəticəsində üfüqi hərəkətidir; təzyiq fərqi küləyin birbaşa fiziki səbəbidir.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-I01": {
        "source": "İnformasiya vahidləri", "target": "Məlumatın kodlaşdırılması",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "İkilik kodlaşdırma zamanı simvolun informasiya tutumu bit və bayt anlayışları ilə ölçülür.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    },
    "GOLD-I02": {
        "source": "Xətti alqoritm", "target": "Budaqlanan alqoritm",
        "strict_necessity": True,
        "helpful_preparation": True,
        "alternative_path_exists": False,
        "alternative_path_details": "Budaqlanan alqoritmin budaqlarının hər biri xətti əmrlər ardıcıllığıdır; xətti blok anlayışı budaqlanmanın təməl tərkib hissəsidir.",
        "curriculum_bridge": False,
        "epistemic_tier": "STRICT_NECESSITY",
        "adjudication_verdict": "UNRESOLVED_AWAITING_PANEL"
    }
}

for rule in registry["rules"]:
    rid = rule["rule_id"]
    crit = EPISTEMIC_CRITERIA.get(rid, {})

    rule["condition_4_epistemic_necessity_evaluation"] = {
        "is_strict_necessity": crit.get("strict_necessity", False),
        "is_helpful_preparation": crit.get("helpful_preparation", True),
        "alternative_path_exists": crit.get("alternative_path_exists", False),
        "alternative_path_details": crit.get("alternative_path_details"),
        "curriculum_bridge": crit.get("curriculum_bridge", False),
        "epistemic_necessity_tier": crit.get("epistemic_tier", "UNCLASSIFIED"),
        "formal_adjudication_verdict": crit.get("adjudication_verdict", "UNRESOLVED")
    }

output_path = "reports/gold_rules_pedagogical_evidence_registry.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(registry, f, ensure_ascii=False, indent=2)

print(f"Updated {output_path} with comprehensive 4-dimensional epistemic necessity evaluation.")
