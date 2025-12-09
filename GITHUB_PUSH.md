# GitHub'a Push Rehberi

## Adımlar

### 1. GitHub'da Repository Oluşturma

1. https://github.com adresine gidin
2. Sağ üstteki **+** → **New repository** tıklayın
3. Repository adı: `ongel-gayrimenkul` (veya istediğiniz isim)
4. **Public** veya **Private** seçin
5. **Initialize this repository with a README** seçmeyin (zaten README var)
6. **Create repository** tıklayın

### 2. Local Repository'yi GitHub'a Bağlama

GitHub'da repository oluşturduktan sonra, GitHub size şu komutları gösterecek. Terminal'de çalıştırın:

```powershell
# Remote repository ekle (YOUR_USERNAME ve REPO_NAME'i değiştirin)
git remote add origin https://github.com/YOUR_USERNAME/ongel-gayrimenkul.git

# Branch adını main yap (eğer master ise)
git branch -M main

# GitHub'a push et
git push -u origin main
```

### 3. Alternatif: SSH Kullanımı

Eğer SSH key'iniz varsa:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/ongel-gayrimenkul.git
git branch -M main
git push -u origin main
```

## Örnek Komutlar

```powershell
# 1. Git repository başlat (zaten yapıldı)
git init

# 2. Tüm dosyaları ekle
git add .

# 3. Commit yap
git commit -m "Initial commit: Öngel Gayrimenkul full-stack application"

# 4. GitHub'da repository oluşturduktan sonra:
git remote add origin https://github.com/YOUR_USERNAME/ongel-gayrimenkul.git
git branch -M main
git push -u origin main
```

## Sonraki Adımlar

GitHub'a push ettikten sonra:

1. Railway'a gidin: https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. `ongel-gayrimenkul` repo'nuzu seçin
4. Deploy başlar!

## Notlar

- `.gitignore` dosyası oluşturuldu (node_modules, .env, dist gibi dosyalar ignore edilecek)
- İlk commit yapıldı
- GitHub repository oluşturduktan sonra `git remote add origin` ve `git push` komutlarını çalıştırın

