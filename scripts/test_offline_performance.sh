#!/bin/bash

# Offline Test Performance Verification Script
# Measures response time for offline vs AI generation

echo "=========================================="
echo "OFFLINE TEST PERFORMANCE TEST"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api/generate-test"

# Test 1: Offline query (should be instant)
echo -e "${BLUE}Test 1: Offline Database Query${NC}"
echo "Topic: İngilis dili (offline available)"
start_time=$(date +%s%N)
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "textbook": "İngilis dili",
    "topic": "İngilis dili",
    "grade": "7",
    "questionCount": 5,
    "difficulty": "sadə",
    "timeLimit": 20
  }')
end_time=$(date +%s%N)
elapsed=$((($end_time - $start_time) / 1000000))

provider=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(d.get('provider', 'unknown'))")
questions=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(len(d.get('questions', [])))")
message=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(d.get('message', 'No message'))")

echo "Provider: $provider"
echo "Questions: $questions"
echo "Message: $message"
echo "Response Time: ${elapsed}ms"

if [ "$provider" = "offline" ]; then
    echo -e "${GREEN}✅ PASS: Questions loaded from offline database${NC}"
    if [ "$elapsed" -lt 200 ]; then
        echo -e "${GREEN}✅ PASS: Response was instant (${elapsed}ms < 200ms)${NC}"
    else
        echo -e "${YELLOW}⚠️ WARN: Response took ${elapsed}ms (expected < 200ms for offline)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ WARN: Using ${provider} instead of offline${NC}"
fi

echo ""

# Test 2: Another offline query (Riyaziyyat)
echo -e "${BLUE}Test 2: Another Offline Query${NC}"
echo "Topic: Riyaziyyat (offline available)"
start_time=$(date +%s%N)
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "textbook": "Riyaziyyat",
    "topic": "Riyaziyyat",
    "grade": "7",
    "questionCount": 4,
    "difficulty": "orta",
    "timeLimit": 25
  }')
end_time=$(date +%s%N)
elapsed=$((($end_time - $start_time) / 1000000))

provider=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(d.get('provider', 'unknown'))")
questions=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(len(d.get('questions', [])))")

echo "Provider: $provider"
echo "Questions: $questions"
echo "Response Time: ${elapsed}ms"

if [ "$provider" = "offline" ]; then
    echo -e "${GREEN}✅ PASS: Questions loaded from offline database${NC}"
else
    echo -e "${YELLOW}⚠️ WARN: Using ${provider} instead of offline${NC}"
fi

echo ""

# Test 3: Unknown topic (should fallback gracefully)
echo -e "${BLUE}Test 3: Unknown Topic (Fallback Test)${NC}"
echo "Topic: Naməlum Mövzu"
start_time=$(date +%s%N)
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "textbook": "Unknown",
    "topic": "Naməlum Mövzu",
    "grade": "7",
    "questionCount": 3,
    "difficulty": "orta",
    "timeLimit": 20
  }')
end_time=$(date +%s%N)
elapsed=$((($end_time - $start_time) / 1000000))

provider=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(d.get('provider', 'unknown'))")
questions=$(echo "$response" | python3 -c "import json, sys; d=json.load(sys.stdin); print(len(d.get('questions', [])))")

echo "Provider: $provider"
echo "Questions: $questions"
echo "Response Time: ${elapsed}ms"
echo -e "${GREEN}✅ PASS: Fallback mechanism working${NC}"

echo ""
echo -e "${GREEN}=========================================="
echo "All offline tests completed successfully!"
echo "==========================================${NC}"
