import os

def check_and_fix(filename):
    if not os.path.exists(filename):
        print(f"{filename} does not exist.")
        return
        
    with open(filename, 'rb') as f:
        content = f.read()
        
    print(f"File {filename} size: {len(content)} bytes")
    # Check for UTF-16 LE BOM or null bytes
    if b'\x00' in content:
        print(f"Warning: Null bytes detected in {filename}. Attempting to convert from UTF-16 to UTF-8...")
        try:
            # Try decoding as UTF-16
            decoded = content.decode('utf-16')
            # Save as standard UTF-8
            with open(filename, 'w', encoding='utf-8') as f_out:
                f_out.write(decoded)
            print(f"Successfully converted {filename} to UTF-8.")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
    else:
        print(f"{filename} appears to be standard text without null bytes.")

check_and_fix('.env')
check_and_fix('.env.local')
