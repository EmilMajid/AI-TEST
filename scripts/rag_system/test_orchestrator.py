import os
import sys

# Add script directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from rag_orchestrator import RAGOrchestrator

def main():
    # Test script for the new system
    print("Testing Advanced RAG Orchestrator...")
    orchestrator = RAGOrchestrator()
    
    # Text with mixed characters and noise
    # We use a safe string for terminal print
    sample_text = "FIRAT HUSEYNOV Umumtehsil mekteblerinin 8-ci sinfi ucun FIZIKI TERBIYE fenni uzre DERSLIK"
    
    print("Attempting to ingest sample text...")
    try:
        # We can still pass the complex text to the function, just don't print it directly to terminal
        complex_text = "FİRAT HÜSEYNOV Ôìóìòÿùñèë ìÿêòÿáëÿðèíèí -úè ñèíôè ö÷öí ÔÈÇÈÊÈ ÒßÐÁÈÉß ôÿííè öçðÿ ÄßÐÑËÈÊ"
        result = orchestrator.ingest_document(complex_text)
        
        print(f"Ingestion result status: {result['status']}")
        if result['status'] == 'success':
            print(f"Chunks created: {result['chunks_count']}")
            print(f"Detected language: {result['language']}")
            print(f"Quality score: {result['quality']}")
        
        print("\nMonitoring Stats:")
        for k, v in orchestrator.get_stats().items():
            print(f"  {k}: {v}")
            
    except Exception as e:
        print(f"Error during ingestion: {e}")

if __name__ == "__main__":
    main()
