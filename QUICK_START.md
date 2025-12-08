# Hızlı Başlangıç Kılavuzu

## ⚠️ Önemli Not

`npm run dev` komutunu **kök dizinde değil**, `frontend/` veya `backend/` klasörlerinde çalıştırmanız gerekiyor!

## 🚀 Adım Adım Kurulum

### 1. Backend Kurulumu

```powershell
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur (varsa .env.example'dan kopyala)
# .env dosyasını düzenle ve database bilgilerini gir

# Backend'i başlat
npm run start:dev
```

Backend çalıştığında:
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

### 2. Frontend Kurulumu

**Yeni bir terminal penceresi açın:**

```powershell
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# .env.local dosyası oluştur
# İçine şunu yazın: NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Frontend'i başlat
npm run dev
```

Frontend çalıştığında:
- Web: http://localhost:3000

## 📝 Özet Komutlar

### Backend için:
```powershell
cd backend
npm install
npm run start:dev
```

### Frontend için (yeni terminal):
```powershell
cd frontend
npm install
npm run dev
```

## ❌ Yapılmaması Gerekenler

- ❌ Kök dizinde (`C:\Projects\ongel-gayrimenkul`) `npm run dev` çalıştırmayın
- ✅ `frontend/` veya `backend/` klasörlerine gidin

## 🔧 Sorun Giderme

### "package.json bulunamadı" hatası
- Doğru klasöre gittiğinizden emin olun (`cd frontend` veya `cd backend`)

### "module not found" hatası
- `npm install` komutunu çalıştırdığınızdan emin olun

### Database bağlantı hatası
- `backend/.env` dosyasını kontrol edin
- PostgreSQL'in çalıştığından emin olun

