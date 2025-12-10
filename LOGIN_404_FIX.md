# 🔐 Login 404 Hatası Çözümü

## ❌ Hata

```
Status: 404 Not Found
Endpoint: /api/auth/login
```

**Sebep:** Frontend API URL'i yanlış yapılandırılmış veya frontend restart edilmemiş.

---

## ✅ Çözüm Adımları

### Adım 1: Frontend Environment Variable Kontrolü

**SSH terminal'inde:**
```bash
cd /var/www/ongel-gayrimenkul/frontend
cat .env.local
```

**Beklenen içerik:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Veya API subdomain kullanıyorsanız:**
```env
NEXT_PUBLIC_API_URL=https://api.ongelgayrimenkul.com/api
```

**Eğer dosya yoksa veya yanlışsa:**

```bash
nano .env.local
```

**İçerik:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

---

### Adım 2: Frontend'i Restart Edin

**SSH terminal'inde:**
```bash
pm2 restart frontend
pm2 logs frontend --lines 20
```

**Kontrol:** Frontend başarıyla başladı mı?

---

### Adım 3: Backend Endpoint Kontrolü

**SSH terminal'inde:**
```bash
# Backend endpoint'i test et
curl -X POST https://ongelgayrimenkul.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

**Beklenen çıktı:**
```json
{"statusCode":401,"message":"Invalid credentials"}
```

**Eğer 404 alıyorsanız:**
- Backend çalışmıyor olabilir
- Nginx yapılandırması yanlış olabilir

**Eğer "Connection refused" alıyorsanız:**
- Backend PM2'de çalışmıyor olabilir

---

### Adım 4: Backend Durumunu Kontrol Edin

**SSH terminal'inde:**
```bash
# PM2 durumu
pm2 status

# Backend logları
pm2 logs backend --lines 20

# Backend'i restart et (gerekirse)
pm2 restart backend
```

**Beklenen:** Backend "online" olmalı

---

### Adım 5: Nginx Yapılandırmasını Kontrol Edin

**SSH terminal'inde:**
```bash
# Nginx config
cat /etc/nginx/sites-available/ongelgayrimenkul

# Nginx test
nginx -t

# Nginx restart (gerekirse)
systemctl restart nginx
```

**Kontrol:** API endpoint'leri doğru yönlendiriliyor mu?

---

### Adım 6: Browser Console Kontrolü

**Browser'da (F12 → Console):**

1. **Network tab'ı açın**
2. **Login butonuna tıklayın**
3. **Login request'ini kontrol edin:**
   - URL doğru mu? (`https://ongelgayrimenkul.com/api/auth/login`)
   - Status code nedir? (404, 401, 500?)

**Eğer URL yanlışsa:**
- Frontend .env.local dosyası güncellenmemiş
- Frontend restart edilmemiş

---

## 🆘 Sorun Giderme

### Hala 404 Hatası

1. **Frontend .env.local kontrol:**
   ```bash
   cat /var/www/ongel-gayrimenkul/frontend/.env.local
   ```

2. **Frontend restart:**
   ```bash
   pm2 restart frontend
   ```

3. **Browser cache temizle:**
   - `Ctrl+Shift+R` (hard refresh)
   - Veya incognito modda test edin

4. **Backend endpoint test:**
   ```bash
   curl https://ongelgayrimenkul.com/api/auth/login
   ```

### Backend Çalışmıyor

1. **PM2 durumu:**
   ```bash
   pm2 status
   ```

2. **Backend logları:**
   ```bash
   pm2 logs backend --lines 50
   ```

3. **Backend restart:**
   ```bash
   pm2 restart backend
   ```

### CORS Hatası

1. **Backend .env kontrol:**
   ```bash
   cat /var/www/ongel-gayrimenkul/backend/.env | grep FRONTEND_URL
   ```

2. **Backend restart:**
   ```bash
   pm2 restart backend
   ```

---

## ✅ Başarı Kontrolü

- [x] Frontend .env.local doğru
- [x] Frontend restart edildi
- [x] Backend çalışıyor
- [x] Backend endpoint erişilebilir
- [x] Browser'da login request URL doğru
- [x] Login başarılı

---

## 📝 Özet

1. ✅ **Frontend .env.local güncelle:** `NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api`
2. ✅ **Frontend restart et:** `pm2 restart frontend`
3. ✅ **Backend endpoint test et:** `curl https://ongelgayrimenkul.com/api/auth/login`
4. ✅ **Backend durumunu kontrol et:** `pm2 status`
5. ✅ **Browser cache temizle:** `Ctrl+Shift+R`
6. ✅ **Login test et**

**Not:** Next.js environment variables build zamanında dahil edilir. Değişiklikten sonra frontend'i mutlaka restart edin!

