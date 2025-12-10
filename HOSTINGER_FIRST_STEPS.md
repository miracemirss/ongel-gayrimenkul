# 🚀 Hostinger İlk Kurulum - Adım Adım

## ✅ SSH Bağlantısı Tamamlandı!

Sunucu bilgileri:
- **OS:** Ubuntu 24.04.3 LTS
- **IP:** 72.60.39.172
- **Durum:** Hazır ✅

---

## 📋 Adım 1: Sistem Güncellemesi

Terminal'de (SSH bağlantısında) şunu çalıştırın:

```bash
apt update && apt upgrade -y
```

Bu işlem 2-5 dakika sürebilir.

---

## 📦 Adım 2: Node.js Kurulumu

```bash
# Node.js 20.x (LTS) kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Kontrol
node --version
npm --version
```

**Beklenen çıktı:**
- `node --version` → `v20.x.x`
- `npm --version` → `10.x.x`

---

## 🔧 Adım 3: PM2 Kurulumu (Process Manager)

```bash
# PM2 global kurulum
npm install -g pm2

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
```

**ÖNEMLİ:** `pm2 startup` komutundan sonra bir komut çıkacak (örnek: `sudo env PATH=...`). Bu komutu kopyalayıp çalıştırın!

### 📝 PM2 Startup Detaylı Açıklama

**Ne yapar?**
- PM2'yi sistem başlangıcında (reboot sonrası) otomatik başlatır
- Kaydedilmiş tüm PM2 process'lerini otomatik olarak yeniden başlatır

**Nasıl çalışır?**

1. **`pm2 startup` komutunu çalıştırdığınızda:**
   ```bash
   pm2 startup
   ```
   
   **Çıktı örneği:**
   ```
   [PM2] Init System found: systemd
   [PM2] To setup the Startup Script, copy/paste the following command:
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
   ```

2. **Çıkan komutu kopyalayın ve çalıştırın:**
   ```bash
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
   ```
   
   **Çıktı örneği:**
   ```
   [PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
   [PM2] Making script booting at startup...
   [PM2] [-] Executing: systemctl enable pm2-root...
   Created symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service → /etc/systemd/system/pm2-root.service.
   [PM2] [v] Command successfully executed.
   +---------------------------------------+
   [PM2] Freeze a process list on reboot via:
   pm2 save
   +---------------------------------------+
   ```

3. **PM2'yi kaydedin:**
   ```bash
   pm2 save
   ```
   
   Bu komut, şu anda çalışan tüm PM2 process'lerini kaydeder. Böylece sistem yeniden başladığında otomatik olarak başlatılırlar.

**Test:**
```bash
# PM2 durumunu kontrol edin
pm2 status

# Bir process başlatın (örnek)
pm2 start npm --name "test" -- run start

# Kaydedin
pm2 save

# Sistem yeniden başlatıldığında otomatik başlayacak
```

**Not:** Eğer `pm2 startup` komutu hata verirse veya komut çıkmazsa, manuel olarak systemd service oluşturabilirsiniz (ama genellikle gerekmez).

---

## 🌐 Adım 4: Nginx ve Git Kurulumu

```bash
# Nginx kurulumu
apt install -y nginx

# Git kurulumu
apt install -y git

# Nginx başlat
systemctl start nginx
systemctl enable nginx

# Kontrol
systemctl status nginx
```

---

## 📁 Adım 5: Proje Dizini Oluşturma

```bash
# Proje dizini oluştur
mkdir -p /var/www/ongel-gayrimenkul
cd /var/www/ongel-gayrimenkul
```

---

## 📤 Adım 6: Projeyi Yükleme

### Seçenek 1: GitHub'dan Clone (Önerilen)

```bash
# GitHub repo'nuzu clone edin
git clone https://github.com/[KULLANICI_ADI]/ongel-gayrimenkul.git .

# Veya private repo ise:
git clone https://[TOKEN]@github.com/[KULLANICI_ADI]/ongel-gayrimenkul.git .
```

### Seçenek 2: Manuel Upload (SCP/FileZilla)

Windows'tan dosyaları yüklemek için:

**PowerShell'de (Windows'ta):**
```powershell
# SCP ile (Git Bash veya WSL gerekli)
scp -r C:\Projects\ongel-gayrimenkul\backend root@72.60.39.172:/var/www/ongel-gayrimenkul/
scp -r C:\Projects\ongel-gayrimenkul\frontend root@72.60.39.172:/var/www/ongel-gayrimenkul/
```

**Veya FileZilla/WinSCP kullanın:**
- Host: `72.60.39.172`
- Port: `22`
- Username: `root`
- Protocol: `SFTP`
- Dosyaları `/var/www/ongel-gayrimenkul/` dizinine yükleyin

---

## ⚙️ Adım 7: Environment Variables

### Backend .env Dosyası

```bash
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

**İçerik (Supabase bilgilerinizi kullanın):**
```env
# Database (Supabase)
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

**Nano'da kaydetme:**
- `Ctrl+O` → Enter → `Ctrl+X`

### Frontend .env.local Dosyası

```bash
cd /var/www/ongel-gayrimenkul/frontend
nano .env.local
```

**İçerik:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

---

## 🔨 Adım 8: Build ve Kurulum

### Backend Build

```bash
cd /var/www/ongel-gayrimenkul/backend
npm install
npm run build
```

### Frontend Build

```bash
cd /var/www/ongel-gayrimenkul/frontend
npm install
npm run build
```

---

## 🚀 Adım 9: PM2 ile Başlatma

### Backend Başlatma

```bash
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start:prod
pm2 save
```

### Frontend Başlatma

```bash
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start
pm2 save
```

### Kontrol

```bash
pm2 status
pm2 logs
```

---

## 🌐 Adım 10: Nginx Yapılandırması

```bash
# Nginx config dosyası oluştur
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**İçerik:**
```nginx
# Backend API
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

# Frontend
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

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

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Aktif et:**
```bash
# Symbolic link oluştur
ln -s /etc/nginx/sites-available/ongelgayrimenkul /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Test ve restart
nginx -t
systemctl restart nginx
```

---

## 🔒 Adım 11: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com
```

Certbot size sorular soracak:
- Email adresi (opsiyonel)
- Terms of Service kabulü: `Y`
- Email paylaşımı (opsiyonel): `N` veya `Y`

---

## 🌍 Adım 12: DNS Ayarları (Hostinger)

**Hostinger Dashboard → Domain → DNS Management**

**A Record ekleyin:**
```
Type: A
Name: @
Value: 72.60.39.172
TTL: 3600
```

```
Type: A
Name: www
Value: 72.60.39.172
TTL: 3600
```

```
Type: A
Name: api
Value: 72.60.39.172
TTL: 3600
```

**DNS propagasyon:** 1-24 saat (genellikle 1-2 saat)

---

## ✅ Adım 13: Test

### Backend Test

```bash
# Sunucuda
curl http://localhost:3001/api

# Browser'da (DNS propagasyon sonrası)
https://api.ongelgayrimenkul.com/api/docs
```

### Frontend Test

```bash
# Sunucuda
curl http://localhost:3000

# Browser'da (DNS propagasyon sonrası)
https://ongelgayrimenkul.com
```

### PM2 Durumu

```bash
pm2 status
pm2 logs
```

---

## 🆘 Sorun Giderme

### PM2 çalışmıyor
```bash
pm2 logs backend
pm2 logs frontend
pm2 restart all
```

### Nginx çalışmıyor
```bash
systemctl status nginx
nginx -t
tail -f /var/log/nginx/error.log
```

### Port kullanımda
```bash
netstat -tulpn | grep 3000
netstat -tulpn | grep 3001
```

---

## 📝 Özet Komutlar

```bash
# PM2
pm2 status              # Durum
pm2 logs                # Loglar
pm2 restart backend     # Backend restart
pm2 restart frontend    # Frontend restart

# Nginx
nginx -t                # Config test
systemctl restart nginx # Restart

# SSL
certbot certificates    # Sertifika durumu
certbot renew           # Yenile
```

---

**İyi şanslar! 🚀**

