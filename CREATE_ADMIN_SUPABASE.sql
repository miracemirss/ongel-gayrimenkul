-- İlk Admin Kullanıcısı Oluşturma (Supabase SQL)
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- ÖNEMLİ: Önce bcrypt hash oluşturmanız gerekiyor!
-- Şifre: Admin123! için bcrypt hash (10 rounds):
-- Online tool: https://bcrypt-generator.com/
-- Veya Node.js: const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10).then(console.log)

-- Örnek bcrypt hash (Admin123! için):
-- $2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq

INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
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

-- Kontrol için:
SELECT id, email, first_name, last_name, role, is_active FROM users WHERE role = 'admin';

