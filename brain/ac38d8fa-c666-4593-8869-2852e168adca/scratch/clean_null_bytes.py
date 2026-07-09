import os

def clean_null_bytes(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'rb') as f:
        content = f.read()
    cleaned = content.replace(b'\x00', b'')
    with open(filename, 'wb') as f_out:
        f_out.write(cleaned)
    print(f"Cleaned null bytes in {filename}. New size: {len(cleaned)} bytes")

clean_null_bytes('.env.local')
clean_null_bytes('.env')
