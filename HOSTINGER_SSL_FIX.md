# 🔒 SSL Sertifikası Sorun Giderme

## ❌ Hatalar

### 1. DNS Hatası (api.ongelgayrimenkul.com)
```
DNS problem: NXDOMAIN looking up A for api.ongelgayrimenkul.com
```
**Sebep:** DNS kaydı yok veya henüz propagate olmamış.

### 2. 404 Hatası (ongelgayrimenkul.com, www.ongelgayrimenkul.com)
```
Invalid response from http://ongelgayrimenkul.com/.well-known/acme-challenge/...
```
**Sebep:** Nginx yapılandırması eksik veya domain sunucuya yönlendirilmemiş.

---

## ✅ Çözüm Adımları

### Adım 1: DNS Kayıtlarını Kontrol Edin

**Hostinger Dashboard → Domain → DNS Management**

Şu kayıtların **HEPSİ** olması gerekiyor:

```
Type: A
Name: @
Value: 72.60.39.172
TTL: 3600

Type: A
Name: www
Value: 72.60.39.172
TTL: 3600

Type: A
Name: api
Value: 72.60.39.172
TTL: 3600
```

**Kontrol:**
```bash
# Sunucuda test edin
nslookup ongelgayrimenkul.com
nslookup www.ongelgayrimenkul.com
nslookup api.ongelgayrimenkul.com
```

**Beklenen çıktı:** Her biri `72.60.39.172` IP'sini göstermeli.

---

### Adım 2: Nginx Yapılandırmasını Kontrol Edin

**SSH'da:**
```bash
# Nginx config dosyasını kontrol edin
cat /etc/nginx/sites-available/ongelgayrimenkul

# Veya düzenleyin
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**Doğru yapılandırma:**
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

**Nginx'i test edin ve restart edin:**
```bash
nginx -t
systemctl restart nginx
```

---

### Adım 3: PM2 Process'lerini Kontrol Edin

**Backend ve Frontend çalışıyor mu?**
```bash
pm2 status
```

**Eğer çalışmıyorsa:**
```bash
# Backend
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start:prod

# Frontend
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start

# Kaydet
pm2 save
```

---

### Adım 4: DNS Propagasyon Bekleyin

DNS değişiklikleri **1-24 saat** sürebilir (genellikle **1-2 saat**).

**Kontrol:**
```bash
# Sunucuda
curl -I http://ongelgayrimenkul.com
curl -I http://www.ongelgayrimenkul.com
curl -I http://api.ongelgayrimenkul.com
```

**Beklenen çıktı:** `200 OK` veya `301/302 Redirect`

---

### Adım 5: Önce Tek Domain ile Deneyin (Önerilen)

DNS henüz hazır değilse, önce sadece ana domain ile SSL alın:

```bash
# Sadece ana domain
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
```

**Başarılı olduktan sonra:**
```bash
# API subdomain için ayrı sertifika
certbot --nginx -d api.ongelgayrimenkul.com
```

---

### Adım 6: SSL Sertifikasını Tekrar Alın

**DNS ve Nginx hazır olduktan sonra:**

```bash
# Tüm domain'ler için
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com
```

**Veya adım adım:**
```bash
# 1. Ana domain
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com

# 2. API subdomain (DNS hazır olduktan sonra)
certbot --nginx -d api.ongelgayrimenkul.com
```

---

## 🔍 Sorun Giderme

### DNS Hala Çalışmıyor

1. **Hostinger DNS kayıtlarını kontrol edin**
2. **TTL değerini düşürün (300 veya 600)**
3. **Farklı DNS server'larından test edin:**
   ```bash
   nslookup ongelgayrimenkul.com 8.8.8.8
   nslookup ongelgayrimenkul.com 1.1.1.1
   ```

### Nginx 404 Hatası

1. **Nginx config'i kontrol edin:**
   ```bash
   nginx -t
   ```

2. **Nginx loglarını kontrol edin:**
   ```bash
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

3. **PM2 process'lerini kontrol edin:**
   ```bash
   pm2 logs
   ```

### Certbot Hata Veriyor

1. **Certbot loglarını kontrol edin:**
   ```bash
   tail -f /var/log/letsencrypt/letsencrypt.log
   ```

2. **Certbot'u verbose modda çalıştırın:**
   ```bash
   certbot --nginx -d ongelgayrimenkul.com -v
   ```

---

## ✅ Başarılı SSL Sonrası

SSL başarılı olduktan sonra:

1. **Nginx otomatik olarak HTTPS yönlendirmesi ekler**
2. **Sertifikalar otomatik yenilenir** (Let's Encrypt)
3. **Browser'da kilit ikonu görünür**

**Test:**
```bash
# HTTPS test
curl -I https://ongelgayrimenkul.com
curl -I https://api.ongelgayrimenkul.com/api/docs
```

---

## 📝 Özet

1. ✅ DNS kayıtlarını ekleyin (Hostinger)
2. ✅ DNS propagasyon bekleyin (1-2 saat)
3. ✅ Nginx yapılandırmasını kontrol edin
4. ✅ PM2 process'lerini başlatın
5. ✅ Önce tek domain ile SSL alın
6. ✅ Sonra API subdomain için SSL alın

**Not:** DNS propagasyon tamamlanmadan SSL sertifikası alınamaz!

