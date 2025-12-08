/**
 * İlk admin kullanıcısını oluşturmak için script
 * 
 * Kullanım:
 * node scripts/create-admin.js
 * 
 * Veya direkt database'e bağlanarak:
 * psql -U postgres -d ongel_gayrimenkul -f scripts/create-admin.sql
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  console.log('=== İlk Admin Kullanıcısı Oluşturma ===\n');

  rl.question('Email: ', (email) => {
    rl.question('Şifre: ', async (password) => {
      rl.question('Ad: ', (firstName) => {
        rl.question('Soyad: ', async (lastName) => {
          try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            console.log('\n=== SQL Komutu ===');
            console.log('Aşağıdaki SQL komutunu PostgreSQL'de çalıştırın:\n');
            console.log(`INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)`);
            console.log(`VALUES (`);
            console.log(`  gen_random_uuid(),`);
            console.log(`  '${email}',`);
            console.log(`  '${hashedPassword}',`);
            console.log(`  '${firstName}',`);
            console.log(`  '${lastName}',`);
            console.log(`  'admin',`);
            console.log(`  true,`);
            console.log(`  NOW(),`);
            console.log(`  NOW()`);
            console.log(`);\n`);
            
            console.log('Veya Swagger UI üzerinden POST /api/users endpoint\'ini kullanın.');
            console.log('(Geçici olarak @Roles(Role.Admin) decorator\'ünü kaldırmanız gerekebilir)');
            
            rl.close();
          } catch (error) {
            console.error('Hata:', error);
            rl.close();
          }
        });
      });
    });
  });
}

createAdmin();

