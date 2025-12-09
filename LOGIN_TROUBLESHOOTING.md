# 🔐 Admin Login Sorun Giderme Rehberi

## "Failed to fetch" Hatası

Bu hata genellikle frontend'in backend'e bağlanamadığını gösterir.

---

## ✅ Kontrol Listesi

### 1. Vercel Environment Variables

**Vercel Dashboard → Project → Settings → Environment Variables**

Kontrol edin:
- `NEXT_PUBLIC_API_URL` var mı?
- Değeri doğru mu? 
  ```
  https://ongel-gayrimenkul-production.up.railway.app/api
  ```
- **ÖNEMLİ:** `/api` suffix'i olmalı!

**Eğer yoksa veya yanlışsa:**
1. Environment Variable ekleyin/güncelleyin
2. **Redeploy** yapın (Vercel otomatik yapabilir)

---

### 2. Railway Backend Kontrolü

**Railway Dashboard → Service → Logs**

Kontrol edin:
- Backend çalışıyor mu?
- "Application is running on..." mesajı var mı?
- Hata var mı?

**Backend URL'ini test edin:**
```
https://ongel-gayrimenkul-production.up.railway.app/api/docs
```
Swagger docs açılıyor mu?

---

### 3. Railway CORS Ayarları

**Railway Dashboard → Service → Variables**

Kontrol edin:
- `FRONTEND_URL` var mı?
- Değeri Vercel URL'inizi içeriyor mu?
  ```
  https://ongel-gayrimenkul.vercel.app
  ```
- Veya birden fazla URL (virgülle ayrılmış):
  ```
  https://ongel-gayrimenkul.vercel.app,https://ongel-gayrimenkul-*.vercel.app
  ```

**Eğer yoksa veya yanlışsa:**
1. Environment Variable ekleyin/güncelleyin
2. Railway otomatik olarak yeniden deploy eder

---

### 4. Browser Console Kontrolü

**F12 → Console Tab**

Kontrol edin:
- Hata mesajları var mı?
- API URL doğru mu?
- CORS hatası var mı?

**F12 → Network Tab**

Kontrol edin:
- Login isteği gönderiliyor mu?
- Hangi URL'e gidiyor?
- Status code nedir? (200, 401, 404, 500, vs.)
- Response nedir?

---

### 5. Database'de Admin Kullanıcısı

**Supabase Dashboard → Table Editor → users**

Kontrol edin:
- Admin kullanıcısı var mı?
- `role = 'admin'` mi?
- `is_active = true` mi?
- `email` doğru mu?

**Eğer yoksa:**
- `CREATE_ADMIN_SUPABASE.sql` dosyasını kullanın
- Veya Railway Swagger'dan `/api/users/init-admin` endpoint'ini kullanın

---

## 🔧 Hızlı Çözümler

### Çözüm 1: Environment Variables Kontrolü

**Vercel:**
```env
NEXT_PUBLIC_API_URL=https://ongel-gayrimenkul-production.up.railway.app/api
```

**Railway:**
```env
FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
```

### Çözüm 2: Backend'i Test Edin

```bash
# Swagger Docs
https://ongel-gayrimenkul-production.up.railway.app/api/docs

# Health Check
curl https://ongel-gayrimenkul-production.up.railway.app/api
```

### Çözüm 3: Frontend'i Test Edin

Browser Console'da:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL);
// Veya
console.log(process.env);
```

---

## 📝 Adım Adım Debug

1. **Browser Console'u açın (F12)**
2. **Network tab'ına gidin**
3. **Login butonuna tıklayın**
4. **İsteği kontrol edin:**
   - URL doğru mu?
   - Status code nedir?
   - Response nedir?
5. **Hata mesajını paylaşın**

---

## 🎯 Beklenen Sonuç

- ✅ Login isteği: `POST https://your-railway-url/api/auth/login`
- ✅ Status: `200 OK`
- ✅ Response: `{ access_token: "...", user: {...} }`
- ✅ Redirect: `/onglgyrmnkl-admin/dashboard`

---

## ❌ Yaygın Hatalar

### "Failed to fetch"
- API URL yanlış/eksik
- Backend çalışmıyor
- CORS hatası

### "401 Unauthorized"
- Email/şifre yanlış
- Kullanıcı database'de yok
- Şifre hash'i yanlış

### "404 Not Found"
- API endpoint yanlış
- Backend route yanlış

### "500 Internal Server Error"
- Backend hatası
- Database bağlantı sorunu

---

## 📞 Yardım

Sorun devam ederse:
1. Browser Console loglarını paylaşın
2. Network tab screenshot'ını paylaşın
3. Railway Logs'u kontrol edin
4. Vercel Logs'u kontrol edin

