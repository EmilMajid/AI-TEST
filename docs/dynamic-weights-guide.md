# Dynamic Weight Adjustment System

## Overview

The Dynamic Weight Adjustment System automatically optimizes hyperparameter sweep objective weights based on real production performance metrics. This creates a feedback loop where your optimization strategy adapts to actual usage patterns.

## How It Works

### 1. Production Metrics Collection

Every inference request is logged with:
- Accuracy score (if available)
- Inference time
- Model size
- Errors (if any)
- User satisfaction (optional)

\`\`\`python
from production_metrics_collector import ProductionMetricsCollector

collector = ProductionMetricsCollector()

collector.log_inference(
    model_version="v1_20241016_153045",
    request_id="req_abc123",
    accuracy_score=0.92,
    inference_time=3.2,
    model_size=8.4,
    user_satisfaction=5  # 1-5 scale
)
\`\`\`

### 2. Performance Analysis

System continuously analyzes:
- **Accuracy trends**: Is quality degrading?
- **Speed performance**: Is inference getting slower?
- **Error rates**: Are failures increasing?
- **User satisfaction**: Are users happy?

### 3. Automatic Weight Adjustment

When issues are detected, weights are automatically adjusted:

\`\`\`python
from production_metrics_collector import DynamicWeightAdjuster

adjuster = DynamicWeightAdjuster(collector)

# Automatically adjust weights
result = adjuster.adjust_weights(
    production_stats=current_stats,
    baseline_stats=baseline_stats
)

# Example adjustment scenarios:
# - Accuracy drops 5% → Increase accuracy weight
# - Speed degrades 20% → Increase speed weight
# - Error rate rises → Adjust model size weight
\`\`\`

### 4. Sweep Triggering

System decides when to trigger new sweeps:

\`\`\`python
decision = adjuster.should_trigger_new_sweep(
    production_stats=current_stats,
    baseline_stats=baseline_stats
)

if decision['should_sweep']:
    print("Triggering new sweep!")
    print("Reasons:", decision['reasons'])
    print("New weights:", decision['current_weights'])
\`\`\`

## Adjustment Rules

### Accuracy-Based Adjustments

| Production Change | Action | Weight Adjustment |
|-------------------|--------|-------------------|
| Drop > 3% | Increase accuracy weight | +10% × drop ratio |
| Improve > 5% | Decrease accuracy weight | -5% |
| Within 3% | No change | 0% |

### Speed-Based Adjustments

| Production Change | Action | Weight Adjustment |
|-------------------|--------|-------------------|
| Slower > 15% | Increase speed weight | +10% × slowdown ratio |
| Faster > 20% | Decrease speed weight | -5% |
| Within 15% | No change | 0% |

### Error-Based Adjustments

| Production Change | Action | Weight Adjustment |
|-------------------|--------|-------------------|
| Error rate > 5% | Adjust model size | Variable |
| Error rate < 2% | Maintain current | 0% |

## Usage Examples

### Example 1: Automatic Monitoring

\`\`\`bash
# Setup cron job for automatic monitoring
# Run every hour
0 * * * * cd /path/to/project && python3 scripts/production_metrics_collector.py summary

# Run weight adjustment daily
0 0 * * * cd /path/to/project && python3 scripts/production_metrics_collector.py adjust

# Check if sweep needed weekly
0 0 * * 0 cd /path/to/project && python3 scripts/production_metrics_collector.py check
\`\`\`

### Example 2: Integration with API

\`\`\`python
# In your inference API
from production_metrics_collector import ProductionMetricsCollector

collector = ProductionMetricsCollector()

@app.post("/generate")
async def generate_questions(request: QuestionRequest):
    start_time = time.time()
    
    try:
        # Generate questions
        result = generator.generate(...)
        
        # Calculate accuracy (if validation available)
        accuracy = validate_questions(result.questions)
        
        # Log metrics
        collector.log_inference(
            model_version=current_model_version,
            request_id=str(uuid.uuid4()),
            accuracy_score=accuracy,
            inference_time=time.time() - start_time,
            model_size=model_size_mb
        )
        
        return result
        
    except Exception as e:
        # Log error
        collector.log_inference(
            model_version=current_model_version,
            request_id=str(uuid.uuid4()),
            inference_time=time.time() - start_time,
            error=str(e)
        )
        raise
\`\`\`

### Example 3: Scheduled Sweep Pipeline

\`\`\`python
import schedule
import time
from production_metrics_collector import ProductionMetricsCollector, DynamicWeightAdjuster
from wandb_multiobjective_sweep import MultiObjectiveSweepRunner

def check_and_sweep():
    collector = ProductionMetricsCollector()
    adjuster = DynamicWeightAdjuster(collector)
    
    # Get metrics
    current = collector.get_recent_metrics(hours=24)
    baseline = collector.get_recent_metrics(hours=168)
    
    current_stats = collector.calculate_performance_stats(current)
    baseline_stats = collector.calculate_performance_stats(baseline)
    
    # Check if sweep needed
    decision = adjuster.should_trigger_new_sweep(
        production_stats=current_stats,
        baseline_stats=baseline_stats
    )
    
    if decision['should_sweep']:
        print(f"🚀 Triggering sweep! Reasons: {decision['reasons']}")
        
        # Get recommended config with adjusted weights
        config = adjuster.get_recommended_sweep_config()
        
        # Start sweep
        runner = MultiObjectiveSweepRunner(
            dataset_path="train_dataset.jsonl",
            base_model="meta-llama/Meta-Llama-3-8B-Instruct"
        )
        
        sweep_id = runner.create_sweep_from_config(config)
        runner.start_sweep_agent(sweep_id, count=20)
        
        print(f"✅ Sweep {sweep_id} started with adjusted weights")

# Schedule to run weekly
schedule.every().sunday.at("02:00").do(check_and_sweep)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Check every hour
\`\`\`

## Real-World Scenario

### Scenario: Accuracy Degradation Detected

\`\`\`
Day 1: Production accuracy: 92%
Day 7: Production accuracy: 87% (-5%)

System detects: Accuracy drop > 3%

Automatic Actions:
1. Increase accuracy weight: 0.50 → 0.55
2. Decrease speed weight: 0.30 → 0.27
3. Decrease size weight: 0.20 → 0.18
4. Trigger new sweep with adjusted weights
5. New sweep finds model with 93% accuracy

Result: Problem automatically fixed!
\`\`\`

### Scenario: Speed Optimization Opportunity

\`\`\`
Week 1: Inference time: 4.5s
Week 4: Inference time: 3.2s (-29%)

System detects: Significant speed improvement

Automatic Actions:
1. Decrease speed weight: 0.30 → 0.25
2. Increase accuracy weight: 0.50 → 0.53
3. No immediate sweep (performance good)
4. Wait for next scheduled sweep

Result: Focus shifts to accuracy improvement
\`\`\`

## Best Practices

1. **Start Conservative**: Begin with gentle adjustment rates (10%)
2. **Monitor Closely**: Watch first few weeks of adjustments
3. **Set Thresholds**: Define what constitutes "significant" changes
4. **Regular Reviews**: Manually review adjustments monthly
5. **Document Changes**: Keep log of all automatic adjustments
6. **Test Thoroughly**: Validate new models before full deployment

## Configuration

### Adjustment Sensitivity

\`\`\`python
adjuster = DynamicWeightAdjuster(
    collector=collector,
    initial_weights={
        "accuracy": 0.5,
        "speed": 0.3,
        "model_size": 0.2
    }
)

# Adjust with custom rate
result = adjuster.adjust_weights(
    production_stats=current,
    baseline_stats=baseline,
    adjustment_rate=0.15  # 15% adjustments (more aggressive)
)
\`\`\`

### Sweep Trigger Thresholds

\`\`\`python
decision = adjuster.should_trigger_new_sweep(
    production_stats=current,
    baseline_stats=baseline,
    last_sweep_time=last_sweep,
    min_sweep_interval_hours=336  # 2 weeks minimum
)
\`\`\`

## Monitoring Dashboard

Access real-time monitoring at:
\`\`\`
http://localhost:3000/admin/production-metrics
\`\`\`

Features:
- 📊 Real-time performance metrics
- ⚖️ Current objective weights
- 📈 Adjustment history
- 🔔 Automated actions log
- 🎯 Sweep recommendations

## Conclusion

The Dynamic Weight Adjustment System creates a self-improving ML pipeline where:
- Production metrics drive optimization strategy
- Weights adapt to real-world usage patterns
- System automatically maintains optimal performance
- Minimal manual intervention required

This represents a significant advancement over static hyperparameter optimization!
