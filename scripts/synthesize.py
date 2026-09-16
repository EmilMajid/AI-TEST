import sys
import asyncio
import edge_tts

# Force UTF-8 encoding for standard IO on Windows
if sys.version_info >= (3, 7):
    try:
        sys.stdin.reconfigure(encoding='utf-8')
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

async def main():
    if len(sys.argv) < 3:
        print("Usage: python synthesize.py <voice> <output_file> [text]")
        sys.exit(1)
        
    voice = sys.argv[1]
    output_file = sys.argv[2]
    
    if len(sys.argv) >= 4 and sys.argv[3].strip():
        text = sys.argv[3]
    else:
        text = sys.stdin.read().strip()
        
    if not text:
        print("Error: No text provided", file=sys.stderr)
        sys.exit(1)
        
    comm = edge_tts.Communicate(text, voice, rate="-5%")
    await comm.save(output_file)
    print("SUCCESS")

if __name__ == "__main__":
    asyncio.run(main())

