from pathlib import Path
from html_content_extractor import HTMLContentExtractor
import logging

logging.basicConfig(level=logging.INFO)

def diagnose_html():
    extractor = HTMLContentExtractor()
    test_path = Path("public/textbooks/8/informatika/informatika-8-az")
    
    if not test_path.exists():
        print(f"Path not found: {test_path}")
        return

    print(f"Diagnosing directory: {test_path}")
    
    # Manually check glob patterns
    html_files = []
    for pattern in ['**/*.xhtml', '**/*.html', '**/*.htm']:
        found = list(test_path.glob(pattern))
        print(f"Pattern {pattern} found {len(found)} files")
        html_files.extend(found)
    
    # Check filtering
    exclude_keywords = ['cover', 'nav', 'toc', 'copyright', 'title']
    filtered = [
        f for f in html_files 
        if not any(keyword in f.name.lower() for keyword in exclude_keywords)
    ]
    print(f"After filtering: {len(filtered)} files")
    
    for f in filtered[:5]:
        extracted = extractor.extract_html_file(f)
        if extracted:
            print(f"SUCCESS: {f.name} ({len(extracted['text'])} chars)")
        else:
            print(f"FAILED: {f.name} (Check content length or decompose logic)")
            # Peek at file
            with open(f, 'r', encoding='utf-8') as fh:
                content = fh.read()
                print(f"  Raw length: {len(content)}")
                if len(content) > 0:
                    print(f"  Preview: {content[:100]}")

if __name__ == "__main__":
    diagnose_html()
