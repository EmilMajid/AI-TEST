# Weights & Biases Integration Guide

## 📚 Nədir?

Weights & Biases (W&B) - machine learning experiment tracking, model versioning və team collaboration platformasıdır. Bu inteqrasiya TESTAI.AZ layihəsində:

- ✅ Training prosesini real-time izləyir
- ✅ Benchmark nəticələrini qeyd edir
- ✅ Model versiyalarını müqayisə edir
- ✅ Dataset və model artifactları saxlayır
- ✅ Komanda üçün şəffaf collaboration təmin edir

## 🚀 Quraşdırma

### 1. W&B Hesabı Yaradın

\`\`\`bash
# Hesab yaradın
https://wandb.ai/signup

# API key əldə edin
https://wandb.ai/authorize
\`\`\`

### 2. Lokal Quraşdırma

\`\`\`bash
# Setup script-ini işə salın
./scripts/setup_wandb.sh

# Və ya manual:
pip install wandb
wandb login
\`\`\`

### 3. API Key Konfiqurasiyası

\`\`\`bash
# Environment variable
export WANDB_API_KEY="your_api_key_here"

# Və ya .env file
echo "WANDB_API_KEY=your_api_key_here" >> .env.local
\`\`\`

### 4. Web Interface İlə Quraşdırma

1. `/admin/wandb` səhifəsinə keçin
2. API key daxil edin
3. "Konfiqurasiya Et" düyməsinə klikləyin
4. ✅ Hazırsınız!

## 📊 İstifadə

### Training ilə İnteqrasiya

\`\`\`python
from rag_lora_trainer_wandb import LoRATrainerWithWandB

# Trainer yaradın
trainer = LoRATrainerWithWandB(
    base_model="meta-llama/Meta-Llama-3-8B-Instruct",
    project_name="testai-az",
    run_name="physics_v1"
)

# Train edin - avtomatik W&B-yə log olunur
trainer.train(
    dataset_path="train_dataset.jsonl",
    num_epochs=3,
    batch_size=4,
    learning_rate=2e-4
)
\`\`\`

**W&B-də görünən məlumatlar:**
- Training loss (hər addımda)
- Evaluation loss (hər eval_steps-də)
- Learning rate schedule
- Model parameters (trainable/total)
- Dataset metadata
- Model artifacts

### Benchmark ilə İnteqrasiya

\`\`\`python
from lora_model_benchmarker_wandb import ModelBenchmarkerWithWandB

# Benchmarker yaradın
benchmarker = ModelBenchmarkerWithWandB(
    project_name="testai-az"
)

# Benchmark işə salın
result = benchmarker.run_benchmark(
    version_id="v1_20241016_120000",
    lora_path="lora_models/versions/v1_20241016_120000/model"
)
\`\`\`

**W&B-də görünən məlumatlar:**
- 8 keyfiyyət metrikası
- Performance metrics (time, success rate)
- Test case results (cədvəl formatında)
- Generated questions (sample)
- Pass/Fail status

### CLI İstifadəsi

\`\`\`bash
# Export all runs
python3 scripts/wandb_integration.py export --output summary.json

# Get best model
python3 scripts/wandb_integration.py best --metric benchmark/overall_score

# Setup W&B
python3 scripts/wandb_integration.py setup --api-key YOUR_KEY
\`\`\`

### Programmatik İstifadə

\`\`\`python
from wandb_integration import WandBLogger, WandBExperimentTracker

# Logger
logger = WandBLogger(project_name="testai-az")
run = logger.init_run(
    run_name="custom_experiment",
    config={"param1": "value1"},
    tags=["custom", "experiment"]
)

# Log metrics
logger.log_metrics({
    "custom_metric": 0.95,
    "another_metric": 123
})

# Finish
logger.finish()

# Experiment Tracker
tracker = WandBExperimentTracker("testai-az")

# Get all runs
all_runs = tracker.get_all_runs()

# Get best model
best = tracker.get_best_model(metric="benchmark/overall_score")

# Compare runs
comparison = tracker.compare_runs(
    run_ids=["run1_id", "run2_id"],
    metrics=["benchmark/overall_score", "performance/generation_time"]
)
\`\`\`

## 📈 W&B Dashboard

### 1. Runs View

W&B dashboard-da bütün training və benchmark runs-larınızı görə bilərsiniz:

\`\`\`
Project: testai-az
├── Runs
│   ├── training_20241016_120000 (training)
│   ├── benchmark_v1_20241016_120000 (benchmark)
│   └── ...
\`\`\`

### 2. Metrics Tracking

Real-time metrics:
- `train/loss` - Training loss
- `eval/loss` - Evaluation loss
- `benchmark/overall_score` - Benchmark score
- `benchmark/*` - Bütün benchmark metrics
- `performance/*` - Performance metrics

### 3. Artifacts

W&B-də saxlanılan artifacts:
- **Models**: LoRA adapter weights
- **Datasets**: Training datasets
- **Results**: Benchmark results

### 4. Reports

W&B Reports ilə:
- Model müqayisəsi
- Progress tracking
- Team sharing
- Custom analysis

## 🎯 Best Practices

### 1. Run Adlandırma

\`\`\`python
# Yaxşı ✅
run_name = "physics_v1_lora64_3epochs"

# Pis ❌
run_name = "test123"
\`\`\`

### 2. Tags İstifadəsi

\`\`\`python
tags = [
    "lora",           # Model type
    "physics",        # Subject
    "grade-8",        # Grade level
    "production"      # Environment
]
\`\`\`

### 3. Config Logging

\`\`\`python
config = {
    # Model
    "base_model": "meta-llama/Meta-Llama-3-8B-Instruct",
    "lora_r": 64,
    "lora_alpha": 128,
    
    # Training
    "num_epochs": 3,
    "batch_size": 4,
    "learning_rate": 2e-4,
    
    # Data
    "dataset": "train_dataset.jsonl",
    "num_samples": 1000
}
\`\`\`

### 4. Artifact Versioning

\`\`\`python
# Model artifacts
artifact_name = f"lora-model-{version_id}"

# Dataset artifacts
artifact_name = f"training_dataset_{date}"
\`\`\`

## 🔗 CI/CD İnteqrasiyası

### GitHub Actions

\`\`\`yaml
name: Train and Track with W&B

on:
  push:
    branches: [main]

jobs:
  train:
    runs-on: gpu-runner
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Dependencies
        run: pip install -r requirements.txt
      
      - name: Train with W&B
        env:
          WANDB_API_KEY: ${{ secrets.WANDB_API_KEY }}
        run: |
          python3 scripts/rag_lora_trainer_wandb.py \
            --dataset train_dataset.jsonl \
            --run-name "github_action_${{ github.sha }}"
      
      - name: Benchmark
        env:
          WANDB_API_KEY: ${{ secrets.WANDB_API_KEY }}
        run: |
          python3 scripts/lora_model_benchmarker_wandb.py \
            ${{ github.sha }} \
            lora_models/latest/model
\`\`\`

## 📊 Metrics Referansı

### Training Metrics

| Metric | Açıqlama | Range |
|--------|----------|-------|
| `train/loss` | Training loss | 0-∞ (aşağı yaxşı) |
| `eval/loss` | Evaluation loss | 0-∞ (aşağı yaxşı) |
| `train/learning_rate` | Current learning rate | 0-1 |
| `model/trainable_params` | Trainable parameters | Count |

### Benchmark Metrics

| Metric | Açıqlama | Threshold |
|--------|----------|-----------|
| `benchmark/overall_score` | Overall quality score | 75% |
| `benchmark/question_validity` | Question validity | 85% |
| `benchmark/answer_correctness` | Answer correctness | 80% |
| `benchmark/format_compliance` | Format compliance | 90% |
| `benchmark/textbook_relevance` | Textbook relevance | 80% |
| `benchmark/azerbaijani_quality` | Azerbaijani quality | 85% |

### Performance Metrics

| Metric | Açıqlama | Ideal |
|--------|----------|-------|
| `performance/generation_time` | Avg generation time (s) | < 10s |
| `performance/success_rate` | Success rate | > 90% |

## 🎓 Nümunə İş Axını

\`\`\`bash
# 1. Setup
./scripts/setup_wandb.sh

# 2. Train model with W&B tracking
python3 scripts/rag_lora_trainer_wandb.py \
  --dataset train_dataset.jsonl \
  --run-name "physics_v1" \
  --epochs 3

# 3. Benchmark with W&B tracking
python3 scripts/lora_model_benchmarker_wandb.py \
  v1_20241016_120000 \
  lora_models/versions/v1_20241016_120000/model

# 4. Check results
python3 scripts/wandb_integration.py best

# 5. View in W&B Dashboard
open https://wandb.ai/your-entity/testai-az
\`\`\`

## 💡 Troubleshooting

### API Key Issues

\`\`\`bash
# Check if configured
echo $WANDB_API_KEY

# Re-login
wandb login --relogin

# Offline mode (testing)
export WANDB_MODE=offline
\`\`\`

### Import Errors

\`\`\`bash
# Reinstall
pip install --upgrade wandb
\`\`\`

### Slow Uploads

\`\`\`bash
# Reduce artifact size
# Use .wandbignore file
echo "*.pyc" >> .wandbignore
echo "__pycache__/" >> .wandbignore
\`\`\`

Bu W&B inteqrasiyası ilə bütün experiment və model lifecycle professional şəkildə track edilir! 🚀
