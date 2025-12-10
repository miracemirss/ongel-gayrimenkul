# 🔧 Sunucu İçinden Domain Bağlantı Sorunu

## ❌ Hata

```
curl: (7) Failed to connect to ongelgayrimenkul.com port 443
```

**Sebep:** Sunucu kendi domain'ine bağlanmaya çalışırken DNS çözümlemesi veya loopback sorunu.

---

## ✅ Çözüm: Sunucu İçinden Test

### Yöntem 1: Localhost Kullan (Önerilen)

**SSH terminal'inde:**

```bash
# Backend direkt test
curl http://localhost:3001/api

# Login endpoint test
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**Beklenen çıktı:**
- `{"message":"Cannot GET /api","error":"Not Found","statusCode":404}` (normal, endpoint var)
- Veya `{"statusCode":401,"message":"Invalid credentials"}` (endpoint var, credentials yanlış)

### Yöntem 2: Nginx Üzerinden Test (Localhost)

**SSH terminal'inde:**

```bash
# Nginx üzerinden API test
curl http://localhost/api

# Login endpoint test
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**Beklenen çıktı:**
- Backend response (JSON)
- `401 Unauthorized` (endpoint var, credentials yanlış)

### Yöntem 3: Browser'dan Test (Dışarıdan)

**Browser'da (Windows'tan):**

- `https://ongelgayrimenkul.com/api` → Backend response
- `https://ongelgayrimenkul.com/api/docs` → Swagger UI
- `https://ongelgayrimenkul.com/api/auth/login` → POST test (Network tab)

**Bu yöntem en güvenilir test yöntemidir!**

---

## 🔍 Nginx Config Kontrolü

**SSH terminal'inde:**

```bash
# Nginx config'i kontrol et
cat /etc/nginx/sites-available/ongelgayrimenkul

# Sadece location /api block'unu göster
cat /etc/nginx/sites-available/ongelgayrimenkul | grep -A 10 "location /api"
```

**Beklenen:** `location /api` block'u olmalı ve `proxy_pass http://localhost:3001;` içermeli.

**Eğer yoksa:**

```bash
nano /etc/nginx/sites-available/ongelgayrimenkul
```

Frontend server block'una ekleyin (location /'dan önce):

```nginx
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
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Nginx restart:**
```bash
nginx -t
systemctl restart nginx
```

---

## 🆘 Sorun Giderme

### Sunucu İçinden Domain'e Bağlanamıyor

**Normal durum:** Sunucu kendi domain'ine bağlanırken DNS loopback sorunu olabilir.

**Çözüm:**
1. **Localhost kullan:** `http://localhost:3001/api`
2. **Nginx üzerinden test:** `http://localhost/api`
3. **Browser'dan test:** `https://ongelgayrimenkul.com/api` (dışarıdan)

### Nginx Config'de location /api Yok

1. **Nginx config'i kontrol et:**
   ```bash
   cat /etc/nginx/sites-available/ongelgayrimenkul
   ```

2. **location /api ekle** (yukarıdaki yapılandırmaya göre)

3. **Nginx restart:**
   ```bash
   nginx -t
   systemctl restart nginx
   ```

### Backend Çalışmıyor

1. **PM2 durumu:**
   ```bash
   pm2 status
   ```

2. **Backend logları:**
   ```bash
   pm2 logs backend --lines 20
   ```

3. **Backend restart:**
   ```bash
   pm2 restart backend
   ```

---

## ✅ Test Checklist

- [ ] Backend localhost'ta çalışıyor (`curl http://localhost:3001/api`)
- [ ] Nginx config'de `location /api` var
- [ ] Nginx üzerinden API erişilebilir (`curl http://localhost/api`)
- [ ] Browser'dan API erişilebilir (`https://ongelgayrimenkul.com/api`)
- [ ] Login endpoint çalışıyor (Browser'dan test)

---

## 📝 Özet

1. ✅ **Sunucu içinden test:** `localhost` kullan
2. ✅ **Nginx config kontrol:** `location /api` var mı?
3. ✅ **Browser'dan test:** En güvenilir yöntem
4. ✅ **Nginx restart:** Config değişikliğinden sonra

**Not:** Sunucu içinden domain'e bağlanmak her zaman çalışmayabilir. Browser'dan test etmek daha güvenilirdir!

