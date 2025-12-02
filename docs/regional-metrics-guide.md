# Regional Metrics System Guide

## Overview

The Regional Metrics System tracks performance separately for different geographic regions of Azerbaijan, enabling region-specific optimization and identifying performance disparities.

## Supported Regions

- **Bakı (baku)** - Capital and largest city
- **Gəncə (ganja)** - Second largest city
- **Sumqayıt (sumqayit)** - Industrial city
- **Mingəçevir (mingachevir)** - Energy hub
- **Şirvan (shirvan)** - Eastern region
- **Lənkəran (lankaran)** - Southern region
- **Naxçıvan (nakhchivan)** - Autonomous republic
- **Şəki (sheki)** - Northwestern region
- **Yevlax (yevlakh)** - Central region
- **Digər (other)** - All other areas

## Features

### 1. Automatic Region Detection

The system automatically detects user region from:
- Explicit region parameter
- IP address geolocation
- City metadata
- Fallback to "other" if unknown

### 2. Regional Performance Tracking

Each inference is logged with regional information:

\`\`\`python
from regional_metrics_collector import RegionalMetricsCollector

collector = RegionalMetricsCollector()

collector.log_inference(
    model_version="v1_20241016_153045",
    request_id="req_abc123",
    region="baku",  # Optional, auto-detected if not provided
    ip_address="5.15.25.35",  # Used for auto-detection
    accuracy_score=0.92,
    inference_time=3.2,
    model_size=8.4
)
\`\`\`

### 3. Regional Comparison

Compare performance across all regions:

\`\`\`bash
python3 scripts/regional_metrics_collector.py compare \
  --metric accuracy \
  --hours 24
\`\`\`

Output:
\`\`\`
🔍 Regional Comparison (accuracy)
============================================================

🏆 Best: Bakı
   Value: 94.2%

📉 Worst: Digər
   Value: 85.3%

============================================================
All Regions:
  Bakı: 94.2% (1250 requests)
  Gəncə: 91.8% (450 requests)
  Sumqayıt: 90.5% (380 requests)
  ...
\`\`\`

### 4. Disparity Detection

Automatically detect significant performance gaps:

\`\`\`bash
python3 scripts/regional_metrics_collector.py disparities \
  --hours 24 \
  --threshold 0.10  # 10% threshold
\`\`\`

Output:
\`\`\`
⚠️  Regional Disparities Analysis
============================================================

🚨 3 disparities detected!

Digər - ACCURACY
  Current: 85.3%
  Mean: 91.5%
  Difference: 6.8%
  Severity: medium

💡 Recommendations:

⚠️ Digər has significantly lower accuracy (85.3% vs 91.5%). Consider:
  - Check regional data quality
  - Add region-specific training data
  - Investigate user behavior patterns
\`\`\`

### 5. Region-Specific Optimization Weights

Calculate optimal weights for each region:

\`\`\`bash
python3 scripts/regional_metrics_collector.py weights
\`\`\`

Output:
\`\`\`
⚖️  Regional Optimization Weights
============================================================

Bakı (baku):
  accuracy: 50.00%
  speed: 30.00%
  model_size: 20.00%

Gəncə (ganja):
  accuracy: 58.00%  # Lower performance → higher accuracy weight
  speed: 25.00%
  model_size: 17.00%
\`\`\`

## Usage Examples

### Example 1: API Integration

\`\`\`python
from fastapi import FastAPI, Request
from regional_metrics_collector import RegionalMetricsCollector

app = FastAPI()
collector = RegionalMetricsCollector()

@app.post("/generate")
async def generate_questions(request: Request, data: QuestionRequest):
    start_time = time.time()
    
    # Get client IP
    client_ip = request.client.host
    
    try:
        result = generator.generate(data)
        
        # Log with automatic region detection
        collector.log_inference(
            model_version=current_model_version,
            request_id=str(uuid.uuid4()),
            ip_address=client_ip,
            accuracy_score=validate_questions(result.questions),
            inference_time=time.time() - start_time,
            model_size=model_size_mb
        )
        
        return result
        
    except Exception as e:
        collector.log_inference(
            model_version=current_model_version,
            request_id=str(uuid.uuid4()),
            ip_address=client_ip,
            inference_time=time.time() - start_time,
            error=str(e)
        )
        raise
\`\`\`

### Example 2: Scheduled Monitoring

\`\`\`bash
# Create cron jobs for monitoring

# Update regional summary every hour
0 * * * * python3 scripts/regional_metrics_collector.py summary

# Check disparities daily
0 9 * * * python3 scripts/regional_metrics_collector.py disparities --hours 24

# Weekly regional comparison
0 10 * * 1 python3 scripts/regional_metrics_collector.py compare --metric accuracy
\`\`\`

### Example 3: Region-Specific Sweeps

\`\`\`python
from regional_metrics_collector import RegionalMetricsCollector
from wandb_multiobjective_sweep import MultiObjectiveSweepRunner

collector = RegionalMetricsCollector()

# Get region-specific weights
regional_weights = collector.get_regional_weights()

# Run sweep for underperforming region
underperforming_region = "ganja"
weights = regional_weights[underperforming_region]

config = {
    "method": "bayes",
    "metric": {"name": "pareto_score", "goal": "maximize"},
    "objective_weights": weights,  # Use region-specific weights
    "parameters": {
        # ... hyperparameters ...
    }
}

runner = MultiObjectiveSweepRunner(
    dataset_path="train_dataset.jsonl",
    base_model="meta-llama/Meta-Llama-3-8B-Instruct"
)

sweep_id = runner.create_sweep_from_config(config)
print(f"Started region-specific sweep for {underperforming_region}: {sweep_id}")
\`\`\`

## Web Dashboard

Access regional metrics at:
\`\`\`
http://localhost:3000/admin/regional-metrics
\`\`\`

### Dashboard Features:

1. **Regional Overview Tab**
   - Card view of all regions
   - Real-time metrics per region
   - Performance badges
   - Request counts

2. **Comparison Tab**
   - Best/worst performing regions
   - Side-by-side comparison
   - Sortable performance table

3. **Disparities Tab**
   - Automatic disparity detection
   - Severity indicators
   - Actionable recommendations

4. **Regional Weights Tab**
   - Optimization weights per region
   - Visual weight distribution

5. **Logs Tab**
   - Activity history
   - Recent actions

## Real-World Scenarios

### Scenario 1: Urban vs Rural Gap

\`\`\`
Detection:
  Bakı (urban): 94% accuracy, 2.8s
  Digər (rural): 85% accuracy, 4.5s

Analysis:
  - 9% accuracy gap (significant!)
  - 60% slower inference

Actions Taken:
  1. Increased accuracy weight for rural regions: 0.50 → 0.65
  2. Ran region-specific sweep with adjusted weights
  3. Deployed optimized model
  4. Added more rural training data

Results:
  Digər improved to 91% accuracy (+6%)
  Gap reduced from 9% to 3%
\`\`\`

### Scenario 2: Regional Network Issues

\`\`\`
Detection:
  Naxçıvan: Normal accuracy (92%)
  Naxçıvan: Slow inference (6.2s vs 3.2s mean)

Analysis:
  - Accuracy OK, speed problem
  - Likely network/infrastructure issue

Actions Taken:
  1. Investigated network latency
  2. Deployed edge server in Naxçıvan
  3. Enabled model caching

Results:
  Speed improved to 3.5s (-44%)
  User satisfaction increased
\`\`\`

### Scenario 3: Language/Dialect Variations

\`\`\`
Detection:
  Şəki: Lower accuracy on dialect-specific terms
  Bakı: Higher accuracy (standard Azerbaijani)

Analysis:
  - Regional language variations
  - Model trained primarily on standard dialect

Actions Taken:
  1. Collected Şəki dialect samples
  2. Added to training dataset
  3. Fine-tuned with regional data

Results:
  Şəki accuracy improved 8%
  Better understanding of regional terms
\`\`\`

## Best Practices

1. **Monitor Regularly**: Check regional metrics daily
2. **Act on Disparities**: Address gaps quickly
3. **Use Region-Specific Weights**: Optimize per region
4. **Collect Regional Data**: Include diverse regional samples
5. **Test Regionally**: Validate in all regions before deployment

## Configuration

### Custom Region Detection

\`\`\`python
def custom_detect_region(ip_address, metadata):
    # Custom logic here
    if metadata.get("school_id"):
        school_id = metadata["school_id"]
        # Map school to region
        return region_by_school.get(school_id, "other")
    
    # Fall back to default detection
    return collector.detect_region(ip_address, metadata)

collector.detect_region = custom_detect_region
\`\`\`

### Disparity Thresholds

\`\`\`python
# More sensitive (detect smaller gaps)
disparities = collector.detect_regional_disparities(
    hours=24,
    threshold=0.05  # 5% threshold instead of 10%
)

# Less sensitive (only major issues)
disparities = collector.detect_regional_disparities(
    hours=24,
    threshold=0.20  # 20% threshold
)
\`\`\`

## Conclusion

The Regional Metrics System ensures fair and optimal performance across all regions of Azerbaijan, automatically detecting and addressing regional disparities for equitable educational AI access.
