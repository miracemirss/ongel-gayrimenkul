# GitHub Repository Kurulum Adımları

## 1. GitHub'da Repository Oluşturma

### Adım 1: GitHub'a Giriş
1. https://github.com adresine gidin
2. Giriş yapın (eğer giriş yapmadıysanız)

### Adım 2: Yeni Repository Oluştur
1. Sağ üst köşedeki **+** (artı) işaretine tıklayın
2. **New repository** seçeneğine tıklayın

### Adım 3: Repository Ayarları
1. **Repository name:** `ongel-gayrimenkul` (veya istediğiniz isim)
2. **Description:** (Opsiyonel) "Luxury Real Estate Platform - Öngel Gayrimenkul"
3. **Visibility:**
   - **Public** (herkes görebilir) veya
   - **Private** (sadece siz görebilirsiniz)
4. **ÖNEMLİ:** Aşağıdaki seçenekleri **SEÇMEYİN:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (Çünkü zaten bu dosyalar projede var)

5. **Create repository** butonuna tıklayın

### Adım 4: Repository URL'ini Kopyalayın
Repository oluşturulduktan sonra, GitHub size şu sayfayı gösterecek:
- "Quick setup" bölümünde bir URL göreceksiniz
- Bu URL şuna benzer olacak: `https://github.com/YOUR_USERNAME/ongel-gayrimenkul.git`
- Bu URL'yi kopyalayın

## 2. Local Repository'yi GitHub'a Bağlama

Terminal'de (PowerShell) şu komutları çalıştırın:

```powershell
# 1. Remote repository ekle (YOUR_USERNAME'i kendi kullanıcı adınızla değiştirin)
git remote add origin https://github.com/YOUR_USERNAME/ongel-gayrimenkul.git

# 2. Branch adını main yap (eğer master ise)
git branch -M main

# 3. GitHub'a push et
git push -u origin main
```

## Örnek

Eğer GitHub kullanıcı adınız `miracemirss` ise:

```powershell
git remote add origin https://github.com/miracemirss/ongel-gayrimenkul.git
git branch -M main
git push -u origin main
```

## Sorun Giderme

### "remote origin already exists" hatası
Eğer remote zaten varsa:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ongel-gayrimenkul.git
```

### "Authentication failed" hatası
GitHub'da Personal Access Token kullanmanız gerekebilir:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "repo" yetkisi verin
3. Token'ı şifre olarak kullanın

### "Repository not found" hatası
- Repository adını kontrol edin
- GitHub kullanıcı adınızı kontrol edin
- Repository'nin oluşturulduğundan emin olun

## Başarılı Push Sonrası

Push başarılı olduğunda:
- GitHub'da repository'nizi görebilirsiniz
- Railway'a gidip deploy edebilirsiniz

