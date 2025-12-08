# HTTPS Deployment Rehberi

## Seçenekler

### 1. **Vercel (Önerilen - En Kolay)**

Vercel hem frontend (Next.js) hem de backend (NestJS) için otomatik HTTPS sağlar.

#### Frontend (Next.js) için:
```bash
# Vercel CLI kurulumu
npm i -g vercel

# Frontend klasöründe
cd frontend
vercel
```

**Avantajlar:**
- Otomatik HTTPS (Let's Encrypt)
- Global CDN
- Next.js için optimize edilmiş
- Ücretsiz plan mevcut

#### Backend (NestJS) için:
Vercel Serverless Functions kullanarak backend'i deploy edebilirsiniz.

**Kurulum:**
1. `vercel.json` dosyası oluşturun (backend klasöründe):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

2. Deploy:
```bash
cd backend
vercel
```

---

### 2. **Supabase Edge Functions (Backend için)**

Supabase Edge Functions, Deno runtime kullanır ve otomatik HTTPS sağlar.

**Kurulum:**
1. Supabase CLI kurulumu:
```bash
npm install -g supabase
```

2. Supabase projenize bağlanın:
```bash
supabase login
supabase link --project-ref your-project-ref
```

3. Edge Function oluşturun:
```bash
supabase functions new api
```

4. Backend kodunuzu Edge Function'a adapte edin (Deno runtime için)

**Avantajlar:**
- Otomatik HTTPS
- Supabase ekosistemi ile entegre
- Ücretsiz plan mevcut

**Dezavantajlar:**
- NestJS yerine Deno runtime (kod adaptasyonu gerekebilir)
- TypeORM yerine Supabase client kullanımı

---

### 3. **Netlify (Frontend için)**

Netlify, Next.js için otomatik HTTPS sağlar.

**Kurulum:**
1. `netlify.toml` dosyası oluşturun (frontend klasöründe):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

### 4. **Geleneksel Hosting + Let's Encrypt**

VPS (DigitalOcean, AWS EC2, vb.) kullanıyorsanız:

#### Nginx Reverse Proxy ile:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;  # Frontend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Certbot ile SSL:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Önerilen Yaklaşım

### Senaryo 1: Hızlı ve Kolay (Önerilen)
- **Frontend:** Vercel (Next.js için optimize)
- **Backend:** Vercel Serverless Functions veya Railway/Render
- **Database:** Supabase (zaten HTTPS üzerinden)

### Senaryo 2: Supabase Ekosistemi
- **Frontend:** Vercel veya Netlify
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase

### Senaryo 3: Tam Kontrol
- **Frontend:** VPS + Nginx + Let's Encrypt
- **Backend:** VPS + PM2 + Nginx + Let's Encrypt
- **Database:** Supabase (yine HTTPS üzerinden)

---

## Hızlı Başlangıç: Vercel ile

### Frontend:
```bash
cd frontend
npm i -g vercel
vercel
# Soruları yanıtlayın ve deploy edin
```

### Backend:
Backend için Vercel Serverless Functions kullanmak yerine, **Railway** veya **Render** daha uygun olabilir çünkü NestJS tam Node.js runtime gerektirir.

**Railway ile:**
1. https://railway.app adresine gidin
2. GitHub repo'nuzu bağlayın
3. Backend klasörünü seçin
4. Otomatik deploy (HTTPS dahil)

**Render ile:**
1. https://render.com adresine gidin
2. "New Web Service" seçin
3. GitHub repo'nuzu bağlayın
4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm run start:prod`
6. Otomatik HTTPS sağlanır

---

## Environment Variables

Deploy ederken şu environment variable'ları ayarlayın:

**Frontend (.env.production):**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

**Backend (.env.production):**
```
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-secret
FRONTEND_URL=https://your-frontend-url.com
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
S3_BUCKET_NAME=your-bucket-name
```

---

## Notlar

1. **Supabase zaten HTTPS kullanıyor:** Database ve Storage erişimleri zaten HTTPS üzerinden
2. **Frontend-Backend iletişimi:** CORS ayarlarını production URL'lerine göre güncelleyin
3. **SSL Sertifikaları:** Vercel, Netlify, Railway, Render otomatik SSL sağlar (Let's Encrypt)
4. **Custom Domain:** Tüm platformlar custom domain desteği sunar

---

## Test

Deploy sonrası:
1. HTTPS URL'lerini kontrol edin
2. Mixed content uyarılarını kontrol edin (HTTP resource'lar HTTPS sayfada)
3. CORS ayarlarını test edin
4. API endpoint'lerini test edin

