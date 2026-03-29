import os
import re

def find_stripping_regex():
    scripts_dir = r"c:\Users\User\Downloads\azerbaijanaiplatform\scripts"
    pattern = re.compile(r"re\.sub\(r'\[\^a-zA-Z.*'\]'") # Pattern to find common "non-alpha" filters
    
    suspicious_chars = ["a-zA-Z"]
    
    for root, dirs, files in os.walk(scripts_dir):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    # Check for simple ranges that might exclude AZ characters
                    if "[a-zA-Z]" in content or "[^a-zA-Z]" in content:
                        print(f"Suspicious file: {path}")
                        # Find the lines
                        lines = content.split('\n')
                        for i, line in enumerate(lines):
                            if "[a-zA-Z]" in line or "[^a-zA-Z]" in line:
                                print(f"  Line {i+1}: {line.strip()}")

if __name__ == "__main__":
    find_stripping_regex()
