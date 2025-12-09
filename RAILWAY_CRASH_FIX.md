# 🔧 Railway Backend Crash Düzeltme Rehberi

## Backend Crash + Port Sorunu

### Sorun
- Backend "Crashed 2 minutes ago" durumunda
- Port 8080 gösteriliyor (yanlış)
- Generate Domain çalışmıyor

---

## ✅ Adım Adım Çözüm

### 1. Logs Kontrolü (ÖNEMLİ!)

**Railway Dashboard → Service → Logs**

Kontrol edin:
- ❌ Hata mesajları var mı?
- ❌ Environment variable eksik mi?
- ❌ Database bağlantı hatası var mı?

**Yaygın Hatalar:**
```
Error: Environment variable 'DATABASE_URL' is missing
Error: connect ECONNREFUSED (database bağlantı hatası)
Error: Cannot find module (dependencies eksik)
```

---

### 2. Environment Variables Ekle

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
- Tüm variables'ı ekledikten sonra Railway otomatik redeploy eder

---

### 3. Port Ayarları

**Railway Dashboard → Service → Settings → Public Networking**

**Seçenek 1: Port'u Boş Bırakın (Önerilen)**
- Port alanını boş bırakın
- Railway otomatik olarak backend'in dinlediği port'u algılar
- `main.ts` dosyasında `process.env.PORT || 3001` kullanılıyor

**Seçenek 2: Manuel Port Belirtin**
- Port: `3001` (veya Railway'ın atadığı port)
- Ama genellikle gerekmez, boş bırakmak daha iyi

---

### 4. Generate Domain

**Railway Dashboard → Service → Settings → Public Networking**

1. Port ayarını yaptıktan sonra
2. **"Generate Domain"** butonuna tıklayın
3. Railway size bir URL verecek: `https://ongel-gayrimenkul-production.up.railway.app`
4. Bu URL'i kopyalayın

---

### 5. Backend'i Yeniden Başlat

**Railway Dashboard → Deployments**

1. Son deployment'a tıklayın
2. **"Redeploy"** butonuna tıklayın
3. Veya yeni bir commit push edin (otomatik redeploy)

---

## 🔍 Logs'ta Ne Aranmalı?

### Başarılı Başlatma:
```
Application is running on: http://0.0.0.0:XXXX
```

### Hata Örnekleri:

**Environment Variable Eksik:**
```
Error: Environment variable 'DATABASE_URL' is missing
```
**Çözüm:** Railway Dashboard → Variables → Ekle

**Database Bağlantı Hatası:**
```
Error: connect ECONNREFUSED
Error: password authentication failed
```
**Çözüm:** `DATABASE_URL` kontrol edin, Supabase connection string doğru mu?

**Dependencies Eksik:**
```
Error: Cannot find module 'xxx'
```
**Çözüm:** `package.json` kontrol edin, `npm install` çalıştırın

---

## ✅ Başarı Kriterleri

- [ ] Railway Logs'da "Application is running" mesajı var
- [ ] Backend "Online" durumunda (crashed değil)
- [ ] Swagger docs açılıyor: `/api/docs`
- [ ] Public domain oluşturuldu
- [ ] Environment variables doğru

---

## 📝 Özet

1. **Logs'u kontrol et** → Hata mesajını bul
2. **Environment variables ekle** → Eksik olanları ekle
3. **Port ayarını yap** → Boş bırak veya 3001
4. **Generate Domain** → Public URL oluştur
5. **Redeploy** → Backend'i yeniden başlat

---

## 🆘 Hala Çalışmıyorsa

1. Railway Logs'u paylaşın
2. Environment variables listesini paylaşın (değerleri gizleyin)
3. Deployment durumunu paylaşın

