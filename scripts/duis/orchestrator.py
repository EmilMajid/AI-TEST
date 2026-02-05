import os
import json
import subprocess
import sys

from discovery import discover
from healer import heal, sync_topics
from extractor import DuisExtractor
from chunker import DuisChunker
from generator import DuisGenerator

class DuisOrchestrator:
    def __init__(self):
        self.extractor = DuisExtractor()
        self.chunker = DuisChunker()
        self.generator = DuisGenerator()
        if sys.stdout.encoding != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')

    def integrate_book(self, grade, subject_slug, textbook_dir, limit_chunks=None):
        print(f"\n🚀 Starting DUİS Integration: {subject_slug} (Grade {grade})")
        
        # 1. Healing & Discovery check
        print("--- Step 1: Discovery & Healing ---")
        heal()
        
        # 2. Extract Topics
        print("--- Step 2: Topic Extraction ---")
        topics_data = self.extractor.get_topics(textbook_dir)
        if not topics_data:
            print("❌ Failed to extract topics automatically.")
            return False
        
        print(f"✅ Found {len(topics_data['topics'])} topics from {topics_data['type']}")
        
        # 2b. Sync Metadata
        print("--- Step 2b: Metadata Synchronization ---")
        book_id = os.path.basename(textbook_dir)
        sync_topics(book_id, topics_data, grade=grade)
        
        # 3. Chunking
        print("--- Step 3: Multi-Modal Chunking ---")
        chunk_success = self.chunker.chunk(textbook_dir, topics_data)
        if not chunk_success:
            print(f"❌ Chunking failed for {subject_slug}")
            return False
            
        # 4. Generation
        print("--- Step 4: Gold Standard Generation ---")
        book_id = os.path.basename(textbook_dir)
        # Use a more descriptive subject title if possible, or fallback to slug
        subject_title = topics_data.get("subject", subject_slug.replace("-", " ").capitalize())
        gen_success = self.generator.generate_for_book(book_id, grade, subject_title, limit=limit_chunks)
        
        if gen_success:
            print(f"\n🏆 DUİS Integration Successful for {subject_slug}")
            print(f"  - Topics: {len(topics_data['topics'])}")
            print(f"  - Output: data/question_bank_duis.json")
            return True
        else:
            print(f"❌ Generation stage failed for {subject_slug}")
            return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="DUİS Orchestrator")
    parser.add_argument("--grade", required=True)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--dir", required=True)
    parser.add_argument("--limit", type=int, default=None, help="Limit number of chunks to generate")

    args = parser.parse_args()
    orch = DuisOrchestrator()
    orch.integrate_book(args.grade, args.subject, args.dir, limit_chunks=args.limit)
