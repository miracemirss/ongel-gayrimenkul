-- İlk Admin Kullanıcısı Oluşturma (Supabase SQL)
-- TypeORM camelCase kolon isimleri kullanıyor

-- ÖNEMLİ: Önce bcrypt hash oluşturmanız gerekiyor!
-- Online tool: https://bcrypt-generator.com/
-- Password: Admin123!
-- Rounds: 10

-- Önce kolon isimlerini kontrol edin:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'users';

-- Eğer kolon isimleri camelCase ise (firstName, lastName, isActive, createdAt, updatedAt):
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
  '$2b$10$YOUR_BCRYPT_HASH_HERE',  -- Bcrypt hash'i buraya yapıştırın!
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);

-- Eğer kolon isimleri snake_case ise (first_name, last_name, is_active, created_at, updated_at):
-- INSERT INTO users (
--   id,
--   email,
--   password,
--   first_name,
--   last_name,
--   role,
--   is_active,
--   created_at,
--   updated_at
-- )
-- VALUES (
--   gen_random_uuid(),
--   'admin@ongel.com',
--   '$2b$10$YOUR_BCRYPT_HASH_HERE',
--   'Admin',
--   'User',
--   'admin',
--   true,
--   NOW(),
--   NOW()
-- );

-- Kontrol için:
SELECT id, email, "firstName", "lastName", role, "isActive" FROM users WHERE role = 'admin';
-- Veya snake_case ise:
-- SELECT id, email, first_name, last_name, role, is_active FROM users WHERE role = 'admin';

