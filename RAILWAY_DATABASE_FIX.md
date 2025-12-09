# 🔧 Railway Database Bağlantı Hatası Düzeltme

## Hata Mesajı

```
ERROR [TypeOrmModule] Unable to connect to the database. Retrying (X)...
Error: connect ENETUNREACH 2a05:d014:1c06:5f24:31c:ec68:a569:f836:5432
```

## Sorun

Railway, Supabase'e IPv6 adresi üzerinden bağlanmaya çalışıyor ama başarısız oluyor. Railway genellikle IPv4 kullanır.

---

## ✅ Çözüm: Connection String Düzeltme

### Railway Dashboard → Service → Variables → DATABASE_URL

**YANLIŞ (IPv6 veya Direct Connection):**
```
postgresql://postgres@db.xxx.supabase.co:5432/postgres
postgresql://postgres@xxx.supabase.co:5432/postgres
```

**DOĞRU (IPv4 Pooler - Önerilen):**
```
postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

**ÖNEMLİ:**
- `pooler.supabase.com` kullanın (IPv4 destekler)
- Password'u URL encode edin (`!` → `%21`)
- Port: `5432` (Session pooler) veya `6543` (Transaction pooler)

---

## 📝 Supabase Connection String Alma

### 1. Supabase Dashboard'a Gidin
https://supabase.com/dashboard

### 2. Project → Settings → Database

### 3. Connection String'i Kopyalayın

**Session Mode (Port 5432) - Önerilen:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

**Transaction Mode (Port 6543):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

### 4. Password'u URL Encode Edin

**Örnek:**
- Orijinal: `Ongel1234!!`
- Encoded: `Ongel1234%21%21`

**Online Tool:**
- https://www.urlencoder.org/

---

## 🔧 Adım Adım Düzeltme

### 1. Supabase'den Connection String Al

1. Supabase Dashboard → Project → Settings → Database
2. **Connection Pooling** bölümüne gidin
3. **Session mode** seçin
4. Connection string'i kopyalayın

### 2. Password'u Encode Et

```javascript
// JavaScript ile
encodeURIComponent('Ongel1234!!')
// Sonuç: Ongel1234%21%21
```

Veya online tool kullanın: https://www.urlencoder.org/

### 3. Railway'a Ekle

1. Railway Dashboard → Service → Variables
2. `DATABASE_URL` değişkenini bulun
3. Değeri güncelleyin:
   ```
   postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
   ```
4. Save

### 4. Railway Otomatik Redeploy Eder

Railway environment variable değiştiğinde otomatik olarak yeniden deploy eder.

---

## ✅ Kontrol

1. Railway Dashboard → Logs
2. "Application is running" mesajını arayın
3. Database bağlantı hatası yok mu?

---

## 📝 Örnek Connection String Formatı

```env
# Session Pooler (Port 5432) - Önerilen
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[ENCODED-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

# Transaction Pooler (Port 6543)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[ENCODED-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

**Örnek:**
```env
DATABASE_URL=postgresql://postgres.lidfgiarpaiuwhfqfiqk:Ongel1234%21%21@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

---

## 🆘 Hala Çalışmıyorsa

1. Supabase Dashboard → Settings → Database → Connection Pooling
2. **Session mode** seçin (Transaction değil)
3. Connection string'i tekrar kopyalayın
4. Password'u encode edin
5. Railway'a ekleyin

---

## 📞 Yardım

Sorun devam ederse:
1. Railway Logs'u paylaşın
2. DATABASE_URL formatını paylaşın (password'u gizleyin)
3. Supabase region'ını kontrol edin (aws-1-eu-central-1 doğru mu?)

