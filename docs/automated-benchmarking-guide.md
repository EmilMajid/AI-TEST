# Automated Benchmarking Guide

## 📚 Ümumi Baxış

Avtomatik benchmark sistemi yeni LoRA modellərinin keyfiyyətini avtomatik test edir və production-a buraxılmadan əvvəl quality gate-lərdən keçməsini təmin edir.

## 🎯 Benchmark Metriklər

### 1. Question Quality Metrics (Sual Keyfiyyəti)

#### Question Validity (Sual Düzgünlüyü) - Threshold: 85%
- Sual mətni mövcud və 10+ simvol
- Sual işarəsi ilə bitir
- 20+ simvol minimum uzunluq

#### Answer Correctness (Cavab Düzgünlüyü) - Threshold: 80%
- Cavab mövcuddur
- MCQ: A/B/C/D formatında
- 4 seçim variantı
- İzah 20+ simvol

#### Format Compliance (Format Uyğunluğu) - Threshold: 90%
- Bütün lazımi fieldlər: sual, cavab, izah
- MCQ: 4 seçim variantı
- Boş seçimlər yoxdur

### 2. Content Quality Metrics (Məzmun Keyfiyyəti)

#### Textbook Relevance (Dərslik Uyğunluğu) - Threshold: 80%
- Gözlənilən konseptlər tapılır
- Mənbə göstərilir
- Mövzuya uyğundur

#### Difficulty Accuracy (Çətinlik Dəqiqliyi) - Threshold: 70%
- Sual uzunluğu çətinliyə uyğun
- Kompleks sözlər (çətin üçün)
- Rəqəmlər və düsturlar

#### Bloom Coverage (Bloom Taksonomiyası) - Threshold: 60%
- Bloom səviyyəsi müəyyən edilir
- Düzgün fellər istifadə olunur
- Dərk səviyyəsinə uyğun

### 3. Language Quality Metrics (Dil Keyfiyyəti)

#### Azerbaijani Quality (Azərbaycan Dili) - Threshold: 85%
- Azərbaycan əlifbasına uyğun
- Xüsusi simvollar: ə, ü, ö, ğ, ı, ş, ç
- Latin/Kiril qarışması yoxdur

#### Grammar Score (Qrammatika) - Threshold: 80%
- Böyük hərflə başlayır
- Düzgün durğu işarələri
- İkiqat boşluq yoxdur

### 4. Performance Metrics (Performans)

- **Avg Generation Time**: Orta generasiya vaxtı (< 10s ideal)
- **Success Rate**: Uğurlu generasiya faizi (> 90% ideal)

## 🚀 İstifadə

### CLI Usage

\`\`\`bash
# Basic benchmark
python3 scripts/lora_model_benchmarker.py \
  v1_20241016_120000 \
  lora_models/versions/v1_20241016_120000/model

# Custom base model
python3 scripts/lora_model_benchmarker.py \
  v1_20241016_120000 \
  lora_models/versions/v1_20241016_120000/model \
  --base-model meta-llama/Meta-Llama-3-8B-Instruct

# Don't save results
python3 scripts/lora_model_benchmarker.py \
  v1_20241016_120000 \
  lora_models/versions/v1_20241016_120000/model \
  --no-save
\`\`\`

### API Usage

\`\`\`typescript
// Run benchmark
const response = await fetch("/api/lora/benchmark", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    version_id: "v1_20241016_120000",
    lora_path: "lora_models/versions/v1_20241016_120000/model",
    auto_activate_if_passed: true,
  }),
})

// Get results
const results = await fetch("/api/lora/benchmark")
const specificResult = await fetch("/api/lora/benchmark?version_id=v1_20241016_120000")
\`\`\`

### Web Interface

1. Navigate to `/admin/lora/benchmark`
2. Select a model from dropdown
3. Check "Auto-activate if passed" if desired
4. Click "Benchmark Başlat"
5. View real-time logs
6. See detailed results

## 📊 Test Cases

Sistem default olaraq 8 test case istifadə edir:

\`\`\`json
{
  "test_cases": [
    {
      "grade": 8,
      "subject": "fizika",
      "topic": "Nyuton qanunları",
      "difficulty": "orta",
      "question_type": "mcq",
      "expected_concepts": ["qüvvə", "kütlə", "təcil", "Nyuton"]
    },
    {
      "grade": 9,
      "subject": "kimya",
      "topic": "Kimyəvi reaksiyalar",
      "difficulty": "çətin",
      "question_type": "mcq",
      "expected_concepts": ["reaksiya", "məhsul", "reaktiv", "tənlik"]
    },
    {
      "grade": 10,
      "subject": "riyaziyyat",
      "topic": "Triqonometriya",
      "difficulty": "sadə",
      "question_type": "open",
      "expected_concepts": ["sinus", "kosinus", "bucaq", "dairə"]
    },
    // ... 5 əlavə test case
  ],
  "num_questions_per_case": 3,
  "timeout_seconds": 30
}
\`\`\`

## 🎯 Quality Gates

Model production-a buraxılmadan əvvəl bu threshold-ları keçməlidir:

| Metrika | Threshold | Çəki |
|---------|-----------|------|
| Overall Score | 75% | - |
| Question Validity | 85% | 20% |
| Answer Correctness | 80% | 20% |
| Format Compliance | 90% | 15% |
| Textbook Relevance | 80% | 15% |
| Azerbaijani Quality | 85% | 10% |

## 🔄 CI/CD Integration

### GitHub Actions

\`\`\`yaml
name: LoRA Model Quality Check

on:
  push:
    paths:
      - 'lora_models/**'

jobs:
  benchmark:
    runs-on: gpu-runner
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run Benchmark
        id: benchmark
        run: |
          python3 scripts/lora_model_benchmarker.py \
            ${{ github.sha }} \
            lora_models/latest/model
      
      - name: Check Results
        run: |
          if [ $? -ne 0 ]; then
            echo "::error::Benchmark failed - quality gates not met"
            exit 1
          fi
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: benchmark-results
          path: benchmark_results/
      
      - name: Auto-activate if passed
        if: success()
        run: |
          python3 scripts/lora_version_manager.py activate ${{ github.sha }}
\`\`\`

### Pre-deployment Hook

\`\`\`python
# scripts/pre_deploy_hook.py
from lora_model_benchmarker import ModelBenchmarker
from lora_version_manager import LoRAVersionManager
import sys

def pre_deploy_check(version_id: str, lora_path: str):
    """Pre-deployment quality check"""
    
    print(f"🔍 Running pre-deployment benchmark for {version_id}...")
    
    benchmarker = ModelBenchmarker()
    result = benchmarker.run_benchmark(
        version_id=version_id,
        lora_path=lora_path,
        save_results=True
    )
    
    if not result.passed:
        print("❌ Model failed quality gates. Deployment blocked.")
        print(f"   Score: {result.overall_score:.2%}")
        sys.exit(1)
    
    print("✅ Model passed all quality gates. Deployment approved.")
    print(f"   Score: {result.overall_score:.2%}")
    
    # Auto-activate
    manager = LoRAVersionManager()
    manager.set_active_model(version_id)
    
    return True

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pre_deploy_hook.py <version_id> <lora_path>")
        sys.exit(1)
    
    pre_deploy_check(sys.argv[1], sys.argv[2])
\`\`\`

## 📈 Benchmark Results Analysis

### Reading Results

\`\`\`python
import json
from pathlib import Path

# Load latest result
results_dir = Path("benchmark_results")
latest_file = sorted(results_dir.glob("*.json"))[-1]

with open(latest_file) as f:
    result = json.load(f)

print(f"Version: {result['version_id']}")
print(f"Overall Score: {result['overall_score']:.2%}")
print(f"Passed: {result['passed']}")

# Check failed metrics
thresholds = {
    "question_validity": 0.85,
    "answer_correctness": 0.80,
    "format_compliance": 0.90,
    "textbook_relevance": 0.80,
    "azerbaijani_quality": 0.85
}

print("\nFailed Metrics:")
for metric, threshold in thresholds.items():
    value = result[metric]
    if value < threshold:
        print(f"  {metric}: {value:.2%} < {threshold:.2%}")
\`\`\`

### Comparing Versions

\`\`\`python
from lora_version_manager import LoRAVersionManager

manager = LoRAVersionManager()

# Get all models with benchmark scores
models = manager.list_models()
models_with_scores = [
    m for m in models 
    if "benchmark_score" in m.get("metrics", {})
]

# Sort by score
models_with_scores.sort(
    key=lambda x: x["metrics"]["benchmark_score"],
    reverse=True
)

print("Top 5 Models by Benchmark Score:")
for i, model in enumerate(models_with_scores[:5], 1):
    score = model["metrics"]["benchmark_score"]
    print(f"{i}. {model['name']}: {score:.2%}")
\`\`\`

## 🛠️ Customizing Benchmarks

### Add Custom Test Case

\`\`\`json
{
  "grade": 11,
  "subject": "informatika",
  "topic": "Alqoritmlər",
  "difficulty": "çətin",
  "question_type": "mcq",
  "expected_concepts": ["alqoritm", "tsikl", "şərt", "kod"]
}
\`\`\`

### Adjust Thresholds

\`\`\`python
benchmarker = ModelBenchmarker()

# Custom thresholds
benchmarker.thresholds = {
    "overall_score": 0.80,  # Stricter
    "question_validity": 0.90,
    "answer_correctness": 0.85,
    "format_compliance": 0.95,
    "textbook_relevance": 0.85,
    "azerbaijani_quality": 0.90
}

result = benchmarker.run_benchmark(version_id, lora_path)
\`\`\`

## 💡 Best Practices

### 1. Run Benchmarks After Every Training

\`\`\`bash
# Train
python3 scripts/rag_lora_trainer.py

# Immediately benchmark
python3 scripts/lora_model_benchmarker.py \
  v_latest \
  lora_models/edutest_v1/final
\`\`\`

### 2. Track Metrics Over Time

\`\`\`python
import matplotlib.pyplot as plt
import json
from pathlib import Path

# Load all results
results = []
for file in sorted(Path("benchmark_results").glob("*.json")):
    with open(file) as f:
        results.append(json.load(f))

# Plot score trend
scores = [r["overall_score"] for r in results]
plt.plot(scores)
plt.xlabel("Version")
plt.ylabel("Overall Score")
plt.title("Model Quality Trend")
plt.axhline(y=0.75, color='r', linestyle='--', label='Threshold')
plt.legend()
plt.savefig("quality_trend.png")
\`\`\`

### 3. Automated Rollback

\`\`\`python
def deploy_with_rollback(new_version_id: str, lora_path: str):
    manager = LoRAVersionManager()
    
    # Save current active
    old_active = manager.get_active_model()
    
    try:
        # Run benchmark
        benchmarker = ModelBenchmarker()
        result = benchmarker.run_benchmark(new_version_id, lora_path)
        
        if not result.passed:
            raise Exception("Benchmark failed")
        
        # Activate new model
        manager.set_active_model(new_version_id)
        
        # Monitor for 5 minutes
        time.sleep(300)
        
        # Check production metrics
        if not check_production_health():
            raise Exception("Production health check failed")
        
        print("✅ Deployment successful")
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        
        # Rollback
        if old_active:
            print(f"🔄 Rolling back to {old_active['version_id']}")
            manager.set_active_model(old_active['version_id'])
\`\`\`

## 🎓 Nəticə

Avtomatik benchmark sistemi model keyfiyyətini təmin edir və production-a keçməzdən əvvəl comprehensive testlərdən keçməsini garantiya edir. Bu sistem:

- ✅ 8 fərqli metriklə keyfiyyət qiymətləndirir
- ✅ Avtomatik quality gate-lər tətbiq edir
- ✅ CI/CD pipeline-a inteqrasiya olunur
- ✅ Ətraflı nəticə hesabatları yaradır
- ✅ Version manager ilə avtomatik aktivləşdirmə

Bu sistem sayəsində yalnız yüksək keyfiyyətli modellər production-a çıxır! 🚀
