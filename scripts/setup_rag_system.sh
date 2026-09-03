#!/bin/bash

echo "🚀 Setting up RAG System for TESTAI.AZ..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip

pip install \
    fastapi \
    uvicorn[standard] \
    python-multipart \
    sentence-transformers \
    faiss-cpu \
    pdfplumber \
    pytesseract \
    pdf2image \
    numpy \
    transformers \
    torch

echo "✅ Dependencies installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p extracted_data
mkdir -p vector_index
mkdir -p textbooks

echo "✅ Directories created"

# Test imports
echo "🧪 Testing imports..."
python3 -c "
from sentence_transformers import SentenceTransformer
import faiss
import pdfplumber
print('✅ All imports successful')
"

echo ""
echo "✅ RAG System setup complete!"
echo ""
echo "Next steps:"
echo "1. Place PDF textbooks in the 'textbooks' directory"
echo "2. Run: python3 scripts/rag_content_extractor.py"
echo "3. Run: python3 scripts/rag_vectorizer.py"
echo "4. Run: python3 scripts/fastapi_rag_backend.py"
echo ""
echo "Or visit /admin/rag in the web interface to upload textbooks"
