# Hostinger sunucusunda git pull + deploy calistirir
# Kullanim: .\hostinger-deploy-remote.ps1 -ServerIP "123.45.67.89"
#           .\hostinger-deploy-remote.ps1 -ServerIP "ongelgayrimenkul.com" -Username "root"

param(
    [Parameter(Mandatory = $true)]
    [string]$ServerIP,

    [Parameter(Mandatory = $false)]
    [string]$Username = "root",

    [Parameter(Mandatory = $false)]
    [string]$RemotePath = "/var/www/ongel-gayrimenkul"
)

if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "SSH bulunamadi. OpenSSH Client kurulu olmali." -ForegroundColor Red
    exit 1
}

$remoteCommand = @"
set -e
cd $RemotePath
echo '>>> Git pull...'
git pull origin main
echo '>>> Deploy script...'
bash deploy-scripts/hostinger-deploy.sh
"@

Write-Host "Hostinger deploy baslatiliyor: ${Username}@${ServerIP}" -ForegroundColor Cyan
Write-Host ""

ssh "${Username}@${ServerIP}" $remoteCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deploy tamamlandi." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Deploy basarisiz (exit code: $LASTEXITCODE)" -ForegroundColor Red
    exit $LASTEXITCODE
}
