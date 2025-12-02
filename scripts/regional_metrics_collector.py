import json
import time
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np


class RegionalMetricsCollector:
    """Collect and analyze production metrics separately for different geographic regions"""
    
    REGIONS = {
        "baku": "Bakı",
        "ganja": "Gəncə",
        "sumqayit": "Sumqayıt",
        "mingachevir": "Mingəçevir",
        "shirvan": "Şirvan",
        "lankaran": "Lənkəran",
        "nakhchivan": "Naxçıvan",
        "sheki": "Şəki",
        "yevlakh": "Yevlax",
        "other": "Digər"
    }
    
    def __init__(self, metrics_dir: str = "regional_metrics"):
        self.metrics_dir = Path(metrics_dir)
        self.metrics_dir.mkdir(exist_ok=True)
        
        for region in self.REGIONS.keys():
            region_dir = self.metrics_dir / region
            region_dir.mkdir(exist_ok=True)
        
        self.global_metrics_file = self.metrics_dir / "global_metrics.jsonl"
        self.regional_summary_file = self.metrics_dir / "regional_summary.json"
    
    def detect_region(self, ip_address: Optional[str] = None, metadata: Optional[Dict] = None) -> str:
        """Detect user's region from IP or metadata"""
        
        if metadata and "region" in metadata:
            region = metadata["region"].lower()
            if region in self.REGIONS:
                return region
        
        if metadata and "city" in metadata:
            city = metadata["city"].lower()
            for region_code, region_name in self.REGIONS.items():
                if city in region_name.lower() or region_code in city:
                    return region_code
        
        if ip_address:
            ip_parts = ip_address.split(".")
            if len(ip_parts) == 4:
                first_octet = int(ip_parts[0])
                
                if 5 <= first_octet <= 20:
                    return "baku"
                elif 21 <= first_octet <= 30:
                    return "ganja"
                elif 31 <= first_octet <= 40:
                    return "sumqayit"
                elif 41 <= first_octet <= 50:
                    return "other"
        
        return "other"
    
    def log_inference(
        self,
        model_version: str,
        request_id: str,
        region: Optional[str] = None,
        ip_address: Optional[str] = None,
        accuracy_score: Optional[float] = None,
        inference_time: float = 0.0,
        model_size: float = 0.0,
        user_satisfaction: Optional[int] = None,
        error: Optional[str] = None,
        metadata: Optional[Dict] = None
    ):
        """Log a single inference event with regional information"""
        
        if region is None:
            region = self.detect_region(ip_address, metadata)
        
        if region not in self.REGIONS:
            region = "other"
        
        metric = {
            "timestamp": datetime.utcnow().isoformat(),
            "model_version": model_version,
            "request_id": request_id,
            "region": region,
            "region_name": self.REGIONS[region],
            "accuracy_score": accuracy_score,
            "inference_time": inference_time,
            "model_size": model_size,
            "user_satisfaction": user_satisfaction,
            "error": error,
            "metadata": metadata or {},
            "ip_address": ip_address
        }
        
        region_file = self.metrics_dir / region / "metrics.jsonl"
        with open(region_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(metric, ensure_ascii=False) + "\n")
        
        with open(self.global_metrics_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(metric, ensure_ascii=False) + "\n")
    
    def get_regional_metrics(
        self,
        region: str,
        hours: int = 24,
        model_version: Optional[str] = None
    ) -> List[Dict]:
        """Get metrics for a specific region"""
        
        if region not in self.REGIONS:
            return []
        
        region_file = self.metrics_dir / region / "metrics.jsonl"
        if not region_file.exists():
            return []
        
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        regional_metrics = []
        
        with open(region_file, "r", encoding="utf-8") as f:
            for line in f:
                metric = json.loads(line)
                metric_time = datetime.fromisoformat(metric["timestamp"])
                
                if metric_time >= cutoff_time:
                    if model_version is None or metric["model_version"] == model_version:
                        regional_metrics.append(metric)
        
        return regional_metrics
    
    def get_all_regional_metrics(
        self,
        hours: int = 24,
        model_version: Optional[str] = None
    ) -> Dict[str, List[Dict]]:
        """Get metrics for all regions"""
        
        all_metrics = {}
        for region in self.REGIONS.keys():
            all_metrics[region] = self.get_regional_metrics(region, hours, model_version)
        
        return all_metrics
    
    def calculate_performance_stats(self, metrics: List[Dict]) -> Dict[str, Any]:
        """Calculate performance statistics from metrics"""
        
        if not metrics:
            return {
                "count": 0,
                "accuracy": {"mean": 0, "std": 0, "p95": 0, "min": 0, "max": 0},
                "speed": {"mean": 0, "std": 0, "p95": 0, "min": 0, "max": 0},
                "model_size": 0,
                "error_rate": 0,
                "user_satisfaction": {"mean": 0, "count": 0}
            }
        
        accuracies = [m["accuracy_score"] for m in metrics if m["accuracy_score"] is not None]
        speeds = [m["inference_time"] for m in metrics if m["inference_time"] > 0]
        sizes = [m["model_size"] for m in metrics if m["model_size"] > 0]
        errors = [m for m in metrics if m["error"] is not None]
        satisfactions = [m["user_satisfaction"] for m in metrics if m["user_satisfaction"] is not None]
        
        stats = {
            "count": len(metrics),
            "accuracy": {
                "mean": float(np.mean(accuracies)) if accuracies else 0,
                "std": float(np.std(accuracies)) if accuracies else 0,
                "p95": float(np.percentile(accuracies, 95)) if accuracies else 0,
                "min": float(np.min(accuracies)) if accuracies else 0,
                "max": float(np.max(accuracies)) if accuracies else 0
            },
            "speed": {
                "mean": float(np.mean(speeds)) if speeds else 0,
                "std": float(np.std(speeds)) if speeds else 0,
                "p95": float(np.percentile(speeds, 95)) if speeds else 0,
                "min": float(np.min(speeds)) if speeds else 0,
                "max": float(np.max(speeds)) if speeds else 0
            },
            "model_size": float(np.mean(sizes)) if sizes else 0,
            "error_rate": len(errors) / len(metrics) if metrics else 0,
            "user_satisfaction": {
                "mean": float(np.mean(satisfactions)) if satisfactions else 0,
                "count": len(satisfactions)
            }
        }
        
        return stats
    
    def compare_regions(
        self,
        hours: int = 24,
        metric_name: str = "accuracy"
    ) -> Dict[str, Any]:
        """Compare performance across regions"""
        
        regional_stats = {}
        
        for region in self.REGIONS.keys():
            metrics = self.get_regional_metrics(region, hours)
            stats = self.calculate_performance_stats(metrics)
            regional_stats[region] = stats
        
        best_region = None
        worst_region = None
        best_value = float('-inf')
        worst_value = float('inf')
        
        for region, stats in regional_stats.items():
            if stats["count"] == 0:
                continue
            
            if metric_name == "accuracy":
                value = stats["accuracy"]["mean"]
                if value > best_value:
                    best_value = value
                    best_region = region
                if value < worst_value:
                    worst_value = value
                    worst_region = region
            
            elif metric_name == "speed":
                value = stats["speed"]["mean"]
                if value > 0:
                    if worst_value == float('inf') or value > worst_value:
                        worst_value = value
                        worst_region = region
                    if value < best_value or best_value == float('-inf'):
                        best_value = value
                        best_region = region
        
        return {
            "regional_stats": regional_stats,
            "best_region": best_region,
            "best_value": best_value,
            "worst_region": worst_region,
            "worst_value": worst_value,
            "metric": metric_name
        }
    
    def detect_regional_disparities(
        self,
        hours: int = 24,
        threshold: float = 0.10
    ) -> Dict[str, Any]:
        """Detect significant performance disparities between regions"""
        
        comparison = self.compare_regions(hours, "accuracy")
        disparities = []
        
        regional_stats = comparison["regional_stats"]
        
        accuracies = []
        speeds = []
        regions_with_data = []
        
        for region, stats in regional_stats.items():
            if stats["count"] > 0:
                accuracies.append(stats["accuracy"]["mean"])
                speeds.append(stats["speed"]["mean"])
                regions_with_data.append(region)
        
        if len(accuracies) < 2:
            return {
                "has_disparities": False,
                "disparities": [],
                "recommendations": []
            }
        
        mean_accuracy = np.mean(accuracies)
        mean_speed = np.mean(speeds)
        
        for region, stats in regional_stats.items():
            if stats["count"] == 0:
                continue
            
            acc_diff = abs(stats["accuracy"]["mean"] - mean_accuracy) / mean_accuracy if mean_accuracy > 0 else 0
            speed_diff = abs(stats["speed"]["mean"] - mean_speed) / mean_speed if mean_speed > 0 else 0
            
            if acc_diff > threshold:
                disparities.append({
                    "region": region,
                    "region_name": self.REGIONS[region],
                    "type": "accuracy",
                    "value": stats["accuracy"]["mean"],
                    "mean": mean_accuracy,
                    "difference": acc_diff,
                    "severity": "high" if acc_diff > threshold * 2 else "medium"
                })
            
            if speed_diff > threshold:
                disparities.append({
                    "region": region,
                    "region_name": self.REGIONS[region],
                    "type": "speed",
                    "value": stats["speed"]["mean"],
                    "mean": mean_speed,
                    "difference": speed_diff,
                    "severity": "high" if speed_diff > threshold * 2 else "medium"
                })
        
        recommendations = self._generate_regional_recommendations(disparities)
        
        return {
            "has_disparities": len(disparities) > 0,
            "disparities": disparities,
            "recommendations": recommendations,
            "summary": {
                "total_regions_analyzed": len(regions_with_data),
                "regions_with_issues": len(set(d["region"] for d in disparities)),
                "mean_accuracy": mean_accuracy,
                "mean_speed": mean_speed
            }
        }
    
    def _generate_regional_recommendations(self, disparities: List[Dict]) -> List[str]:
        """Generate recommendations based on regional disparities"""
        
        recommendations = []
        
        accuracy_issues = [d for d in disparities if d["type"] == "accuracy"]
        speed_issues = [d for d in disparities if d["type"] == "speed"]
        
        if accuracy_issues:
            worst_acc_region = max(accuracy_issues, key=lambda x: x["difference"])
            recommendations.append(
                f"⚠️ {worst_acc_region['region_name']} has significantly lower accuracy "
                f"({worst_acc_region['value']:.1%} vs {worst_acc_region['mean']:.1%}). "
                f"Consider:\n"
                f"  - Check regional data quality\n"
                f"  - Add region-specific training data\n"
                f"  - Investigate user behavior patterns"
            )
        
        if speed_issues:
            worst_speed_region = max(speed_issues, key=lambda x: x["difference"])
            recommendations.append(
                f"⚠️ {worst_speed_region['region_name']} has significantly slower inference "
                f"({worst_speed_region['value']:.2f}s vs {worst_speed_region['mean']:.2f}s). "
                f"Consider:\n"
                f"  - Check network latency\n"
                f"  - Deploy regional CDN/edge servers\n"
                f"  - Optimize model for edge deployment"
            )
        
        high_severity = [d for d in disparities if d["severity"] == "high"]
        if high_severity:
            recommendations.append(
                f"🚨 Critical: {len(high_severity)} regions with severe performance issues. "
                f"Immediate action required!"
            )
        
        return recommendations
    
    def update_regional_summary(self):
        """Update comprehensive regional summary"""
        
        summary = {
            "last_updated": datetime.utcnow().isoformat(),
            "regions": {}
        }
        
        for region in self.REGIONS.keys():
            metrics_24h = self.get_regional_metrics(region, hours=24)
            metrics_7d = self.get_regional_metrics(region, hours=168)
            
            summary["regions"][region] = {
                "name": self.REGIONS[region],
                "last_24h": self.calculate_performance_stats(metrics_24h),
                "last_7d": self.calculate_performance_stats(metrics_7d)
            }
        
        comparison = self.compare_regions(hours=24, metric_name="accuracy")
        disparities = self.detect_regional_disparities(hours=24)
        
        summary["comparison"] = comparison
        summary["disparities"] = disparities
        
        with open(self.regional_summary_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        return summary
    
    def get_regional_weights(self) -> Dict[str, Dict[str, float]]:
        """Calculate region-specific optimization weights"""
        
        regional_weights = {}
        
        for region in self.REGIONS.keys():
            metrics = self.get_regional_metrics(region, hours=168)
            stats = self.calculate_performance_stats(metrics)
            
            if stats["count"] < 10:
                regional_weights[region] = {
                    "accuracy": 0.5,
                    "speed": 0.3,
                    "model_size": 0.2
                }
                continue
            
            accuracy = stats["accuracy"]["mean"]
            speed = stats["speed"]["mean"]
            error_rate = stats["error_rate"]
            
            acc_weight = 0.5
            speed_weight = 0.3
            size_weight = 0.2
            
            if accuracy < 0.85:
                acc_weight += 0.15
                speed_weight -= 0.10
                size_weight -= 0.05
            
            if speed > 5.0:
                speed_weight += 0.15
                acc_weight -= 0.10
                size_weight -= 0.05
            
            if error_rate > 0.05:
                size_weight -= 0.10
                acc_weight += 0.10
            
            total = acc_weight + speed_weight + size_weight
            regional_weights[region] = {
                "accuracy": acc_weight / total,
                "speed": speed_weight / total,
                "model_size": size_weight / total
            }
        
        return regional_weights


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Regional Metrics Collector")
    subparsers = parser.add_subparsers(dest="command")
    
    log_parser = subparsers.add_parser("log", help="Log inference metric")
    log_parser.add_argument("--model-version", required=True)
    log_parser.add_argument("--request-id", required=True)
    log_parser.add_argument("--region", help="Region code")
    log_parser.add_argument("--ip", help="IP address")
    log_parser.add_argument("--accuracy", type=float)
    log_parser.add_argument("--time", type=float, required=True)
    log_parser.add_argument("--size", type=float)
    
    summary_parser = subparsers.add_parser("summary", help="Update summary")
    
    compare_parser = subparsers.add_parser("compare", help="Compare regions")
    compare_parser.add_argument("--metric", default="accuracy", choices=["accuracy", "speed"])
    compare_parser.add_argument("--hours", type=int, default=24)
    
    disparities_parser = subparsers.add_parser("disparities", help="Detect disparities")
    disparities_parser.add_argument("--hours", type=int, default=24)
    disparities_parser.add_argument("--threshold", type=float, default=0.10)
    
    weights_parser = subparsers.add_parser("weights", help="Get regional weights")
    
    args = parser.parse_args()
    
    collector = RegionalMetricsCollector()
    
    if args.command == "log":
        collector.log_inference(
            model_version=args.model_version,
            request_id=args.request_id,
            region=args.region,
            ip_address=args.ip,
            accuracy_score=args.accuracy,
            inference_time=args.time,
            model_size=args.size
        )
        print("✅ Regional metric logged")
    
    elif args.command == "summary":
        summary = collector.update_regional_summary()
        print(f"\n📊 Regional Summary Updated")
        print(f"Last Updated: {summary['last_updated']}")
        print(f"\nRegional Stats:")
        for region, data in summary["regions"].items():
            stats = data["last_24h"]
            if stats["count"] > 0:
                print(f"\n{data['name']} ({region}):")
                print(f"  Requests: {stats['count']}")
                print(f"  Accuracy: {stats['accuracy']['mean']:.2%}")
                print(f"  Speed: {stats['speed']['mean']:.2f}s")
    
    elif args.command == "compare":
        comparison = collector.compare_regions(args.hours, args.metric)
        print(f"\n🔍 Regional Comparison ({args.metric})")
        print(f"{'='*60}")
        
        if comparison["best_region"]:
            print(f"\n🏆 Best: {collector.REGIONS[comparison['best_region']]}")
            print(f"   Value: {comparison['best_value']:.2%}" if args.metric == "accuracy" else f"   Value: {comparison['best_value']:.2f}s")
        
        if comparison["worst_region"]:
            print(f"\n📉 Worst: {collector.REGIONS[comparison['worst_region']]}")
            print(f"   Value: {comparison['worst_value']:.2%}" if args.metric == "accuracy" else f"   Value: {comparison['worst_value']:.2f}s")
        
        print(f"\n{'='*60}")
        print(f"All Regions:")
        for region, stats in comparison["regional_stats"].items():
            if stats["count"] > 0:
                value = stats[args.metric]["mean"]
                print(f"  {collector.REGIONS[region]}: ", end="")
                print(f"{value:.2%} ({stats['count']} requests)" if args.metric == "accuracy" else f"{value:.2f}s ({stats['count']} requests)")
    
    elif args.command == "disparities":
        result = collector.detect_regional_disparities(args.hours, args.threshold)
        print(f"\n⚠️  Regional Disparities Analysis")
        print(f"{'='*60}")
        
        if result["has_disparities"]:
            print(f"\n🚨 {len(result['disparities'])} disparities detected!")
            
            for disparity in result["disparities"]:
                print(f"\n{disparity['region_name']} - {disparity['type'].upper()}")
                print(f"  Current: {disparity['value']:.2%}" if disparity['type'] == 'accuracy' else f"  Current: {disparity['value']:.2f}s")
                print(f"  Mean: {disparity['mean']:.2%}" if disparity['type'] == 'accuracy' else f"  Mean: {disparity['mean']:.2f}s")
                print(f"  Difference: {disparity['difference']:.1%}")
                print(f"  Severity: {disparity['severity']}")
            
            print(f"\n💡 Recommendations:")
            for rec in result["recommendations"]:
                print(f"\n{rec}")
        else:
            print(f"\n✅ No significant disparities detected")
            print(f"All regions performing within {args.threshold:.0%} of mean")
    
    elif args.command == "weights":
        weights = collector.get_regional_weights()
        print(f"\n⚖️  Regional Optimization Weights")
        print(f"{'='*60}")
        
        for region, region_weights in weights.items():
            print(f"\n{collector.REGIONS[region]} ({region}):")
            for metric, weight in region_weights.items():
                print(f"  {metric}: {weight:.2%}")


if __name__ == "__main__":
    main()
