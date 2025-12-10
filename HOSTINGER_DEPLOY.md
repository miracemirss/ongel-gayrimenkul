# 🚀 Hostinger'a Deploy Rehberi

## 📋 Gereksinimler

Hostinger'da **VPS** veya **Cloud Hosting** paketi gerekli (Shared hosting yeterli değil).

**Minimum Gereksinimler:**
- ✅ Node.js 18+ desteği
- ✅ SSH erişimi
- ✅ Root/sudo yetkisi
- ✅ 2GB+ RAM (önerilen: 4GB)
- ✅ 20GB+ disk alanı

---

## 🎯 Adım 1: Hostinger VPS/Cloud Hazırlığı

### 1.1 VPS/Cloud Paketi Satın Alın

1. Hostinger Dashboard → **VPS** veya **Cloud Hosting**
2. Uygun paketi seçin (en az 2GB RAM)
3. İşletim sistemi: **Ubuntu 22.04 LTS** (önerilen)

### 1.2 SSH Erişimi

Hostinger size şunları verecek:
- **IP Adresi:** `xxx.xxx.xxx.xxx`
- **SSH Port:** `22` (genellikle)
- **Root Password:** veya SSH key

**Windows'ta SSH:**
```powershell
# PowerShell veya Git Bash
ssh root@xxx.xxx.xxx.xxx
```

**Veya PuTTY kullanın:**
- Host: `xxx.xxx.xxx.xxx`
- Port: `22`
- Connection type: `SSH`

---

## 🛠️ Adım 2: Sunucu Kurulumu

### 2.1 Sistem Güncellemesi

```bash
# Sunucuya SSH ile bağlanın
ssh root@xxx.xxx.xxx.xxx

# Sistem güncelle
apt update && apt upgrade -y
```

### 2.2 Node.js Kurulumu

```bash
# Node.js 20.x kurulumu (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Kontrol
node --version  # v20.x.x olmalı
npm --version   # 10.x.x olmalı
```

### 2.3 PM2 Kurulumu (Process Manager)

```bash
# PM2 global kurulum
npm install -g pm2

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
# Çıkan komutu çalıştırın (sudo ...)
```

### 2.4 Nginx Kurulumu (Reverse Proxy)

```bash
# Nginx kurulumu
apt install -y nginx

# Nginx başlat
systemctl start nginx
systemctl enable nginx

# Kontrol
systemctl status nginx
```

### 2.5 Git Kurulumu

```bash
# Git kurulumu
apt install -y git
```

### 2.6 PostgreSQL (Opsiyonel - Supabase kullanıyorsanız gerekmez)

Eğer Supabase kullanmaya devam edecekseniz, PostgreSQL kurmanıza gerek yok.

```bash
# Sadece Supabase kullanmayacaksanız:
apt install -y postgresql postgresql-contrib
```

---

## 📦 Adım 3: Proje Kurulumu

### 3.1 Proje Klasörü Oluşturma

```bash
# Ana dizin
cd /var/www
mkdir ongel-gayrimenkul
cd ongel-gayrimenkul
```

### 3.2 GitHub'dan Proje Çekme

```bash
# GitHub repo'nuzu clone edin
git clone https://github.com/[KULLANICI_ADI]/ongel-gayrimenkul.git .

# Veya manuel upload:
# - FileZilla ile dosyaları yükleyin
# - Veya scp ile:
#   scp -r C:\Projects\ongel-gayrimenkul root@xxx.xxx.xxx.xxx:/var/www/ongel-gayrimenkul
```

### 3.3 Backend Kurulumu

```bash
# Backend dizinine git
cd /var/www/ongel-gayrimenkul/backend

# Dependencies yükle
npm install

# Build
npm run build
```

### 3.4 Frontend Kurulumu

```bash
# Frontend dizinine git
cd /var/www/ongel-gayrimenkul/frontend

# Dependencies yükle
npm install

# Production build
npm run build
```

---

## ⚙️ Adım 4: Environment Variables

### 4.1 Backend .env Dosyası

```bash
# Backend dizininde
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

**İçerik:**
```env
# Database (Supabase - değiştirmeyin)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
S3_BUCKET_NAME=listings

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://ongelgayrimenkul.com
```

**Kaydet:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.2 Frontend .env.local Dosyası

```bash
# Frontend dizininde
cd /var/www/ongel-gayrimenkul/frontend
nano .env.local
```

**İçerik:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Kaydet:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 🚀 Adım 5: Backend Başlatma (PM2)

### 5.1 PM2 ile Backend Başlatma

```bash
# Backend dizininde
cd /var/www/ongel-gayrimenkul/backend

# PM2 ile başlat
pm2 start npm --name "backend" -- run start:prod

# PM2 logları
pm2 logs backend

# PM2 durumu
pm2 status

# PM2'yi kaydet (restart sonrası otomatik başlasın)
pm2 save
```

**Backend URL:** `http://localhost:3001` (sadece sunucu içinden erişilebilir)

---

## 🌐 Adım 6: Nginx Yapılandırması

### 6.1 Nginx Config Dosyası

```bash
# Nginx config dosyası oluştur
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**İçerik:**
```nginx
# Backend API (api.ongelgayrimenkul.com veya ongelgayrimenkul.com/api)
server {
    listen 80;
    server_name api.ongelgayrimenkul.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend (ongelgayrimenkul.com)
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

    root /var/www/ongel-gayrimenkul/frontend/.next;
    index index.html;

    # Next.js static files
    location /_next/static {
        alias /var/www/ongel-gayrimenkul/frontend/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Kaydet:** `Ctrl+O`, `Enter`, `Ctrl+X`

### 6.2 Nginx Config'i Aktif Etme

```bash
# Symbolic link oluştur
ln -s /etc/nginx/sites-available/ongelgayrimenkul /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Nginx config test
nginx -t

# Nginx restart
systemctl restart nginx
```

---

## 🎨 Adım 7: Frontend Başlatma (PM2)

### 7.1 Next.js Standalone Build (Önerilen)

Next.js standalone build kullanarak daha küçük bir build oluşturabilirsiniz.

**`frontend/next.config.js` güncelle:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

**Yeniden build:**
```bash
cd /var/www/ongel-gayrimenkul/frontend
npm run build
```

### 7.2 PM2 ile Frontend Başlatma

```bash
# Frontend dizininde
cd /var/www/ongel-gayrimenkul/frontend

# PM2 ile başlat
pm2 start npm --name "frontend" -- run start

# PM2 logları
pm2 logs frontend

# PM2 durumu
pm2 status

# PM2'yi kaydet
pm2 save
```

**Frontend URL:** `http://localhost:3000` (sadece sunucu içinden erişilebilir)

---

## 🔒 Adım 8: SSL Sertifikası (Let's Encrypt)

### 8.1 Certbot Kurulumu

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx
```

### 8.2 SSL Sertifikası Alma

```bash
# SSL sertifikası al (hem www hem www olmayan için)
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com

# Otomatik yenileme test
certbot renew --dry-run
```

**Certbot otomatik olarak:**
- ✅ SSL sertifikası alır
- ✅ Nginx config'i günceller (HTTPS yönlendirmesi)
- ✅ Otomatik yenileme ayarlar

### 8.3 Nginx Config Güncelleme (Certbot Sonrası)

Certbot Nginx config'i otomatik günceller, ama manuel kontrol edebilirsiniz:

```bash
nano /etc/nginx/sites-available/ongelgayrimenkul
```

HTTPS yönlendirmesi ve SSL ayarları otomatik eklenmiş olmalı.

---

## 🌍 Adım 9: Domain DNS Ayarları

### 9.1 Hostinger DNS Yönetimi

**Hostinger Dashboard → Domain → DNS Management**

**A Record (Root domain):**
```
Type: A
Name: @
Value: [SUNUCU_IP_ADRESI]
TTL: 3600
```

**A Record (www):**
```
Type: A
Name: www
Value: [SUNUCU_IP_ADRESI]
TTL: 3600
```

**A Record (api subdomain):**
```
Type: A
Name: api
Value: [SUNUCU_IP_ADRESI]
TTL: 3600
```

**Veya CNAME (api için):**
```
Type: CNAME
Name: api
Value: ongelgayrimenkul.com
TTL: 3600
```

### 9.2 DNS Propagasyon

DNS değişiklikleri 1-24 saat sürebilir. Genellikle 1-2 saat içinde aktif olur.

**Kontrol:**
```bash
# Terminal'de
nslookup ongelgayrimenkul.com
nslookup api.ongelgayrimenkul.com
```

---

## ✅ Adım 10: Test ve Kontrol

### 10.1 Backend Test

```bash
# Sunucuda
curl http://localhost:3001/api

# Dışarıdan (browser'da)
https://api.ongelgayrimenkul.com/api/docs
```

### 10.2 Frontend Test

```bash
# Sunucuda
curl http://localhost:3000

# Dışarıdan (browser'da)
https://ongelgayrimenkul.com
```

### 10.3 PM2 Durumu

```bash
pm2 status
pm2 logs
```

### 10.4 Nginx Durumu

```bash
systemctl status nginx
nginx -t
```

---

## 🔄 Adım 11: Güncelleme ve Bakım

### 11.1 Kod Güncelleme

```bash
# Proje dizinine git
cd /var/www/ongel-gayrimenkul

# GitHub'dan çek
git pull origin main

# Backend güncelle
cd backend
npm install
npm run build
pm2 restart backend

# Frontend güncelle
cd ../frontend
npm install
npm run build
pm2 restart frontend
```

### 11.2 Log Kontrolü

```bash
# PM2 logları
pm2 logs

# Nginx logları
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Backend logları (PM2)
pm2 logs backend

# Frontend logları (PM2)
pm2 logs frontend
```

---

## 🆘 Sorun Giderme

### Backend Çalışmıyor

```bash
# PM2 durumu
pm2 status

# Backend logları
pm2 logs backend

# Backend'i yeniden başlat
pm2 restart backend

# Port kontrolü
netstat -tulpn | grep 3001
```

### Frontend Çalışmıyor

```bash
# PM2 durumu
pm2 status

# Frontend logları
pm2 logs frontend

# Frontend'i yeniden başlat
pm2 restart frontend

# Port kontrolü
netstat -tulpn | grep 3000
```

### Nginx Çalışmıyor

```bash
# Nginx durumu
systemctl status nginx

# Nginx config test
nginx -t

# Nginx restart
systemctl restart nginx

# Nginx logları
tail -f /var/log/nginx/error.log
```

### SSL Sertifikası Sorunu

```bash
# SSL sertifikası durumu
certbot certificates

# SSL sertifikası yenile
certbot renew

# SSL sertifikası yeniden al
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com --force-renewal
```

### Database Bağlantı Hatası

```bash
# Backend logları
pm2 logs backend

# .env dosyasını kontrol et
cat /var/www/ongel-gayrimenkul/backend/.env

# DATABASE_URL doğru mu?
# Supabase connection string doğru mu?
```

---

## 📝 Özet Komutlar

```bash
# PM2 komutları
pm2 status              # Durum
pm2 logs                # Tüm loglar
pm2 restart backend     # Backend restart
pm2 restart frontend    # Frontend restart
pm2 stop all            # Tümünü durdur
pm2 start all           # Tümünü başlat
pm2 save                # Kaydet

# Nginx komutları
nginx -t                # Config test
systemctl restart nginx # Restart
systemctl status nginx  # Durum

# SSL komutları
certbot certificates    # Sertifika durumu
certbot renew           # Yenile
```

---

## 🎯 Sonuç

Artık projeniz Hostinger'da çalışıyor:
- ✅ Frontend: `https://ongelgayrimenkul.com`
- ✅ Backend: `https://api.ongelgayrimenkul.com/api`
- ✅ SSL: Otomatik HTTPS
- ✅ PM2: Otomatik restart
- ✅ Nginx: Reverse proxy

**Not:** İlk kurulumdan sonra, kod güncellemeleri için "Güncelleme ve Bakım" bölümünü kullanın.

