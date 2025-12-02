#!/bin/bash

echo "🚀 Setting up Weights & Biases integration..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Install W&B
echo "📦 Installing wandb package..."
pip install wandb

# Create directories
mkdir -p benchmark_results
mkdir -p lora_models

# Setup W&B
echo ""
echo "🔑 Setting up W&B authentication..."
echo "   Visit: https://wandb.ai/authorize"
echo "   Copy your API key and run: wandb login"
echo ""

# Optional: Login now
read -p "Do you want to login now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wandb login
fi

echo ""
echo "✅ W&B setup complete!"
echo ""
echo "Next steps:"
echo "  1. Train a model: python3 scripts/rag_lora_trainer_wandb.py --dataset train_dataset.jsonl"
echo "  2. Run benchmark: python3 scripts/lora_model_benchmarker_wandb.py v1_xxx lora_models/xxx/model"
echo "  3. View results: python3 scripts/wandb_integration.py export"
echo "  4. Get best model: python3 scripts/wandb_integration.py best"
