"""
LoRA Dataset Builder - Dərslik məlumatlarından training dataset hazırlayır
"""
import json
import os
from typing import List, Dict
from pathlib import Path
from rag_system import RAGSystem

class LoRADatasetBuilder:
    def __init__(self, rag_system: RAGSystem):
        self.rag = rag_system
        self.output_dir = Path("training_data")
        self.output_dir.mkdir(exist_ok=True)
        
    def create_question_samples(self, topics: List[Dict]) -> List[Dict]:
        """Mövzulardan sual-cavab nümunələri yaradır"""
        samples = []
        
        for topic_info in topics:
            grade = topic_info["grade"]
            subject = topic_info["subject"]
            topic = topic_info["topic"]
            
            # RAG-dən kontekst əldə et
            context = self.rag.retrieve_context(topic, grade, subject, k=3)
            
            # Müxtəlif sual növləri üçün nümunələr
            samples.extend(self._create_mcq_samples(context, grade, subject, topic))
            samples.extend(self._create_open_samples(context, grade, subject, topic))
            samples.extend(self._create_analysis_samples(context, grade, subject, topic))
            
        return samples
    
    def _create_mcq_samples(self, context: str, grade: int, subject: str, topic: str) -> List[Dict]:
        """Çoxseçimli sual nümunələri"""
        return [
            {
                "instruction": f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə çoxseçimli test sualı hazırlayın.

Tələblər:
- Dərslik kontekstinə əsaslanın
- 4 cavab variantı olsun (A, B, C, D)
- Yalnız 1 düzgün cavab
- Ətraflı izahat verin
- Bloom taksonomiyasına uyğun olsun""",
                "input": f"""Kontekst: {context}

Mövzu: {topic}
Sinif: {grade}
Fənn: {subject}
Sual növü: Çoxseçimli (MCQ)
Çətinlik: Orta""",
                "output": json.dumps({
                    "sual": f"{topic} haqqında əsas anlayışlar",
                    "seçimlər": [
                        "Variant A - düzgün cavab",
                        "Variant B - yanlış",
                        "Variant C - yanlış",
                        "Variant D - yanlış"
                    ],
                    "cavab": "A",
                    "izah": "Dərslikdə açıq şəkildə göstərildiyi kimi...",
                    "bloom": "anlama",
                    "çətinlik": "orta",
                    "mənbə": "Dərslik səh. X"
                }, ensure_ascii=False)
            }
        ]
    
    def _create_open_samples(self, context: str, grade: int, subject: str, topic: str) -> List[Dict]:
        """Açıq cavablı sual nümunələri"""
        return [
            {
                "instruction": f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə açıq cavablı sual hazırlayın.

Tələblər:
- Tələbənin anlayışını yoxlasın
- Ətraflı cavab tələb etsin
- Qiymətləndirmə kriteriyaları olsun""",
                "input": f"""Kontekst: {context}

Mövzu: {topic}
Sinif: {grade}
Fənn: {subject}
Sual növü: Açıq cavablı""",
                "output": json.dumps({
                    "sual": f"{topic} anlayışını izah edin",
                    "nümunə_cavab": "Ətraflı cavab...",
                    "qiymətləndirmə": {
                        "tam": "Bütün aspektlər əhatə olunub",
                        "qismən": "Bəzi aspektlər çatışmır",
                        "zəif": "Əsas anlayış başa düşülməyib"
                    },
                    "bloom": "tətbiq",
                    "mənbə": "Dərslik səh. X"
                }, ensure_ascii=False)
            }
        ]
    
    def _create_analysis_samples(self, context: str, grade: int, subject: str, topic: str) -> List[Dict]:
        """Təhlil tələb edən sual nümunələri"""
        return [
            {
                "instruction": f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə təhlil tələb edən sual hazırlayın.

Tələblər:
- Tənqidi düşünmə tələb etsin
- Müqayisə və təhlil
- Nəticə çıxarma qabiliyyəti""",
                "input": f"""Kontekst: {context}

Mövzu: {topic}
Sinif: {grade}
Fənn: {subject}
Sual növü: Təhlil""",
                "output": json.dumps({
                    "sual": f"{topic} anlayışını müqayisə edin və təhlil edin",
                    "nümunə_cavab": "Müqayisəli təhlil...",
                    "əsas_nöqtələr": [
                        "Oxşarlıqlar",
                        "Fərqlər",
                        "Nəticə"
                    ],
                    "bloom": "təhlil",
                    "çətinlik": "çətin",
                    "mənbə": "Dərslik səh. X"
                }, ensure_ascii=False)
            }
        ]
    
    def build_dataset(self, topics_file: str = "training_topics.json") -> str:
        """Tam dataset yaradır"""
        # Mövzuları oxu
        with open(topics_file, 'r', encoding='utf-8') as f:
            topics = json.load(f)
        
        # Nümunələr yarat
        print(f"🔨 {len(topics)} mövzu üçün nümunələr yaradılır...")
        samples = self.create_question_samples(topics)
        
        # Train/eval split (80/20)
        split_idx = int(len(samples) * 0.8)
        train_samples = samples[:split_idx]
        eval_samples = samples[split_idx:]
        
        # JSONL formatında yaz
        train_file = self.output_dir / "train.jsonl"
        eval_file = self.output_dir / "eval.jsonl"
        
        with open(train_file, 'w', encoding='utf-8') as f:
            for sample in train_samples:
                f.write(json.dumps(sample, ensure_ascii=False) + '\n')
        
        with open(eval_file, 'w', encoding='utf-8') as f:
            for sample in eval_samples:
                f.write(json.dumps(sample, ensure_ascii=False) + '\n')
        
        print(f"✅ Dataset hazırdır:")
        print(f"   Train: {len(train_samples)} nümunə → {train_file}")
        print(f"   Eval: {len(eval_samples)} nümunə → {eval_file}")
        
        return str(self.output_dir)

def create_sample_topics():
    """Nümunə mövzular faylı yaradır"""
    topics = [
        # Riyaziyyat
        {"grade": 5, "subject": "riyaziyyat", "topic": "Kəsr ədədlər"},
        {"grade": 6, "subject": "riyaziyyat", "topic": "Faiz hesablamaları"},
        {"grade": 7, "subject": "riyaziyyat", "topic": "Cəbr ifadələri"},
        {"grade": 8, "subject": "riyaziyyat", "topic": "Kvadrat tənliklər"},
        {"grade": 9, "subject": "riyaziyyat", "topic": "Triqonometriya"},
        
        # Fizika
        {"grade": 7, "subject": "fizika", "topic": "Qüvvə və hərəkət"},
        {"grade": 8, "subject": "fizika", "topic": "Elektrik cərəyanı"},
        {"grade": 9, "subject": "fizika", "topic": "Enerji çevrilmələri"},
        {"grade": 10, "subject": "fizika", "topic": "Dalğalar və optika"},
        
        # Kimya
        {"grade": 8, "subject": "kimya", "topic": "Atom quruluşu"},
        {"grade": 9, "subject": "kimya", "topic": "Kimyəvi reaksiyalar"},
        {"grade": 10, "subject": "kimya", "topic": "Üzvi birləşmələr"},
        
        # Biologiya
        {"grade": 6, "subject": "biologiya", "topic": "Hüceyrə quruluşu"},
        {"grade": 9, "subject": "biologiya", "topic": "Genetika"},
        {"grade": 10, "subject": "biologiya", "topic": "Ekologiya"},
        
        # Azərbaycan dili
        {"grade": 5, "subject": "azərbaycan_dili", "topic": "Nitq hissələri"},
        {"grade": 6, "subject": "azərbaycan_dili", "topic": "Fel zamanları"},
        {"grade": 7, "subject": "azərbaycan_dili", "topic": "Cümlə üzvləri"},
    ]
    
    with open("training_topics.json", 'w', encoding='utf-8') as f:
        json.dump(topics, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {len(topics)} mövzu hazırlandı: training_topics.json")

if __name__ == "__main__":
    # Nümunə mövzular yarat
    create_sample_topics()
    
    # RAG sistemi yüklə
    from rag_system import RAGSystem
    rag = RAGSystem()
    rag.load_index()
    
    # Dataset builder
    builder = LoRADatasetBuilder(rag)
    output_dir = builder.build_dataset()
    
    print(f"\n🎯 Dataset hazırdır: {output_dir}")
