# 🚀 Deployment Checklist - Backend Deploy Sonrası

## ✅ Backend Deploy Tamamlandı!

Backend URL'iniz: `https://ongel-gayrimenkul-production.up.railway.app`

---

## 📋 Sıradaki Adımlar

### 1️⃣ Environment Variables Ekle (Railway)

Railway Dashboard → Service → **Variables** sekmesine gidin ve şunları ekleyin:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Supabase Storage
SUPABASE_URL=https://lidfgiarpaiuwhfqfiqk.supabase.co
SUPABASE_KEY=your-anon-key-here
S3_BUCKET_NAME=listings

# App
NODE_ENV=production
FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
```

**ÖNEMLİ:**
- `PORT` eklemeyin - Railway otomatik atar
- `DATABASE_URL` Supabase connection string'inizi kullanın
- `FRONTEND_URL` Vercel'deki frontend URL'inizi kullanın

**Değişikliklerden sonra:** Railway otomatik olarak yeniden deploy eder.

---

### 2️⃣ Frontend'i Güncelle (Vercel)

Vercel Dashboard → Project → **Settings** → **Environment Variables**:

1. `NEXT_PUBLIC_API_URL` değişkenini ekleyin/güncelleyin:
   ```
   https://ongel-gayrimenkul-production.up.railway.app/api
   ```

2. **Redeploy** yapın (Vercel otomatik yapabilir veya manuel "Redeploy" butonuna tıklayın)

---

### 3️⃣ Test Et

#### Backend Test:
- ✅ Swagger Docs: `https://ongel-gayrimenkul-production.up.railway.app/api/docs`
- ✅ Health Check: `https://ongel-gayrimenkul-production.up.railway.app/api`
- ✅ Railway Logs: Dashboard → Logs sekmesi

#### Frontend Test:
- ✅ Frontend açılıyor mu?
- ✅ API çağrıları çalışıyor mu? (Network tab'da kontrol edin)
- ✅ Login çalışıyor mu?
- ✅ Listings görüntüleniyor mu?

#### CORS Kontrolü:
- ✅ Browser console'da CORS hatası var mı?
- ✅ `FRONTEND_URL` doğru mu?

---

### 4️⃣ Admin Panel Test

1. Frontend'den `/onglgyrmnkl-admin` sayfasına gidin
2. Admin kullanıcısı ile giriş yapın
3. Dashboard açılıyor mu?
4. Listings, Leads, CMS sayfaları çalışıyor mu?
5. Yeni listing ekleyebiliyor musunuz?
6. Image upload çalışıyor mu?

---

### 5️⃣ Public Site Test

1. Ana sayfa açılıyor mu?
2. Portfolio (Listings) sayfası çalışıyor mu?
3. Listing detay sayfası açılıyor mu?
4. About, Services, Mortgage sayfaları çalışıyor mu?
5. Contact formu çalışıyor mu?
6. Multi-language (TR/EN/AR) çalışıyor mu?

---

## 🔧 Sorun Giderme

### Backend Çalışmıyor
- Railway Logs'u kontrol edin
- Environment variables doğru mu?
- Database bağlantısı çalışıyor mu?

### CORS Hatası
- `FRONTEND_URL` doğru mu?
- Frontend URL'i Vercel'deki URL ile eşleşiyor mu?

### API Çağrıları Çalışmıyor
- `NEXT_PUBLIC_API_URL` doğru mu?
- Frontend redeploy edildi mi?
- Browser console'da hata var mı?

### Database Bağlantı Hatası
- `DATABASE_URL` doğru formatta mı?
- Supabase connection string doğru mu?
- SSL ayarları doğru mu?

---

## ✅ Başarı Kriterleri

- [ ] Backend Railway'da çalışıyor
- [ ] Environment variables eklendi
- [ ] Frontend Vercel'de güncellendi
- [ ] Swagger docs açılıyor
- [ ] API çağrıları çalışıyor
- [ ] Admin panel çalışıyor
- [ ] Public site çalışıyor
- [ ] Image upload çalışıyor
- [ ] Multi-language çalışıyor
- [ ] CORS hatası yok

---

## 🎯 Sonraki Adımlar (Opsiyonel)

1. **Custom Domain** ekleyin (Railway ve Vercel'de)
2. **Monitoring** kurun (Railway Metrics)
3. **Backup** stratejisi oluşturun
4. **SSL sertifikaları** kontrol edin (otomatik olmalı)

---

## 📞 Yardım

Sorun yaşarsanız:
- Railway Logs: Dashboard → Logs
- Vercel Logs: Dashboard → Deployments → View Function Logs
- Browser Console: F12 → Console tab

