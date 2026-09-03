# LoRA Fine-Tuning Təlimatı

## 📋 İçindəkilər

1. [Giriş](#giriş)
2. [Quraşdırma](#quraşdırma)
3. [Dataset Hazırlığı](#dataset-hazırlığı)
4. [Training Prosesi](#training-prosesi)
5. [Model İstifadəsi](#model-istifadəsi)
6. [Optimallaşdırma](#optimallaşdırma)

## 🎯 Giriş

LoRA (Low-Rank Adaptation) böyük dil modellərini səmərəli şəkildə fine-tune etmək üçün istifadə olunan texnikadır. Bu təlimat Azərbaycan dərslikləri üçün test generatoru modelini necə train etməyi izah edir.

## 🔧 Quraşdırma

### Sistem Tələbləri

- **GPU**: NVIDIA GPU (min 16GB VRAM)
- **RAM**: Minimum 32GB
- **Disk**: 100GB boş yer
- **Python**: 3.10+
- **CUDA**: 11.8+

### Quraşdırma Addımları

\`\`\`bash
# 1. Environment quraşdır
./scripts/setup_lora_training.sh

# 2. GPU-nu yoxla
python3 -c "import torch; print(torch.cuda.is_available())"

# 3. Dependencies yüklə
pip install -r requirements.txt
\`\`\`

## 📚 Dataset Hazırlığı

### 1. Mövzular Faylı

`training_topics.json` faylını redaktə edin:

\`\`\`json
[
  {
    "grade": 8,
    "subject": "fizika",
    "topic": "Elektrik cərəyanı"
  },
  {
    "grade": 9,
    "subject": "kimya",
    "topic": "Atom quruluşu"
  }
]
\`\`\`

### 2. Dataset Yaradılması

\`\`\`bash
# RAG sistemini işə sal
python3 scripts/rag_system.py

# Dataset yarat
python3 scripts/rag_lora_dataset_builder.py
\`\`\`

**Nəticə**: `training_data/` qovluğunda `train.jsonl` və `eval.jsonl` faylları

### Dataset Formatı

\`\`\`json
{
  "instruction": "Siz təhsil mütəxəssisisiniz...",
  "input": "Kontekst: ... Mövzu: ... Sinif: ...",
  "output": "{sual, seçimlər, cavab, izah}"
}
\`\`\`

## 🚀 Training Prosesi

### 1. Konfiqurasiya

`rag_lora_trainer.py` faylında parametrləri təyin edin:

\`\`\`python
config = {
    "base_model": "meta-llama/Meta-Llama-3-8B-Instruct",
    "lora_r": 64,          # Rank (32-128)
    "lora_alpha": 128,     # Alpha (2x rank)
    "num_epochs": 3,       # Epochs (3-5)
    "batch_size": 4,       # Batch size
    "learning_rate": 2e-4  # Learning rate
}
\`\`\`

### 2. Training Başlat

#### Terminal vasitəsi:

\`\`\`bash
python3 scripts/rag_lora_trainer.py
\`\`\`

#### Web interfeys:

1. `/admin/lora` səhifəsinə keçin
2. Parametrləri təyin edin
3. "Training-ə başla" düyməsinə klikləyin
4. Real-time progress izləyin

### 3. Training Gedişatı

Training zamanı aşağıdakılar monitorinq edilir:

- **Loss**: Training itkisi (azalmalıdır)
- **Eval Loss**: Validasiya itkisi
- **Learning Rate**: Dinamik dəyişir (cosine schedule)
- **GPU Utilization**: 80-90% olmalıdır
- **Memory Usage**: 14-16GB (16GB GPU üçün)

## 💡 Model İstifadəsi

### 1. Fine-tuned Modeli Yüklə

\`\`\`python
from rag_lora_generator import LoRAQuestionGenerator

generator = LoRAQuestionGenerator(
    base_model="meta-llama/Meta-Llama-3-8B-Instruct",
    lora_path="lora_models/testai_v1/final"
)
generator.load_model()
\`\`\`

### 2. Sual Yaradılması

\`\`\`python
# RAG ilə birlikdə
from rag_system import RAGSystem

rag = RAGSystem()
rag.load_index()

questions = generator.generate_with_rag(
    rag_system=rag,
    grade=8,
    subject="fizika",
    topic="Elektrik cərəyanı",
    count=5,
    question_type="mcq",
    difficulty="orta"
)
\`\`\`

### 3. API İnteqrasiyası

`app/api/generate-test/route.ts` faylında yeni generator-u istifadə edin:

\`\`\`typescript
const response = await fetch('http://localhost:8000/api/generate-lora', {
  method: 'POST',
  body: JSON.stringify({
    grade: 8,
    subject: 'fizika',
    topic: 'Elektrik cərəyanı',
    count: 10,
    type: 'mcq'
  })
})
\`\`\`

## ⚡ Optimallaşdırma

### Training Sürətini Artırmaq

1. **Batch Size**: 8-ə qədər artır (əgər memory icazə verirsə)
2. **Gradient Accumulation**: 2-4 addım
3. **Mixed Precision**: FP16/BF16 istifadə et
4. **Flash Attention**: Quraşdır (2x sürət artımı)

### Memory İstifadəsini Azaltmaq

1. **4-bit Quantization**: Aktiv edin
2. **Gradient Checkpointing**: Aktiv edin
3. **LoRA Rank**: 32-ə düşürün
4. **Batch Size**: 2-ə düşürün

### Keyfiyyəti Artırmaq

1. **Dataset**: Daha çox nümunə əlavə edin (min 1000)
2. **Epochs**: 5-ə qədər artırın
3. **LoRA Rank**: 128-ə qədər artırın
4. **Learning Rate**: 1e-4 test edin

## 📊 Performans Benchmarkları

| Konfiqurasiya | GPU | Training Vaxtı | VRAM | Keyfiyyət |
|---------------|-----|----------------|------|-----------|
| Base (R=64)   | A100 40GB | 2-3 saat | 16GB | ⭐⭐⭐⭐ |
| Fast (R=32)   | RTX 3090 | 4-5 saat | 12GB | ⭐⭐⭐ |
| High-Q (R=128)| A100 80GB | 4-6 saat | 24GB | ⭐⭐⭐⭐⭐ |

## 🐛 Troubleshooting

### CUDA Out of Memory

\`\`\`bash
# Batch size-ı azalt
config["batch_size"] = 2

# Gradient accumulation artır
training_args.gradient_accumulation_steps = 8

# 4-bit quantization aktiv et
load_in_4bit = True
\`\`\`

### Slow Training

\`\`\`bash
# Flash Attention quraşdır
pip install flash-attn

# Compile model
torch.compile(model)
\`\`\`

### Poor Quality Questions

1. Dataset-i genişləndir (min 1000 nümunə)
2. Epochs-u artır (5-ə qədər)
3. LoRA rank-ı artır (128)
4. RAG kontekstini artır (k=10)

## 📈 Növbəti Addımlar

1. **Multi-GPU Training**: Distributed training tətbiq et
2. **Hyperparameter Tuning**: Optuna ilə avtomatik tuning
3. **Model Merging**: Adapter-i base modelə merge et
4. **Quantization**: GGUF formatına çevir (CPU inference)
5. **Deployment**: vLLM serveri qur

## 📚 Əlavə Resurslar

- [Hugging Face PEFT Docs](https://huggingface.co/docs/peft)
- [LoRA Paper](https://arxiv.org/abs/2106.09685)
- [Llama-3 Model Card](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct)

## 🤝 Dəstək

Problemlə qarşılaşsanız:

1. `docs/lora-training-guide.md` oxuyun
2. GitHub Issues-də axtarın
3. Telegram qrupumuzda soruşun
