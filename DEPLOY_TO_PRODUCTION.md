# 🚀 Canlıya Deploy Rehberi

## Hızlı Deploy (Script ile)

### 1. SSH ile Sunucuya Bağlan

```bash
ssh root@72.60.39.172
# veya kullanıcı adınız varsa:
ssh kullanici@72.60.39.172
```

### 2. Deploy Script'i Çalıştır

```bash
cd /var/www/ongel-gayrimenkul
chmod +x deploy-scripts/hostinger-deploy.sh
./deploy-scripts/hostinger-deploy.sh
```

---

## Manuel Deploy (Adım Adım)

### 1. SSH ile Sunucuya Bağlan

```bash
ssh root@72.60.39.172
```

### 2. Proje Dizinine Git

```bash
cd /var/www/ongel-gayrimenkul
```

### 3. Git Pull (Yeni Değişiklikleri Çek)

```bash
git pull origin main
```

### 4. Backend Güncelle

```bash
cd backend

# Yeni paketleri yükle (nodemailer eklendi)
npm install

# Build yap
npm run build

# PM2 restart
pm2 restart backend
```

### 5. Frontend Güncelle

```bash
cd ../frontend

# Yeni paketleri yükle (varsa)
npm install

# Build yap
npm run build

# PM2 restart
pm2 restart frontend
```

### 6. Nginx Reload

```bash
nginx -t  # Config kontrolü
systemctl reload nginx
```

### 7. Kontrol

```bash
# PM2 durumu
pm2 status

# Backend logları
pm2 logs backend --lines 50

# Frontend logları
pm2 logs frontend --lines 50
```

---

## ⚠️ Önemli: Environment Variables

Backend `.env` dosyasında SMTP ayarlarını kontrol edin:

```bash
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

**Eklenecek/Güncellenecek değişkenler:**

```env
# Email Configuration (YENİ)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@ongelgayrimenkul.com
SMTP_PASSWORD=Ongel1234!!
SMTP_FROM=info@ongelgayrimenkul.com
SMTP_SECURE=false
CONTACT_EMAIL=info@ongelgayrimenkul.com
```

**Not:** Hostinger'ın SMTP ayarlarını kullanıyorsanız:
- SMTP_HOST: `smtp.hostinger.com` veya `smtp.titan.email`
- SMTP_PORT: `587` (TLS) veya `465` (SSL)
- SMTP_USER: E-posta adresiniz (örn: `info@ongelgayrimenkul.com`)
- SMTP_PASSWORD: E-posta şifreniz

---

## 🔍 Sorun Giderme

### Backend Çalışmıyor

```bash
# PM2 logları kontrol et
pm2 logs backend --lines 100

# Backend'i manuel başlat
cd /var/www/ongel-gayrimenkul/backend
npm run start:prod

# Hata varsa, PM2'ye ekle
pm2 start dist/main.js --name backend
```

### Frontend Çalışmıyor

```bash
# PM2 logları kontrol et
pm2 logs frontend --lines 100

# Frontend'i manuel başlat
cd /var/www/ongel-gayrimenkul/frontend
npm run start

# Hata varsa, PM2'ye ekle
pm2 start npm --name frontend -- start
```

### Database Migration (Blog Tablosu)

TypeORM `synchronize: true` modunda otomatik oluşturur. Eğer hata alırsanız:

```bash
# Backend loglarında migration hatası varsa
cd /var/www/ongel-gayrimenkul/backend
npm run typeorm migration:run
```

---

## ✅ Deploy Sonrası Kontrol Listesi

- [ ] Backend çalışıyor mu? (`pm2 status`)
- [ ] Frontend çalışıyor mu? (`pm2 status`)
- [ ] Site açılıyor mu? (`https://ongelgayrimenkul.com`)
- [ ] Blog sayfası çalışıyor mu? (`https://ongelgayrimenkul.com/blog`)
- [ ] İletişim formu çalışıyor mu? (`https://ongelgayrimenkul.com/contact`)
- [ ] Admin panel açılıyor mu? (`https://ongelgayrimenkul.com/onglgyrmnkl-admin`)
- [ ] CMS sayfaları düzenlenebiliyor mu?
- [ ] Blog yönetimi çalışıyor mu?

---

## 📝 Hızlı Komutlar

```bash
# Tüm servisleri restart
pm2 restart all

# Tüm logları göster
pm2 logs

# PM2 durumu
pm2 status

# Nginx config test
nginx -t

# Nginx restart
systemctl restart nginx
```

