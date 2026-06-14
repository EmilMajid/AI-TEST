$logPath = "C:\Users\User\.gemini\antigravity\brain\3c6d91d4-ab06-4ee4-9598-273f712891fb\.system_generated\logs\transcript_full.jsonl"
Select-String -Path $logPath -Pattern "06-AZT-6" | Select-Object -First 5 | Out-File "C:\Users\User\Downloads\azerbaijanaiplatform\data\raw_extracted_counts.txt" -Encoding utf8
