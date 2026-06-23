# Hostinger Deploy Kılavuzu

Canlı ortam **Hostinger VPS** üzerinde SSH ile yönetilir. Vercel/Railway kullanılmaz.

## Sunucu yapısı

- Proje dizini: `/var/www/ongel-gayrimenkul`
- Backend: PM2 `backend` process (port 3001)
- Frontend: PM2 `frontend` process (port 3000)
- Reverse proxy: Nginx

## Deploy adımları

### 1. Lokal — değişiklikleri GitHub'a gönder

```bash
git add .
git commit -m "açıklama"
git push origin main
```

### 2. Sunucu — SSH ile bağlan

```bash
ssh root@SUNUCU_IP
# veya
ssh root@ongelgayrimenkul.com
```

### 3. Sunucu — güncelle ve yeniden başlat

```bash
cd /var/www/ongel-gayrimenkul
git pull origin main
bash deploy-scripts/hostinger-deploy.sh
```

Script şunları yapar:
- `backend`: npm install + build
- `frontend`: npm install + build
- PM2 restart (backend + frontend)
- Nginx reload

### 4. Kontrol

```bash
pm2 status
pm2 logs backend --lines 30
pm2 logs frontend --lines 30
```

Tarayıcıda admin panel → Yeni İlan / İlan Düzenle → fotoğraf yükleme testi.

## Windows'tan tek komutla deploy

PowerShell (Git Bash veya OpenSSH gerekir):

```powershell
.\deploy-scripts\hostinger-deploy-remote.ps1 -ServerIP "SUNUCU_IP"
```

## Nginx — 413 hatası (opsiyonel)

Fotoğraf yükleme istekleri Nginx limitine takılırsa `/etc/nginx/sites-available/` altındaki site config'e ekleyin:

```nginx
client_max_body_size 20M;
```

Sonra:

```bash
nginx -t && systemctl reload nginx
```

> Not: Uygulama tarafında fotoğraflar paralel ve sıkıştırılmış yüklenir; çoğu durumda ek Nginx ayarı gerekmez.

## Ortam değişkenleri (sunucuda)

**Backend** — `/var/www/ongel-gayrimenkul/backend/.env`

- `FRONTEND_URL` → canlı site URL'i (örn. `https://ongelgayrimenkul.com`)
- Supabase, JWT, DB ayarları

**Frontend** — `/var/www/ongel-gayrimenkul/frontend/.env.local`

- `NEXT_PUBLIC_API_URL` → `https://ongelgayrimenkul.com/api` (veya backend URL'iniz)

## Sorun giderme

| Sorun | Çözüm |
|-------|--------|
| `git pull` auth hatası | Sunucuda GitHub SSH key veya PAT ayarlayın |
| Build hatası | `pm2 logs` ve build çıktısını kontrol edin |
| 502 Bad Gateway | `pm2 status` — backend/frontend çalışıyor mu? |
| CORS hatası | Backend `.env` içinde `FRONTEND_URL` doğru mu? |
