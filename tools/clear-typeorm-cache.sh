#!/bin/bash

echo "🧹 Очистка кэша TypeORM и перезапуск базы данных..."

# Остановка контейнеров
echo "📦 Остановка Docker контейнеров..."
docker-compose down

# Удаление volumes для полной очистки данных
echo "🗑️ Удаление volumes PostgreSQL..."
docker volume rm film-react-nest_postgres_data 2>/dev/null || true

# Очистка кэша TypeORM
echo "🧹 Очистка кэша TypeORM..."
rm -rf dist/
rm -rf node_modules/
rm -f package-lock.json

# Переустановка зависимостей
echo "📦 Переустановка зависимостей..."
npm install

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Запуск контейнеров
echo "🚀 Запуск Docker контейнеров..."
docker-compose up -d

echo "✅ Очистка завершена! База данных перезапущена с новыми схемами."
echo "📊 Проверьте логи: docker-compose logs -f backend" 