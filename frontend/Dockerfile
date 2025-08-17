# Этап сборки
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (включая dev dependencies для сборки)
RUN npm ci

# Устанавливаем недостающие пакеты для rollup в Alpine Linux
# npm автоматически выберет подходящий пакет для текущей архитектуры
RUN npm install @rollup/rollup-linux-x64-musl @rollup/rollup-linux-arm64-musl --no-save

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап продакшена - только статические файлы
FROM alpine:latest AS production

# Устанавливаем необходимые инструменты
RUN apk add --no-cache bash

# Копируем собранные файлы из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Создаем директорию для монтирования
RUN mkdir -p /app/dist

# Копируем файлы в директорию для монтирования
RUN cp -r /usr/share/nginx/html/* /app/dist/

# Открываем порт (для совместимости)
EXPOSE 80

# Команда для копирования файлов и ожидания
CMD ["sh", "-c", "cp -r /usr/share/nginx/html/* /app/dist/ && tail -f /dev/null"] 