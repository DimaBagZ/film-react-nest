#!/bin/bash

# Скрипт для первоначальной настройки удаленного сервера
# Использование: ./setup-server.sh

set -e

echo "Настройка удаленного сервера для Film! проекта..."

# Обновляем систему
echo "Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
echo "Устанавливаем Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Устанавливаем Docker Compose
echo "Устанавливаем Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Создаем директорию проекта
echo "Создаем директорию проекта..."
sudo mkdir -p /opt/film-react-nest
sudo chown $USER:$USER /opt/film-react-nest

# Создаем необходимые директории
mkdir -p /opt/film-react-nest/ssl
mkdir -p /opt/film-react-nest/server/logs
mkdir -p /opt/film-react-nest/server/cache

# Настраиваем firewall
echo "Настраиваем firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Создаем .env файл
echo "Создаем .env файл..."
cat > /opt/film-react-nest/.env << 'EOF'
# ========================================
# Film! Project - Переменные окружения для Docker Compose
# ========================================

# Основные настройки
GITHUB_REPOSITORY=dimabagz/film-react-nest
DOCKER_REGISTRY=ghcr.io

# ========================================
# БАЗА ДАННЫХ
# ========================================
# PostgreSQL настройки
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=film
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-secure-database-password

# Тип логгера: dev | json | tskv
LOGGER_TYPE=json

# ========================================
# PGADMIN
# ========================================
# Email и пароль для pgAdmin (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
PGADMIN_EMAIL=admin@your-domain.nomoreparties.site
PGADMIN_PASSWORD=your-secure-pgadmin-password

# ========================================
# GITHUB И РЕЕСТР
# ========================================
# GitHub токен для доступа к реестру
GITHUB_TOKEN=your-github-token

# Ваш домен (замените на полученный на domain.nomoreparties.site)
DOMAIN=your-domain.nomoreparties.site

# ========================================
# SSL СЕРТИФИКАТЫ (для продакшена)
# ========================================
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# ========================================
# ПРОИЗВОДИТЕЛЬНОСТЬ
# ========================================
IMAGE_TAG=latest
EOF

echo "Настройка сервера завершена!"
echo ""
echo "Следующие шаги:"
echo "1. Отредактируйте /opt/film-react-nest/.env файл с вашими настройками"
echo "2. Получите домен на domain.nomoreparties.site"
echo "3. Настройте SSL сертификаты: ./tools/setup-ssl.sh your-domain.nomoreparties.site"
echo "4. Запустите приложение: docker compose -f docker-compose.prod.yml up -d" 