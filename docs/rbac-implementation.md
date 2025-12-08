# RBAC (Role-Based Access Control) Teknik Açıklama

## Genel Bakış

Sistemde iki rol bulunmaktadır:
- **Admin**: Tüm kaynaklara tam erişim
- **Agent (Danışman)**: Sadece kendi atanan kaynaklara erişim

---

## Implementasyon Detayları

### 1. Rol Tanımları

**Dosya:** `backend/src/common/decorators/roles.decorator.ts`

```typescript
export enum Role {
  Admin = 'admin',
  Agent = 'agent',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### 2. Guard Sistemi

#### JWT Auth Guard
**Dosya:** `backend/src/common/guards/jwt-auth.guard.ts`

Tüm isteklerde JWT token doğrulaması yapar. `@Public()` decorator'ü ile bypass edilebilir.

#### Roles Guard
**Dosya:** `backend/src/common/guards/roles.guard.ts`

Controller seviyesinde rol kontrolü yapar. `@Roles(Role.Admin)` gibi decorator'lerle kullanılır.

#### Resource Ownership Guard
**Dosya:** `backend/src/common/guards/resource-ownership.guard.ts`

Kaynak sahipliği kontrolü yapar. Agent sadece kendi kaynaklarına erişebilir.

### 3. Service Seviyesinde RBAC

RBAC kontrolü genellikle Service katmanında yapılır. Örnek:

**Dosya:** `backend/src/listings/listings.service.ts`

```typescript
async findAll(
  filterDto: ListingFilterDto,
  userId: string,
  userRole: Role,
): Promise<Listing[]> {
  const where: FindOptionsWhere<Listing> = {};

  // Agent can only see their own listings
  if (userRole === Role.Agent) {
    where.assignedAgentId = userId;
  }

  // Admin sees all listings (no filter)
  // ... rest of the query
}
```

### 4. Controller Kullanımı

**Dosya:** `backend/src/listings/listings.controller.ts`

```typescript
@Controller('listings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListingsController {
  @Get()
  findAll(
    @Query() filterDto: ListingFilterDto,
    @CurrentUser() user: any, // JWT'den gelen user bilgisi
  ) {
    return this.listingsService.findAll(
      filterDto,
      user.id,      // Current user ID
      user.role,    // Current user role
    );
  }
}
```

---

## RBAC Senaryoları

### Senaryo 1: İlan Listeleme

**Admin:**
- Tüm ilanları görür
- Filtreleme yapabilir

**Agent:**
- Sadece kendi atanan ilanlarını görür
- `assignedAgentId` filtresi otomatik uygulanır

**Kod Örneği:**
```typescript
// listings.service.ts
async findAll(filterDto, userId, userRole) {
  const where = {};
  
  if (userRole === Role.Agent) {
    where.assignedAgentId = userId; // Otomatik filtre
  }
  
  return this.listingsRepository.find({ where });
}
```

### Senaryo 2: İlan Oluşturma

**Admin:**
- Herhangi bir agent'a atayabilir
- `assignedAgentId` parametresini değiştirebilir

**Agent:**
- Sadece kendine atayabilir
- `assignedAgentId` parametresi otomatik olarak kendi ID'si yapılır

**Kod Örneği:**
```typescript
// listings.service.ts
async create(createListingDto, userId, userRole) {
  // Agent can only assign listings to themselves
  if (userRole === Role.Agent) {
    createListingDto.assignedAgentId = userId; // Zorla kendi ID'si
  }
  
  const listing = this.listingsRepository.create(createListingDto);
  return this.listingsRepository.save(listing);
}
```

### Senaryo 3: İlan Güncelleme

**Admin:**
- Herhangi bir ilanı güncelleyebilir
- `assignedAgentId` değiştirebilir

**Agent:**
- Sadece kendi ilanlarını güncelleyebilir
- `assignedAgentId` değiştiremez (silinir)

**Kod Örneği:**
```typescript
// listings.service.ts
async update(id, updateListingDto, userId, userRole) {
  const listing = await this.findOne(id, userId, userRole);
  
  // RBAC check
  if (userRole === Role.Agent && listing.assignedAgentId !== userId) {
    throw new ForbiddenException('Permission denied');
  }
  
  // Agent cannot change assignedAgentId
  if (userRole === Role.Agent && updateListingDto.assignedAgentId) {
    delete updateListingDto.assignedAgentId; // Sil
  }
  
  Object.assign(listing, updateListingDto);
  return this.listingsRepository.save(listing);
}
```

### Senaryo 4: Lead Yönetimi

Lead'ler için de aynı mantık geçerlidir:

```typescript
// leads.service.ts
async findAll(status, userId, userRole) {
  const where = {};
  
  if (userRole === Role.Agent) {
    where.assignedAgentId = userId; // Sadece kendi lead'leri
  }
  
  return this.leadsRepository.find({ where });
}
```

---

## Decorator Kullanımı

### @Roles() Decorator

Controller veya method seviyesinde rol kontrolü:

```typescript
@Roles(Role.Admin)
@Post('users')
createUser(@Body() dto: CreateUserDto) {
  // Sadece Admin erişebilir
}
```

### @CurrentUser() Decorator

JWT'den gelen user bilgisini almak için:

```typescript
@Get('listings')
findAll(@CurrentUser() user: any) {
  // user.id, user.role, user.email, etc.
}
```

### @Public() Decorator

JWT kontrolünü bypass etmek için:

```typescript
@Public()
@Get('cms/pages/:type')
findByType(@Param('type') type: string) {
  // JWT kontrolü yapılmaz
}
```

---

## Güvenlik Notları

1. **Service Katmanında Kontrol**: RBAC kontrolü her zaman Service katmanında yapılmalıdır. Controller'da sadece `@Roles()` decorator'ü kullanılabilir, ancak kaynak sahipliği kontrolü Service'te olmalıdır.

2. **Database Seviyesinde Filtreleme**: Agent'lar için WHERE clause'da otomatik filtreleme yapılmalıdır. Bu, yanlışlıkla başka kaynakların döndürülmesini engeller.

3. **Parametre Manipülasyonu**: Agent'lar `assignedAgentId` gibi parametreleri değiştirememelidir. Service katmanında bu parametreler kontrol edilmeli ve gerekirse silinmelidir.

4. **Exception Handling**: Yetkisiz erişim denemelerinde `ForbiddenException` fırlatılmalıdır.

---

## Test Senaryoları

### Test 1: Agent Kendi İlanını Görebilir
```typescript
// Agent ID: agent-123
// Listing assignedAgentId: agent-123
// ✅ Başarılı
```

### Test 2: Agent Başka Agent'ın İlanını Göremez
```typescript
// Agent ID: agent-123
// Listing assignedAgentId: agent-456
// ❌ ForbiddenException
```

### Test 3: Admin Tüm İlanları Görebilir
```typescript
// User Role: admin
// ✅ Tüm ilanlar döner
```

### Test 4: Agent assignedAgentId Değiştiremez
```typescript
// Agent ID: agent-123
// Request: { assignedAgentId: 'agent-456' }
// Service: assignedAgentId silinir veya agent-123'e zorlanır
```

---

## Özet

- **Admin**: Tüm kaynaklara tam erişim
- **Agent**: Sadece kendi atanan kaynaklara erişim
- **Kontrol Noktaları**: Service katmanında WHERE clause filtreleme
- **Güvenlik**: Parametre manipülasyonu engelleme
- **Exception**: Yetkisiz erişimde `ForbiddenException`

