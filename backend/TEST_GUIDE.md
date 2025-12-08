# Backend Test Kılavuzu

## 1. Ön Hazırlık

### PostgreSQL Veritabanı Kurulumu

```sql
-- PostgreSQL'de veritabanı oluştur
CREATE DATABASE ongel_gayrimenkul;

-- Kullanıcı oluştur (opsiyonel)
CREATE USER ongel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ongel_gayrimenkul TO ongel_user;
```

### Environment Dosyası Oluşturma

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyin ve database bilgilerinizi girin.

## 2. Bağımlılıkları Yükleme

```bash
cd backend
npm install
```

## 3. Backend'i Başlatma

```bash
npm run start:dev
```

Backend başarıyla çalıştığında:
- API: http://localhost:3001
- Swagger UI: http://localhost:3001/api/docs

## 4. Swagger UI ile Test

1. Tarayıcıda http://localhost:3001/api/docs adresine gidin
2. Swagger UI'da tüm endpoint'leri görebilirsiniz
3. "Try it out" butonuna tıklayarak endpoint'leri test edebilirsiniz

## 5. İlk Admin Kullanıcısı Oluşturma

### Yöntem 1: Swagger UI ile

1. Swagger UI'da `/api/users` endpoint'ine gidin
2. "POST /api/users" endpoint'ini açın
3. "Try it out" butonuna tıklayın
4. Request body'yi doldurun:

```json
{
  "email": "admin@ongel.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

5. "Execute" butonuna tıklayın

**Not:** İlk kullanıcıyı oluşturmak için geçici olarak `users.controller.ts`'deki `@Roles(Role.Admin)` decorator'ünü kaldırmanız gerekebilir veya direkt database'e ekleme yapabilirsiniz.

### Yöntem 2: cURL ile

```bash
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

### Yöntem 3: PostgreSQL ile Direkt

```sql
-- Password hash: bcrypt hash of "admin123"
-- Bu hash'i backend'den alabilirsiniz veya bcrypt ile oluşturabilirsiniz
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',
  '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

## 6. Login Testi

### Swagger UI ile

1. `/api/auth/login` endpoint'ine gidin
2. Request body:

```json
{
  "email": "admin@ongel.com",
  "password": "admin123"
}
```

3. Response'da `access_token` alacaksınız
4. Bu token'ı kopyalayın

### Token Kullanımı

Swagger UI'da:
1. Sağ üstteki "Authorize" butonuna tıklayın
2. Token'ı şu formatta girin: `Bearer YOUR_TOKEN_HERE`
3. Artık protected endpoint'leri test edebilirsiniz

## 7. Test Senaryoları

### A. İlan (Listing) Testi

1. **İlan Oluşturma**
   - POST `/api/listings`
   - Request body (JSONB çoklu dil):

```json
{
  "title": {
    "tr": "Lüks Villa, Bebek",
    "en": "Luxury Villa, Bebek",
    "ar": "فيلا فاخرة، بيبك"
  },
  "description": {
    "tr": "Muhteşem manzaralı lüks villa...",
    "en": "Luxury villa with stunning views...",
    "ar": "فيلا فاخرة بإطلالات خلابة..."
  },
  "price": 5000000,
  "currency": "USD",
  "status": "active_for_sale",
  "location": "Bebek, İstanbul",
  "latitude": 41.0766,
  "longitude": 29.0430,
  "netArea": 350.5,
  "grossArea": 450.0,
  "roomCount": 5,
  "virtualTourUrl": "https://example.com/tour",
  "videoUrl": "https://example.com/video.mp4",
  "assignedAgentId": "YOUR_AGENT_USER_ID"
}
```

2. **İlanları Listeleme**
   - GET `/api/listings`
   - Query parameters: `?status=active_for_sale&minPrice=1000000`

3. **İlan Detayı**
   - GET `/api/listings/:id`

### B. Lead Testi

1. **Lead Oluşturma**
   - POST `/api/leads`

```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+905551234567",
  "source": "contact_form",
  "relatedListingId": "OPTIONAL_LISTING_ID",
  "assignedAgentId": "YOUR_AGENT_USER_ID"
}
```

2. **Lead'e Not Ekleme**
   - POST `/api/leads/:id/notes`

```json
{
  "content": "Müşteri ile görüşüldü. İlan hakkında bilgi verildi."
}
```

### C. CMS Testi

1. **CMS Sayfası Oluşturma**
   - POST `/api/cms/pages`

```json
{
  "type": "about",
  "title": {
    "tr": "Hakkımızda",
    "en": "About Us",
    "ar": "من نحن"
  },
  "content": {
    "tr": "<p>Öngel Gayrimenkul hakkında...</p>",
    "en": "<p>About Öngel Gayrimenkul...</p>",
    "ar": "<p>حول أونجل العقارية...</p>"
  },
  "metaTitle": {
    "tr": "Hakkımızda - Öngel Gayrimenkul",
    "en": "About Us - Öngel Gayrimenkul",
    "ar": "من نحن - أونجل العقارية"
  }
}
```

2. **Public CMS Sayfası**
   - GET `/api/cms/pages/about` (Public endpoint)

### D. Footer Link Testi

1. **Footer Link Oluşturma**
   - POST `/api/footer/links`

```json
{
  "type": "social",
  "name": "Instagram",
  "url": "https://instagram.com/ongelgayrimenkul",
  "icon": "instagram",
  "order": 0,
  "isActive": true
}
```

2. **Public Footer Links**
   - GET `/api/footer/links` (Public endpoint)
   - GET `/api/footer/links?type=social`

## 8. Hata Ayıklama

### Database Bağlantı Hatası

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Çözüm:**
- PostgreSQL servisinin çalıştığından emin olun
- `.env` dosyasındaki database bilgilerini kontrol edin

### JWT Secret Hatası

```
Error: secretOrPrivateKey must have a value
```

**Çözüm:**
- `.env` dosyasında `JWT_SECRET` değerinin ayarlandığından emin olun
- Minimum 32 karakter olmalı

### TypeORM Synchronize Hatası

Development modunda `synchronize: true` olduğu için tablolar otomatik oluşturulur. Production'da `false` yapın ve migration kullanın.

## 9. Postman/Insomnia ile Test

Swagger UI yerine Postman veya Insomnia kullanabilirsiniz:

1. Collection oluşturun
2. Environment variables ekleyin:
   - `base_url`: http://localhost:3001/api
   - `token`: Login'den alınan token
3. Pre-request script ile token'ı otomatik ekleyin

## 10. Unit Test (Opsiyonel)

```bash
npm run test
npm run test:watch
npm run test:cov
```

## Hızlı Test Checklist

- [ ] PostgreSQL çalışıyor
- [ ] `.env` dosyası oluşturuldu ve düzenlendi
- [ ] `npm install` çalıştırıldı
- [ ] `npm run start:dev` ile backend başlatıldı
- [ ] Swagger UI açılıyor (http://localhost:3001/api/docs)
- [ ] İlk admin kullanıcısı oluşturuldu
- [ ] Login çalışıyor ve token alınıyor
- [ ] Protected endpoint'ler token ile çalışıyor

