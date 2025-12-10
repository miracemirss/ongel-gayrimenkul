# 🔧 Nginx API Routing Düzeltmesi

## ❌ Sorun

```
URL: ongelgayrimenkul.com/api
Hata: 404 Not Found
```

**Sebep:** Nginx yapılandırmasında `/api` path'i backend'e yönlendirilmemiş.

---

## ✅ Çözüm

### Adım 1: Nginx Yapılandırmasını Kontrol Edin

**SSH terminal'inde:**
```bash
cat /etc/nginx/sites-available/ongelgayrimenkul
```

**Mevcut yapılandırma muhtemelen sadece frontend'i yönlendiriyor.**

---

### Adım 2: Nginx Config'i Güncelleyin

**SSH terminal'inde:**
```bash
nano /etc/nginx/sites-available/ongelgayrimenkul
```

**Doğru yapılandırma:**

```nginx
# Backend API (api.ongelgayrimenkul.com veya ongelgayrimenkul.com/api)
server {
    listen 80;
    listen [::]:80;
    server_name api.ongelgayrimenkul.com;

    # Let's Encrypt için .well-known klasörüne erişim
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

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
    listen [::]:80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;

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
```

**ÖNEMLİ:** Frontend server block'unda `location /api` eklenmeli!

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

---

### Adım 3: Nginx'i Test Edin ve Restart Edin

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

### Adım 4: Test Edin

**SSH terminal'inde:**
```bash
# API endpoint test
curl -I https://ongelgayrimenkul.com/api/auth/login

# Veya POST test
curl -X POST https://ongelgayrimenkul.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**Beklenen çıktı:**
- `200 OK` veya `401 Unauthorized` (endpoint var, credentials yanlış)
- `404 Not Found` değil!

**Browser'da:**
- `https://ongelgayrimenkul.com/api/docs` → Swagger UI açılmalı
- `https://ongelgayrimenkul.com/api` → Backend response (JSON)

---

## 🆘 Sorun Giderme

### Nginx Config Test Hatası

1. **Syntax hatası var mı?**
   ```bash
   nginx -t
   ```

2. **Hata mesajını kontrol edin**
   - Satır numarasını not edin
   - `nano` ile açıp kontrol edin

### Hala 404 Hatası

1. **Nginx restart edildi mi?**
   ```bash
   systemctl restart nginx
   ```

2. **Backend çalışıyor mu?**
   ```bash
   pm2 status
   curl http://localhost:3001/api
   ```

3. **Location block sırası doğru mu?**
   - `location /api` `location /`'dan **önce** olmalı
   - Nginx en spesifik location'ı seçer

### SSL Sertifikası Sonrası

**Eğer SSL sertifikası aldıktan sonra bu sorunu yaşıyorsanız:**

Certbot Nginx config'i otomatik günceller, ama bazen `location /api` block'unu eklemez.

1. **Nginx config'i kontrol edin:**
   ```bash
   cat /etc/nginx/sites-available/ongelgayrimenkul
   ```

2. **`location /api` block'u var mı?**
   - Yoksa ekleyin (yukarıdaki yapılandırmaya göre)

3. **Nginx restart:**
   ```bash
   nginx -t
   systemctl restart nginx
   ```

---

## ✅ Başarı Kontrolü

- [x] Nginx config'de `location /api` var
- [x] Nginx config test başarılı
- [x] Nginx restart edildi
- [x] `https://ongelgayrimenkul.com/api` erişilebilir
- [x] `https://ongelgayrimenkul.com/api/docs` açılıyor
- [x] Login çalışıyor

---

## 📝 Özet

1. ✅ **Nginx config'i kontrol et**
2. ✅ **Frontend server block'una `location /api` ekle**
3. ✅ **Nginx test et:** `nginx -t`
4. ✅ **Nginx restart et:** `systemctl restart nginx`
5. ✅ **Test et:** `curl https://ongelgayrimenkul.com/api`

**Not:** `location /api` block'u `location /` block'undan **önce** olmalı!

