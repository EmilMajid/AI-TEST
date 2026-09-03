# RAG Sistem Qurmaq Təlimatı

## 🎯 Məqsəd

Dərslik məlumatlarından istifadə edərək daha dəqiq və kontekst-aware test sualları yaratmaq.

## 📋 Sistem Arxitekturası

\`\`\`
┌─────────────────┐
│   PDF Dərslik   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Content Extractor      │
│  - Mətn çıxarma         │
│  - Düstur tanıma        │
│  - Chunking             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Vector Indexer         │
│  - Embedding generation │
│  - FAISS indexing       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│     RAG System          │
│  - Context retrieval    │
│  - Similarity search    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Test Generator         │
│  - AI prompt            │
│  - Question generation  │
└─────────────────────────┘
\`\`\`

## 🚀 Quraşdırma

### 1. Sistem Tələbləri

\`\`\`bash
# Python 3.10+
# 4GB+ RAM
# 2GB+ disk space
\`\`\`

### 2. Asılılıqların Quraşdırılması

\`\`\`bash
chmod +x scripts/setup_rag_system.sh
./scripts/setup_rag_system.sh
\`\`\`

### 3. Dərsliklərin Hazırlanması

\`\`\`bash
# Dərslikləri textbooks/ qovluğuna yerləşdirin
mkdir -p textbooks
# Məsələn:
# textbooks/8_fizika.pdf
# textbooks/9_kimya.pdf
\`\`\`

## 📊 İstifadə

### Variant 1: Avtomatik Emal

\`\`\`bash
# 1. Məlumatları çıxart
python3 scripts/rag_content_extractor.py

# 2. Vektor indeksi yarat
python3 scripts/rag_vectorizer.py

# 3. Backend-i işə sal
python3 scripts/fastapi_rag_backend.py
\`\`\`

### Variant 2: Web İnterfeys

1. `/admin/rag` səhifəsinə keçin
2. PDF dərsliklərini yükləyin
3. Sistem avtomatik emal və indeksləyir

## 🔍 RAG Sisteminin İşləmə Prinsipi

### 1. İndeksləmə (Offline)

\`\`\`python
# Dərslik → Chunks → Embeddings → FAISS Index
textbook.pdf 
  → ["chunk1", "chunk2", ...] 
  → [vec1, vec2, ...] 
  → FAISS Index
\`\`\`

### 2. Axtarış (Runtime)

\`\`\`python
# İstifadəçi sorğusu → Embedding → Similarity Search → Kontekst
"Nyuton qanunları" 
  → query_embedding 
  → top_k_similar_chunks 
  → relevant_context
\`\`\`

### 3. Test Generasiyası

\`\`\`python
# Kontekst + AI Model → Test Sualları
relevant_context + AI_prompt 
  → generated_questions
\`\`\`

## 📈 Performans Optimizasiyası

### FAISS İndeks Növləri

\`\`\`python
# Flat Index (Dəqiq amma yavaş)
index = faiss.IndexFlatIP(dimension)

# HNSW Index (Sürətli amma approx)
index = faiss.IndexHNSWFlat(dimension, 32)

# IVF Index (Böyük datalar üçün)
quantizer = faiss.IndexFlatIP(dimension)
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)
\`\`\`

### Embedding Model Seçimi

| Model | Dimension | Ölçü | Sürət |
|-------|-----------|------|-------|
| MiniLM-L12 | 384 | 120MB | ⚡⚡⚡ |
| mpnet-base | 768 | 420MB | ⚡⚡ |
| multilingual-e5 | 768 | 560MB | ⚡ |

## 🔧 Troubleshooting

### Problem: Index yüklənmir

\`\`\`bash
# Yoxla:
ls -lh vector_index/
# textbook_index.faiss və index_metadata.json olmalıdır

# Yenidən yarat:
python3 scripts/rag_vectorizer.py
\`\`\`

### Problem: Axtarış nəticə vermir

\`\`\`bash
# Metadata-nı yoxla:
python3 -c "
import json
with open('vector_index/index_metadata.json') as f:
    data = json.load(f)
    print(f'Total entries: {len(data)}')
    print(f'Subjects: {set(d[\"subject\"] for d in data)}')
"
\`\`\`

### Problem: Yaddaş problemi

\`\`\`python
# Batch processing istifadə et:
# vectorizer.py-də batch_size=32 → 16
embeddings = model.encode(texts, batch_size=16)
\`\`\`

## 📚 Faydalı Resurslar

- [FAISS Documentation](https://github.com/facebookresearch/faiss)
- [Sentence Transformers](https://www.sbert.net/)
- [RAG Paper](https://arxiv.org/abs/2005.11401)
- [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)

## 🎓 Tövsiyələr

1. **Keyfiyyətli Dərslik Seçin:** PDF-də aydın mətn olmalıdır
2. **Chunk Size Optimallaşdırın:** 300-800 söz optimal sayılır
3. **k Parametrini Tənzimləyin:** Çox kiçik → az kontekst, Çox böyük → noise
4. **Mütəmadi Yeniləyin:** Yeni dərslik əlavə edəndə indeksi rebuild edin

## 🚦 İstehsal Mühitinə Çıxarmaq

\`\`\`bash
# Docker image yarat
docker build -t testai-rag:latest -f Dockerfile.rag .

# Konteyner işə sal
docker run -d \
  -p 8000:8000 \
  -v $(pwd)/vector_index:/app/vector_index \
  -v $(pwd)/textbooks:/app/textbooks \
  testai-rag:latest
\`\`\`

## 📊 Metrikalar

RAG sisteminin keyfiyyətini ölçmək üçün:

- **Relevance Score:** Axtarış nəticələrinin relevantlığı (>0.7 yaxşıdır)
- **Coverage:** Dərslik mövzularının əhatə dərəcəsi
- **Latency:** Axtarış sürəti (<500ms olmalıdır)
- **Question Quality:** Yaradılan sualların keyfiyyəti

## 🎯 Növbəti Addımlar

1. ✅ RAG sistemi quraşdırıldı
2. 🔄 Fine-tuned model inteqrasiyası (LoRA)
3. 🔄 Multi-modal support (şəkillər, cədvəllər)
4. 🔄 Query expansion (sorğu genişləndirmə)
5. 🔄 Hybrid search (keyword + semantic)
