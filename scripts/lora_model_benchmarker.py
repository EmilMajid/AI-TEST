"""
LoRA Model Benchmarker - Yeni modellərin keyfiyyətini avtomatik test edir
"""
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import numpy as np
from dataclasses import dataclass, asdict

from rag_lora_generator import LoRAQuestionGenerator
from rag_system import RAGSystem
from lora_version_manager import LoRAVersionManager


@dataclass
class BenchmarkResult:
    """Benchmark nəticələri"""
    version_id: str
    timestamp: str
    overall_score: float
    passed: bool
    
    # Question Quality Metrics
    question_validity: float  # Sualların düzgünlüyü (0-1)
    answer_correctness: float  # Cavabların düzgünlüyü (0-1)
    format_compliance: float  # Format uyğunluğu (0-1)
    
    # Content Quality Metrics
    textbook_relevance: float  # Dərslik uyğunluğu (0-1)
    difficulty_accuracy: float  # Çətinlik səviyyəsi dəqiqliyi (0-1)
    bloom_coverage: float  # Bloom taksonomiyası əhatəsi (0-1)
    
    # Language Quality Metrics
    azerbaijani_quality: float  # Azərbaycan dili keyfiyyəti (0-1)
    grammar_score: float  # Qrammatika düzgünlüyü (0-1)
    
    # Performance Metrics
    avg_generation_time: float  # Orta generasiya vaxtı (saniyə)
    success_rate: float  # Uğurlu generasiya faizi (0-1)
    
    # Detailed Results
    detailed_results: Dict
    test_cases: List[Dict]
    
    def to_dict(self):
        return asdict(self)


class ModelBenchmarker:
    """Model keyfiyyət testləri"""
    
    def __init__(
        self,
        base_model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
        benchmark_config_path: str = "benchmark_config.json"
    ):
        self.base_model = base_model
        self.rag_system = RAGSystem()
        self.rag_system.load_index()
        self.version_manager = LoRAVersionManager()
        
        # Load benchmark configuration
        self.config = self._load_config(benchmark_config_path)
        
        # Quality thresholds
        self.thresholds = {
            "overall_score": 0.75,
            "question_validity": 0.85,
            "answer_correctness": 0.80,
            "format_compliance": 0.90,
            "textbook_relevance": 0.80,
            "azerbaijani_quality": 0.85
        }
        
    def _load_config(self, config_path: str) -> Dict:
        """Benchmark konfiqurasiyasını yüklə"""
        default_config = {
            "test_cases": [
                {
                    "grade": 8,
                    "subject": "fizika",
                    "topic": "Nyuton qanunları",
                    "difficulty": "orta",
                    "question_type": "mcq",
                    "expected_concepts": ["qüvvə", "kütlə", "təcil"]
                },
                {
                    "grade": 9,
                    "subject": "kimya",
                    "topic": "Kimyəvi reaksiyalar",
                    "difficulty": "çətin",
                    "question_type": "mcq",
                    "expected_concepts": ["reaksiya", "məhsul", "reaktiv"]
                },
                {
                    "grade": 10,
                    "subject": "riyaziyyat",
                    "topic": "Triqonometriya",
                    "difficulty": "sadə",
                    "question_type": "open",
                    "expected_concepts": ["sinus", "kosinus", "bucaq"]
                },
                {
                    "grade": 7,
                    "subject": "biologiya",
                    "topic": "Hüceyrə quruluşu",
                    "difficulty": "orta",
                    "question_type": "mcq",
                    "expected_concepts": ["hüceyrə", "orqanoid", "nüvə"]
                },
                {
                    "grade": 11,
                    "subject": "fizika",
                    "topic": "Elektrik cərəyanı",
                    "difficulty": "çətin",
                    "question_type": "mcq",
                    "expected_concepts": ["cərəyan", "gərginlik", "müqavimət"]
                }
            ],
            "num_questions_per_case": 3,
            "timeout_seconds": 30
        }
        
        config_file = Path(config_path)
        if config_file.exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Save default config
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=2, ensure_ascii=False)
        
        return default_config
    
    def run_benchmark(
        self,
        version_id: str,
        lora_path: str,
        save_results: bool = True
    ) -> BenchmarkResult:
        """Tam benchmark suite-ini işə sal"""
        
        print(f"\n{'='*60}")
        print(f"🧪 Model Benchmark Başladı: {version_id}")
        print(f"{'='*60}\n")
        
        # Initialize generator
        generator = LoRAQuestionGenerator(
            base_model=self.base_model,
            lora_path=lora_path
        )
        generator.load_model()
        
        # Run all test cases
        all_results = []
        generation_times = []
        success_count = 0
        total_count = 0
        
        for i, test_case in enumerate(self.config["test_cases"], 1):
            print(f"\n📋 Test Case {i}/{len(self.config['test_cases'])}")
            print(f"   Mövzu: {test_case['subject']} - {test_case['topic']}")
            print(f"   Sinif: {test_case['grade']}, Çətinlik: {test_case['difficulty']}")
            
            try:
                start_time = time.time()
                
                # Generate questions
                questions = generator.generate_with_rag(
                    rag_system=self.rag_system,
                    grade=test_case["grade"],
                    subject=test_case["subject"],
                    topic=test_case["topic"],
                    count=self.config["num_questions_per_case"],
                    question_type=test_case["question_type"],
                    difficulty=test_case["difficulty"]
                )
                
                generation_time = time.time() - start_time
                generation_times.append(generation_time)
                
                if questions and len(questions) > 0:
                    success_count += 1
                    
                    # Evaluate questions
                    evaluation = self._evaluate_questions(
                        questions,
                        test_case
                    )
                    
                    all_results.append({
                        "test_case": test_case,
                        "questions": questions,
                        "evaluation": evaluation,
                        "generation_time": generation_time,
                        "success": True
                    })
                    
                    print(f"   ✅ Generasiya uğurlu: {len(questions)} sual")
                    print(f"   ⏱️  Vaxt: {generation_time:.2f}s")
                    print(f"   📊 Keyfiyyət: {evaluation['overall_score']:.2%}")
                else:
                    all_results.append({
                        "test_case": test_case,
                        "questions": [],
                        "evaluation": {"overall_score": 0},
                        "generation_time": generation_time,
                        "success": False,
                        "error": "No questions generated"
                    })
                    print(f"   ❌ Generasiya uğursuz")
                
                total_count += 1
                
            except Exception as e:
                print(f"   ❌ Xəta: {str(e)}")
                all_results.append({
                    "test_case": test_case,
                    "questions": [],
                    "evaluation": {"overall_score": 0},
                    "generation_time": 0,
                    "success": False,
                    "error": str(e)
                })
                total_count += 1
        
        # Calculate aggregate metrics
        print(f"\n{'='*60}")
        print("📊 Nəticələrin Hesablanması...")
        print(f"{'='*60}\n")
        
        metrics = self._calculate_aggregate_metrics(all_results)
        
        # Create benchmark result
        overall_score = metrics["overall_score"]
        passed = self._check_quality_gate(metrics)
        
        result = BenchmarkResult(
            version_id=version_id,
            timestamp=datetime.now().isoformat(),
            overall_score=overall_score,
            passed=passed,
            question_validity=metrics["question_validity"],
            answer_correctness=metrics["answer_correctness"],
            format_compliance=metrics["format_compliance"],
            textbook_relevance=metrics["textbook_relevance"],
            difficulty_accuracy=metrics["difficulty_accuracy"],
            bloom_coverage=metrics["bloom_coverage"],
            azerbaijani_quality=metrics["azerbaijani_quality"],
            grammar_score=metrics["grammar_score"],
            avg_generation_time=np.mean(generation_times) if generation_times else 0,
            success_rate=success_count / total_count if total_count > 0 else 0,
            detailed_results=metrics,
            test_cases=all_results
        )
        
        # Print summary
        self._print_summary(result)
        
        # Save results
        if save_results:
            self._save_results(result)
        
        # Update version manager with metrics
        self.version_manager.update_metrics(version_id, {
            "benchmark_score": overall_score,
            "benchmark_passed": passed,
            "question_validity": metrics["question_validity"],
            "generation_time": result.avg_generation_time,
            "success_rate": result.success_rate
        })
        
        return result
    
    def _evaluate_questions(
        self,
        questions: List[Dict],
        test_case: Dict
    ) -> Dict:
        """Sualları qiymətləndir"""
        
        scores = {
            "question_validity": [],
            "answer_correctness": [],
            "format_compliance": [],
            "textbook_relevance": [],
            "difficulty_accuracy": [],
            "bloom_coverage": [],
            "azerbaijani_quality": [],
            "grammar_score": []
        }
        
        for question in questions:
            # Question validity
            validity = self._check_question_validity(question)
            scores["question_validity"].append(validity)
            
            # Answer correctness
            correctness = self._check_answer_correctness(question)
            scores["answer_correctness"].append(correctness)
            
            # Format compliance
            format_score = self._check_format_compliance(question, test_case["question_type"])
            scores["format_compliance"].append(format_score)
            
            # Textbook relevance
            relevance = self._check_textbook_relevance(question, test_case)
            scores["textbook_relevance"].append(relevance)
            
            # Difficulty accuracy
            difficulty = self._check_difficulty_match(question, test_case["difficulty"])
            scores["difficulty_accuracy"].append(difficulty)
            
            # Bloom taxonomy
            bloom = self._check_bloom_taxonomy(question)
            scores["bloom_coverage"].append(bloom)
            
            # Azerbaijani quality
            az_quality = self._check_azerbaijani_quality(question)
            scores["azerbaijani_quality"].append(az_quality)
            
            # Grammar
            grammar = self._check_grammar(question)
            scores["grammar_score"].append(grammar)
        
        # Calculate averages
        avg_scores = {
            key: np.mean(values) if values else 0
            for key, values in scores.items()
        }
        
        # Overall score (weighted average)
        weights = {
            "question_validity": 0.20,
            "answer_correctness": 0.20,
            "format_compliance": 0.15,
            "textbook_relevance": 0.15,
            "difficulty_accuracy": 0.10,
            "bloom_coverage": 0.05,
            "azerbaijani_quality": 0.10,
            "grammar_score": 0.05
        }
        
        overall = sum(
            avg_scores[key] * weight
            for key, weight in weights.items()
        )
        
        avg_scores["overall_score"] = overall
        avg_scores["detailed_scores"] = scores
        
        return avg_scores
    
    def _check_question_validity(self, question: Dict) -> float:
        """Sualın düzgünlüyünü yoxla"""
        score = 1.0
        
        # Must have question text
        if not question.get("sual") or len(question["sual"]) < 10:
            score -= 0.5
        
        # Question should end with question mark
        if question.get("sual") and not question["sual"].strip().endswith("?"):
            score -= 0.2
        
        # Should not be empty or too short
        if question.get("sual") and len(question["sual"]) < 20:
            score -= 0.3
        
        return max(0, score)
    
    def _check_answer_correctness(self, question: Dict) -> float:
        """Cavabın düzgünlüyünü yoxla"""
        score = 1.0
        
        # Must have answer
        if not question.get("cavab"):
            return 0.0
        
        # MCQ: answer should be A, B, C, or D
        if question.get("seçimlər"):
            if question["cavab"] not in ["A", "B", "C", "D"]:
                score -= 0.5
            
            # Should have choices
            if len(question.get("seçimlər", [])) != 4:
                score -= 0.3
        
        # Should have explanation
        if not question.get("izah") or len(question.get("izah", "")) < 20:
            score -= 0.2
        
        return max(0, score)
    
    def _check_format_compliance(self, question: Dict, question_type: str) -> float:
        """Format uyğunluğunu yoxla"""
        score = 1.0
        required_fields = ["sual", "cavab", "izah"]
        
        # Check required fields
        for field in required_fields:
            if field not in question or not question[field]:
                score -= 0.3
        
        # MCQ specific checks
        if question_type == "mcq":
            if "seçimlər" not in question:
                score -= 0.4
            elif len(question["seçimlər"]) != 4:
                score -= 0.2
            
            # All choices should be non-empty
            if question.get("seçimlər"):
                empty_choices = sum(1 for c in question["seçimlər"] if not c or len(c) < 2)
                score -= empty_choices * 0.1
        
        return max(0, score)
    
    def _check_textbook_relevance(self, question: Dict, test_case: Dict) -> float:
        """Dərslik uyğunluğunu yoxla"""
        score = 0.5  # Base score
        
        # Check if expected concepts are mentioned
        question_text = (
            question.get("sual", "") + " " + 
            question.get("izah", "") + " " +
            " ".join(question.get("seçimlər", []))
        ).lower()
        
        expected_concepts = test_case.get("expected_concepts", [])
        if expected_concepts:
            found_concepts = sum(
                1 for concept in expected_concepts
                if concept.lower() in question_text
            )
            score += (found_concepts / len(expected_concepts)) * 0.5
        else:
            score += 0.5  # No expected concepts, assume relevant
        
        # Check if source is mentioned
        if question.get("mənbə"):
            score += 0.1
        
        return min(1.0, score)
    
    def _check_difficulty_match(self, question: Dict, expected_difficulty: str) -> float:
        """Çətinlik səviyyəsini yoxla"""
        # Simple heuristic based on question length and complexity
        question_text = question.get("sual", "")
        
        # Count complexity indicators
        complexity_score = 0
        
        # Long questions are usually harder
        if len(question_text) > 100:
            complexity_score += 1
        elif len(question_text) > 50:
            complexity_score += 0.5
        
        # Questions with formulas or numbers
        if any(char.isdigit() for char in question_text):
            complexity_score += 0.5
        
        # Complex words
        complex_words = ["təhlil", "müqayisə", "qiymətləndir", "izah"]
        if any(word in question_text.lower() for word in complex_words):
            complexity_score += 0.5
        
        # Map complexity to difficulty
        expected_complexity = {
            "sadə": 0.5,
            "orta": 1.5,
            "çətin": 2.5
        }.get(expected_difficulty, 1.5)
        
        # Calculate match score
        diff = abs(complexity_score - expected_complexity)
        match_score = max(0, 1 - (diff / 3))
        
        return match_score
    
    def _check_bloom_taxonomy(self, question: Dict) -> float:
        """Bloom taksonomiyası əhatəsini yoxla"""
        # Simple check based on question verbs
        question_text = question.get("sual", "").lower()
        
        bloom_levels = {
            "bilmə": ["nədir", "hansıdır", "adlandır", "göstər"],
            "anlama": ["izah et", "başa düş", "təsvir et"],
            "tətbiq": ["istifadə et", "tətbiq et", "həll et"],
            "təhlil": ["təhlil et", "müqayisə et", "fərqləndir"],
            "qiymətləndirmə": ["qiymətləndir", "mühakimə yürüt"]
        }
        
        detected_level = None
        for level, verbs in bloom_levels.items():
            if any(verb in question_text for verb in verbs):
                detected_level = level
                break
        
        # If Bloom level detected in question metadata
        if question.get("bloom"):
            return 1.0 if detected_level else 0.8
        
        return 0.5  # Partial credit if no explicit Bloom level
    
    def _check_azerbaijani_quality(self, question: Dict) -> float:
        """Azərbaycan dili keyfiyyətini yoxla"""
        score = 1.0
        
        # Check all text fields
        text_fields = [
            question.get("sual", ""),
            question.get("izah", ""),
            question.get("cavab", "")
        ] + question.get("seçimlər", [])
        
        full_text = " ".join(str(t) for t in text_fields)
        
        # Should not contain Latin-only text (must have Cyrillic or Azerbaijani specific)
        if full_text and not any(c in "əüöğışçӘÜÖĞIŞÇ" for c in full_text):
            # Check if it's actually Azerbaijani Cyrillic
            cyrillic_count = sum(1 for c in full_text if '\u0400' <= c <= '\u04FF')
            if cyrillic_count < len(full_text) * 0.1:
                score -= 0.3
        
        # Check for common mistakes
        mistakes = [
            ("i", "і"),  # Latin i vs Cyrillic і
            ("c", "с"),  # Latin c vs Cyrillic с
        ]
        for latin, cyrillic in mistakes:
            if latin in full_text:
                score -= 0.1
        
        return max(0, score)
    
    def _check_grammar(self, question: Dict) -> float:
        """Qrammatika düzgünlüyünü yoxla"""
        # Basic grammar checks
        score = 1.0
        
        text_fields = [question.get("sual", ""), question.get("izah", "")]
        
        for text in text_fields:
            if not text:
                continue
            
            # Should start with capital letter
            if text and not text[0].isupper():
                score -= 0.1
            
            # Should end with proper punctuation
            if text and text[-1] not in ".?!":
                score -= 0.1
            
            # No double spaces
            if "  " in text:
                score -= 0.1
        
        return max(0, score)
    
    def _calculate_aggregate_metrics(self, all_results: List[Dict]) -> Dict:
        """Ümumi metriklər hesabla"""
        
        # Collect all evaluations
        all_evaluations = []
        for result in all_results:
            if result.get("success") and result.get("evaluation"):
                all_evaluations.append(result["evaluation"])
        
        if not all_evaluations:
            return {
                "overall_score": 0,
                "question_validity": 0,
                "answer_correctness": 0,
                "format_compliance": 0,
                "textbook_relevance": 0,
                "difficulty_accuracy": 0,
                "bloom_coverage": 0,
                "azerbaijani_quality": 0,
                "grammar_score": 0
            }
        
        # Average across all test cases
        metrics = {}
        metric_keys = [
            "overall_score", "question_validity", "answer_correctness",
            "format_compliance", "textbook_relevance", "difficulty_accuracy",
            "bloom_coverage", "azerbaijani_quality", "grammar_score"
        ]
        
        for key in metric_keys:
            values = [e[key] for e in all_evaluations if key in e]
            metrics[key] = np.mean(values) if values else 0
        
        return metrics
    
    def _check_quality_gate(self, metrics: Dict) -> bool:
        """Keyfiyyət qapısını yoxla"""
        
        for metric, threshold in self.thresholds.items():
            if metrics.get(metric, 0) < threshold:
                return False
        
        return True
    
    def _print_summary(self, result: BenchmarkResult):
        """Nəticə xülasəsini çap et"""
        
        print(f"\n{'='*60}")
        print("📊 BENCHMARK NƏTİCƏLƏRİ")
        print(f"{'='*60}\n")
        
        status = "✅ KEÇDİ" if result.passed else "❌ UĞURSUZ"
        print(f"Status: {status}")
        print(f"Ümumi Xal: {result.overall_score:.2%}\n")
        
        print("📈 Əsas Metriklər:")
        print(f"  Sual Düzgünlüyü:        {result.question_validity:.2%}")
        print(f"  Cavab Düzgünlüyü:       {result.answer_correctness:.2%}")
        print(f"  Format Uyğunluğu:       {result.format_compliance:.2%}")
        print(f"  Dərslik Uyğunluğu:      {result.textbook_relevance:.2%}")
        print(f"  Çətinlik Dəqiqliyi:     {result.difficulty_accuracy:.2%}")
        print(f"  Bloom Əhatəsi:          {result.bloom_coverage:.2%}")
        print(f"  Azərbaycan Dili:        {result.azerbaijani_quality:.2%}")
        print(f"  Qrammatika:             {result.grammar_score:.2%}\n")
        
        print("⚡ Performans:")
        print(f"  Orta Generasiya Vaxtı:  {result.avg_generation_time:.2f}s")
        print(f"  Uğur Faizi:             {result.success_rate:.2%}\n")
        
        if not result.passed:
            print("❌ Aşağıdakı metriklər threshold-dan aşağıdır:")
            for metric, threshold in self.thresholds.items():
                value = getattr(result, metric)
                if value < threshold:
                    print(f"  {metric}: {value:.2%} < {threshold:.2%}")
            print()
        
        print(f"{'='*60}\n")
    
    def _save_results(self, result: BenchmarkResult):
        """Nəticələri saxla"""
        
        results_dir = Path("benchmark_results")
        results_dir.mkdir(exist_ok=True)
        
        filename = f"{result.version_id}_{result.timestamp.replace(':', '-')}.json"
        filepath = results_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result.to_dict(), f, indent=2, ensure_ascii=False)
        
        print(f"💾 Nəticələr saxlanıldı: {filepath}\n")


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="LoRA Model Benchmarker")
    parser.add_argument("version_id", help="Model version ID")
    parser.add_argument("lora_path", help="Path to LoRA adapter")
    parser.add_argument("--base-model", default="meta-llama/Meta-Llama-3-8B-Instruct")
    parser.add_argument("--no-save", action="store_true", help="Don't save results")
    
    args = parser.parse_args()
    
    benchmarker = ModelBenchmarker(base_model=args.base_model)
    result = benchmarker.run_benchmark(
        version_id=args.version_id,
        lora_path=args.lora_path,
        save_results=not args.no_save
    )
    
    # Exit with error code if failed
    if not result.passed:
        exit(1)


if __name__ == "__main__":
    main()
