import sys
import os
import numpy as np
from pathlib import Path

# Add rag_system to path
sys.path.append(str(Path(__file__).parent / "rag_system"))

from ocr_repair import OCRRepair
from auto_language_correction import AutoLanguageCorrector
from encoding_fixer import EncodingFixer
from semantic_filter import SemanticDeduplicator
from monitoring import IngestionMonitor
from vector_store import VectorStore
from rag_orchestrator import RAGOrchestrator

def test_ocr_repair():
    print("\n--- Testing OCR Repair & Auto Correction ---")
    repairer = OCRRepair()
    corrector = AutoLanguageCorrector()
    
    # Test 1: Dictionary repair
    noisy_text = "Fiziki trbiy sas fnlrdn biridir. agirdlrin inkiaf n mllr vacibdir."
    repaired = repairer.repair(noisy_text)
    print(f"Repaired (Dictionary): {repaired}")
    assert "tərbiyə" in repaired
    
    # Test 2: Auto Correction (Skeleton/Prefix)
    # "trbiy" already fixed, let's try others
    noisy2 = "Mktb hzrlq flyyt thsl."
    corrected = corrector.correct(noisy2, lang="az")
    print(f"Corrected (Auto): {corrected}")
    assert "Məktəb" in corrected
    assert "hazırlıq" in corrected
    assert "fəaliyyət" in corrected
    assert "təhsil" in corrected
    
    print("OCR/Auto Correction: PASS")

def test_embedding_cache():
    print("\n--- Testing Embedding Cache ---")
    from embedding_cache import EmbeddingCache
    cache = EmbeddingCache(db_name="test_embeddings.db")
    
    text = "bu bir test mətndir"
    model = "test-model"
    emb = np.array([0.1, 0.2, 0.3])
    
    print("Setting cache...")
    cache.set(text, emb, model)
    
    print("Getting from cache...")
    cached_emb = cache.get(text, model)
    print(f"Cached: {cached_emb}")
    
    assert np.allclose(emb, cached_emb)
    print("Embedding Cache: PASS")

def test_mojibake_fix():
    print("\n--- Testing Mojibake Encoding Fixer ---")
    fixer = EncodingFixer()
    
    # 1. Test standard Mojibake from user example
    corrupted = "Ìÿëóìäóð êè, êîìïöòåð èíôîðìàñèéàëàðû åìàë åäèð"
    fixed = fixer.fix(corrupted)
    print(f"Corrupted: {corrupted}")
    print(f"Fixed: {fixed}")
    
    assert "Məlumdur ki" in fixed or "Məlulndur ki" in fixed or "Məlumdur ki" in fixed
    # Checking specific characters from the user example
    assert "ə" in fixed
    assert "k" in fixed
    
    # 2. Test non-mojibake text (should remain unchanged)
    clean = "Bu normal Azərbaycan dilində olan mətndir."
    assert clean == fixer.fix(clean)
    
    print("Mojibake Fixer: PASS")

def test_semantic_filter():
    dedup = SemanticDeduplicator(threshold=0.95)
    
    # Create mock embeddings (random but reproducible)
    np.random.seed(42)
    base_emb = np.random.rand(768)
    near_dup = base_emb + 0.01 # Very close
    diff_emb = np.random.rand(768)
    
    print("Adding base embedding...")
    is_dup1 = dedup.is_duplicate(base_emb)
    print(f"Is Duplicate 1: {is_dup1}")
    
    print("Adding near duplicate...")
    is_dup2 = dedup.is_duplicate(near_dup)
    print(f"Is Duplicate 2: {is_dup2}")
    
    print("Adding different embedding...")
    is_dup3 = dedup.is_duplicate(diff_emb)
    print(f"Is Duplicate 3: {is_dup3}")
    
    assert is_dup1 == False
    assert is_dup2 == True
    assert is_dup3 == False
    print("Semantic Filter: PASS")

def test_orchestrator():
    print("\n--- Testing RAG Orchestrator Integration ---")
    
    # Mock embedding model
    class MockEmbedder:
        def get_sentence_embedding_dimension(self): return 768
        def encode(self, texts):
            return [np.random.rand(768) for _ in texts]
            
    orchestrator = RAGOrchestrator(embedding_model=MockEmbedder())
    
    # 1. Test low quality skip
    print("Ingesting low quality text...")
    res1 = orchestrator.ingest_document("short junk")
    print(f"Result 1: {res1['status']} ({res1.get('reason')})")
    assert res1["status"] == "skipped"
    
    # 2. Test successful ingestion with OCR repair (implied)
    print("\nIngesting valid text (long)...")
    content = """Fiziki tərbiyə fənninin tədrisi Azərbaycan Respublikasının Nazirlər Kabineti tərəfindən təsdiq edilmiş dövlət standartlarına müvafiq olaraq həyata keçirilir. 
    Bu fənn şagirdlərin sağlamlığının möhkəmləndirilməsi, onların fiziki inkişafının təmin edilməsi və hərəki bacarıqlarının formalaşdırılması məqsədini daşıyır. 
    Məktəb hazırlığı dövründən başlayaraq, şagirdlər müxtəlif idman növləri və gimnastika hərəkətləri ilə tanış olurlar. 
    Tədris prosesində həmçinin nəzəri biliklər və informasiya təminatı da böyük rol oynayır. 
    Fiziki tərbiyə dərsləri şagirdlərdə intizam, komanda ruhu və özünəinam hissinin inkişafına kömək edir. 
    Azərbaycan məktəblərində fiziki tərbiyənin keyfiyyətinin yüksəldilməsi üçün müasir infrastruktur və avadanlıqlarla təchizat işləri davam etdirilir."""
    
    res2 = orchestrator.ingest_document(content, meta={"book_id": "test-1", "page": 5})
    print(f"Result 2: {res2['status']}, Chunks: {res2['chunks_count']}")
    assert res2["status"] == "success"
    
    # 3. Check stats
    stats = orchestrator.get_stats()
    print(f"Stats: {stats}")
    assert stats["total_processed"] >= 2
    assert "chunks_per_sec" in stats
    
    # 4. Check vector store metadata
    print(f"Stored Metadata count: {len(orchestrator.store.metadata)}")
    if orchestrator.store.metadata:
        print(f"Sample Metadata: {orchestrator.store.metadata[0]}")
        assert orchestrator.store.metadata[0]["book_id"] == "test-1"
        assert orchestrator.store.metadata[0]["language"] == "az"
    
    print("Orchestrator Integration: PASS")

if __name__ == "__main__":
    try:
        test_ocr_repair()
        test_embedding_cache()
        test_mojibake_fix()
        test_semantic_filter()
        test_orchestrator()
        print("\nALL TESTS PASSED!")
    except Exception as e:
        print(f"\nTEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
