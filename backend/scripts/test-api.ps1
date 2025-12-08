# Backend API Test Script (PowerShell)
# Kullanım: .\scripts\test-api.ps1

$BASE_URL = "http://localhost:3001/api"

Write-Host "=== Backend API Test Script ===" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check (Swagger)
Write-Host "1. Swagger UI Kontrolü..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/docs" -Method Get -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "   Swagger UI: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   Swagger UI erişilemiyor" -ForegroundColor Red
}

# 2. Public Endpoints
Write-Host ""
Write-Host "2. Public Endpoint Testleri..." -ForegroundColor Yellow

# CMS Pages
Write-Host "   - CMS Pages (Public)" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/cms/pages/about" -Method Get -ErrorAction SilentlyContinue
    Write-Host "   ✅ CMS endpoint çalışıyor" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  CMS endpoint henüz içerik yok" -ForegroundColor Yellow
}

# Footer Links
Write-Host "   - Footer Links (Public)" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/footer/links" -Method Get -ErrorAction SilentlyContinue
    Write-Host "   ✅ Footer endpoint çalışıyor" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Footer endpoint henüz içerik yok" -ForegroundColor Yellow
}

# 3. Login Test
Write-Host ""
Write-Host "3. Login Testi..." -ForegroundColor Yellow
Write-Host "   Email: admin@ongel.com" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
Write-Host ""

$loginBody = @{
    email = "admin@ongel.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $TOKEN = $loginResponse.access_token
    
    if ($TOKEN) {
        Write-Host "   ✅ Login başarılı!" -ForegroundColor Green
        Write-Host "   Token: $($TOKEN.Substring(0, [Math]::Min(50, $TOKEN.Length)))..." -ForegroundColor Gray
        
        # 4. Protected Endpoints
        Write-Host ""
        Write-Host "4. Protected Endpoint Testleri..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "Bearer $TOKEN"
        }
        
        # Users List
        Write-Host "   - Users List" -ForegroundColor Gray
        try {
            $users = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Get -Headers $headers
            Write-Host "   ✅ Users endpoint çalışıyor ($($users.Count) kullanıcı)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Users endpoint hatası: $_" -ForegroundColor Red
        }
        
        # Listings List
        Write-Host "   - Listings List" -ForegroundColor Gray
        try {
            $listings = Invoke-RestMethod -Uri "$BASE_URL/listings" -Method Get -Headers $headers
            Write-Host "   ✅ Listings endpoint çalışıyor ($($listings.Count) ilan)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Listings endpoint hatası: $_" -ForegroundColor Red
        }
        
        # Leads List
        Write-Host "   - Leads List" -ForegroundColor Gray
        try {
            $leads = Invoke-RestMethod -Uri "$BASE_URL/leads" -Method Get -Headers $headers
            Write-Host "   ✅ Leads endpoint çalışıyor ($($leads.Count) lead)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Leads endpoint hatası: $_" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   ❌ Login başarısız! Kullanıcı oluşturulmuş mu kontrol edin." -ForegroundColor Red
    Write-Host "   Hata: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Tamamlandı ===" -ForegroundColor Cyan

