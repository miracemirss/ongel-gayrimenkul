# İlk Admin Kullanıcısı Oluşturma (Supabase)

## Yöntem 1: API Endpoint ile (Önerilen)

Backend'de `/api/users/init-admin` endpoint'i eklendi. Bu endpoint sadece hiç admin kullanıcısı yoksa çalışır.

### Adımlar:

1. Backend'in çalıştığından emin olun (http://localhost:3001)

2. Swagger UI'ya gidin: http://localhost:3001/api/docs

3. `POST /api/users/init-admin` endpoint'ini bulun

4. "Try it out" butonuna tıklayın

5. Request body'yi doldurun:

```json
{
  "email": "admin@ongel.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

6. "Execute" butonuna tıklayın

7. Başarılı olursa, artık bu kullanıcı ile login yapabilirsiniz.

**Not:** Bu endpoint sadece hiç admin kullanıcısı yoksa çalışır. İlk admin oluşturulduktan sonra bu endpoint devre dışı kalır.

## Yöntem 2: cURL ile

```bash
curl -X POST http://localhost:3001/api/users/init-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ongel.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

## Yöntem 3: PowerShell ile

```powershell
$body = @{
    email = "admin@ongel.com"
    password = "Admin123!"
    firstName = "Admin"
    lastName = "User"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/users/init-admin" -Method Post -Body $body -ContentType "application/json"
```

## Yöntem 4: Supabase SQL Editor ile (Manuel)

Eğer API çalışmıyorsa, Supabase SQL Editor'den direkt SQL çalıştırabilirsiniz:

1. Supabase Dashboard > SQL Editor'e gidin
2. Aşağıdaki SQL'i çalıştırın (şifreyi değiştirmeyi unutmayın):

```sql
-- Önce bcrypt hash oluşturmanız gerekiyor
-- Node.js'de: const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10).then(console.log)
-- Veya online tool kullanın: https://bcrypt-generator.com/

INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@ongel.com',
  '$2b$10$YOUR_BCRYPT_HASH_HERE', -- Buraya bcrypt hash'i ekleyin
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

**Güvenlik Uyarısı:** İlk admin oluşturulduktan sonra `/init-admin` endpoint'i devre dışı kalır. Sonraki kullanıcılar için normal `/api/users` endpoint'ini kullanın (admin yetkisi gerekir).

