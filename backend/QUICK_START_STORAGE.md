# Supabase Storage Hızlı Başlangıç

## ✅ Yapılanlar

1. `.env` dosyasına Supabase Storage ayarları eklendi:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET=listings`

## 🔧 Yapılması Gerekenler

### 1. Supabase Dashboard'da Bucket Oluşturma

1. [Supabase Dashboard](https://app.supabase.com) → Projenizi seçin
2. Sol menüden **Storage** → **New bucket**
3. Ayarlar:
   - **Name**: `listings`
   - **Public bucket**: ✅ **Aktif** (önemli!)
4. **Create bucket** butonuna tıklayın

### 2. Backend'i Başlatma

```powershell
cd backend
npm run start:dev
```

**Kontrol:** Backend konsolunda şu mesajı görmelisiniz:
```
Supabase Storage initialized successfully
```

Eğer şu mesajı görürseniz:
```
Supabase Storage configuration missing...
```
`.env` dosyasındaki değerleri kontrol edin.

### 3. Test Etme

1. Frontend'i başlatın (eğer çalışmıyorsa):
   ```powershell
   cd frontend
   npm run dev
   ```

2. Admin paneline giriş yapın:
   - URL: `http://localhost:3000/onglgyrmnkl-admin`
   - Kullanıcı adı ve şifre ile giriş yapın

3. Yeni ilan ekleme:
   - `/onglgyrmnkl-admin/dashboard/listings/new` sayfasına gidin
   - Fotoğraf seçin ve yükleyin
   - İlanı kaydedin

4. Kontrol:
   - Supabase Dashboard > Storage > `listings` bucket'ında fotoğrafları görmelisiniz
   - İlan detay sayfasında fotoğraflar görünmeli

## 🐛 Sorun Giderme

### Hata: "Supabase Storage is not configured"

**Çözüm:**
- `.env` dosyasında `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` değerlerinin olduğundan emin olun
- Backend'i yeniden başlatın

### Hata: "Bucket not found"

**Çözüm:**
- Supabase Dashboard'da `listings` bucket'ının oluşturulduğunu kontrol edin
- Bucket adının `.env` dosyasındaki `SUPABASE_STORAGE_BUCKET` ile eşleştiğinden emin olun

### Hata: "Permission denied"

**Çözüm:**
- Bucket'ın **Public** olarak işaretlendiğinden emin olun
- Supabase Dashboard > Storage > `listings` > Settings > **Public bucket** ✅

### Fotoğraflar görünmüyor

**Çözüm:**
1. Supabase Dashboard > Storage > `listings` bucket'ında dosyaların yüklendiğini kontrol edin
2. Fotoğraf URL'lerini tarayıcıda açarak test edin
3. Browser console'da hata mesajlarını kontrol edin
4. Backend konsolunda hata mesajlarını kontrol edin

## 📝 Notlar

- **Service Role Key**: Asla frontend'de kullanmayın! Sadece backend'de kullanılmalıdır.
- **Bucket Policies**: Public bucket olduğu için read policy otomatik olarak aktif olmalı.
- **File Size**: Maksimum 10MB (kod içinde ayarlanmış).

## 🔗 Detaylı Rehber

Daha fazla bilgi için: `SUPABASE_STORAGE_SETUP.md` dosyasına bakın.

