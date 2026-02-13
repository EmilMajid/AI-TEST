import os

def fix_file():
    path = 'scripts/rag_content_extractor.py'
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    start_idx = -1
    end_idx = -1
    
    # Marker 1: Start of garbage (orphan regex)
    # text = re.sub(r"([.,!?])([^\s])", r"\1 \2", text) # Add space after punct
    start_marker = 'text = re.sub(r"([.,!?])([^\s])", r"\\1 \\2", text)'
    
    # Marker 2: End of garbage (start of next valid method)
    end_marker = 'def is_valid_text(self, text: str) -> bool:'
    
    for i, line in enumerate(lines):
        if 'text = re.sub(r"([.,!?])([^\s])", r"\\1 \\2", text)' in line or 'Add space after punct' in line:
            # Verify context to avoid false positives (should be inside class but not inside a valid method)
            # In our case, it's right after calculate_quality_score
            if start_idx == -1:
                start_idx = i
                print(f"Found start at line {i+1}: {line.strip()}")
        
        if 'def is_valid_text(self, text: str) -> bool:' in line:
            end_idx = i
            print(f"Found end at line {i+1}: {line.strip()}")
            # Break if we found start and this is after start
            if start_idx != -1:
                break
    
    if start_idx != -1 and end_idx != -1:
        print(f"Removing lines {start_idx+1} to {end_idx}")
        new_lines = lines[:start_idx] + lines[end_idx:]
        
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("File updated successfully.")
    else:
        print("Could not find patterns.")
        # Fallback: Just print lines around expected area to debug
        print("Lines 160-170:")
        for j in range(160, 170):
            if j < len(lines):
                print(f"{j+1}: {lines[j].strip()}")

if __name__ == '__main__':
    fix_file()
