# 🔒 SSL 404 Hatası Çözümü

## ❌ Hata

```
Domain: ongelgayrimenkul.com
Type: unauthorized
Detail: Invalid response from http://ongelgayrimenkul.com/.well-known/acme-challenge/...: 404
```

**Sebep:** Let's Encrypt domain'i doğrulayamıyor. `.well-known/acme-challenge` endpoint'ine erişilemiyor.

---

## ✅ Çözüm Adımları

### Adım 1: DNS Kayıtlarını Kontrol

**SSH'da:**
```bash
# DNS kontrolü
nslookup ongelgayrimenkul.com
nslookup www.ongelgayrimenkul.com
```

**Beklenen çıktı:**
```
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   ongelgayrimenkul.com
Address: 72.60.39.172
```

**Eğer farklı IP gösteriyorsa veya bulamıyorsa:**
- DNS kayıtları henüz propagate olmamış (1-24 saat bekleyin)
- DNS kayıtları yanlış (Hostinger'da kontrol edin)

---

### Adım 2: Domain Erişilebilirliğini Test

**SSH'da:**
```bash
# Domain erişilebilirliği
curl -I http://ongelgayrimenkul.com
curl -I http://www.ongelgayrimenkul.com
```

**Beklenen çıktı:**
```
HTTP/1.1 200 OK
# veya
HTTP/1.1 301 Moved Permanently
# veya
HTTP/1.1 302 Found
```

**Eğer "Connection refused" veya "Could not resolve host" hatası alıyorsanız:**
- DNS kayıtları henüz hazır değil
- Nginx yapılandırması eksik

---

### Adım 3: Nginx Yapılandırmasını Kontrol

**SSH'da:**
```bash
# Nginx config dosyasını kontrol edin
cat /etc/nginx/sites-available/ongelgayrimenkul

# Nginx config test
nginx -t

# Nginx durumu
systemctl status nginx
```

**Doğru yapılandırma:**
```nginx
# Frontend
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

    # Let's Encrypt için .well-known klasörüne erişim
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

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

**ÖNEMLİ:** `.well-known/acme-challenge/` location block'u eklenmeli!

---

### Adım 4: Nginx Config'i Güncelle

**SSH'da:**
```bash
# Nginx config dosyasını düzenleyin
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**İçerik (güncellenmiş):**
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

    # Let's Encrypt için .well-known klasörüne erişim
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

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

**Nginx'i test edin ve restart edin:**
```bash
nginx -t
systemctl restart nginx
```

---

### Adım 5: .well-known Klasörünü Oluştur

**SSH'da:**
```bash
# .well-known klasörünü oluştur
mkdir -p /var/www/html/.well-known/acme-challenge

# İzinleri ayarla
chmod -R 755 /var/www/html/.well-known
```

---

### Adım 6: DNS Propagasyon Bekleyin

**Eğer DNS kayıtları yeni eklendiyse:**

1. **Hostinger Dashboard → Domain → DNS Management**
2. **Kayıtları kontrol edin:**
   - `@` → `72.60.39.172` (A)
   - `www` → `72.60.39.172` (A)
3. **1-24 saat bekleyin** (genellikle 1-2 saat)

**Kontrol:**
```bash
# Farklı DNS server'larından test edin
nslookup ongelgayrimenkul.com 8.8.8.8
nslookup ongelgayrimenkul.com 1.1.1.1
```

---

### Adım 7: SSL Sertifikasını Tekrar Al

**DNS ve Nginx hazır olduktan sonra:**

```bash
# Önce ana domain için
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com

# Sonra API subdomain için
certbot --nginx -d api.ongelgayrimenkul.com
```

**Başarılı çıktı:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/ongelgayrimenkul.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/ongelgayrimenkul.com/privkey.pem
```

---

## 🆘 Sorun Giderme

### DNS Hala Propagate Olmamış

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
   cat /etc/nginx/sites-available/ongelgayrimenkul
   ```

2. **Nginx loglarını kontrol edin:**
   ```bash
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

3. **.well-known klasörünü kontrol edin:**
   ```bash
   ls -la /var/www/html/.well-known/acme-challenge/
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

3. **Certbot'u temizleyin ve yeniden deneyin:**
   ```bash
   certbot delete --cert-name ongelgayrimenkul.com
   certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
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

1. ✅ **DNS kayıtlarını kontrol edin** (nslookup)
2. ✅ **Domain erişilebilirliğini test edin** (curl)
3. ✅ **Nginx yapılandırmasını güncelleyin** (.well-known ekleyin)
4. ✅ **.well-known klasörünü oluşturun**
5. ✅ **DNS propagasyon bekleyin** (1-2 saat)
6. ✅ **SSL sertifikasını tekrar alın**

**Not:** DNS propagasyon tamamlanmadan SSL sertifikası alınamaz!

