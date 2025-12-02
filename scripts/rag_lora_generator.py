"""
LoRA Question Generator - Fine-tuned model ilə sual yaradır
"""
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from peft import PeftModel
import json
from typing import List, Dict, Optional

class LoRAQuestionGenerator:
    def __init__(
        self,
        base_model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
        lora_path: str = "lora_models/edutest_v1/final"
    ):
        self.base_model = base_model
        self.lora_path = lora_path
        self.model = None
        self.tokenizer = None
        self.pipe = None
        
    def load_model(self):
        """Fine-tuned modeli yüklə"""
        print(f"📥 Model yüklənir...")
        print(f"   Base: {self.base_model}")
        print(f"   LoRA: {self.lora_path}")
        
        # Tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.lora_path)
        
        # Base model
        base = AutoModelForCausalLM.from_pretrained(
            self.base_model,
            device_map="auto",
            torch_dtype=torch.bfloat16,
            load_in_4bit=True,
        )
        
        # Load LoRA adapters
        self.model = PeftModel.from_pretrained(base, self.lora_path)
        self.model.eval()
        
        # Create pipeline
        self.pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            device_map="auto",
        )
        
        print("✅ Model yükləndi")
        
    def generate_questions(
        self,
        context: str,
        grade: int,
        subject: str,
        topic: str,
        count: int = 5,
        question_type: str = "mcq",
        difficulty: str = "orta"
    ) -> List[Dict]:
        """Test sualları yaradır"""
        
        if not self.pipe:
            self.load_model()
        
        # Prompt hazırla
        if question_type == "mcq":
            instruction = self._get_mcq_instruction(grade, subject, topic, count, difficulty)
        elif question_type == "open":
            instruction = self._get_open_instruction(grade, subject, topic, count, difficulty)
        else:
            instruction = self._get_mixed_instruction(grade, subject, topic, count, difficulty)
        
        prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{instruction}<|eot_id|><|start_header_id|>user<|end_header_id|>

Kontekst: {context}

Mövzu: {topic}
Sinif: {grade}
Fənn: {subject}
Sual növü: {question_type}
Çətinlik: {difficulty}
Sual sayı: {count}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""
        
        # Generate
        print(f"🤖 {count} sual yaradılır...")
        output = self.pipe(
            prompt,
            max_new_tokens=2000,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            num_return_sequences=1,
        )
        
        # Parse output
        generated_text = output[0]["generated_text"]
        questions = self._parse_questions(generated_text)
        
        # Validate and limit
        questions = questions[:count]
        
        print(f"✅ {len(questions)} sual yaradıldı")
        return questions
    
    def _get_mcq_instruction(self, grade: int, subject: str, topic: str, count: int, difficulty: str) -> str:
        """Çoxseçimli sual instruction-ı"""
        return f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə {count} çoxseçimli test sualı hazırlayın.

Tələblər:
- Dərslik kontekstinə əsaslanın
- Hər sual 4 cavab variantı olsun (A, B, C, D)
- Yalnız 1 düzgün cavab
- Ətraflı və aydın izahat verin
- Bloom taksonomiyasını göstərin
- Çətinlik səviyyəsi: {difficulty}
- Dərslik səhifə nömrəsini qeyd edin

JSON formatında qaytarın:
[
  {{
    "sual": "Sual mətni?",
    "seçimlər": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "cavab": "A",
    "izah": "Ətraflı izahat...",
    "bloom": "anlama",
    "çətinlik": "{difficulty}",
    "mənbə": "Dərslik səh. X"
  }}
]"""
    
    def _get_open_instruction(self, grade: int, subject: str, topic: str, count: int, difficulty: str) -> str:
        """Açıq sual instruction-ı"""
        return f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə {count} açıq cavablı sual hazırlayın.

Tələblər:
- Tələbənin dərindən anlayışını yoxlasın
- Ətraflı cavab tələb etsin
- Qiymətləndirmə kriteriyaları verin
- Nümunə cavab təqdim edin
- Çətinlik səviyyəsi: {difficulty}

JSON formatında qaytarın."""
    
    def _get_mixed_instruction(self, grade: int, subject: str, topic: str, count: int, difficulty: str) -> str:
        """Qarışıq sual instruction-ı"""
        return f"""Siz təhsil mütəxəssisisiniz. {grade}-ci sinif {subject} fənnindən "{topic}" mövzusu üzrə {count} sual hazırlayın (çoxseçimli və açıq qarışıq).

Bölgü: 60% çoxseçimli, 40% açıq
Çətinlik: {difficulty}"""
    
    def _parse_questions(self, text: str) -> List[Dict]:
        """Yaradılmış mətni parse edib JSON-a çevir"""
        try:
            # Try to extract JSON array
            start_idx = text.find('[')
            end_idx = text.rfind(']') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                questions = json.loads(json_str)
                return questions
            
            # Fallback: try to find individual JSON objects
            questions = []
            import re
            json_pattern = r'\{[^}]+\}'
            matches = re.finditer(json_pattern, text, re.DOTALL)
            
            for match in matches:
                try:
                    q = json.loads(match.group())
                    if 'sual' in q:
                        questions.append(q)
                except:
                    continue
            
            return questions
            
        except Exception as e:
            print(f"⚠️ Parse xətası: {e}")
            return []
    
    def generate_with_rag(
        self,
        rag_system,
        grade: int,
        subject: str,
        topic: str,
        count: int = 5,
        question_type: str = "mcq",
        difficulty: str = "orta"
    ) -> List[Dict]:
        """RAG sistemi ilə birlikdə sual yaradır"""
        
        # RAG-dən kontekst al
        print(f"🔍 RAG-dən kontekst alınır...")
        context = rag_system.retrieve_context(
            query=topic,
            grade=grade,
            subject=subject,
            k=5
        )
        
        # Sual yarat
        questions = self.generate_questions(
            context=context,
            grade=grade,
            subject=subject,
            topic=topic,
            count=count,
            question_type=question_type,
            difficulty=difficulty
        )
        
        return questions

# Test funksiyası
def test_generator():
    """Generator-u test et"""
    generator = LoRAQuestionGenerator()
    generator.load_model()
    
    # Test context
    context = """
    Elektrik cərəyanı - elektrik yüklərinin nizamlı hərəkətidir.
    Elektrik dövrəsi: mənbə, istehlakçı, açar və naqillərdən ibarətdir.
    Om qanunu: I = U/R, burada I - cərəyan, U - gərginlik, R - müqavimət.
    """
    
    questions = generator.generate_questions(
        context=context,
        grade=8,
        subject="fizika",
        topic="Elektrik cərəyanı",
        count=3,
        question_type="mcq",
        difficulty="orta"
    )
    
    print("\n" + "="*60)
    print("YARADILMIŞ SUALLAR:")
    print("="*60)
    for i, q in enumerate(questions, 1):
        print(f"\n{i}. {q.get('sual', 'N/A')}")
        if 'seçimlər' in q:
            for opt in q['seçimlər']:
                print(f"   {opt}")
        print(f"   Cavab: {q.get('cavab', 'N/A')}")
        print(f"   İzah: {q.get('izah', 'N/A')}")

if __name__ == "__main__":
    test_generator()
