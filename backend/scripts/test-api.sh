#!/bin/bash

# Backend API Test Script
# Kullanım: ./scripts/test-api.sh

BASE_URL="http://localhost:3001/api"

echo "=== Backend API Test Script ==="
echo ""

# 1. Health Check (Swagger)
echo "1. Swagger UI Kontrolü..."
curl -s -o /dev/null -w "Swagger UI: %{http_code}\n" "$BASE_URL/docs" || echo "Swagger UI erişilemiyor"

# 2. Public Endpoints
echo ""
echo "2. Public Endpoint Testleri..."

# CMS Pages
echo "   - CMS Pages (Public)"
curl -s -X GET "$BASE_URL/cms/pages/about" | head -c 100
echo ""

# Footer Links
echo "   - Footer Links (Public)"
curl -s -X GET "$BASE_URL/footer/links" | head -c 100
echo ""

# 3. Login Test
echo ""
echo "3. Login Testi..."
echo "   Email: admin@ongel.com"
echo "   Password: admin123"
echo ""
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ongel.com",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "   ❌ Login başarısız! Kullanıcı oluşturulmuş mu kontrol edin."
else
  echo "   ✅ Login başarılı!"
  echo "   Token: ${TOKEN:0:50}..."
  
  # 4. Protected Endpoints
  echo ""
  echo "4. Protected Endpoint Testleri..."
  
  # Users List
  echo "   - Users List"
  curl -s -X GET "$BASE_URL/users" \
    -H "Authorization: Bearer $TOKEN" | head -c 200
  echo ""
  
  # Listings List
  echo "   - Listings List"
  curl -s -X GET "$BASE_URL/listings" \
    -H "Authorization: Bearer $TOKEN" | head -c 200
  echo ""
  
  # Leads List
  echo "   - Leads List"
  curl -s -X GET "$BASE_URL/leads" \
    -H "Authorization: Bearer $TOKEN" | head -c 200
  echo ""
fi

echo ""
echo "=== Test Tamamlandı ==="

