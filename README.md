# Öngel Gayrimenkul - Luxury Real Estate Platform

Lüks emlak ve finansal danışmanlık platformu. Sotheby's International Realty estetiğinde, minimalist lüks tasarım.

## 🎨 Tasarım Felsefesi

- **Minimalist Lüks**: Siyah, beyaz ve gümüş tonlarında temiz tasarım
- **Sotheby's Estetiği**: Profesyonel ve elit görsel dil
- **Monokromatik Görseller**: Yüksek kaliteli siyah-beyaz filtre uygulanmış görseller
- **Aşırı Animasyonsuz**: Sade ve profesyonel kullanıcı deneyimi

## 🛠 Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT (Passport)
- **Storage**: S3-compatible (AWS S3, MinIO, etc.)
- **API Docs**: Swagger/OpenAPI

## 📁 Proje Yapısı

```
ongel-gayrimenkul/
├── frontend/          # Next.js 14 App Router
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities (api, auth)
│   └── ...
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/     # Authentication
│   │   ├── users/    # User management
│   │   ├── listings/ # Listing management
│   │   ├── leads/    # Lead management
│   │   ├── cms/      # Content management
│   │   └── common/   # Shared modules
│   └── ...
└── docs/             # Technical documentation
    ├── database-schema.md
    ├── api-endpoints.md
    ├── rbac-implementation.md
    ├── frontend-structure.md
    ├── backend-structure.md
    └── setup-guide.md
```

## 🚀 Hızlı Başlangıç

Detaylı kurulum için [Setup Guide](./docs/setup-guide.md) dosyasına bakın.

### Backend
```bash
cd backend
npm install
cp .env.example .env  # .env dosyasını düzenleyin
npm run start:dev
```

Backend: http://localhost:3001  
Swagger UI: http://localhost:3001/api/docs

### Frontend
```bash
cd frontend
npm install
# .env.local dosyası oluşturun: NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

Frontend: http://localhost:3000

## 🔐 Roller ve Yetkiler

### Admin
- ✅ Tüm modüllere tam erişim
- ✅ Kullanıcı yönetimi
- ✅ CMS yönetimi
- ✅ Tüm ilan ve lead'lere erişim
- ✅ Agent atama/değiştirme

### Agent (Danışman)
- ✅ Sadece kendi atanan ilanları görür/düzenler
- ✅ Sadece kendi atanan lead'leri görür/düzenler
- ✅ Lead'lere not ekleyebilir
- ✅ CMS sayfalarını okuyabilir (public)
- ❌ Başka agent'ın kaynaklarına erişemez
- ❌ Kullanıcı yönetimi yapamaz

## 📦 Modüller

### 1. İlan Yönetimi (Listings)
- ✅ CRUD işlemleri
- ✅ Çoklu görsel galeri
- ✅ 360° Sanal Tur URL
- ✅ Video URL
- ✅ Harita entegrasyonu (latitude/longitude)
- ✅ Filtreleme (fiyat, alan, oda sayısı, konum)
- ✅ Durum yönetimi (Aktif, Satıldı, Pasif)
- ✅ RBAC: Agent sadece kendi ilanlarını görür

### 2. Lead Yönetimi (Leads)
- ✅ CRUD işlemleri
- ✅ Lead notları/günlük sistemi
- ✅ Kaynak takibi (İletişim Formu, Portföy, Mortgage)
- ✅ Durum yönetimi (Yeni, İşlemde, Tamamlandı)
- ✅ İlan ilişkilendirme
- ✅ RBAC: Agent sadece kendi lead'lerini görür

### 3. Kurumsal İçerik Yönetimi (CMS)
- ✅ WYSIWYG editör
- ✅ Hakkımızda sayfası
- ✅ Hizmetler sayfası
- ✅ Mortgage sayfası
- ✅ SEO meta bilgileri
- ✅ Public endpoint'ler

### 4. Kullanıcı Yönetimi (Users)
- ✅ CRUD işlemleri (Admin only)
- ✅ Rol yönetimi (Admin, Agent)
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)

## 📚 Dökümantasyon

Tüm teknik dökümantasyon `docs/` klasöründe:

- **[Database Schema](./docs/database-schema.md)** - PostgreSQL ERD ve tablo yapıları
- **[API Endpoints](./docs/api-endpoints.md)** - RESTful API endpoint listesi
- **[RBAC Implementation](./docs/rbac-implementation.md)** - Rol bazlı yetkilendirme detayları
- **[Frontend Structure](./docs/frontend-structure.md)** - Next.js klasör yapısı
- **[Backend Structure](./docs/backend-structure.md)** - NestJS modül yapısı
- **[Setup Guide](./docs/setup-guide.md)** - Kurulum kılavuzu

## 🔒 Güvenlik

- JWT-based authentication
- Role-based access control (RBAC)
- Resource ownership validation
- Input validation (class-validator)
- Password hashing (bcrypt)
- CORS configuration
- SQL injection protection (TypeORM)

## 📝 Özellikler

- ✅ Tam yığın (Full-stack) uygulama
- ✅ TypeScript ile tip güvenliği
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ RBAC (Role-Based Access Control)
- ✅ S3-compatible storage
- ✅ WYSIWYG editor
- ✅ Responsive design
- ✅ Swagger API documentation
- ✅ Form validation
- ✅ Error handling

## 🧪 Geliştirme

### Backend Development
```bash
cd backend
npm run start:dev  # Watch mode
npm run build    # Production build
npm run start:prod  # Production mode
```

### Frontend Development
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
```

## 📄 Lisans

Bu proje özel bir projedir.

## 👥 İletişim

Öngel Gayrimenkul - info@ongelgayrimenkul.com

