# 🔐 Admin Panel Erişim Kurulumu

## 📋 Durum

- ✅ Admin panel route'u: `/onglgyrmnkl-admin`
- ✅ Login sayfası: `/onglgyrmnkl-admin`
- ✅ Backend init-admin endpoint: `/api/users/init-admin`
- ⚠️ Environment variables güncellenmeli (HTTPS)

---

## 🎯 Adım 1: Frontend Environment Variable Güncelle

**SSH'da:**
```bash
cd /var/www/ongel-gayrimenkul/frontend
nano .env.local
```

**Güncelleyin:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

**Veya API subdomain kullanıyorsanız:**
```env
NEXT_PUBLIC_API_URL=https://api.ongelgayrimenkul.com/api
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Frontend'i restart edin:**
```bash
pm2 restart frontend
```

---

## 🎯 Adım 2: Backend Environment Variable Güncelle

**SSH'da:**
```bash
cd /var/www/ongel-gayrimenkul/backend
nano .env
```

**Güncelleyin:**
```env
FRONTEND_URL=https://ongelgayrimenkul.com
```

**Kaydet:** `Ctrl+O` → Enter → `Ctrl+X`

**Backend'i restart edin:**
```bash
pm2 restart backend
```

---

## 🎯 Adım 3: İlk Admin Kullanıcısını Oluştur

### Yöntem 1: Swagger UI (Önerilen)

1. **Browser'da açın:**
   ```
   https://api.ongelgayrimenkul.com/api/docs
   ```
   Veya:
   ```
   https://ongelgayrimenkul.com/api/docs
   ```

2. **`POST /api/users/init-admin` endpoint'ini bulun**

3. **"Try it out" butonuna tıklayın**

4. **Request body'yi doldurun:**
   ```json
   {
     "email": "admin@ongel.com",
     "password": "Admin123!",
     "firstName": "Admin",
     "lastName": "User",
     "role": "admin"
   }
   ```

5. **"Execute" butonuna tıklayın**

6. **Başarılı olursa, artık bu kullanıcı ile login yapabilirsiniz**

**Not:** Bu endpoint sadece hiç admin kullanıcısı yoksa çalışır. İlk admin oluşturulduktan sonra bu endpoint devre dışı kalır.

### Yöntem 2: cURL (SSH'da)

**SSH terminal'inde:**
```bash
curl -X POST https://ongelgayrimenkul.com/api/users/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ongel.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

**Veya API subdomain kullanıyorsanız:**
```bash
curl -X POST https://api.ongelgayrimenkul.com/api/users/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ongel.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

### Yöntem 3: PowerShell (Windows'ta)

**Windows PowerShell'de:**
```powershell
$body = @{
    email = "admin@ongel.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "User"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ongelgayrimenkul.com/api/users/init-admin" -Method Post -Body $body -ContentType "application/json"
```

---

## 🎯 Adım 4: Admin Panel Login Test

1. **Browser'da açın:**
   ```
   https://ongelgayrimenkul.com/onglgyrmnkl-admin
   ```

2. **Login formunu doldurun:**
   - Email: `admin@ongel.com` (veya oluşturduğunuz email)
   - Şifre: `Admin123!` (veya oluşturduğunuz şifre)

3. **"Giriş Yap" butonuna tıklayın**

4. **Başarılı olursa, dashboard'a yönlendirilmelisiniz:**
   ```
   https://ongelgayrimenkul.com/onglgyrmnkl-admin/dashboard
   ```

---

## 🎯 Adım 5: Admin Dashboard Test

**Dashboard'da kontrol edin:**
- ✅ İlanlar sayısı görünüyor mu?
- ✅ Lead'ler sayısı görünüyor mu?
- ✅ Menü linkleri çalışıyor mu?
- ✅ Logout çalışıyor mu?

---

## 🆘 Sorun Giderme

### Login Başarısız

1. **Backend loglarını kontrol edin:**
   ```bash
   pm2 logs backend --lines 50
   ```

2. **API URL'ini kontrol edin:**
   - Browser console'da Network tab'ı açın
   - Login request'ini kontrol edin
   - URL doğru mu? (`https://ongelgayrimenkul.com/api/auth/login`)

3. **CORS hatası var mı?**
   - Backend `.env` dosyasında `FRONTEND_URL` doğru mu?
   - Backend restart edildi mi?

### Init-Admin Endpoint Çalışmıyor

1. **Backend loglarını kontrol edin:**
   ```bash
   pm2 logs backend --lines 50
   ```

2. **Endpoint erişilebilir mi?**
   ```bash
   curl -X POST https://ongelgayrimenkul.com/api/users/init-admin \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User","role":"admin"}'
   ```

3. **Zaten admin var mı?**
   - Endpoint sadece hiç admin yoksa çalışır
   - Eğer admin varsa, normal login kullanın

### 401 Unauthorized Hatası

1. **Token localStorage'da var mı?**
   - Browser console'da: `localStorage.getItem('access_token')`

2. **Token geçerli mi?**
   - Backend loglarını kontrol edin
   - JWT_SECRET doğru mu?

3. **API interceptor çalışıyor mu?**
   - Browser console'da Network tab'ı açın
   - Request header'larında `Authorization: Bearer ...` var mı?

---

## ✅ Başarı Kontrolü

- [x] Frontend environment variable güncellendi
- [x] Backend environment variable güncellendi
- [x] Frontend restart edildi
- [x] Backend restart edildi
- [x] İlk admin kullanıcısı oluşturuldu
- [x] Login sayfası açılıyor
- [x] Login başarılı
- [x] Dashboard açılıyor
- [x] Tüm sayfalar çalışıyor

---

## 📝 Özet

1. ✅ **Frontend `.env.local` güncelle:** `NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api`
2. ✅ **Backend `.env` güncelle:** `FRONTEND_URL=https://ongelgayrimenkul.com`
3. ✅ **Frontend ve Backend restart et**
4. ✅ **İlk admin kullanıcısını oluştur:** `POST /api/users/init-admin`
5. ✅ **Login test et:** `https://ongelgayrimenkul.com/onglgyrmnkl-admin`
6. ✅ **Dashboard test et:** `https://ongelgayrimenkul.com/onglgyrmnkl-admin/dashboard`

**Sonraki:** Environment variables'ı güncelleyin ve ilk admin kullanıcısını oluşturun!

