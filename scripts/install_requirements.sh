#!/bin/bash

echo "🚀 TESTAI.AZ Backend Dependencies yüklənir..."

# Python dependencies
pip install fastapi uvicorn sqlite3 bcrypt pydantic[email] python-multipart

# Create directories
mkdir -p static/uploads
mkdir -p static/textbooks

echo "✅ Bütün dependencies yükləndi!"
echo "📁 static/uploads və static/textbooks qovluqları yaradıldı"
echo ""
echo "📋 Növbəti addımlar:"
echo "1. Fizika 7 (1-ci hissə).zip faylını static/uploads/ qovluğuna yerləşdirin"
echo "2. python scripts/setup_textbook.py - dərsliyi quraşdırmaq üçün"
echo "3. python scripts/fastapi_backend_with_textbooks.py - serveri başlatmaq üçün"
