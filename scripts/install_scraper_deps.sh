#!/bin/bash

echo "🕷️ Web Scraping Dependencies yüklənir..."

# Python dependencies
pip install selenium beautifulsoup4 requests webdriver-manager

# ChromeDriver avtomatik yükləmə
pip install webdriver-manager

echo "✅ Scraping dependencies yükləndi!"
echo ""
echo "📋 Növbəti addımlar:"
echo "1. python scripts/e_derslik_scraper.py - test scraping"
echo "2. python scripts/fastapi_with_scraper.py - API serveri"
echo "3. http://localhost:3000/admin - Admin panel"
echo ""
echo "⚠️ Qeyd: ChromeDriver avtomatik yüklənəcək"
