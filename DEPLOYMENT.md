# Deployment Rehberi - HTTPS ile

## Hızlı Başlangıç: Vercel (Önerilen)

### 1. Frontend Deploy (Next.js)

```bash
# Vercel CLI kurulumu
npm install -g vercel

# Frontend klasöründe
cd frontend
vercel
```

**Adımlar:**
1. `vercel` komutunu çalıştırın
2. Soruları yanıtlayın:
   - "Set up and deploy?" → Yes
   - "Which scope?" → Hesabınızı seçin
   - "Link to existing project?" → No (ilk sefer)
   - "Project name?" → ongel-gayrimenkul-frontend
   - "Directory?" → ./
   - "Override settings?" → No

3. Environment variables ekleyin:
   - `NEXT_PUBLIC_API_URL` → Backend URL'iniz

4. Otomatik HTTPS sağlanır! ✅

---

### 2. Backend Deploy (NestJS)

NestJS için **Railway** veya **Render** önerilir (Vercel Serverless Functions NestJS için uygun değil).

#### Seçenek A: Railway (Önerilen)

1. https://railway.app adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Repo'nuzu seçin
5. "Add Service" → "GitHub Repo"
6. Root directory: `backend`
7. Build command: `npm install && npm run build`
8. Start command: `npm run start:prod`
9. Environment variables ekleyin:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `S3_BUCKET_NAME`
   - `PORT` (Railway otomatik atar)

10. Otomatik HTTPS sağlanır! ✅

#### Seçenek B: Render

1. https://render.com adresine gidin
2. "New" → "Web Service"
3. GitHub repo'nuzu bağlayın
4. Ayarlar:
   - **Name:** ongel-gayrimenkul-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
5. Environment variables ekleyin (Railway ile aynı)
6. Otomatik HTTPS sağlanır! ✅

---

## Supabase ile HTTPS

Supabase'in kendi hosting çözümü yok, ama:

### ✅ Supabase zaten HTTPS kullanıyor:
- Database bağlantıları: `postgresql://...` (SSL zorunlu)
- Storage: `https://your-project.supabase.co/storage/v1/...`
- API: `https://your-project.supabase.co/rest/v1/...`

### Supabase Edge Functions (Alternatif Backend)

Eğer backend'i Supabase Edge Functions'a taşımak isterseniz:

```bash
# Supabase CLI
npm install -g supabase

# Login
supabase login

# Projeye bağlan
supabase link --project-ref your-project-ref

# Function oluştur
supabase functions new api

# Deploy
supabase functions deploy api
```

**Not:** Bu, NestJS kodunuzu Deno'ya adapte etmenizi gerektirir.

---

## Environment Variables

### Frontend (.env.production veya Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render Dashboard)
```
DATABASE_URL=postgresql://... (Supabase connection string)
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
S3_BUCKET_NAME=your-bucket-name
NODE_ENV=production
```

---

## CORS Ayarları

Backend'de `main.ts` dosyasında:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true,
});
```

---

## Test Checklist

- [ ] Frontend HTTPS üzerinden açılıyor
- [ ] Backend HTTPS üzerinden çalışıyor
- [ ] API istekleri başarılı
- [ ] Database bağlantısı çalışıyor
- [ ] File upload çalışıyor (Supabase Storage)
- [ ] Authentication çalışıyor
- [ ] Mixed content uyarıları yok

---

## Custom Domain

### Vercel (Frontend):
1. Project Settings → Domains
2. Domain ekleyin
3. DNS kayıtlarını güncelleyin
4. Otomatik SSL sertifikası

### Railway/Render (Backend):
1. Settings → Domains
2. Custom domain ekleyin
3. DNS kayıtlarını güncelleyin
4. Otomatik SSL sertifikası

---

## Özet

**En Kolay Yol:**
1. Frontend → Vercel (5 dakika, otomatik HTTPS)
2. Backend → Railway (10 dakika, otomatik HTTPS)
3. Database → Supabase (zaten HTTPS)

**Toplam süre:** ~15 dakika, tamamen ücretsiz (küçük projeler için)

