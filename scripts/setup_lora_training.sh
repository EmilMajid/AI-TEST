#!/bin/bash

echo "🚀 LoRA Training Environment Quraşdırılması"
echo "=========================================="

# Create directories
echo "📁 Qovluqlar yaradılır..."
mkdir -p training_data
mkdir -p lora_models
mkdir -p textbooks

# Install Python dependencies
echo "📦 Python paketləri yüklənir..."
pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -q transformers accelerate peft bitsandbytes
pip install -q datasets sentencepiece protobuf
pip install -q einops scipy

# Check GPU
echo ""
echo "🖥️ GPU Status:"
python3 << EOF
import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
    print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
EOF

# Create sample topics file
echo ""
echo "📝 Nümunə mövzular faylı yaradılır..."
python3 scripts/rag_lora_dataset_builder.py

echo ""
echo "✅ Quraşdırma tamamlandı!"
echo ""
echo "Növbəti addımlar:"
echo "1. Dərslikləri textbooks/ qovluğuna yerləşdirin"
echo "2. RAG sistemini işə salın: python3 scripts/rag_vectorizer.py"
echo "3. Dataset yaradın: python3 scripts/rag_lora_dataset_builder.py"
echo "4. Training başladın: python3 scripts/rag_lora_trainer.py"
