#!/bin/bash

# Hostinger Deployment Script
# Kullanım: ./hostinger-deploy.sh

set -e

echo "🚀 Hostinger Deployment Başlatılıyor..."

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Proje dizini
PROJECT_DIR="/var/www/ongel-gayrimenkul"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Kontrol: Proje dizini var mı?
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Proje dizini bulunamadı: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# Git pull
echo -e "${YELLOW}📥 Git pull yapılıyor...${NC}"
git pull origin main || git pull origin master

# Backend güncelleme
echo -e "${YELLOW}🔧 Backend güncelleniyor...${NC}"
cd "$BACKEND_DIR"
npm install
npm run build

# Frontend güncelleme
echo -e "${YELLOW}🎨 Frontend güncelleniyor...${NC}"
cd "$FRONTEND_DIR"
npm install
npm run build

# PM2 restart
echo -e "${YELLOW}🔄 PM2 restart yapılıyor...${NC}"
pm2 restart backend
pm2 restart frontend

# Nginx reload
echo -e "${YELLOW}🌐 Nginx reload yapılıyor...${NC}"
nginx -t && systemctl reload nginx

echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo -e "${GREEN}📊 PM2 durumu:${NC}"
pm2 status

