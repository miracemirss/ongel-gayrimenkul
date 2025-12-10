# 🔒 Port 443 (HTTPS) Düzeltmesi

## ❌ Sorun

```
Port 443 dinlenmiyor
HTTPS çalışmıyor
```

**Sebep:** Nginx config'de SSL yapılandırması eksik veya yanlış.

---

## ✅ Çözüm Adımları

### Adım 1: SSL Sertifikası Kontrolü

**SSH terminal'inde:**
```bash
# SSL sertifikası durumu
certbot certificates
```

**Beklenen çıktı:**
```
Found the following certificates:
  Certificate Name: ongelgayrimenkul.com
    Domains: ongelgayrimenkul.com www.ongelgayrimenkul.com
    Expiry Date: 2026-03-10
    Certificate Path: /etc/letsencrypt/live/ongelgayrimenkul.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/ongelgayrimenkul.com/privkey.pem
```

**Eğer sertifika yoksa:**
```bash
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
```

---

### Adım 2: Nginx Config Kontrolü

**SSH terminal'inde:**
```bash
# Nginx config'i kontrol et
cat /etc/nginx/sites-available/ongelgayrimenkul
```

**Beklenen:** `listen 443 ssl;` olmalı

**Eğer yoksa veya yanlışsa:**

---

### Adım 3: Nginx Config'i Güncelle

**SSH terminal'inde:**
```bash
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**Doğru yapılandırma (HTTPS için):**

```nginx
# Frontend (HTTPS)
server {
    listen 80;
    listen [::]:80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;
    
    # HTTP'den HTTPS'e yönlendirme
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

    # SSL Sertifikaları
    ssl_certificate /etc/letsencrypt/live/ongelgayrimenkul.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ongelgayrimenkul.com/privkey.pem;
    
    # SSL Ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Let's Encrypt için .well-known klasörüne erişim
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    # API isteklerini backend'e yönlendir
    location /api {
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

    # Frontend istekleri
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

# Backend API (HTTPS)
server {
    listen 80;
    listen [::]:80;
    server_name api.ongelgayrimenkul.com;
    
    # HTTP'den HTTPS'e yönlendirme
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.ongelgayrimenkul.com;

    # SSL Sertifikaları (ana domain ile aynı veya ayrı)
    ssl_certificate /etc/letsencrypt/live/ongelgayrimenkul.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ongelgayrimenkul.com/privkey.pem;
    
    # SSL Ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

---

### Adım 4: Nginx Test ve Restart

**SSH terminal'inde:**
```bash
# Nginx config test
nginx -t

# Eğer hata yoksa restart
systemctl restart nginx

# Nginx durumu
systemctl status nginx
```

**Beklenen çıktı:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### Adım 5: Port Kontrolü

**SSH terminal'inde:**
```bash
# Port 443 kontrolü
netstat -tulpn | grep 443
```

**Beklenen çıktı:**
```
tcp6       0      0 :::443                  :::*                    LISTEN      1234/nginx: master
```

**Eğer görünmüyorsa:**
- Nginx restart edildi mi?
- SSL sertifikası var mı?
- Nginx config'de `listen 443 ssl;` var mı?

---

### Adım 6: Certbot ile Otomatik Güncelleme

**Eğer SSL sertifikası varsa ama Nginx config güncellenmemişse:**

**SSH terminal'inde:**
```bash
# Certbot Nginx config'i otomatik günceller
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com --force-renewal
```

**Veya sadece config'i güncelle:**
```bash
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
```

Certbot otomatik olarak:
- `listen 443 ssl;` ekler
- SSL sertifika path'lerini ekler
- HTTP'den HTTPS'e yönlendirme ekler

---

## 🆘 Sorun Giderme

### SSL Sertifikası Yok

1. **Certbot ile SSL al:**
   ```bash
   certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com
   ```

2. **DNS kayıtları hazır mı?**
   - `nslookup ongelgayrimenkul.com`

### Nginx Config Test Hatası

1. **Syntax hatası:**
   ```bash
   nginx -t
   ```

2. **Hata mesajını kontrol et**
   - Satır numarasını not edin
   - `nano` ile açıp kontrol edin

### Port 443 Hala Dinlenmiyor

1. **Nginx restart edildi mi?**
   ```bash
   systemctl restart nginx
   ```

2. **SSL sertifikası var mı?**
   ```bash
   certbot certificates
   ```

3. **Nginx config'de `listen 443 ssl;` var mı?**
   ```bash
   grep "listen 443" /etc/nginx/sites-available/ongelgayrimenkul
   ```

### Firewall Engelliyor

1. **UFW durumu:**
   ```bash
   ufw status
   ```

2. **Port 443'ü aç:**
   ```bash
   ufw allow 443/tcp
   ufw reload
   ```

---

## ✅ Başarı Kontrolü

- [x] SSL sertifikası var
- [x] Nginx config'de `listen 443 ssl;` var
- [x] SSL sertifika path'leri doğru
- [x] Nginx config test başarılı
- [x] Nginx restart edildi
- [x] Port 443 dinleniyor
- [x] Browser'dan HTTPS erişilebilir

---

## 📝 Özet

1. ✅ **SSL sertifikası kontrol:** `certbot certificates`
2. ✅ **Nginx config kontrol:** `listen 443 ssl;` var mı?
3. ✅ **Certbot ile güncelle:** `certbot --nginx -d ongelgayrimenkul.com`
4. ✅ **Nginx restart:** `systemctl restart nginx`
5. ✅ **Port kontrol:** `netstat -tulpn | grep 443`
6. ✅ **Browser'dan test:** `https://ongelgayrimenkul.com`

**Not:** Certbot genellikle Nginx config'i otomatik günceller. Eğer güncellememişse, manuel ekleyin!

