# Öngel Gayrimenkul - Teknik Dökümantasyon

Bu klasör, projenin tüm teknik dökümantasyonunu içerir.

## İçindekiler

1. **[Database Schema](./database-schema.md)** - PostgreSQL ERD ve tablo yapıları
2. **[API Endpoints](./api-endpoints.md)** - RESTful API endpoint listesi ve örnekleri
3. **[RBAC Implementation](./rbac-implementation.md)** - Rol bazlı yetkilendirme teknik detayları
4. **[Frontend Structure](./frontend-structure.md)** - Next.js 14 App Router klasör yapısı
5. **[Backend Structure](./backend-structure.md)** - NestJS modül yapısı
6. **[Setup Guide](./setup-guide.md)** - Kurulum ve konfigürasyon kılavuzu

## Hızlı Başlangıç

1. [Setup Guide](./setup-guide.md) dosyasını takip ederek projeyi kurun
2. [API Endpoints](./api-endpoints.md) dosyasından API kullanımını öğrenin
3. [RBAC Implementation](./rbac-implementation.md) dosyasından yetkilendirme sistemini anlayın

## Mimari Özet

### Backend (NestJS)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT
- **Storage**: S3-compatible
- **API Documentation**: Swagger/OpenAPI

### Frontend (Next.js 14)
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Güvenlik
- JWT-based authentication
- Role-based access control (RBAC)
- Resource ownership validation
- Input validation (class-validator)

## Modüller

1. **İlan Yönetimi (Listings)**
   - CRUD işlemleri
   - Çoklu görsel yükleme
   - 360° sanal tur ve video URL
   - RBAC: Agent sadece kendi ilanlarını görür

2. **Lead Yönetimi (Leads)**
   - CRUD işlemleri
   - Lead notları/günlük
   - Kaynak takibi (form, portföy, mortgage)
   - RBAC: Agent sadece kendi lead'lerini görür

3. **Kurumsal İçerik Yönetimi (CMS)**
   - WYSIWYG editör
   - Hakkımızda, Hizmetler, Mortgage sayfaları
   - Public endpoint'ler

4. **Kullanıcı Yönetimi (Users)**
   - Admin ve Agent rolleri
   - Kullanıcı CRUD işlemleri
   - Admin only endpoints

## Roller ve Yetkiler

### Admin
- Tüm modüllere tam erişim
- Kullanıcı yönetimi
- CMS yönetimi
- Tüm ilan ve lead'lere erişim

### Agent (Danışman)
- Sadece kendi atanan ilanları görür/düzenler
- Sadece kendi atanan lead'leri görür/düzenler
- Lead'lere not ekleyebilir
- CMS sayfalarını okuyabilir (public)

## API Base URL

- **Development**: `http://localhost:3001/api`
- **Swagger UI**: `http://localhost:3001/api/docs`

## Frontend Base URL

- **Development**: `http://localhost:3000`

## Destek

Teknik sorular için lütfen proje yöneticisi ile iletişime geçin.

