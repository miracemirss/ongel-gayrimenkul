# 🔧 Railway Backend Sorun Giderme

## Backend Çalışmıyor - Kontrol Listesi

### 1. Railway Logs Kontrolü

**Railway Dashboard → Service → Logs**

Kontrol edin:
- ✅ "Application is running on..." mesajı var mı?
- ❌ Hata mesajları var mı?
- ❌ Crash olmuş mu?

**Yaygın Hatalar:**
- `Error: connect ECONNREFUSED` → Database bağlantı hatası
- `Error: Cannot find module` → Dependencies eksik
- `Port already in use` → Port çakışması
- `Environment variable missing` → Environment variable eksik

---

### 2. Environment Variables Kontrolü

**Railway Dashboard → Service → Variables**

**Zorunlu Variables:**
```env
DATABASE_URL=postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://lidfgiarpaiuwhfqfiqk.supabase.co
SUPABASE_KEY=your-anon-key-here
S3_BUCKET_NAME=listings
NODE_ENV=production
FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
```

**ÖNEMLİ:**
- `PORT` eklemeyin - Railway otomatik atar
- Tüm variables doğru mu?
- Değerlerde yazım hatası var mı?

---

### 3. Deployment Kontrolü

**Railway Dashboard → Deployments**

Kontrol edin:
- ✅ Son deploy başarılı mı?
- ❌ Build hatası var mı?
- ❌ Deploy hatası var mı?

**Build Hataları:**
- Root directory yanlış mı?
- Build command yanlış mı?
- Dependencies yüklenemiyor mu?

---

### 4. Service Settings Kontrolü

**Railway Dashboard → Service → Settings → General**

Kontrol edin:
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

---

### 5. Database Bağlantısı

**Supabase Dashboard → Database → Connection String**

Kontrol edin:
- Connection string doğru mu?
- Password URL encoded mu? (`!` → `%21`)
- SSL ayarları doğru mu?

---

## 🔧 Hızlı Çözümler

### Çözüm 1: Environment Variables Ekle

Eğer eksikse, Railway Dashboard'dan ekleyin:
1. Service → Variables
2. "New Variable" butonuna tıklayın
3. Name ve Value'yu girin
4. Save

### Çözüm 2: Redeploy

1. Railway Dashboard → Deployments
2. Son deployment'a tıklayın
3. "Redeploy" butonuna tıklayın

### Çözüm 3: Logs Kontrolü

1. Railway Dashboard → Logs
2. Hata mesajlarını okuyun
3. Hata mesajına göre düzeltin

---

## 📝 Örnek Hata Mesajları ve Çözümleri

### "Error: connect ECONNREFUSED"
**Sorun:** Database bağlantı hatası
**Çözüm:** `DATABASE_URL` kontrol edin, Supabase connection string doğru mu?

### "Error: Cannot find module 'xxx'"
**Sorun:** Dependencies eksik
**Çözüm:** `package.json` kontrol edin, `npm install` çalıştırın

### "Environment variable 'XXX' is missing"
**Sorun:** Environment variable eksik
**Çözüm:** Railway Dashboard'dan eksik variable'ı ekleyin

### "Application failed to start"
**Sorun:** Backend başlatılamıyor
**Çözüm:** Logs'u kontrol edin, hata mesajını okuyun

---

## ✅ Başarı Kriterleri

- [ ] Railway Logs'da "Application is running" mesajı var
- [ ] Swagger docs açılıyor: `/api/docs`
- [ ] API endpoint'leri çalışıyor
- [ ] Database bağlantısı çalışıyor
- [ ] Environment variables doğru

---

## 📞 Yardım

Sorun devam ederse:
1. Railway Logs'u paylaşın
2. Environment variables listesini paylaşın (değerleri gizleyin)
3. Deployment durumunu paylaşın

