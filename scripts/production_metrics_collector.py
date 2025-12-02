import json
import time
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np


class ProductionMetricsCollector:
    """Collect and analyze production metrics for dynamic weight adjustment"""
    
    def __init__(self, metrics_dir: str = "production_metrics"):
        self.metrics_dir = Path(metrics_dir)
        self.metrics_dir.mkdir(exist_ok=True)
        self.metrics_file = self.metrics_dir / "metrics.jsonl"
        self.summary_file = self.metrics_dir / "summary.json"
        
    def log_inference(
        self,
        model_version: str,
        request_id: str,
        accuracy_score: Optional[float] = None,
        inference_time: float = 0.0,
        model_size: float = 0.0,
        user_satisfaction: Optional[int] = None,
        error: Optional[str] = None,
        metadata: Optional[Dict] = None
    ):
        """Log a single inference event"""
        
        metric = {
            "timestamp": datetime.utcnow().isoformat(),
            "model_version": model_version,
            "request_id": request_id,
            "accuracy_score": accuracy_score,
            "inference_time": inference_time,
            "model_size": model_size,
            "user_satisfaction": user_satisfaction,
            "error": error,
            "metadata": metadata or {}
        }
        
        with open(self.metrics_file, "a") as f:
            f.write(json.dumps(metric, ensure_ascii=False) + "\n")
    
    def get_recent_metrics(
        self,
        hours: int = 24,
        model_version: Optional[str] = None
    ) -> List[Dict]:
        """Get metrics from recent time period"""
        
        if not self.metrics_file.exists():
            return []
        
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        recent_metrics = []
        
        with open(self.metrics_file, "r") as f:
            for line in f:
                metric = json.loads(line)
                metric_time = datetime.fromisoformat(metric["timestamp"])
                
                if metric_time >= cutoff_time:
                    if model_version is None or metric["model_version"] == model_version:
                        recent_metrics.append(metric)
        
        return recent_metrics
    
    def calculate_performance_stats(
        self,
        metrics: List[Dict]
    ) -> Dict[str, Any]:
        """Calculate performance statistics from metrics"""
        
        if not metrics:
            return {
                "count": 0,
                "accuracy": {"mean": 0, "std": 0, "p95": 0},
                "speed": {"mean": 0, "std": 0, "p95": 0},
                "model_size": 0,
                "error_rate": 0,
                "user_satisfaction": {"mean": 0, "count": 0}
            }
        
        # Extract values
        accuracies = [m["accuracy_score"] for m in metrics if m["accuracy_score"] is not None]
        speeds = [m["inference_time"] for m in metrics if m["inference_time"] > 0]
        sizes = [m["model_size"] for m in metrics if m["model_size"] > 0]
        errors = [m for m in metrics if m["error"] is not None]
        satisfactions = [m["user_satisfaction"] for m in metrics if m["user_satisfaction"] is not None]
        
        stats = {
            "count": len(metrics),
            "accuracy": {
                "mean": np.mean(accuracies) if accuracies else 0,
                "std": np.std(accuracies) if accuracies else 0,
                "p95": np.percentile(accuracies, 95) if accuracies else 0,
                "min": np.min(accuracies) if accuracies else 0,
                "max": np.max(accuracies) if accuracies else 0
            },
            "speed": {
                "mean": np.mean(speeds) if speeds else 0,
                "std": np.std(speeds) if speeds else 0,
                "p95": np.percentile(speeds, 95) if speeds else 0,
                "min": np.min(speeds) if speeds else 0,
                "max": np.max(speeds) if speeds else 0
            },
            "model_size": np.mean(sizes) if sizes else 0,
            "error_rate": len(errors) / len(metrics) if metrics else 0,
            "user_satisfaction": {
                "mean": np.mean(satisfactions) if satisfactions else 0,
                "count": len(satisfactions)
            }
        }
        
        return stats
    
    def detect_performance_issues(
        self,
        current_stats: Dict,
        baseline_stats: Dict,
        thresholds: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Detect performance degradation"""
        
        if thresholds is None:
            thresholds = {
                "accuracy_drop": 0.05,  # 5% drop
                "speed_increase": 0.20,  # 20% slower
                "error_rate_increase": 0.10  # 10% more errors
            }
        
        issues = []
        severity = "ok"
        
        # Check accuracy
        if baseline_stats["accuracy"]["mean"] > 0:
            acc_change = (current_stats["accuracy"]["mean"] - baseline_stats["accuracy"]["mean"]) / baseline_stats["accuracy"]["mean"]
            if acc_change < -thresholds["accuracy_drop"]:
                issues.append({
                    "type": "accuracy_degradation",
                    "current": current_stats["accuracy"]["mean"],
                    "baseline": baseline_stats["accuracy"]["mean"],
                    "change": acc_change,
                    "severity": "high"
                })
                severity = "high"
        
        # Check speed
        if baseline_stats["speed"]["mean"] > 0:
            speed_change = (current_stats["speed"]["mean"] - baseline_stats["speed"]["mean"]) / baseline_stats["speed"]["mean"]
            if speed_change > thresholds["speed_increase"]:
                issues.append({
                    "type": "speed_degradation",
                    "current": current_stats["speed"]["mean"],
                    "baseline": baseline_stats["speed"]["mean"],
                    "change": speed_change,
                    "severity": "medium"
                })
                if severity == "ok":
                    severity = "medium"
        
        # Check error rate
        error_change = current_stats["error_rate"] - baseline_stats["error_rate"]
        if error_change > thresholds["error_rate_increase"]:
            issues.append({
                "type": "error_rate_increase",
                "current": current_stats["error_rate"],
                "baseline": baseline_stats["error_rate"],
                "change": error_change,
                "severity": "high"
            })
            severity = "high"
        
        return {
            "has_issues": len(issues) > 0,
            "severity": severity,
            "issues": issues,
            "recommendations": self._generate_recommendations(issues)
        }
    
    def _generate_recommendations(self, issues: List[Dict]) -> List[str]:
        """Generate recommendations based on issues"""
        
        recommendations = []
        
        for issue in issues:
            if issue["type"] == "accuracy_degradation":
                recommendations.append(
                    f"Accuracy dropped by {abs(issue['change']):.1%}. Consider:\n"
                    "  - Increase accuracy weight in next sweep\n"
                    "  - Retrain with more recent data\n"
                    "  - Review failed test cases"
                )
            
            elif issue["type"] == "speed_degradation":
                recommendations.append(
                    f"Speed degraded by {issue['change']:.1%}. Consider:\n"
                    "  - Increase speed weight in next sweep\n"
                    "  - Optimize model size\n"
                    "  - Use model quantization"
                )
            
            elif issue["type"] == "error_rate_increase":
                recommendations.append(
                    f"Error rate increased to {issue['current']:.1%}. Consider:\n"
                    "  - Investigate error patterns\n"
                    "  - Add error handling\n"
                    "  - Rollback to previous version"
                )
        
        return recommendations
    
    def update_summary(self):
        """Update summary statistics"""
        
        recent_metrics = self.get_recent_metrics(hours=24)
        weekly_metrics = self.get_recent_metrics(hours=168)
        
        summary = {
            "last_updated": datetime.utcnow().isoformat(),
            "last_24h": self.calculate_performance_stats(recent_metrics),
            "last_7d": self.calculate_performance_stats(weekly_metrics)
        }
        
        with open(self.summary_file, "w") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        return summary


class DynamicWeightAdjuster:
    """Automatically adjust sweep objective weights based on production metrics"""
    
    def __init__(
        self,
        metrics_collector: ProductionMetricsCollector,
        initial_weights: Optional[Dict[str, float]] = None
    ):
        self.collector = metrics_collector
        self.weights_history = []
        
        if initial_weights is None:
            self.current_weights = {
                "accuracy": 0.5,
                "speed": 0.3,
                "model_size": 0.2
            }
        else:
            self.current_weights = initial_weights
        
        self.weights_file = Path("adaptive_weights.json")
        self._load_weights_history()
    
    def _load_weights_history(self):
        """Load weights history from file"""
        
        if self.weights_file.exists():
            with open(self.weights_file, "r") as f:
                data = json.load(f)
                self.weights_history = data.get("history", [])
                self.current_weights = data.get("current", self.current_weights)
    
    def _save_weights_history(self):
        """Save weights history to file"""
        
        with open(self.weights_file, "w") as f:
            json.dump({
                "current": self.current_weights,
                "history": self.weights_history
            }, f, indent=2)
    
    def adjust_weights(
        self,
        production_stats: Dict,
        baseline_stats: Dict,
        adjustment_rate: float = 0.1
    ) -> Dict[str, float]:
        """Adjust weights based on production performance"""
        
        new_weights = self.current_weights.copy()
        adjustments = []
        
        # Accuracy adjustment
        if baseline_stats["accuracy"]["mean"] > 0:
            acc_change = (production_stats["accuracy"]["mean"] - baseline_stats["accuracy"]["mean"]) / baseline_stats["accuracy"]["mean"]
            
            if acc_change < -0.03:  # 3% drop
                # Increase accuracy weight
                adjustment = adjustment_rate * abs(acc_change)
                new_weights["accuracy"] = min(0.8, new_weights["accuracy"] + adjustment)
                adjustments.append(f"Increased accuracy weight by {adjustment:.2f} due to {acc_change:.1%} accuracy drop")
            
            elif acc_change > 0.05:  # 5% improvement
                # Can reduce accuracy weight slightly
                adjustment = adjustment_rate * 0.5
                new_weights["accuracy"] = max(0.3, new_weights["accuracy"] - adjustment)
                adjustments.append(f"Decreased accuracy weight by {adjustment:.2f} due to {acc_change:.1%} accuracy improvement")
        
        # Speed adjustment
        if baseline_stats["speed"]["mean"] > 0:
            speed_change = (production_stats["speed"]["mean"] - baseline_stats["speed"]["mean"]) / baseline_stats["speed"]["mean"]
            
            if speed_change > 0.15:  # 15% slower
                # Increase speed weight
                adjustment = adjustment_rate * speed_change
                new_weights["speed"] = min(0.7, new_weights["speed"] + adjustment)
                adjustments.append(f"Increased speed weight by {adjustment:.2f} due to {speed_change:.1%} speed degradation")
            
            elif speed_change < -0.20:  # 20% faster
                # Can reduce speed weight slightly
                adjustment = adjustment_rate * 0.5
                new_weights["speed"] = max(0.1, new_weights["speed"] - adjustment)
                adjustments.append(f"Decreased speed weight by {adjustment:.2f} due to {abs(speed_change):.1%} speed improvement")
        
        # Model size adjustment based on error rate
        error_change = production_stats["error_rate"] - baseline_stats["error_rate"]
        
        if error_change > 0.05:  # 5% more errors
            # Might need larger model for reliability
            adjustment = adjustment_rate * error_change
            new_weights["model_size"] = max(0.1, new_weights["model_size"] - adjustment)
            adjustments.append(f"Decreased model_size weight by {adjustment:.2f} due to increased error rate")
        
        # Normalize weights to sum to 1.0
        total = sum(new_weights.values())
        new_weights = {k: v / total for k, v in new_weights.items()}
        
        # Record adjustment
        self.weights_history.append({
            "timestamp": datetime.utcnow().isoformat(),
            "old_weights": self.current_weights,
            "new_weights": new_weights,
            "adjustments": adjustments,
            "production_stats": production_stats,
            "baseline_stats": baseline_stats
        })
        
        self.current_weights = new_weights
        self._save_weights_history()
        
        return {
            "weights": new_weights,
            "adjustments": adjustments,
            "changed": new_weights != self.current_weights
        }
    
    def get_recommended_sweep_config(self) -> Dict:
        """Generate sweep config with current weights"""
        
        return {
            "method": "bayes",
            "metric": {
                "name": "pareto_score",
                "goal": "maximize"
            },
            "parameters": {
                "lora_r": {"values": [32, 64, 128]},
                "lora_alpha": {"values": [32, 64, 128, 256]},
                "lora_dropout": {"min": 0.0, "max": 0.1},
                "learning_rate": {"min": 0.00005, "max": 0.0005},
                "batch_size": {"values": [2, 4, 8]},
                "num_epochs": {"values": [2, 3, 4, 5]},
                "optimizer": {"values": ["adamw_torch", "adamw_8bit"]},
                "lr_scheduler_type": {"values": ["linear", "cosine", "constant"]},
                "warmup_ratio": {"min": 0.0, "max": 0.1},
                "weight_decay": {"min": 0.0, "max": 0.1},
                "gradient_accumulation_steps": {"values": [1, 2, 4]},
                "max_grad_norm": {"min": 0.5, "max": 2.0}
            },
            "objective_weights": self.current_weights,
            "early_terminate": {
                "type": "hyperband",
                "min_iter": 3,
                "eta": 2
            }
        }
    
    def should_trigger_new_sweep(
        self,
        production_stats: Dict,
        baseline_stats: Dict,
        last_sweep_time: Optional[datetime] = None,
        min_sweep_interval_hours: int = 168  # 1 week
    ) -> Dict[str, Any]:
        """Determine if a new sweep should be triggered"""
        
        should_sweep = False
        reasons = []
        
        # Check if enough time has passed
        if last_sweep_time:
            time_since_sweep = (datetime.utcnow() - last_sweep_time).total_seconds() / 3600
            if time_since_sweep < min_sweep_interval_hours:
                return {
                    "should_sweep": False,
                    "reasons": [f"Last sweep was {time_since_sweep:.1f} hours ago (minimum {min_sweep_interval_hours}h)"]
                }
        
        # Check for performance degradation
        issues = self.collector.detect_performance_issues(production_stats, baseline_stats)
        
        if issues["has_issues"] and issues["severity"] in ["high", "medium"]:
            should_sweep = True
            reasons.append(f"Performance issues detected (severity: {issues['severity']})")
            reasons.extend([issue["type"] for issue in issues["issues"]])
        
        # Check if weights have changed significantly
        if self.weights_history:
            last_weights = self.weights_history[-1]["old_weights"]
            weight_change = sum(abs(self.current_weights[k] - last_weights[k]) for k in self.current_weights)
            
            if weight_change > 0.15:  # 15% total weight change
                should_sweep = True
                reasons.append(f"Significant weight change detected ({weight_change:.1%})")
        
        return {
            "should_sweep": should_sweep,
            "reasons": reasons,
            "current_weights": self.current_weights,
            "recommended_config": self.get_recommended_sweep_config() if should_sweep else None
        }


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Dynamic Weight Adjustment System")
    subparsers = parser.add_subparsers(dest="command")
    
    # Log inference
    log_parser = subparsers.add_parser("log", help="Log inference metric")
    log_parser.add_argument("--model-version", required=True)
    log_parser.add_argument("--request-id", required=True)
    log_parser.add_argument("--accuracy", type=float)
    log_parser.add_argument("--time", type=float, required=True)
    log_parser.add_argument("--size", type=float)
    
    # Update summary
    summary_parser = subparsers.add_parser("summary", help="Update summary")
    
    # Adjust weights
    adjust_parser = subparsers.add_parser("adjust", help="Adjust weights")
    adjust_parser.add_argument("--baseline-hours", type=int, default=168)
    
    # Check if sweep needed
    check_parser = subparsers.add_parser("check", help="Check if sweep needed")
    
    args = parser.parse_args()
    
    collector = ProductionMetricsCollector()
    
    if args.command == "log":
        collector.log_inference(
            model_version=args.model_version,
            request_id=args.request_id,
            accuracy_score=args.accuracy,
            inference_time=args.time,
            model_size=args.size
        )
        print("✅ Metric logged")
    
    elif args.command == "summary":
        summary = collector.update_summary()
        print(f"\n📊 Summary Updated")
        print(f"Last 24h: {summary['last_24h']['count']} requests")
        print(f"Accuracy: {summary['last_24h']['accuracy']['mean']:.2%}")
        print(f"Speed: {summary['last_24h']['speed']['mean']:.2f}s")
    
    elif args.command == "adjust":
        current_metrics = collector.get_recent_metrics(hours=24)
        baseline_metrics = collector.get_recent_metrics(hours=args.baseline_hours)
        
        current_stats = collector.calculate_performance_stats(current_metrics)
        baseline_stats = collector.calculate_performance_stats(baseline_metrics)
        
        adjuster = DynamicWeightAdjuster(collector)
        result = adjuster.adjust_weights(current_stats, baseline_stats)
        
        print(f"\n⚖️  Weight Adjustment")
        print(f"Changed: {result['changed']}")
        print(f"\nNew Weights:")
        for k, v in result['weights'].items():
            print(f"  {k}: {v:.2%}")
        
        if result['adjustments']:
            print(f"\nAdjustments:")
            for adj in result['adjustments']:
                print(f"  - {adj}")
    
    elif args.command == "check":
        current_metrics = collector.get_recent_metrics(hours=24)
        baseline_metrics = collector.get_recent_metrics(hours=168)
        
        current_stats = collector.calculate_performance_stats(current_metrics)
        baseline_stats = collector.calculate_performance_stats(baseline_metrics)
        
        adjuster = DynamicWeightAdjuster(collector)
        result = adjuster.should_trigger_new_sweep(current_stats, baseline_stats)
        
        print(f"\n🔍 Sweep Check")
        print(f"Should Sweep: {'✅ Yes' if result['should_sweep'] else '❌ No'}")
        
        if result['reasons']:
            print(f"\nReasons:")
            for reason in result['reasons']:
                print(f"  - {reason}")
        
        if result['recommended_config']:
            print(f"\n⚙️  Recommended Weights:")
            for k, v in result['current_weights'].items():
                print(f"  {k}: {v:.2%}")


if __name__ == "__main__":
    main()
