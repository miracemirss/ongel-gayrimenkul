# Backend Klasör Yapısı - NestJS

## Genel Yapı

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── auth/                      # Authentication modülü
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── users/                     # Kullanıcı yönetimi
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── listings/                  # İlan yönetimi
│   │   ├── listings.module.ts
│   │   ├── listings.service.ts
│   │   ├── listings.controller.ts
│   │   ├── entities/
│   │   │   ├── listing.entity.ts
│   │   │   └── listing-image.entity.ts
│   │   └── dto/
│   │       ├── create-listing.dto.ts
│   │       ├── update-listing.dto.ts
│   │       └── listing-filter.dto.ts
│   ├── leads/                     # Lead yönetimi
│   │   ├── leads.module.ts
│   │   ├── leads.service.ts
│   │   ├── leads.controller.ts
│   │   ├── entities/
│   │   │   ├── lead.entity.ts
│   │   │   └── lead-note.entity.ts
│   │   └── dto/
│   │       ├── create-lead.dto.ts
│   │       ├── update-lead.dto.ts
│   │       └── create-lead-note.dto.ts
│   ├── cms/                       # Kurumsal içerik yönetimi
│   │   ├── cms.module.ts
│   │   ├── cms.service.ts
│   │   ├── cms.controller.ts
│   │   ├── entities/
│   │   │   └── cms-page.entity.ts
│   │   └── dto/
│   │       ├── create-cms-page.dto.ts
│   │       └── update-cms-page.dto.ts
│   ├── storage/                   # S3 storage servisi
│   │   ├── storage.module.ts
│   │   └── storage.service.ts
│   └── common/                    # Ortak modüller
│       ├── decorators/
│       │   ├── roles.decorator.ts
│       │   ├── current-user.decorator.ts
│       │   └── public.decorator.ts
│       └── guards/
│           ├── jwt-auth.guard.ts
│           ├── roles.guard.ts
│           └── resource-ownership.guard.ts
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## Modül Yapısı

Her modül NestJS pattern'ine uygun olarak şu yapıyı takip eder:

1. **Module**: Modül tanımı ve bağımlılıklar
2. **Service**: İş mantığı (business logic)
3. **Controller**: HTTP endpoint'leri
4. **Entity**: TypeORM entity (database model)
5. **DTO**: Data Transfer Objects (validation)

## Ortak Modüller

### common/decorators/
- `@Roles()`: Rol bazlı yetkilendirme
- `@CurrentUser()`: JWT'den user bilgisini al
- `@Public()`: JWT kontrolünü bypass et

### common/guards/
- `JwtAuthGuard`: JWT token doğrulama
- `RolesGuard`: Rol kontrolü
- `ResourceOwnershipGuard`: Kaynak sahipliği kontrolü

## Database Bağlantısı

TypeORM kullanılarak PostgreSQL'e bağlanılır. Entity'ler otomatik olarak tablolara dönüştürülür (development modunda `synchronize: true`).

## API Dokümantasyonu

Swagger/OpenAPI dokümantasyonu: `http://localhost:3001/api/docs`

