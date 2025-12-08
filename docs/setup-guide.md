# Kurulum Kılavuzu

## Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

## 1. Proje Klonlama ve Bağımlılıkları Yükleme

```bash
# Backend bağımlılıklarını yükle
cd backend
npm install

# Frontend bağımlılıklarını yükle
cd ../frontend
npm install
```

## 2. PostgreSQL Veritabanı Kurulumu

```sql
-- PostgreSQL'de veritabanı oluştur
CREATE DATABASE ongel_gayrimenkul;

-- Kullanıcı oluştur (opsiyonel)
CREATE USER ongel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ongel_gayrimenkul TO ongel_user;
```

## 3. Backend Konfigürasyonu

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ongel_gayrimenkul

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# S3 Storage
S3_ENDPOINT=your-s3-endpoint
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=ongel-gayrimenkul
S3_REGION=us-east-1

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 4. Frontend Konfigürasyonu

```bash
cd frontend
```

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 5. Veritabanı Migration (Development)

Development modunda TypeORM otomatik olarak tabloları oluşturur (`synchronize: true`).

Production için migration dosyaları oluşturulmalıdır.

## 6. İlk Admin Kullanıcısı Oluşturma

Backend çalıştıktan sonra, Swagger UI üzerinden veya direkt API çağrısı ile admin kullanıcısı oluşturabilirsiniz:

```bash
# Backend çalışıyorken
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ongel.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

**Not:** İlk admin kullanıcısını oluşturmak için geçici olarak `@Roles()` decorator'ünü kaldırmanız gerekebilir veya direkt database'e ekleme yapabilirsiniz.

## 7. Uygulamayı Çalıştırma

### Backend

```bash
cd backend
npm run start:dev
```

Backend: http://localhost:3001
Swagger UI: http://localhost:3001/api/docs

### Frontend

```bash
cd frontend
npm run dev
```

Frontend: http://localhost:3000

## 8. Test Kullanıcıları

### Admin Kullanıcısı
- Email: `admin@ongel.com`
- Password: `admin123`
- Role: `admin`

### Agent Kullanıcısı
- Email: `agent@ongel.com`
- Password: `agent123`
- Role: `agent`

## 9. S3 Storage Konfigürasyonu

S3-compatible storage için seçenekler:
- AWS S3
- MinIO (local development)
- DigitalOcean Spaces
- Cloudflare R2

MinIO ile local development:

```bash
# Docker ile MinIO
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

`.env` dosyasında:
```env
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=ongel-gayrimenkul
S3_REGION=us-east-1
```

## 10. Production Build

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

## Sorun Giderme

### Database Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- `.env` dosyasındaki database bilgilerini kontrol edin

### JWT Token Hatası
- `JWT_SECRET` değerinin ayarlandığından emin olun
- Token'ın süresinin dolmadığından emin olun

### CORS Hatası
- Backend `.env` dosyasında `FRONTEND_URL` değerini kontrol edin

### S3 Storage Hatası
- S3 endpoint'inin erişilebilir olduğundan emin olun
- Credential'ları kontrol edin

