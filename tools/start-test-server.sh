#!/bin/bash

# ========================================
# Скрипт запуска тестового сервера для GitHub Actions
# ========================================

set -e

echo "🚀 Запуск тестового сервера..."

# Переходим в директорию backend
cd backend

# Устанавливаем переменные окружения для тестирования
export NODE_OPTIONS="--experimental-global-webcrypto"
export DATABASE_DRIVER="inmemory"
export USE_IN_MEMORY_REPOSITORY="true"
export PORT="3000"
export NODE_ENV="development"
export LOG_LEVEL="info"
export STRUCTURED_LOGS="false"
export ENABLE_SWAGGER="false"
export CORS_ALLOW_ALL="true"

echo "📋 Переменные окружения:"
echo "  DATABASE_DRIVER: $DATABASE_DRIVER"
echo "  USE_IN_MEMORY_REPOSITORY: $USE_IN_MEMORY_REPOSITORY"
echo "  PORT: $PORT"
echo "  NODE_OPTIONS: $NODE_OPTIONS"

# Запускаем сервер в фоновом режиме
echo "🔧 Запуск NestJS сервера..."
npm run start:test &
SERVER_PID=$!

# Ждем запуска сервера
echo "⏳ Ожидание запуска сервера..."
sleep 15

# Проверяем, что сервер запустился
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Сервер успешно запущен на порту 3000"
    echo "🔄 PID сервера: $SERVER_PID"
    
    # Ждем завершения тестов
    wait $SERVER_PID
else
    echo "❌ Ошибка: сервер не запустился"
    exit 1
fi 