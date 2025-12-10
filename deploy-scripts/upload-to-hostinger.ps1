# Hostinger'a Dosya Yükleme Scripti (PowerShell)
# Kullanım: .\upload-to-hostinger.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath = "/var/www/ongel-gayrimenkul"
)

Write-Host "🚀 Hostinger'a Dosya Yükleme Başlatılıyor..." -ForegroundColor Green
Write-Host ""

# Kontrol: SCP komutu var mı?
if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SCP komutu bulunamadı!" -ForegroundColor Red
    Write-Host "💡 Çözüm: Git Bash veya WSL kullanın, veya WinSCP/FileZilla kullanın" -ForegroundColor Yellow
    exit 1
}

# Proje dizini
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "📁 Proje Dizini: $ProjectRoot" -ForegroundColor Cyan
Write-Host "🌐 Sunucu: $Username@$ServerIP" -ForegroundColor Cyan
Write-Host "📂 Hedef: $RemotePath" -ForegroundColor Cyan
Write-Host ""

# Onay
$confirm = Read-Host "Devam etmek istiyor musunuz? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ İşlem iptal edildi" -ForegroundColor Red
    exit 0
}

# Dosyaları yükle
Write-Host "📤 Dosyalar yükleniyor..." -ForegroundColor Yellow

# Backend
Write-Host "  📦 Backend yükleniyor..." -ForegroundColor Cyan
scp -r "$ProjectRoot\backend" "${Username}@${ServerIP}:${RemotePath}/"

# Frontend
Write-Host "  📦 Frontend yükleniyor..." -ForegroundColor Cyan
scp -r "$ProjectRoot\frontend" "${Username}@${ServerIP}:${RemotePath}/"

# Package.json (root)
if (Test-Path "$ProjectRoot\package.json") {
    Write-Host "  📦 Root package.json yükleniyor..." -ForegroundColor Cyan
    scp "$ProjectRoot\package.json" "${Username}@${ServerIP}:${RemotePath}/"
}

Write-Host ""
Write-Host "✅ Dosya yükleme tamamlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Sonraki adımlar:" -ForegroundColor Yellow
Write-Host "  1. SSH ile sunucuya bağlanın: ssh $Username@$ServerIP" -ForegroundColor White
Write-Host "  2. cd $RemotePath" -ForegroundColor White
Write-Host "  3. Backend .env dosyasını oluşturun" -ForegroundColor White
Write-Host "  4. Frontend .env.local dosyasını oluşturun" -ForegroundColor White
Write-Host "  5. npm install ve build yapın" -ForegroundColor White
Write-Host "  6. PM2 ile başlatın" -ForegroundColor White

