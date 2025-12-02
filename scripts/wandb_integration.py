"""
Weights & Biases Integration - Experiment tracking və model monitoring
"""
import wandb
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import os


class WandBLogger:
    """Weights & Biases logger"""
    
    def __init__(
        self,
        project_name: str = "edutest-ai",
        entity: Optional[str] = None,
        tags: Optional[List[str]] = None
    ):
        self.project_name = project_name
        self.entity = entity or os.getenv("WANDB_ENTITY")
        self.tags = tags or []
        self.run = None
        
        # Check if API key is set
        if not os.getenv("WANDB_API_KEY"):
            print("⚠️  WANDB_API_KEY not set. Using offline mode.")
            os.environ["WANDB_MODE"] = "offline"
    
    def init_run(
        self,
        run_name: str,
        config: Dict,
        run_type: str = "training",
        tags: Optional[List[str]] = None
    ) -> wandb.Run:
        """Initialize W&B run"""
        
        all_tags = self.tags + (tags or []) + [run_type]
        
        self.run = wandb.init(
            project=self.project_name,
            entity=self.entity,
            name=run_name,
            config=config,
            tags=all_tags,
            reinit=True
        )
        
        print(f"✅ W&B Run initialized: {self.run.name}")
        print(f"   URL: {self.run.url}")
        
        return self.run
    
    def log_metrics(self, metrics: Dict[str, Any], step: Optional[int] = None):
        """Log metrics"""
        if self.run:
            self.run.log(metrics, step=step)
    
    def log_training_metrics(
        self,
        epoch: int,
        train_loss: float,
        eval_loss: Optional[float] = None,
        learning_rate: Optional[float] = None,
        **kwargs
    ):
        """Log training metrics"""
        metrics = {
            "epoch": epoch,
            "train/loss": train_loss,
        }
        
        if eval_loss is not None:
            metrics["eval/loss"] = eval_loss
        
        if learning_rate is not None:
            metrics["train/learning_rate"] = learning_rate
        
        # Add any additional metrics
        metrics.update(kwargs)
        
        self.log_metrics(metrics, step=epoch)
    
    def log_benchmark_results(
        self,
        version_id: str,
        overall_score: float,
        passed: bool,
        metrics: Dict[str, float],
        generation_time: float,
        success_rate: float
    ):
        """Log benchmark results"""
        
        log_data = {
            "benchmark/overall_score": overall_score,
            "benchmark/passed": 1 if passed else 0,
            "benchmark/question_validity": metrics.get("question_validity", 0),
            "benchmark/answer_correctness": metrics.get("answer_correctness", 0),
            "benchmark/format_compliance": metrics.get("format_compliance", 0),
            "benchmark/textbook_relevance": metrics.get("textbook_relevance", 0),
            "benchmark/difficulty_accuracy": metrics.get("difficulty_accuracy", 0),
            "benchmark/bloom_coverage": metrics.get("bloom_coverage", 0),
            "benchmark/azerbaijani_quality": metrics.get("azerbaijani_quality", 0),
            "benchmark/grammar_score": metrics.get("grammar_score", 0),
            "performance/generation_time": generation_time,
            "performance/success_rate": success_rate,
        }
        
        self.log_metrics(log_data)
        
        # Create summary table
        table = wandb.Table(
            columns=["Metric", "Value", "Threshold", "Status"],
            data=[
                ["Overall Score", f"{overall_score:.2%}", "75%", "✅" if passed else "❌"],
                ["Question Validity", f"{metrics.get('question_validity', 0):.2%}", "85%", 
                 "✅" if metrics.get('question_validity', 0) >= 0.85 else "❌"],
                ["Answer Correctness", f"{metrics.get('answer_correctness', 0):.2%}", "80%",
                 "✅" if metrics.get('answer_correctness', 0) >= 0.80 else "❌"],
                ["Format Compliance", f"{metrics.get('format_compliance', 0):.2%}", "90%",
                 "✅" if metrics.get('format_compliance', 0) >= 0.90 else "❌"],
                ["Textbook Relevance", f"{metrics.get('textbook_relevance', 0):.2%}", "80%",
                 "✅" if metrics.get('textbook_relevance', 0) >= 0.80 else "❌"],
                ["Azerbaijani Quality", f"{metrics.get('azerbaijani_quality', 0):.2%}", "85%",
                 "✅" if metrics.get('azerbaijani_quality', 0) >= 0.85 else "❌"],
            ]
        )
        
        self.run.log({"benchmark/summary": table})
    
    def log_model_artifact(
        self,
        model_path: str,
        version_id: str,
        metadata: Optional[Dict] = None
    ):
        """Log model as artifact"""
        
        artifact = wandb.Artifact(
            name=f"lora-model-{version_id}",
            type="model",
            metadata=metadata or {}
        )
        
        artifact.add_dir(model_path)
        self.run.log_artifact(artifact)
        
        print(f"✅ Model artifact logged: {version_id}")
    
    def log_dataset_artifact(
        self,
        dataset_path: str,
        dataset_name: str,
        metadata: Optional[Dict] = None
    ):
        """Log dataset as artifact"""
        
        artifact = wandb.Artifact(
            name=dataset_name,
            type="dataset",
            metadata=metadata or {}
        )
        
        if Path(dataset_path).is_dir():
            artifact.add_dir(dataset_path)
        else:
            artifact.add_file(dataset_path)
        
        self.run.log_artifact(artifact)
        
        print(f"✅ Dataset artifact logged: {dataset_name}")
    
    def log_test_questions(
        self,
        questions: List[Dict],
        test_case: Dict
    ):
        """Log generated test questions"""
        
        # Create table for questions
        columns = ["Sual", "Cavab", "İzah", "Bloom", "Çətinlik", "Mənbə"]
        data = []
        
        for q in questions:
            data.append([
                q.get("sual", "")[:100],  # Truncate long text
                q.get("cavab", ""),
                q.get("izah", "")[:100],
                q.get("bloom", "N/A"),
                test_case.get("difficulty", "N/A"),
                q.get("mənbə", "N/A")
            ])
        
        table = wandb.Table(columns=columns, data=data)
        
        self.run.log({
            f"questions/{test_case['subject']}_{test_case['topic']}": table
        })
    
    def log_comparison(
        self,
        version_ids: List[str],
        metrics: Dict[str, List[float]]
    ):
        """Log version comparison"""
        
        # Create comparison table
        columns = ["Version"] + list(metrics.keys())
        data = []
        
        for i, version_id in enumerate(version_ids):
            row = [version_id]
            for metric_values in metrics.values():
                row.append(f"{metric_values[i]:.2%}" if i < len(metric_values) else "N/A")
            data.append(row)
        
        table = wandb.Table(columns=columns, data=data)
        self.run.log({"comparison/versions": table})
        
        # Create bar charts for each metric
        for metric_name, values in metrics.items():
            data = [[version_ids[i], values[i]] for i in range(len(version_ids))]
            table = wandb.Table(data=data, columns=["Version", metric_name])
            
            self.run.log({
                f"comparison/{metric_name}": wandb.plot.bar(
                    table,
                    "Version",
                    metric_name,
                    title=f"{metric_name} Comparison"
                )
            })
    
    def finish(self, exit_code: int = 0):
        """Finish W&B run"""
        if self.run:
            self.run.finish(exit_code=exit_code)
            print("✅ W&B Run finished")


class WandBExperimentTracker:
    """Track experiments across multiple runs"""
    
    def __init__(self, project_name: str = "edutest-ai"):
        self.project_name = project_name
        self.api = wandb.Api()
    
    def get_all_runs(
        self,
        filters: Optional[Dict] = None,
        order: str = "-created_at"
    ) -> List[wandb.apis.public.Run]:
        """Get all runs from project"""
        
        runs = self.api.runs(
            path=self.project_name,
            filters=filters,
            order=order
        )
        
        return list(runs)
    
    def get_best_model(
        self,
        metric: str = "benchmark/overall_score",
        direction: str = "max"
    ) -> Optional[wandb.apis.public.Run]:
        """Get best model based on metric"""
        
        runs = self.get_all_runs(
            filters={"state": "finished"}
        )
        
        # Filter runs with the metric
        runs_with_metric = [
            r for r in runs 
            if metric in r.summary
        ]
        
        if not runs_with_metric:
            return None
        
        # Sort by metric
        sorted_runs = sorted(
            runs_with_metric,
            key=lambda r: r.summary[metric],
            reverse=(direction == "max")
        )
        
        return sorted_runs[0]
    
    def compare_runs(
        self,
        run_ids: List[str],
        metrics: List[str]
    ) -> Dict[str, List[float]]:
        """Compare multiple runs"""
        
        comparison = {metric: [] for metric in metrics}
        
        for run_id in run_ids:
            try:
                run = self.api.run(f"{self.project_name}/{run_id}")
                
                for metric in metrics:
                    value = run.summary.get(metric, 0)
                    comparison[metric].append(value)
            
            except Exception as e:
                print(f"Error loading run {run_id}: {e}")
                for metric in metrics:
                    comparison[metric].append(0)
        
        return comparison
    
    def get_run_history(
        self,
        run_id: str,
        metrics: Optional[List[str]] = None
    ) -> Dict[str, List]:
        """Get history of metrics for a run"""
        
        run = self.api.run(f"{self.project_name}/{run_id}")
        history = run.history()
        
        if metrics:
            history = history[metrics]
        
        return history.to_dict('list')
    
    def export_summary(self, output_path: str = "wandb_summary.json"):
        """Export summary of all runs"""
        
        runs = self.get_all_runs()
        
        summary = []
        for run in runs:
            summary.append({
                "id": run.id,
                "name": run.name,
                "state": run.state,
                "created_at": run.created_at.isoformat(),
                "config": run.config,
                "summary": dict(run.summary),
                "tags": run.tags,
                "url": run.url
            })
        
        with open(output_path, 'w') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Summary exported to {output_path}")
        
        return summary


def setup_wandb(api_key: Optional[str] = None):
    """Setup W&B with API key"""
    
    if api_key:
        os.environ["WANDB_API_KEY"] = api_key
        wandb.login(key=api_key)
        print("✅ W&B API key configured")
    else:
        # Try to login with existing key
        try:
            wandb.login()
            print("✅ W&B already configured")
        except:
            print("⚠️  W&B not configured. Run: wandb login")


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="W&B Integration Tools")
    subparsers = parser.add_subparsers(dest="command")
    
    # Setup command
    setup_parser = subparsers.add_parser("setup", help="Setup W&B")
    setup_parser.add_argument("--api-key", help="W&B API key")
    
    # Export command
    export_parser = subparsers.add_parser("export", help="Export runs summary")
    export_parser.add_argument("--output", default="wandb_summary.json")
    
    # Best model command
    best_parser = subparsers.add_parser("best", help="Get best model")
    best_parser.add_argument("--metric", default="benchmark/overall_score")
    
    args = parser.parse_args()
    
    if args.command == "setup":
        setup_wandb(args.api_key)
    
    elif args.command == "export":
        tracker = WandBExperimentTracker()
        tracker.export_summary(args.output)
    
    elif args.command == "best":
        tracker = WandBExperimentTracker()
        best_run = tracker.get_best_model(metric=args.metric)
        
        if best_run:
            print(f"🏆 Best Model: {best_run.name}")
            print(f"   Score: {best_run.summary[args.metric]:.2%}")
            print(f"   URL: {best_run.url}")
        else:
            print("No runs found")


if __name__ == "__main__":
    main()
