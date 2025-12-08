# Supabase Kurulum Kılavuzu

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin
2. Yeni bir proje oluşturun
3. Proje oluşturulduktan sonra **Settings** > **Database** bölümüne gidin

## 2. Database Connection Bilgilerini Alma

### Seçenek 1: Connection String (Önerilen)

**Settings** > **Database** > **Connection string** bölümünden **URI** formatını kopyalayın:

```
postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

### Seçenek 2: Ayrı Bilgiler

**Settings** > **Database** bölümünden şu bilgileri alın:
- **Host**: `[PROJECT-REF].supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: Proje oluştururken belirlediğiniz şifre

## 3. .env Dosyası Yapılandırması

`backend/.env` dosyasını oluşturun veya güncelleyin:

### Connection String Kullanımı (Önerilen):

```env
# Supabase Database Connection String
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# SSL gereklidir
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# S3 Storage Configuration (Optional)
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=us-east-1
S3_BUCKET_NAME=
```

### Ayrı Bilgiler Kullanımı:

```env
# Supabase Database Configuration
DB_HOST=[PROJECT-REF].supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_DATABASE=postgres
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# S3 Storage Configuration (Optional)
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=us-east-1
S3_BUCKET_NAME=
```

## 4. Önemli Notlar

### SSL Bağlantısı
- Supabase SSL gerektirir, bu yüzden `DB_SSL=true` ayarını yapın
- `rejectUnauthorized: false` ayarı Supabase'in self-signed sertifikası için gereklidir

### Connection Pooling
- Supabase connection pooling kullanır
- Production'da connection pool limitlerine dikkat edin

### Güvenlik
- `.env` dosyasını asla Git'e commit etmeyin
- `JWT_SECRET` değerini güçlü ve rastgele bir değerle değiştirin
- Supabase password'unuzu güvenli tutun

## 5. Veritabanı Tablolarını Oluşturma

Backend'i başlattığınızda, `synchronize: true` ayarı sayesinde (development modunda) tablolar otomatik olarak oluşturulacaktır.

**Production için**: `synchronize: false` yapın ve migration kullanın.

## 6. Test Etme

Backend'i başlattıktan sonra:

```powershell
cd backend
npm run start:dev
```

Başarılı bağlantı mesajını görmelisiniz. Hata alırsanız:
1. `.env` dosyasındaki bilgileri kontrol edin
2. Supabase projenizin aktif olduğundan emin olun
3. Firewall/IP whitelist ayarlarını kontrol edin (Supabase Dashboard > Settings > Database)

## 7. Supabase Dashboard

Supabase Dashboard'dan:
- **Table Editor**: Tabloları görüntüleyin ve düzenleyin
- **SQL Editor**: SQL sorguları çalıştırın
- **Database**: Connection bilgilerini görüntüleyin
- **API**: REST ve GraphQL API'lerini kullanın (isteğe bağlı)

