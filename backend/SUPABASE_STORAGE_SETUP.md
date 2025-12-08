# Supabase Storage Kurulum Kılavuzu

Bu rehber, Öngel Gayrimenkul projesinde Supabase Storage'ı kullanarak fotoğraf yükleme işlemlerini yapılandırmak için hazırlanmıştır.

## 1. Supabase Storage Bucket Oluşturma

### Adım 1: Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenizi seçin

### Adım 2: Storage Bucket Oluşturma

1. Sol menüden **Storage** bölümüne tıklayın
2. **New bucket** butonuna tıklayın
3. Bucket bilgilerini doldurun:
   - **Name**: `listings` (veya istediğiniz isim)
   - **Public bucket**: ✅ **Aktif** (fotoğrafların herkese açık olması için)
4. **Create bucket** butonuna tıklayın

### Adım 3: Bucket Politikalarını Ayarlama

1. Oluşturduğunuz bucket'a tıklayın
2. **Policies** sekmesine gidin
3. **New Policy** butonuna tıklayın
4. **For full customization** seçeneğini seçin
5. Aşağıdaki politikaları ekleyin:

#### Upload Policy (Yükleme İçin)

```sql
-- İsim: Allow authenticated uploads
-- Policy: INSERT
-- Target roles: authenticated
-- USING expression:
bucket_id = 'listings' AND auth.role() = 'authenticated'
```

#### Read Policy (Okuma İçin - Public)

```sql
-- İsim: Allow public reads
-- Policy: SELECT
-- Target roles: public
-- USING expression:
bucket_id = 'listings'
```

#### Delete Policy (Silme İçin)

```sql
-- İsim: Allow authenticated deletes
-- Policy: DELETE
-- Target roles: authenticated
-- USING expression:
bucket_id = 'listings' AND auth.role() = 'authenticated'
```

**Not:** Eğer bucket'ı public yaptıysanız, read policy zaten aktif olabilir. Kontrol edin.

## 2. Supabase API Keys Alma

### Adım 1: Project Settings

1. Sol menüden **Settings** (⚙️) ikonuna tıklayın
2. **API** sekmesine gidin

### Adım 2: API Keys'i Kopyalama

Aşağıdaki bilgileri kopyalayın:

- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **anon/public key**: Public key (frontend'de kullanılır)
- **service_role key**: Service role key (backend'de kullanılır - **GİZLİ TUTUN!**)

**ÖNEMLİ:** `service_role` key'i asla frontend'de kullanmayın! Sadece backend'de kullanılmalıdır.

## 3. Backend .env Dosyası Yapılandırması

`backend/.env` dosyasını oluşturun veya güncelleyin:

```env
# Supabase Database Connection String
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# SSL gereklidir
DB_SSL=true

# Supabase Storage Configuration
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]
SUPABASE_STORAGE_BUCKET=listings

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Eski S3 Configuration (Artık kullanılmıyor, Supabase Storage kullanıyoruz)
# S3_ENDPOINT=
# S3_ACCESS_KEY_ID=
# S3_SECRET_ACCESS_KEY=
# S3_REGION=us-east-1
# S3_BUCKET_NAME=
```

### .env Dosyası Örnek Değerler

```env
# Supabase Database Connection String
DATABASE_URL=postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:6543/postgres

# SSL gereklidir
DB_SSL=true

# Supabase Storage Configuration
SUPABASE_URL=https://lidfgiarpaiuwhfqfiqk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZGZnaWFycGFpdXdoZnFmaXFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODc2NDMyMCwiZXhwIjoyMDE0MzQwMzIwfQ.XXXXXXXXXXXXXX
SUPABASE_STORAGE_BUCKET=listings

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 4. Storage Service'i Güncelleme

Storage service'i Supabase Storage kullanacak şekilde güncellenmiştir. `@supabase/supabase-js` paketi zaten yüklü.

## 5. Test Etme

### Adım 1: Backend'i Başlatma

```powershell
cd backend
npm run start:dev
```

### Adım 2: Fotoğraf Yükleme Testi

1. Admin paneline giriş yapın: `http://localhost:3000/onglgyrmnkl-admin`
2. Yeni ilan ekleme sayfasına gidin
3. Fotoğraf seçin ve yükleyin
4. Konsolda hata mesajı olup olmadığını kontrol edin

### Adım 3: Supabase Dashboard'da Kontrol

1. Supabase Dashboard > Storage > `listings` bucket'ına gidin
2. Yüklenen fotoğrafları görmelisiniz
3. Fotoğraf URL'lerini kopyalayıp tarayıcıda açarak test edin

## 6. Sorun Giderme

### Hata: "Bucket not found"

- Bucket adının `.env` dosyasındaki `SUPABASE_STORAGE_BUCKET` ile eşleştiğinden emin olun
- Supabase Dashboard'da bucket'ın oluşturulduğunu kontrol edin

### Hata: "Invalid API key"

- `SUPABASE_SERVICE_ROLE_KEY` değerinin doğru olduğundan emin olun
- Service role key'i kullandığınızdan emin olun (anon key değil)

### Hata: "Permission denied"

- Bucket politikalarını kontrol edin
- Bucket'ın public olduğundan emin olun (fotoğrafların herkese açık olması için)

### Fotoğraflar görünmüyor

- Fotoğraf URL'lerini kontrol edin
- Supabase Dashboard > Storage'da dosyaların yüklendiğini kontrol edin
- Bucket'ın public olduğundan emin olun

## 7. Güvenlik Notları

1. **Service Role Key**: 
   - Asla frontend'de kullanmayın
   - Asla Git'e commit etmeyin
   - `.env` dosyasını `.gitignore`'a ekleyin

2. **Bucket Policies**:
   - Upload ve delete işlemleri için authenticated kullanıcılar gerekir
   - Read işlemleri public olabilir (fotoğrafların görüntülenmesi için)

3. **File Size Limits**:
   - Supabase Storage'ın dosya boyutu limitleri vardır
   - Şu an 10MB limiti var, gerekirse artırılabilir

## 8. Production İçin Öneriler

1. **Environment Variables**:
   - Production'da environment variables'ları güvenli bir şekilde saklayın
   - Vercel, Railway, veya benzeri platformlarda environment variables kullanın

2. **Bucket Policies**:
   - Production'da daha sıkı politikalar uygulayın
   - Sadece authenticated kullanıcıların upload yapmasına izin verin

3. **File Validation**:
   - Dosya türü kontrolü zaten var (sadece resimler)
   - Dosya boyutu kontrolü zaten var (10MB)

4. **CDN**:
   - Supabase Storage otomatik olarak CDN kullanır
   - Fotoğraflar hızlı bir şekilde yüklenir

## 9. Ek Kaynaklar

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage API Reference](https://supabase.com/docs/reference/javascript/storage-from)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

## 10. Destek

Sorun yaşarsanız:
1. Backend konsolundaki hata mesajlarını kontrol edin
2. Supabase Dashboard > Logs bölümünden hataları kontrol edin
3. Browser console'da hata mesajlarını kontrol edin

