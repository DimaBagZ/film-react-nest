#!/bin/bash

# Скрипт для запуска тестового сервера backend
# Используется в GitHub Actions для тестирования endpoints

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "🚀 Запуск тестового сервера backend..."

# Переходим в директорию backend
cd backend

# Проверяем, что package.json существует
if [ ! -f "package.json" ]; then
    log_error "package.json не найден в директории backend"
    exit 1
fi

# Устанавливаем зависимости, если node_modules не существует
if [ ! -d "node_modules" ]; then
    log_info "Установка зависимостей..."
    npm install
fi

# Проверяем, что база данных доступна
# Для тестов используем in-memory репозиторий
export DATABASE_DRIVER=memory
export USE_IN_MEMORY_REPOSITORY=true
export NODE_ENV=test
export PORT=3000
export LOGGER_TYPE=dev

log_info "Запуск backend сервера на порту 3000..."

# Запускаем сервер в фоновом режиме
npm run start:dev > server.log 2>&1 &
SERVER_PID=$!

# Сохраняем PID для возможности остановки
echo $SERVER_PID > server.pid

# Ждем, пока сервер запустится
log_info "Ожидание запуска сервера..."
sleep 10

# Проверяем, что сервер запустился
if curl -s --connect-timeout 5 "http://localhost:3000/api/afisha/films" > /dev/null; then
    log_success "Сервер успешно запущен на http://localhost:3000"
else
    log_error "Сервер не запустился"
    cat server.log
    exit 1
fi

echo "Тестовый сервер готов для тестирования endpoints" 