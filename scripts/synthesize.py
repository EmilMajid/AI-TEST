import sys
import asyncio
import edge_tts

async def main():
    if len(sys.argv) < 4:
        print("Usage: python synthesize.py <voice> <output_file> <text>")
        sys.exit(1)
        
    voice = sys.argv[1]
    output_file = sys.argv[2]
    text = sys.argv[3]
    
    comm = edge_tts.Communicate(text, voice, rate="-5%")
    await comm.save(output_file)
    print("SUCCESS")

if __name__ == "__main__":
    asyncio.run(main())
