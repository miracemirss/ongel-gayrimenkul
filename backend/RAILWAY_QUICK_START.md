# Railway Backend Deploy - Hızlı Başlangıç

## 🚀 Adım Adım Deploy

### 1. Railway'a Giriş
1. https://railway.app adresine gidin
2. **"Start a New Project"** tıklayın
3. **GitHub ile giriş yapın** (GitHub hesabınızla)

### 2. Proje Oluşturma
1. **"Deploy from GitHub repo"** seçin
2. GitHub repo listenizden **`ongel-gayrimenkul`** seçin
3. **"Deploy Now"** tıklayın

### 3. Service Ayarları (ÖNEMLİ!)

Railway otomatik olarak deploy başlatacak, ama ayarları yapmanız gerekiyor:

1. Oluşturulan **Service**'e tıklayın
2. **Settings** sekmesine gidin
3. Şu ayarları yapın:

   **Root Directory:**
   ```
   backend
   ```
   ⚠️ **ÖNEMLİ:** Root directory'yi `backend` olarak ayarlamazsanız build hatası alırsınız!

   **Build Command:**
   ```
   npm install && npm run build
   ```

   **Start Command:**
   ```
   npm run start:prod
   ```

   **Alternatif:** Eğer ayarlar kaybolursa, proje root'unda `railway.json` dosyası var, Railway bunu otomatik kullanır.

### 4. Environment Variables Ekleme

**Settings** → **Variables** sekmesine gidin ve şunları ekleyin:

```env
# Database (Supabase Connection String)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
S3_BUCKET_NAME=your-bucket-name

# App
NODE_ENV=production
FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
```

**ÖNEMLİ Notlar:**
- `PORT` environment variable'ını **EKLEMEYİN** - Railway otomatik atar
- `FRONTEND_URL` Vercel'deki frontend URL'inizi kullanın
- Eğer birden fazla frontend URL'iniz varsa (preview + production), virgülle ayırın:
  ```
  FRONTEND_URL=https://ongel-gayrimenkul.vercel.app,https://ongel-gayrimenkul-*.vercel.app
  ```

**ÖNEMLİ:** 
- `PORT` environment variable'ını **EKLEMEYİN** - Railway otomatik atar
- `DATABASE_URL` Supabase connection string'inizi kullanın
- `FRONTEND_URL` Vercel'deki frontend URL'inizi kullanın

### 5. Public URL Alma

1. **Settings** → **Networking** sekmesine gidin
2. **"Generate Domain"** butonuna tıklayın
3. Railway size bir URL verecek: `https://your-app-name.up.railway.app`
4. Bu URL'i kopyalayın

### 6. Frontend'i Güncelleme

Vercel Dashboard'da:
1. Project Settings → Environment Variables
2. `NEXT_PUBLIC_API_URL` ekleyin/güncelleyin:
   ```
   https://your-app-name.up.railway.app/api
   ```
3. Redeploy yapın

### 7. CORS Ayarları

Backend'de `main.ts` dosyasında CORS ayarlarını kontrol edin:
- `FRONTEND_URL` environment variable'ı doğru mu?

## ✅ Deploy Kontrolü

1. Railway Dashboard → **Deployments** sekmesinde build loglarını görebilirsiniz
2. **Logs** sekmesinde runtime loglarını görebilirsiniz
3. API endpoint'ini test edin: `https://your-app-name.up.railway.app/api/docs` (Swagger)

## 🔧 Sorun Giderme

### Build Hatası
- Root directory'nin `backend` olduğundan emin olun
- Build command'in doğru olduğundan emin olun

### Port Hatası
- `PORT` environment variable'ını **SİLİN** (Railway otomatik atar)
- `main.ts` dosyasında `process.env.PORT || 3001` kullanılıyor, sorun yok

### Database Bağlantı Hatası
- `DATABASE_URL` doğru formatta mı?
- Supabase connection string'iniz doğru mu?
- SSL ayarları doğru mu? (Supabase için `rejectUnauthorized: false`)

### CORS Hatası
- `FRONTEND_URL` environment variable'ı doğru mu?
- Frontend URL'i Vercel'deki URL ile eşleşiyor mu?

## 📝 Örnek Environment Variables

```env
DATABASE_URL=postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://lidfgiarpaiuwhfqfiqk.supabase.co
SUPABASE_KEY=your-anon-key-here
S3_BUCKET_NAME=listings
NODE_ENV=production
FRONTEND_URL=https://ongel-gayrimenkul.vercel.app
```

## 🎯 Başarı Kriterleri

- ✅ Build başarılı
- ✅ Service çalışıyor (Logs'da "Application is running" görünüyor)
- ✅ Public URL çalışıyor
- ✅ Swagger docs açılıyor: `/api/docs`
- ✅ Frontend'den API çağrıları çalışıyor

