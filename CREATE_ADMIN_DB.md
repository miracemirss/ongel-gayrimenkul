# 🗄️ Veritabanından Direkt Admin Kullanıcısı Oluşturma

## 📋 Gereksinimler

- Supabase Dashboard erişimi
- Şifre için bcrypt hash (10 rounds)

---

## 🔐 Adım 1: Bcrypt Hash Oluşturma

### Yöntem 1: Online Tool (En Kolay)

1. **https://bcrypt-generator.com/** adresine gidin
2. **Password** alanına şifrenizi yazın (örnek: `Admin123!`)
3. **Rounds** değerini `10` yapın
4. **"Generate Hash"** butonuna tıklayın
5. **Hash'i kopyalayın** (örnek: `$2b$10$...`)

### Yöntem 2: Node.js (SSH'da)

**SSH terminal'inde:**
```bash
# Node.js REPL'de
node
```

**Node.js'de:**
```javascript
const bcrypt = require('bcrypt');

// Şifrenizi buraya yazın
const password = 'Admin123!';

bcrypt.hash(password, 10).then(hash => {
  console.log('Bcrypt Hash:', hash);
  process.exit();
});
```

**Çıktı:**
```
Bcrypt Hash: $2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq
```

**Not:** Eğer `bcrypt` modülü yoksa:
```bash
npm install bcrypt
```

### Yöntem 3: Python (SSH'da)

**SSH terminal'inde:**
```bash
python3
```

**Python'da:**
```python
import bcrypt

# Şifrenizi buraya yazın
password = 'Admin123!'.encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=10))
print(hashed.decode('utf-8'))
```

**Not:** Eğer `bcrypt` modülü yoksa:
```bash
pip3 install bcrypt
```

---

## 🗄️ Adım 2: Supabase SQL Editor'de Kullanıcı Oluşturma

### 1. Supabase Dashboard'a Giriş

1. **https://supabase.com** adresine gidin
2. **Projenizi seçin**
3. **SQL Editor** sekmesine gidin

### 2. Kolon İsimlerini Kontrol Edin

**ÖNEMLİ:** Önce veritabanındaki kolon isimlerini kontrol edin!

**SQL Editor'de şu sorguyu çalıştırın:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';
```

**Bu sorgu, users tablosundaki tüm kolon isimlerini gösterecek.**

**Muhtemelen kolon isimleri:**
- `firstName` (camelCase) - tırnak içinde: `"firstName"`
- `lastName` (camelCase) - tırnak içinde: `"lastName"`
- `isActive` (camelCase) - tırnak içinde: `"isActive"`
- `createdAt` (camelCase) - tırnak içinde: `"createdAt"`
- `updatedAt` (camelCase) - tırnak içinde: `"updatedAt"`

**Veya:**
- `first_name` (snake_case)
- `last_name` (snake_case)
- `is_active` (snake_case)
- `created_at` (snake_case)
- `updated_at` (snake_case)

### 3. SQL Komutunu Çalıştırın

**Eğer kolon isimleri camelCase ise (tırnak içinde):**

```sql
INSERT INTO users (
  id,
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',  -- Email'i değiştirebilirsiniz
  '$2b$10$YOUR_BCRYPT_HASH_HERE',  -- Buraya bcrypt hash'i ekleyin!
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**Eğer kolon isimleri snake_case ise:**

```sql
INSERT INTO users (
  id,
  email,
  password,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',  -- Email'i değiştirebilirsiniz
  '$2b$10$YOUR_BCRYPT_HASH_HERE',  -- Buraya bcrypt hash'i ekleyin!
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**ÖNEMLİ:** `$2b$10$YOUR_BCRYPT_HASH_HERE` yerine Adım 1'de oluşturduğunuz bcrypt hash'ini yazın!

### 3. Örnek (Şifre: Admin123!)

**Eğer şifreniz `Admin123!` ise, örnek hash:**
```
$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq
```

**Tam SQL:**
```sql
INSERT INTO users (
  id,
  email,
  password,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',
  '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**Not:** Bu hash örnek bir hash'tir. Kendi hash'inizi oluşturun!

---

## ✅ Adım 3: Kullanıcıyı Kontrol Etme

**SQL Editor'de:**
```sql
-- Admin kullanıcılarını listele
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  is_active,
  created_at
FROM users 
WHERE role = 'admin';
```

**Beklenen çıktı:**
```
id                                   | email            | first_name | last_name | role  | is_active | created_at
-------------------------------------+------------------+------------+-----------+-------+-----------+------------
550e8400-e29b-41d4-a716-446655440000 | admin@ongel.com  | Admin      | User      | admin | true      | 2025-12-10
```

---

## 🔐 Adım 4: Login Test

1. **Browser'da açın:**
   ```
   https://ongelgayrimenkul.com/onglgyrmnkl-admin
   ```

2. **Login formunu doldurun:**
   - Email: `admin@ongel.com` (veya oluşturduğunuz email)
   - Şifre: `Admin123!` (veya oluşturduğunuz şifre)

3. **"Giriş Yap" butonuna tıklayın**

4. **Başarılı olursa, dashboard'a yönlendirilmelisiniz**

---

## 🆘 Sorun Giderme

### Bcrypt Hash Oluşturulamıyor

1. **Online tool kullanın:** https://bcrypt-generator.com/
2. **Node.js'de bcrypt modülü yoksa:**
   ```bash
   npm install bcrypt
   ```

### SQL Hatası

1. **Tablo adı doğru mu?** (`users`)
2. **Kolon adları doğru mu?** (`email`, `password`, `first_name`, `last_name`, `role`)
3. **Bcrypt hash doğru mu?** (`$2b$10$...` formatında olmalı)

### Login Başarısız

1. **Email doğru mu?**
   ```sql
   SELECT email FROM users WHERE email = 'admin@ongel.com';
   ```

2. **Role admin mi?**
   ```sql
   SELECT role FROM users WHERE email = 'admin@ongel.com';
   ```

3. **is_active true mu?**
   ```sql
   SELECT is_active FROM users WHERE email = 'admin@ongel.com';
   ```

4. **Bcrypt hash doğru mu?**
   - Şifreyi tekrar hash'leyin ve karşılaştırın
   - Online tool'dan hash'i kontrol edin

---

## 📝 Hızlı Başlangıç

### 1. Bcrypt Hash Oluştur

**Online tool:** https://bcrypt-generator.com/
- Password: `Admin123!`
- Rounds: `10`
- Generate Hash

### 2. Supabase SQL Editor'de Çalıştır

```sql
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',
  '$2b$10$YOUR_HASH_HERE',  -- Bcrypt hash'i buraya yapıştırın
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

### 3. Kontrol Et

```sql
SELECT email, first_name, last_name, role FROM users WHERE role = 'admin';
```

### 5. Login Test

- URL: `https://ongelgayrimenkul.com/onglgyrmnkl-admin`
- Email: `admin@ongel.com`
- Şifre: `Admin123!`

---

## ✅ Başarı Kontrolü

- [x] Bcrypt hash oluşturuldu
- [x] SQL komutu çalıştırıldı
- [x] Kullanıcı veritabanında görünüyor
- [x] Login sayfası açılıyor
- [x] Login başarılı
- [x] Dashboard açılıyor

---

## 📝 Özet

1. ✅ **Bcrypt hash oluştur:** https://bcrypt-generator.com/
2. ✅ **Supabase SQL Editor'de çalıştır:** INSERT komutu
3. ✅ **Kontrol et:** SELECT komutu
4. ✅ **Login test et:** Admin panel

**Not:** Bcrypt hash'i mutlaka doğru oluşturun, yoksa login çalışmaz!

