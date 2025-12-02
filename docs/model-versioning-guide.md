# LoRA Model Versioning Guide

## 📚 Ümumi Baxış

Model versioning sistemi LoRA modellərinin idarə edilməsi, müqayisə edilməsi və deploy edilməsi üçün tam həlldir.

## 🎯 Əsas Xüsusiyyətlər

### 1. Avtomatik Versioning
- Unique version ID generasiyası
- Timestamp-based versioning
- Hash-based duplicate detection
- Automatic model registration

### 2. Model Registry
- Centralized model metadata
- Training configuration tracking
- Performance metrics storage
- Tag-based organization

### 3. Version Management
- Activate/deactivate models
- Compare multiple versions
- Delete unused versions
- Export model packages

### 4. Metrics Tracking
- Training loss history
- Evaluation metrics
- Performance benchmarks
- Quality indicators

## 🚀 İstifadə Nümunələri

### Model Qeydiyyatı

\`\`\`python
from lora_version_manager import LoRAVersionManager

manager = LoRAVersionManager()

# Yeni modeli qeydiyyatdan keçir
version_id = manager.register_model(
    model_path="lora_models/edutest_v1/final",
    name="EduTest v1.0 - Physics Focus",
    description="Fine-tuned on 8th grade physics textbooks",
    training_config={
        "lora_r": 64,
        "lora_alpha": 128,
        "num_epochs": 3,
        "learning_rate": 2e-4
    },
    metrics={
        "train_loss": 0.234,
        "eval_loss": 0.289,
        "accuracy": 0.92
    },
    tags=["physics", "grade-8", "production"]
)
\`\`\`

### Model Aktivasiyası

\`\`\`python
# Modelləri siyahıla
models = manager.list_models(tags=["production"])

# Ən yaxşı modeli aktivləşdir
best_model = manager.get_best_model(metric="eval_loss")
manager.set_active_model(best_model["version_id"])
\`\`\`

### Model Müqayisəsi

\`\`\`python
# 2 modeli müqayisə et
comparison = manager.compare_models([
    "v1_20241016_120000",
    "v2_20241016_140000"
])

print(comparison["metrics_comparison"])
# {
#   "eval_loss": [0.289, 0.245],
#   "accuracy": [0.92, 0.95]
# }
\`\`\`

### CLI İstifadəsi

\`\`\`bash
# Modeli qeydiyyatdan keçir
python scripts/lora_version_manager.py register \
  lora_models/edutest_v1/final \
  --name "EduTest v1.0" \
  --description "Production model" \
  --tags production physics

# Modelləri siyahıla
python scripts/lora_version_manager.py list --tags production

# Modeli aktivləşdir
python scripts/lora_version_manager.py activate v1_20241016_120000

# Modelləri müqayisə et
python scripts/lora_version_manager.py compare v1_20241016_120000 v2_20241016_140000

# Modeli sil
python scripts/lora_version_manager.py delete v1_20241016_120000
\`\`\`

## 🎨 Web Interface

### Model Siyahısı
- `/admin/lora/versions` - Bütün modelləri göstərir
- Tag-based filtering
- Sort by date, metrics, etc.
- Bulk selection and operations

### Model Müqayisəsi
- Side-by-side comparison
- Metrics visualization
- Performance trends
- Training config differences

### Model Aktivasiyası
- One-click activation
- Active model indicator
- Automatic symlink creation
- Production deployment

## 📊 Best Practices

### 1. Version Naming
\`\`\`python
# ✅ Yaxşı
"EduTest v2.1 - Math Focus (Grade 10)"

# ❌ Pis
"model_final_2"
\`\`\`

### 2. Tag Organization
\`\`\`python
tags = [
    "production",      # Environment
    "physics",         # Subject
    "grade-8",         # Grade level
    "high-accuracy",   # Quality indicator
    "v2.1"            # Version number
]
\`\`\`

### 3. Metrics Tracking
\`\`\`python
metrics = {
    "train_loss": 0.234,
    "eval_loss": 0.289,
    "accuracy": 0.92,
    "f1_score": 0.91,
    "precision": 0.93,
    "recall": 0.90,
    "inference_time_ms": 250
}
\`\`\`

### 4. Regular Cleanup
\`\`\`python
# Köhnə modelləri sil
old_models = manager.list_models()
for model in old_models:
    if not model["active"] and model["downloads"] == 0:
        age_days = (datetime.now() - datetime.fromisoformat(model["created_at"])).days
        if age_days > 30:
            manager.delete_model(model["version_id"])
\`\`\`

## 🔄 CI/CD Integration

\`\`\`yaml
# .github/workflows/model-training.yml
name: LoRA Model Training

on:
  push:
    paths:
      - 'training_data/**'

jobs:
  train:
    runs-on: gpu-runner
    steps:
      - name: Train Model
        run: python scripts/rag_lora_trainer.py
      
      - name: Register Model
        run: |
          python scripts/lora_version_manager.py register \
            lora_models/edutest_latest/final \
            --name "EduTest Auto-trained $(date +%Y-%m-%d)" \
            --tags automated ci/cd
      
      - name: Run Tests
        run: python scripts/test_model_quality.py
      
      - name: Deploy if Successful
        if: success()
        run: |
          BEST_MODEL=$(python -c "from lora_version_manager import LoRAVersionManager; m = LoRAVersionManager(); print(m.get_best_model()['version_id'])")
          python scripts/lora_version_manager.py activate $BEST_MODEL
\`\`\`

## 📈 Monitoring

\`\`\`python
# Monitor model performance
def monitor_active_model():
    manager = LoRAVersionManager()
    active = manager.get_active_model()
    
    # Log metrics
    print(f"Active Model: {active['name']}")
    print(f"Metrics: {active['metrics']}")
    
    # Alert if performance drops
    if active['metrics']['accuracy'] < 0.85:
        send_alert("Model accuracy below threshold!")
\`\`\`

## 🎓 Nəticə

Model versioning sistemi LoRA modellərinin professional idarə edilməsini təmin edir. Avtomatik versioning, comprehensive metrics tracking və easy deployment proseslərini birləşdirərək təkmil AI model lifecycle management həlli yaradır.
