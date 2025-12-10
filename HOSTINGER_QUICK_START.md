# ⚡ Hostinger Hızlı Başlangıç

## 🎯 Hızlı Kurulum (Özet)

### 1. Hostinger VPS/Cloud Satın Al
- Minimum: 2GB RAM, Ubuntu 22.04

### 2. SSH ile Bağlan
```bash
ssh root@[SUNUCU_IP]
```

### 3. Sistem Kurulumu
```bash
# Güncelle
apt update && apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2
npm install -g pm2
pm2 startup

# Nginx
apt install -y nginx

# Git
apt install -y git
```

### 4. Proje Kurulumu
```bash
# Proje dizini
cd /var/www
mkdir ongel-gayrimenkul
cd ongel-gayrimenkul

# GitHub'dan çek (veya manuel upload)
git clone https://github.com/[KULLANICI]/ongel-gayrimenkul.git .

# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

### 5. Environment Variables

**Backend `.env`:**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
S3_BUCKET_NAME=listings
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://ongelgayrimenkul.com
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://ongelgayrimenkul.com/api
```

### 6. PM2 ile Başlat
```bash
# Backend
cd /var/www/ongel-gayrimenkul/backend
pm2 start npm --name "backend" -- run start:prod

# Frontend
cd /var/www/ongel-gayrimenkul/frontend
pm2 start npm --name "frontend" -- run start

# Kaydet
pm2 save
```

### 7. Nginx Config

`/etc/nginx/sites-available/ongelgayrimenkul`:
```nginx
# Backend
server {
    listen 80;
    server_name api.ongelgayrimenkul.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Frontend
server {
    listen 80;
    server_name ongelgayrimenkul.com www.ongelgayrimenkul.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Aktif et
ln -s /etc/nginx/sites-available/ongelgayrimenkul /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 8. SSL (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ongelgayrimenkul.com -d www.ongelgayrimenkul.com -d api.ongelgayrimenkul.com
```

### 9. DNS (Hostinger)
```
A Record: @ → [SUNUCU_IP]
A Record: www → [SUNUCU_IP]
A Record: api → [SUNUCU_IP]
```

### 10. Test
- ✅ `https://ongelgayrimenkul.com`
- ✅ `https://api.ongelgayrimenkul.com/api/docs`

**Detaylı rehber:** `HOSTINGER_DEPLOY.md`

