# 🎯 Gold Standard: Universal Test Generation Protocol

> **Version:** 2.1 (Advanced Psychometric & PISA-Ready)
> **Scope:** Grades 1-11 (Universal)
> **Goal:** 100% pedagogical rigor, 0% hallucination, and psychometric precision.

---

## 🏗️ 1. The "GOLD CORE" (Global Constraints)
*Applied to EVERY prompt generation regardless of subject.*

### ❗ Fundamental Rules
1. **Source Isolation**: Use ONLY the provided context. Do NOT use external knowledge.
2. **Pedagogical Integrity**:
   - **No Negative Stems**: Forbidden: "Hansı DEYİL?", "Yanlışdır?", "Doğru olmayan".
   - **Single Best Answer**: Exactly one unambiguously correct option.
   - **Zero Subjectivity**: Avoid "səncə", "ən parlaq", "ən vacib".
3. **Format**: Strictly JSON.
4. **Self-Correction & Reliability**:
   - **Model must solve the question it created before final output.**
   - **CRITICAL**: If the model's own solution contradicts the assigned `correct_index`, the process must be REGENERATED.

### 🚫 Prohibited Patterns
- Multiple correct answers.
- "All of the above" / "None of the above" options.
- Direct copy-pasting from text (Paraphrase required).

---

## 🧠 2. Bloom-Lock & Operational Definitions
| Level | Operational Action (Məcburi) | Forbidden (Qadağan) |
| :--- | :--- | :--- |
| **Xatırlama** | Fakt, tarix, termin, ad | Şərh vermək |
| **Anlama** | Müqayisə etmək, izah etmək, parafraza | Sadə termin sorğusu |
| **Tətbiq** | Yeni situasiyada istifadə, hesablama | Mövcud nümunəni təkrarlama |
| **Təhlil** | Səbəb-nəticə, struktur bölmə, fərqləndirmə | Şərhsiz fakt |

---

## 📊 3. Psychometric Distractor Standards
| Type | Definition (Azerbaijani) | Diagnostic Insight |
| :--- | :--- | :--- |
| **conceptual_error** | Konseptual səhv | Misunderstanding the core concept |
| **partial_truth** | Qismən doğru (şərtə uyğun deyil) | Incomplete knowledge/reading |
| **typical_mistake** | Tipik şagird səhvi | Common cognitive bias at this grade |
| **term_confusion** | Termin qarışıqlığı | Weak vocabulary boundary |

---

## 📂 4. Subject-Specific Protocols

### 🟢 Azərbaycan Dili və Ədəbiyyat
- **Operational Definition**: Focus on internal text logic and cause-effect.
- **Rules**: Linguistic terms must be precise. No literary subjectivity.
- **Distractors**: Symbolic analysis errors or term confusion.

### 🔵 Riyaziyyat / Fizika
- **Rules**: Step-by-step internal calculation is mandatory.
- **Validation**: Final internal check must match result.
- **Distractors**: Calculation errors, formula misuse, or condition misreading.

### 🟡 Xarici Dil
- **Grade-Lock**: Vocabulary restricted strictly to current grade's textbook.
- **Rules**: Fair grammatical traps aligned with curriculum benchmarks.
- **Distractors**: Tense confusion, word form errors.

### 🟠 Sosial Fənlər (Tarix / Coğrafiya)
- **Rules**: Absolute source isolation. Cause-effect analysis preferred.
- **Distractors**: Anachronisms (wrong period), region mismatch, or partially correct explanations.

---

## ⚙️ 5. Technical JSON Spec (Version 2.1)

```json
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0,
  "bloom_level": "Anlama",
  "difficulty": "Orta",
  "measured_skill": "fractions.denominator_logic",
  "operational_description": "...",
  "explanation": {
    "correct": "...",
    "distractors": {
      "A": "...", "B": "...", "C": "..."
    }
  },
  "distractor_diagnostics": {
    "A": "conceptual_error",
    "B": "typical_mistake",
    "C": "term_confusion"
  },
  "solution_steps": ["step1", "step2"],
  "estimated_time_sec": 60,
  "cognitive_load": "medium",
  "irt_proxy": {
    "difficulty_estimate": 0.65,
    "discrimination_estimate": 0.42
  }
}
```

---
**Document Status:** ✅ PROMPT SPEC (Backend Specification Ready)
