# Railway ile Backend Deploy Rehberi

## 🚀 Hızlı Başlangıç

### 1. Railway Hesabı Oluşturma
1. https://railway.app adresine gidin
2. "Start a New Project" tıklayın
3. GitHub ile giriş yapın

### 2. Proje Oluşturma
1. "Deploy from GitHub repo" seçin
2. GitHub repo'nuzu seçin: `ongel-gayrimenkul`
3. "Add Service" → "GitHub Repo" seçin
4. Repo'yu seçin ve "Deploy Now" tıklayın

### 3. Service Ayarları
1. Service'e tıklayın
2. **Settings** → **Root Directory**: `backend` yazın
3. **Settings** → **Build Command**: `npm install && npm run build`
4. **Settings** → **Start Command**: `npm run start:prod`

### 4. Environment Variables Ekleme
**Settings** → **Variables** bölümüne şunları ekleyin:

```env
# Database (Supabase)
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
PORT=3001
```

**Önemli:** Railway otomatik olarak `PORT` environment variable'ını atar, ama kodunuzda `process.env.PORT || 3001` kullanıyorsanız sorun olmaz.

### 5. Deploy
1. Railway otomatik olarak deploy edecek
2. **Settings** → **Generate Domain** ile public URL alın
3. HTTPS otomatik aktif olacak! ✅

## 📝 Notlar

- **Port:** Railway otomatik port atar, `PORT` environment variable'ını kullanın
- **HTTPS:** Otomatik aktif (Railway'ın özelliği)
- **Database:** Supabase zaten HTTPS üzerinden, ekstra ayar gerekmez
- **Logs:** Railway Dashboard'dan canlı logları görebilirsiniz

## 🔧 Sorun Giderme

### Build Hatası
- Root directory'nin `backend` olduğundan emin olun
- Build command'in doğru olduğundan emin olun

### Port Hatası
- `main.ts` dosyasında `process.env.PORT || 3001` kullanıldığından emin olun
- Railway otomatik `PORT` atar

### Database Bağlantı Hatası
- `DATABASE_URL` doğru formatta mı? (Supabase connection string)
- SSL ayarları doğru mu? (Supabase için `rejectUnauthorized: false`)

## ✅ Deploy Sonrası

1. **Backend URL'i alın:** Railway Dashboard → Settings → Generate Domain
2. **Frontend'i güncelleyin:** Vercel Dashboard → Environment Variables → `NEXT_PUBLIC_API_URL` → Backend URL'i ekleyin
3. **CORS ayarlarını kontrol edin:** Backend'de `FRONTEND_URL` doğru mu?

## 🎯 Örnek URL'ler

- **Backend:** `https://ongel-gayrimenkul-backend-production.up.railway.app`
- **Frontend:** `https://ongel-gayrimenkul.vercel.app`
- **API Endpoint:** `https://ongel-gayrimenkul-backend-production.up.railway.app/api`

