# roomCount Kolonu Migration Hatası Düzeltme

## Sorun

`roomCount` kolonu `int`'den `varchar(50)`'ye değiştirilmeye çalışılıyor ancak kolonda null değerler var.

## Hızlı Çözüm (Önerilen)

### Seçenek 1: Supabase SQL Editor'de Çalıştırın

1. [Supabase Dashboard](https://app.supabase.com) → Projenizi seçin
2. Sol menüden **SQL Editor**'e gidin
3. Aşağıdaki SQL'i çalıştırın:

```sql
-- Null değerleri güncelle
UPDATE listings SET "roomCount" = '1+1' WHERE "roomCount" IS NULL;

-- Eğer roomCount hala integer ise, string'e çevir
-- Önce mevcut değerleri kontrol edin
SELECT "roomCount", typeof("roomCount") FROM listings LIMIT 1;

-- Eğer integer ise, yeni bir kolon oluşturup değerleri kopyalayın
ALTER TABLE listings ADD COLUMN "roomCount_new" VARCHAR(50);
UPDATE listings SET "roomCount_new" = CAST("roomCount" AS VARCHAR) WHERE "roomCount" IS NOT NULL;
UPDATE listings SET "roomCount_new" = '1+1' WHERE "roomCount" IS NULL;
ALTER TABLE listings DROP COLUMN "roomCount";
ALTER TABLE listings RENAME COLUMN "roomCount_new" TO "roomCount";
ALTER TABLE listings ALTER COLUMN "roomCount" SET NOT NULL;
```

### Seçenek 2: Entity'yi Geçici Olarak Nullable Yapın

Entity zaten nullable yapıldı. Şimdi:

1. Backend'i yeniden başlatın
2. Mevcut null değerleri güncelleyin (admin panelden veya SQL ile)
3. Entity'yi tekrar NOT NULL yapın

```typescript
// backend/src/listings/entities/listing.entity.ts
@Column({ type: 'varchar', length: 50, nullable: true }) // Geçici olarak nullable
roomCount: string;
```

Sonra SQL ile güncelleyin:
```sql
UPDATE listings SET "roomCount" = '1+1' WHERE "roomCount" IS NULL;
```

Ve entity'yi tekrar NOT NULL yapın:
```typescript
@Column({ type: 'varchar', length: 50 }) // NOT NULL
roomCount: string;
```

### Seçenek 3: Tüm Listings Kayıtlarını Silin (Sadece Test Verileri Varsa)

```sql
-- DİKKAT: Bu tüm listings kayıtlarını siler!
DELETE FROM listings;
```

Sonra backend'i yeniden başlatın.

## Detaylı Çözüm

`backend/scripts/fix-roomcount-simple.sql` dosyasındaki SQL'i Supabase SQL Editor'de çalıştırın.

## Kontrol

Migration başarılı oldu mu kontrol edin:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'roomCount';
```

`data_type` = `character varying` ve `is_nullable` = `NO` olmalı.

