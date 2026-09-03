"""
Model Benchmarker with W&B Integration
"""
from lora_model_benchmarker import ModelBenchmarker, BenchmarkResult
from wandb_integration import WandBLogger
from datetime import datetime


class ModelBenchmarkerWithWandB(ModelBenchmarker):
    """Model Benchmarker with W&B logging"""
    
    def __init__(
        self,
        base_model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
        benchmark_config_path: str = "benchmark_config.json",
        project_name: str = "testai-az"
    ):
        super().__init__(base_model, benchmark_config_path)
        
        self.wandb_logger = WandBLogger(project_name=project_name)
    
    def run_benchmark(
        self,
        version_id: str,
        lora_path: str,
        save_results: bool = True
    ) -> BenchmarkResult:
        """Run benchmark with W&B logging"""
        
        # Initialize W&B run
        self.wandb_logger.init_run(
            run_name=f"benchmark_{version_id}",
            config={
                "version_id": version_id,
                "lora_path": lora_path,
                "base_model": self.base_model,
                "test_cases": len(self.config["test_cases"]),
                "questions_per_case": self.config["num_questions_per_case"]
            },
            run_type="benchmark",
            tags=["benchmark", "evaluation", "quality-check"]
        )
        
        # Run benchmark
        result = super().run_benchmark(version_id, lora_path, save_results)
        
        # Log to W&B
        self.wandb_logger.log_benchmark_results(
            version_id=version_id,
            overall_score=result.overall_score,
            passed=result.passed,
            metrics={
                "question_validity": result.question_validity,
                "answer_correctness": result.answer_correctness,
                "format_compliance": result.format_compliance,
                "textbook_relevance": result.textbook_relevance,
                "difficulty_accuracy": result.difficulty_accuracy,
                "bloom_coverage": result.bloom_coverage,
                "azerbaijani_quality": result.azerbaijani_quality,
                "grammar_score": result.grammar_score
            },
            generation_time=result.avg_generation_time,
            success_rate=result.success_rate
        )
        
        # Log detailed test case results
        for test_result in result.test_cases:
            if test_result.get("success") and test_result.get("questions"):
                self.wandb_logger.log_test_questions(
                    questions=test_result["questions"],
                    test_case=test_result["test_case"]
                )
        
        # Finish W&B run
        self.wandb_logger.finish(exit_code=0 if result.passed else 1)
        
        return result


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Model Benchmarker with W&B")
    parser.add_argument("version_id", help="Model version ID")
    parser.add_argument("lora_path", help="Path to LoRA adapter")
    parser.add_argument("--base-model", default="meta-llama/Meta-Llama-3-8B-Instruct")
    parser.add_argument("--no-save", action="store_true", help="Don't save results")
    
    args = parser.parse_args()
    
    benchmarker = ModelBenchmarkerWithWandB(base_model=args.base_model)
    result = benchmarker.run_benchmark(
        version_id=args.version_id,
        lora_path=args.lora_path,
        save_results=not args.no_save
    )
    
    if not result.passed:
        exit(1)


if __name__ == "__main__":
    main()
