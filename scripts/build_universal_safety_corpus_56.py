#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az Universal Adversarial Safety Corpus 56 Builder
Fulfills:
  - Phase 4: 14 Subjects x 4 Adversarial Failure Classes = 56 Universal Safety Corpus
  - Strict Epistemic Safety Invariant: UNKNOWN > WRONG
  - Zero Dangerous ACTIVE Leakage Across All 14 Subjects
"""

import os
import sys
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "ontology", "adversarial_safety_corpus_56.json")

# 14 Subjects definition
# Classes:
#   A: FALSE_PREREQUISITE
#   B: CROSS_STRAND_TRAP
#   C: CROSS_SUBJECT_TRAP
#   D: NO_PROOF_CASE

CORPUS_56 = [
    # -------------------------------------------------------------
    # 1. RIYAZIYYAT (MATHEMATICS)
    # -------------------------------------------------------------
    {
        "test_id": "MATH-A01", "subject": "Riyaziyyat", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "math_inverse_function_algebraic", "canonical_name": "Tərs funksiyanın cəbri üsulla tapılması", "domain": "mathematics", "strand": "2.1_FUNCTIONS", "grade": 11},
        "candidate_prerequisite": {"concept_id": "math_vectors_concept", "canonical_name": "Vektor anlayışı, kollinear və bərabər vektorlar", "domain": "mathematics", "strand": "3.1_GEOMETRY", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_GUARD_VIOLATION",
        "description": "Inverse function must NEVER map to vectors."
    },
    {
        "test_id": "MATH-B01", "subject": "Riyaziyyat", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "math_continuity_at_point", "canonical_name": "Funksiyanın nöqtədə kəsilməzliyi", "domain": "mathematics", "strand": "2.1_FUNCTIONS", "grade": 11},
        "candidate_prerequisite": {"concept_id": "math_coordinate_geometry", "canonical_name": "Koordinatlar üsulu", "domain": "mathematics", "strand": "3.2_ANALYTIC_GEOMETRY", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Calculus continuity must not jump into coordinate geometry."
    },
    {
        "test_id": "MATH-C01", "subject": "Riyaziyyat", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "math_inverse_function", "canonical_name": "Tərs funksiyalar", "domain": "mathematics", "strand": "2.1_FUNCTIONS", "grade": 11},
        "candidate_prerequisite": {"concept_id": "geol_tectonic_fault", "canonical_name": "Tektonik fay və qırılma vilayətləri", "domain": "geography", "strand": "1.1_LITHOSPHERE", "grade": 10},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Lexical 'fay' token must not map to geological fault."
    },
    {
        "test_id": "MATH-D01", "subject": "Riyaziyyat", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "math_function_transformation", "canonical_name": "Qrafiklərin çevrilməsi", "domain": "mathematics", "strand": "2.1_FUNCTIONS", "grade": 10},
        "candidate_prerequisite": {"concept_id": "math_base_graph_concept", "canonical_name": "Baza funksiyasının qrafiki", "domain": "mathematics", "strand": "2.1_FUNCTIONS", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Plausible background graph without formal dependency evidence must stay safe."
    },

    # -------------------------------------------------------------
    # 2. FIZIKA (PHYSICS)
    # -------------------------------------------------------------
    {
        "test_id": "PHYS-A01", "subject": "Fizika", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "phys_newton_second_law_calc", "canonical_name": "Nyutonun ikinci qanununun tətbiqi", "domain": "physics", "strand": "1.1_MECHANICS", "grade": 8},
        "candidate_prerequisite": {"concept_id": "phys_velocity_change_rate", "canonical_name": "Sürət dəyişməsi və bərabərsürətli hərəkət", "domain": "physics", "strand": "1.1_MECHANICS", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Broad acceleration definition is not automatic remediation for F=ma proportional problem."
    },
    {
        "test_id": "PHYS-B01", "subject": "Fizika", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "phys_electric_circuit_calc", "canonical_name": "Sadə elektrik dövrəsinin hesablanması", "domain": "physics", "strand": "2.1_ELECTRODYNAMICS", "grade": 8},
        "candidate_prerequisite": {"concept_id": "phys_mechanics_motion", "canonical_name": "Düzxətli mexaniki hərəkət", "domain": "physics", "strand": "1.1_MECHANICS", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Electrodynamics circuit must not cross into mechanics motion."
    },
    {
        "test_id": "PHYS-C01", "subject": "Fizika", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "phys_force_calculation", "canonical_name": "Qüvvə anlayışı və hesablanması", "domain": "physics", "strand": "1.1_MECHANICS", "grade": 7},
        "candidate_prerequisite": {"concept_id": "hist_social_force", "canonical_name": "İctimai hərəkat və ictimai qüvvələr", "domain": "az_history", "strand": "2.1_SOCIO_POLITICAL", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Physical force token must never map to historical social forces."
    },
    {
        "test_id": "PHYS-D01", "subject": "Fizika", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "phys_wave_interference", "canonical_name": "Dalğaların interferensiyası", "domain": "physics", "strand": "3.1_OPTICS_WAVES", "grade": 11},
        "candidate_prerequisite": {"concept_id": "phys_wave_reflection", "canonical_name": "Dalğaların qayıtması", "domain": "physics", "strand": "3.1_OPTICS_WAVES", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Contextually related wave behavior without operational proof stays unmapped."
    },

    # -------------------------------------------------------------
    # 3. KIMYA (CHEMISTRY)
    # -------------------------------------------------------------
    {
        "test_id": "CHEM-A01", "subject": "Kimya", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "chem_redox_reactions", "canonical_name": "Oksidləşmə-reduksiya reaksiyalarının tərtibi", "domain": "chemistry", "strand": "1.2_REACTIONS", "grade": 9},
        "candidate_prerequisite": {"concept_id": "chem_reaction_rate_catalysts", "canonical_name": "Kimyəvi reaksiyanın sürəti və katalizatorlar haqqında ümumi anlayış", "domain": "chemistry", "strand": "1.2_REACTIONS", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "General reaction kinetics without electron balance operational proof remains unvalidated."
    },
    {
        "test_id": "CHEM-B01", "subject": "Kimya", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "chem_organic_alcohols", "canonical_name": "Doymuş biratomlu spirtlərin kimyəvi xassələri", "domain": "chemistry", "strand": "2.1_ORGANIC", "grade": 10},
        "candidate_prerequisite": {"concept_id": "chem_inorganic_metals", "canonical_name": "Qələvi metalların ümumi xassələri", "domain": "chemistry", "strand": "1.3_INORGANIC", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Organic chemistry must not jump across into inorganic metallurgy strand without bridge."
    },
    {
        "test_id": "CHEM-C01", "subject": "Kimya", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "chem_chemical_bond_types", "canonical_name": "Kovalent və ion rabitəsi", "domain": "chemistry", "strand": "1.1_MATTER", "grade": 8},
        "candidate_prerequisite": {"concept_id": "hist_international_ties", "canonical_name": "Beynəlxalq diplomatik rabitələr və ittifaqlar", "domain": "az_history", "strand": "2.1_MODERN_PERIOD", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Chemical bond token 'rabitə' must never cross to historical alliances."
    },
    {
        "test_id": "CHEM-D01", "subject": "Kimya", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "chem_electrolytic_dissociation", "canonical_name": "Elektrolitik dissosiasiya dərəcəsi", "domain": "chemistry", "strand": "1.2_REACTIONS", "grade": 9},
        "candidate_prerequisite": {"concept_id": "chem_reactions_classification_general", "canonical_name": "Kimyəvi reaksiyaların istilik effekti və təsnifatı", "domain": "chemistry", "strand": "1.2_REACTIONS", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "General thermal reaction classification without dissociation ion evidence stays unvalidated."
    },

    # -------------------------------------------------------------
    # 4. BIOLOGIYA (BIOLOGY)
    # -------------------------------------------------------------
    {
        "test_id": "BIO-A01", "subject": "Biologiya", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "bio_mammal_classification", "canonical_name": "Məməlilər sinfinin ümumi xarakteristikası", "domain": "biology", "strand": "2.1_ZOOLOGY_TAXONOMY", "grade": 7},
        "candidate_prerequisite": {"concept_id": "bio_bird_classification", "canonical_name": "Quşlar sinfinin xüsusiyyətləri", "domain": "biology", "strand": "2.1_ZOOLOGY_TAXONOMY", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "TAXONOMIC_ASSOCIATIVE", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "TAXONOMIC_NOT_PREREQUISITE",
        "description": "Taxonomic sibling similarity must never generate PREREQUISITE_OF."
    },
    {
        "test_id": "BIO-B01", "subject": "Biologiya", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "bio_protein_synthesis_translation", "canonical_name": "Zülal biosintezi və translyasiya", "domain": "biology", "strand": "1.1_CELL_MOLECULAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "bio_animal_taxonomy", "canonical_name": "Heyvanların təsnifatı", "domain": "biology", "strand": "2.1_ZOOLOGY_TAXONOMY", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Molecular protein synthesis must not jump into zoological taxonomy."
    },
    {
        "test_id": "BIO-C01", "subject": "Biologiya", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "bio_dna_structure", "canonical_name": "DNT molekulunun quruluşu və komplementarlıq", "domain": "biology", "strand": "1.1_CELL_MOLECULAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "info_computer_data_structure", "canonical_name": "Verilənlər strukturu və kodlaşdırma", "domain": "informatics", "strand": "2.1_ALGORITHMS_DATA", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Genetic code analogy must never cross into computer data structures."
    },
    {
        "test_id": "BIO-D01", "subject": "Biologiya", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "bio_protein_synthesis_translation", "canonical_name": "Zülal biosintezinin mərhələləri", "domain": "biology", "strand": "1.1_CELL_MOLECULAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "bio_nucleic_acid_broad_structure", "canonical_name": "Nuklein turşuları haqqında ümumi anlayış", "domain": "biology", "strand": "1.1_CELL_MOLECULAR", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Broad chapter title must not serve as atomic dependency root."
    },

    # -------------------------------------------------------------
    # 5. COĞRAFİYA (GEOGRAPHY)
    # -------------------------------------------------------------
    {
        "test_id": "GEO-A01", "subject": "Coğrafiya", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "geo_relief_forms", "canonical_name": "Morfostrukturlar və relyef formaları", "domain": "geography", "strand": "1.1_LITHOSPHERE", "grade": 8},
        "candidate_prerequisite": {"concept_id": "geo_ocean_currents", "canonical_name": "Dünya okeanında cərəyanlar", "domain": "geography", "strand": "1.2_HYDROSPHERE", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Lithospheric landform analysis does not operationally depend on ocean currents."
    },
    {
        "test_id": "GEO-B01", "subject": "Coğrafiya", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "geo_population_demography", "canonical_name": "Əhali coğrafiyası və demoqrafik proseslər", "domain": "geography", "strand": "2.1_HUMAN_GEOGRAPHY", "grade": 9},
        "candidate_prerequisite": {"concept_id": "geo_tectonic_plates", "canonical_name": "Litosfer tavaları və seysmik zonalar", "domain": "geography", "strand": "1.1_LITHOSPHERE", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Human demography must not jump into lithospheric tectonics."
    },
    {
        "test_id": "GEO-C01", "subject": "Coğrafiya", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "geo_geographic_coordinates", "canonical_name": "Coğrafi enlik və uzunluq koordinatları", "domain": "geography", "strand": "1.0_CARTOGRAPHY", "grade": 6},
        "candidate_prerequisite": {"concept_id": "math_analytic_geometry_coordinates", "canonical_name": "Müstəvidə Dekart koordinat sistemi", "domain": "mathematics", "strand": "3.2_ANALYTIC_GEOMETRY", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Geographical coordinates must not cross-bleed into advanced Cartesian geometry."
    },
    {
        "test_id": "GEO-D01", "subject": "Coğrafiya", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "geo_climate_zones", "canonical_name": "Yerin iqlim qurşaqları və xüsusiyyətləri", "domain": "geography", "strand": "1.3_ATMOSPHERE", "grade": 8},
        "candidate_prerequisite": {"concept_id": "geo_winds_general", "canonical_name": "Atmosferdə küləklər haqqında ümumi məlumat", "domain": "geography", "strand": "1.3_ATMOSPHERE", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "General wind lesson is not validated atomic prerequisite for global climate belts."
    },

    # -------------------------------------------------------------
    # 6. AZƏRBAYCAN TARİXİ (AZERBAIJANI HISTORY)
    # -------------------------------------------------------------
    {
        "test_id": "HIST-A01", "subject": "Azərbaycan tarixi", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "hist_adr_independence_declaration", "canonical_name": "Azərbaycan Xalq Cümhuriyyətinin yaranması və İstiqlal Bəyannaməsi", "domain": "az_history", "strand": "2.1_MODERN_PERIOD", "grade": 9},
        "candidate_prerequisite": {"concept_id": "hist_world_war_I", "canonical_name": "Birinci Dünya müharibəsi və Qafqaz cəbhəsi", "domain": "az_history", "strand": "2.1_MODERN_PERIOD", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "CONTEXTUAL_NOT_PREREQUISITE",
        "description": "Historical causality is contextual, NOT pedagogical PREREQUISITE_OF."
    },
    {
        "test_id": "HIST-B01", "subject": "Azərbaycan tarixi", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "hist_adr_government_reforms", "canonical_name": "Azərbaycan Xalq Cümhuriyyətinin daxili siyasəti və islahatları", "domain": "az_history", "strand": "2.1_MODERN_PERIOD", "grade": 9},
        "candidate_prerequisite": {"concept_id": "hist_ancient_azerbaijan_archaeology", "canonical_name": "İbtidai icma quruluşu və Qobustan abidələri", "domain": "az_history", "strand": "1.1_ANCIENT_PERIOD", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Modern 20th century history must not jump into prehistoric archaeology."
    },
    {
        "test_id": "HIST-C01", "subject": "Azərbaycan tarixi", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "hist_treaty_gulistan", "canonical_name": "Gülüstan müqaviləsi və Azərbaycan torpaqlarının bölünməsi", "domain": "az_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_prerequisite": {"concept_id": "chem_chemical_bond", "canonical_name": "Kovalent və ion rabitəsi", "domain": "chemistry", "strand": "1.1_ATOMIC_STRUCTURE", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Historical 'rabitə/bağ' must never cross into chemistry bonds."
    },
    {
        "test_id": "HIST-D01", "subject": "Azərbaycan tarixi", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "hist_treaty_turkmenchay_fact", "canonical_name": "Türkmənçay müqaviləsinin maddələri və tarixi faktlar", "domain": "az_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_prerequisite": {"concept_id": "hist_treaty_gulistan_precedence", "canonical_name": "Gülüstan müqaviləsi", "domain": "az_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Chronological precedence in history does not automatically prove learning prerequisite."
    },

    # -------------------------------------------------------------
    # 7. ÜMUMİ TARİX (WORLD HISTORY)
    # -------------------------------------------------------------
    {
        "test_id": "WHIST-A01", "subject": "Ümumi tarix", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "whist_french_revolution", "canonical_name": "Böyük Fransa İnqilabı və onun nəticələri", "domain": "world_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_prerequisite": {"concept_id": "whist_enlightenment_philosophy", "canonical_name": "Maarifçilik hərəkatı və fəlsəfəsi", "domain": "world_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "CONTEXTUAL_NOT_PREREQUISITE",
        "description": "Enlightenment is intellectual context, NOT an operational prerequisite."
    },
    {
        "test_id": "WHIST-B01", "subject": "Ümumi tarix", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "whist_cold_war_bipolar", "canonical_name": "İkinci Dünya müharibəsindən sonra Soyuq müharibə", "domain": "world_history", "strand": "2.1_CONTEMPORARY_PERIOD", "grade": 11},
        "candidate_prerequisite": {"concept_id": "whist_ancient_rome_republic", "canonical_name": "Qədim Roma respublikası və senat", "domain": "world_history", "strand": "1.1_ANCIENT_PERIOD", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Cold War contemporary period must not cross into Ancient Rome."
    },
    {
        "test_id": "WHIST-C01", "subject": "Ümumi tarix", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "whist_industrial_revolution_steam", "canonical_name": "Sənaye çevrilişi və buxar maşınının kəşfi", "domain": "world_history", "strand": "1.3_NEW_PERIOD", "grade": 8},
        "candidate_prerequisite": {"concept_id": "phys_thermodynamics_heat_engines", "canonical_name": "İstilik mühərrikləri və Faydalı İş Əmsalı", "domain": "physics", "strand": "1.2_THERMODYNAMICS", "grade": 10},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Historical invention analysis must not cross into formal Physics thermodynamics."
    },
    {
        "test_id": "WHIST-D01", "subject": "Ümumi tarix", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "whist_treaty_versailles", "canonical_name": "Versal-Vaşinqton sistemi və sülh müqaviləsi", "domain": "world_history", "strand": "2.1_CONTEMPORARY_PERIOD", "grade": 10},
        "candidate_prerequisite": {"concept_id": "whist_palace_architecture", "canonical_name": "Versal sarayı və dövrün memarlığı", "domain": "world_history", "strand": "2.1_CONTEMPORARY_PERIOD", "grade": 10},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Palace architecture is unproven prerequisite for diplomatic peace conference."
    },

    # -------------------------------------------------------------
    # 8. AZƏRBAYCAN DİLİ (AZERBAIJANI LANGUAGE)
    # -------------------------------------------------------------
    {
        "test_id": "AZL-A01", "subject": "Azərbaycan dili", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "lang_predicate_identification", "canonical_name": "Cümlənin baş üzvü: Xəbərin müəyyən edilməsi", "domain": "az_language", "strand": "4.0_DIL_QAYDALARI", "grade": 8},
        "candidate_prerequisite": {"concept_id": "lang_parts_of_speech_broad", "canonical_name": "Əsas nitq hissələri haqqında ümumi məlumat", "domain": "az_language", "strand": "4.0_DIL_QAYDALARI", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Broad morphology chapter must not become blanket prerequisite for syntactic predicate."
    },
    {
        "test_id": "AZL-B01", "subject": "Azərbaycan dili", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "lang_syntactic_sentence_analysis", "canonical_name": "Cümlənin sintaktik təhlili", "domain": "az_language", "strand": "4.0_DIL_QAYDALARI", "grade": 8},
        "candidate_prerequisite": {"concept_id": "lang_oral_speech_communication", "canonical_name": "Şifahi nitq və ünsiyyət mədəniyyəti", "domain": "az_language", "strand": "1.0_DANISIQ_NITQ", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Syntactic analysis must not jump into oral speech communication."
    },
    {
        "test_id": "AZL-C01", "subject": "Azərbaycan dili", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "lang_syntactic_predicate", "canonical_name": "Cümlənin xəbəri", "domain": "az_language", "strand": "4.0_DIL_QAYDALARI", "grade": 8},
        "candidate_prerequisite": {"concept_id": "info_boolean_predicate", "canonical_name": "Məntiqi predikat və şərt operatorları", "domain": "informatics", "strand": "2.1_ALGORITHMS", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Linguistic predicate must never cross with informatics boolean predicate."
    },
    {
        "test_id": "AZL-D01", "subject": "Azərbaycan dili", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "lang_reading_character_comprehension", "canonical_name": "Mətndə bədii obrazın xarakterinin təhlili", "domain": "az_language", "strand": "2.0_OXU", "grade": 10},
        "candidate_prerequisite": {"concept_id": "lang_reading_main_idea_broad", "canonical_name": "Mətnin əsas ideyasının müəyyən edilməsi", "domain": "az_language", "strand": "2.0_OXU", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Broad reading comprehension skill without atomic dependency evidence stays unmapped."
    },

    # -------------------------------------------------------------
    # 9. ƏDƏBİYYAT (LITERATURE)
    # -------------------------------------------------------------
    {
        "test_id": "LIT-A01", "subject": "Ədəbiyyat", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "lit_nizami_khamsa_ideas", "canonical_name": "Nizami Gəncəvinin 'Xəmsə'sində ədalətli hökmdar ideyası", "domain": "literature", "strand": "1.1_CLASSICAL_LIT", "grade": 8},
        "candidate_prerequisite": {"concept_id": "hist_shirvanshahs_state", "canonical_name": "Şirvanşahlar dövlətinin intibah dövrü", "domain": "literature", "strand": "1.1_CLASSICAL_LIT", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "CONTEXTUAL_NOT_PREREQUISITE",
        "description": "Historical epoch of Shirvanshahs is context, NOT literary prerequisite."
    },
    {
        "test_id": "LIT-B01", "subject": "Ədəbiyyat", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "lit_literary_devices_metaphor", "canonical_name": "Bədii təsvir vasitələri: Metafora və təşbeh", "domain": "literature", "strand": "2.1_THEORY_OF_LIT", "grade": 7},
        "candidate_prerequisite": {"concept_id": "lit_folk_epics_dada_gorgud", "canonical_name": "'Kitabi-Dədə Qorqud' dastanının boyları", "domain": "literature", "strand": "1.2_ORAL_FOLK_LIT", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Literary theory strand must not cross into oral folklore narratives."
    },
    {
        "test_id": "LIT-C01", "subject": "Ədəbiyyat", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "lit_poetic_meter_aruz", "canonical_name": "Klassik poeziyada Əruz vəzni və bəhrləri", "domain": "literature", "strand": "2.1_THEORY_OF_LIT", "grade": 9},
        "candidate_prerequisite": {"concept_id": "mus_musical_meter_rhythm", "canonical_name": "Musiqidə takt, ölçü və ritm", "domain": "music", "strand": "1.1_MUSIC_THEORY", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Poetic meter must not leak into music theory."
    },
    {
        "test_id": "LIT-D01", "subject": "Ədəbiyyat", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "lit_fuzuli_leylic_character", "canonical_name": "M.Füzulinin 'Leyli və Məcnun' poemasında Məcnun obrazı", "domain": "literature", "strand": "1.1_CLASSICAL_LIT", "grade": 10},
        "candidate_prerequisite": {"concept_id": "lit_romantic_love_poems", "canonical_name": "Yaxın Şərq ədəbiyyatında məhəbbət dastanları", "domain": "literature", "strand": "1.1_CLASSICAL_LIT", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "General romantic genre survey is unproven prerequisite for Fuzuli's philosophical character."
    },

    # -------------------------------------------------------------
    # 10. İNFORMATİKA (INFORMATICS)
    # -------------------------------------------------------------
    {
        "test_id": "INFO-A01", "subject": "İnformatika", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "info_cyclic_algorithm_loops", "canonical_name": "Alqoritmin dövri strukturu və sayğaclı dövrlər", "domain": "informatics", "strand": "2.1_ALGORITHMS", "grade": 7},
        "candidate_prerequisite": {"concept_id": "info_hardware_components", "canonical_name": "Kompüterin periferiya qurğuları", "domain": "informatics", "strand": "1.1_HARDWARE", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Algorithmic logic does not operationally require peripheral hardware devices."
    },
    {
        "test_id": "INFO-B01", "subject": "İnformatika", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "info_python_array_lists", "canonical_name": "Python proqramlaşdırma dilində siyahılar və massivlər", "domain": "informatics", "strand": "2.2_PROGRAMMING", "grade": 8},
        "candidate_prerequisite": {"concept_id": "info_raster_graphics_paint", "canonical_name": "Qrafik redaktorda rəsm çəkmə alətləri", "domain": "informatics", "strand": "3.1_MULTIMEDIA", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Python data structures must not cross into primary school raster paint."
    },
    {
        "test_id": "INFO-C01", "subject": "İnformatika", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "info_relational_database_table", "canonical_name": "Relyasiya verilənlər bazası və cədvəllər", "domain": "informatics", "strand": "2.1_ALGORITHMS", "grade": 9},
        "candidate_prerequisite": {"concept_id": "math_multiplication_table", "canonical_name": "Riyazi vurma cədvəli", "domain": "mathematics", "strand": "1.1_NUMBERS_OPERATIONS", "grade": 3},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Database table token must never cross into arithmetic multiplication table."
    },
    {
        "test_id": "INFO-D01", "subject": "İnformatika", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "info_network_ip_addressing", "canonical_name": "Kompüter şəbəkələrində IP ünvanlaşdırma", "domain": "informatics", "strand": "4.1_NETWORKS", "grade": 9},
        "candidate_prerequisite": {"concept_id": "info_internet_history_general", "canonical_name": "İnternetin yaranma tarixi və xidmətləri", "domain": "informatics", "strand": "4.1_NETWORKS", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Internet history survey is not atomic dependency for subnet masking IP calculation."
    },

    # -------------------------------------------------------------
    # 11. İNGİLİS DİLİ (ENGLISH LANGUAGE - FOREIGN LANGUAGE 1)
    # -------------------------------------------------------------
    {
        "test_id": "ENG-A01", "subject": "İngilis dili", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "eng_present_perfect_usage", "canonical_name": "Present Perfect Tense Form and Usage", "domain": "english_language", "strand": "4.0_GRAMMAR", "grade": 8},
        "candidate_prerequisite": {"concept_id": "eng_alphabet_phonics", "canonical_name": "English Alphabet and Phonics", "domain": "english_language", "strand": "4.0_GRAMMAR", "grade": 2},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Primary alphabet cannot serve as direct atomic remediation root for perfect tense aspect."
    },
    {
        "test_id": "ENG-B01", "subject": "İngilis dili", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "eng_relative_clauses", "canonical_name": "Defining and Non-defining Relative Clauses", "domain": "english_language", "strand": "4.0_GRAMMAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "eng_daily_routine_speaking", "canonical_name": "Talking about daily routine and hobbies", "domain": "english_language", "strand": "1.0_SPEAKING", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Grammar syntax must not cross into elementary speaking routines."
    },
    {
        "test_id": "ENG-C01", "subject": "İngilis dili", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "eng_sentence_clause_structure", "canonical_name": "Complex Sentence Clauses (Adverbial Clauses)", "domain": "english_language", "strand": "4.0_GRAMMAR", "grade": 10},
        "candidate_prerequisite": {"concept_id": "law_constitutional_clause", "canonical_name": "Konstitusiya hüququnda qanunvericilik bəndləri", "domain": "law_civics", "strand": "1.0_CONSTITUTION", "grade": 9},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "English grammar 'Clause' must never collide with legal constitutional clauses."
    },
    {
        "test_id": "ENG-D01", "subject": "İngilis dili", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "eng_reading_scanning_skill", "canonical_name": "Reading for specific information (Scanning)", "domain": "english_language", "strand": "2.0_READING", "grade": 8},
        "candidate_prerequisite": {"concept_id": "eng_travel_general_story", "canonical_name": "A trip to London reading passage", "domain": "english_language", "strand": "2.0_READING", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "A specific contextual reading story is unproven prerequisite for cognitive scanning skill."
    },

    # -------------------------------------------------------------
    # 12. İKİNCİ XARİCİ DİL (RUS / ALMAN DİLİ - FOREIGN LANGUAGE 2)
    # -------------------------------------------------------------
    {
        "test_id": "FL2-A01", "subject": "İkinci xarici dil", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "rus_noun_case_declination", "canonical_name": "Склонение существительных по падежам", "domain": "second_foreign_lang", "strand": "4.0_GRAMMAR", "grade": 7},
        "candidate_prerequisite": {"concept_id": "rus_proverbs_sayings", "canonical_name": "Русские пословицы и поговорки", "domain": "second_foreign_lang", "strand": "2.0_READING", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Grammatical case system does not operationally depend on folklore proverbs."
    },
    {
        "test_id": "FL2-B01", "subject": "İkinci xarici dil", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "ger_subordinate_clause_syntax", "canonical_name": "Nebensätze mit 'weil' und 'dass' (Wortstellung)", "domain": "second_foreign_lang", "strand": "4.0_GRAMMAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "ger_greeting_dialogues", "canonical_name": "Begrüßung und Kennenlernen", "domain": "second_foreign_lang", "strand": "1.0_SPEAKING", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Advanced subordinating word order must not cross into greeting speech."
    },
    {
        "test_id": "FL2-C01", "subject": "İkinci xarici dil", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "ger_conjunctions_konnektoren", "canonical_name": "Konnektoren im Satzgefüge", "domain": "second_foreign_lang", "strand": "4.0_GRAMMAR", "grade": 9},
        "candidate_prerequisite": {"concept_id": "tech_electrical_connector", "canonical_name": "Elektrotexnikada konnektor və ştepsel birləşmələri", "domain": "technology", "strand": "2.1_ELECTROTECH", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "German linguistic 'Konnektor' must never cross to technology hardware connector."
    },
    {
        "test_id": "FL2-D01", "subject": "İkinci xarici dil", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "fl2_listening_dialogue_comprehension", "canonical_name": "Audiodialoqların dinlənilib başa düşülməsi", "domain": "second_foreign_lang", "strand": "1.1_LISTENING", "grade": 8},
        "candidate_prerequisite": {"concept_id": "fl2_cultural_carnival_customs", "canonical_name": "Xarici ölkələrdə bayram və karnaval ənənələri", "domain": "second_foreign_lang", "strand": "1.1_LISTENING", "grade": 7},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "General cultural festivity topic is unproven prerequisite for audio listening comprehension."
    },

    # -------------------------------------------------------------
    # 13. TƏBİƏT / HƏYAT BİLGİSİ (NATURE / SCIENCE / LIFE KNOWLEDGE)
    # -------------------------------------------------------------
    {
        "test_id": "NAT-A01", "subject": "Təbiət", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "nat_photosynthesis_basics", "canonical_name": "Bitkilərdə fotosintez və qidalanma prosesi", "domain": "natural_sciences", "strand": "1.1_LIVING_NATURE", "grade": 6},
        "candidate_prerequisite": {"concept_id": "nat_autumn_leaves_falling", "canonical_name": "Fəsillərin dəyişməsi və payızda yarpaq tökümü", "domain": "natural_sciences", "strand": "1.1_LIVING_NATURE", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "CONTEXTUAL_CHRONOLOGICAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "CONTEXTUAL_NOT_PREREQUISITE",
        "description": "Seasonal leaf loss is contextual phenology, NOT biological photosynthesis prerequisite."
    },
    {
        "test_id": "NAT-B01", "subject": "Təbiət", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "nat_earth_gravity_force", "canonical_name": "Yerin cazibə qüvvəsi və cisimlərin düşməsi", "domain": "natural_sciences", "strand": "2.1_PHYSICAL_PHENOMENA", "grade": 5},
        "candidate_prerequisite": {"concept_id": "nat_traffic_safety_rules", "canonical_name": "Piyada və yol hərəkəti təhlükəsizliyi qaydaları", "domain": "natural_sciences", "strand": "3.1_SAFETY_HEALTH", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Physical gravity must not cross into traffic safety rules strand."
    },
    {
        "test_id": "NAT-C01", "subject": "Təbiət", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "nat_water_cycle_nature", "canonical_name": "Təbiətdə suyun böyük və kiçik dövranı", "domain": "natural_sciences", "strand": "1.2_EARTH_ENVIRONMENT", "grade": 5},
        "candidate_prerequisite": {"concept_id": "econ_money_circulation", "canonical_name": "İqtisadiyyatda pulun dövranı və banklar", "domain": "economics_civics", "strand": "1.1_ECONOMY", "grade": 8},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Natural water cycle token 'dövran' must never cross to monetary economic circulation."
    },
    {
        "test_id": "NAT-D01", "subject": "Təbiət", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "nat_solar_system_planets", "canonical_name": "Günəş sisteminin planetləri və onların hərəkəti", "domain": "natural_sciences", "strand": "2.2_ASTRONOMY", "grade": 6},
        "candidate_prerequisite": {"concept_id": "nat_universe_myths", "canonical_name": "Qədim xalqların kainat haqqında təsəvvürləri", "domain": "natural_sciences", "strand": "2.2_ASTRONOMY", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Mythological worldviews are unproven prerequisites for heliocentric planetary mechanics."
    },

    # -------------------------------------------------------------
    # 14. TEXNOLOGİYA (TECHNOLOGY)
    # -------------------------------------------------------------
    {
        "test_id": "TECH-A01", "subject": "Texnologiya", "class": "FALSE_PREREQUISITE",
        "assessment_concept": {"concept_id": "tech_electrical_wiring_circuits", "canonical_name": "Məişət elektrik cihazlarının sadə dövrə sxemləri", "domain": "technology", "strand": "2.1_ELECTROTECH", "grade": 8},
        "candidate_prerequisite": {"concept_id": "tech_kitchen_hygiene", "canonical_name": "Mətbəxdə ərzaqların saxlanması və gigiyena", "domain": "technology", "strand": "3.1_CULINARY", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Electrotechnical circuit skills do not depend on culinary food storage."
    },
    {
        "test_id": "TECH-B01", "subject": "Texnologiya", "class": "CROSS_STRAND_TRAP",
        "assessment_concept": {"concept_id": "tech_metal_lathe_machining", "canonical_name": "Metalı emal edən torna dəzgahının quruluşu", "domain": "technology", "strand": "1.2_METAL_PROCESSING", "grade": 8},
        "candidate_prerequisite": {"concept_id": "tech_textile_sewing_patterns", "canonical_name": "Parçanın biçilməsi və tikiş növləri", "domain": "technology", "strand": "1.3_TEXTILE", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "STRAND_MISMATCH",
        "description": "Heavy metal lathe machining must not cross into textile sewing patterns."
    },
    {
        "test_id": "TECH-C01", "subject": "Texnologiya", "class": "CROSS_SUBJECT_TRAP",
        "assessment_concept": {"concept_id": "tech_wood_joint_techniques", "canonical_name": "Ağac materiallarının xarrat birləşmələri", "domain": "technology", "strand": "1.1_WOOD_PROCESSING", "grade": 7},
        "candidate_prerequisite": {"concept_id": "bio_plant_tissue_structure", "canonical_name": "Bitkilərdə ötürücü və mexaniki toxumalar", "domain": "biology", "strand": "1.1_CELL_MOLECULAR", "grade": 6},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "REJECTED", "expected_reason": "DOMAIN_GUARD_VIOLATION",
        "description": "Woodworking joint token 'toxuma/lif' must never cross to biological plant tissues."
    },
    {
        "test_id": "TECH-D01", "subject": "Texnologiya", "class": "NO_PROOF_CASE",
        "assessment_concept": {"concept_id": "tech_technical_drawing_views", "canonical_name": "Texniki rəsmdə görünüşlər və kəsiklər", "domain": "technology", "strand": "4.1_GRAPHICS_DRAWING", "grade": 8},
        "candidate_prerequisite": {"concept_id": "tech_history_of_tools", "canonical_name": "İbtidai əmək alətlərinin inkişaf tarixi", "domain": "technology", "strand": "4.1_GRAPHICS_DRAWING", "grade": 5},
        "candidate_relation": "PREREQUISITE_OF", "dependency_archetype": "OPERATIONAL", "proof_class": "NONE", "evidence": [],
        "expected_status": "NO_VALIDATED_PREREQUISITE", "expected_reason": "INSUFFICIENT_DEPENDENCY_EVIDENCE",
        "description": "Historical evolution of stone tools is unproven prerequisite for orthographic technical projection."
    }
]

def main():
    print(f"Building 56 Universal Adversarial Safety Corpus across 14 subjects...")
    print(f"Total items defined: {len(CORPUS_56)}")

    # Verify counts: exactly 14 subjects x 4 failure classes
    subjects = set(x["subject"] for x in CORPUS_56)
    classes = set(x["class"] for x in CORPUS_56)

    print(f"Distinct Subjects: {len(subjects)} -> {sorted(list(subjects))}")
    print(f"Distinct Classes:  {len(classes)} -> {sorted(list(classes))}")

    if len(CORPUS_56) != 56:
        raise ValueError(f"Expected 56 items, got {len(CORPUS_56)}")
    if len(subjects) != 14:
        raise ValueError(f"Expected 14 subjects, got {len(subjects)}")
    if len(classes) != 4:
        raise ValueError(f"Expected 4 classes, got {len(classes)}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(CORPUS_56, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated 56 Universal Safety Corpus at: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
