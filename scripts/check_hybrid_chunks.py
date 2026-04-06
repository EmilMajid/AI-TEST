import json
import sys

def check_chunks():
    file_path = 'data/azerbaycan-tarixi-7-chunks.jsonl'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        print(f"Total chunks in file: {len(lines)}")
        
        # Read the first few lines to see the results
        for idx, line in enumerate(lines[:5]):
            data = json.loads(line)
            mode = "HYBRID (Healed)" if data.get('metadata', {}).get('hybrid_mode') else "RAW/MANUAL"
            # Some earlier pages didn't even have hybrid metadata if they failed or were user-provided
            text_preview = data.get('text', '')[:150].replace('\n', ' ')
            print(f"Page {data.get('page')}: [{mode}] {text_preview}")
            
    except Exception as e:
        print(f"Error reading file: {e}")

if __name__ == "__main__":
    check_chunks()
