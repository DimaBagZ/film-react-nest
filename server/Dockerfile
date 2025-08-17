# Используем официальный образ nginx
FROM nginx:alpine

# Устанавливаем необходимые инструменты
RUN apk add --no-cache curl openssl

# Создаем директории для логов и кэша
RUN mkdir -p /var/log/nginx /var/cache/nginx

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Статические файлы будут подключены через volume в docker-compose
# Создаем директорию для статических файлов
RUN mkdir -p /usr/share/nginx/html

# Пользователь nginx уже существует в базовом образе
# Настраиваем права доступа
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Открываем порты
EXPOSE 80 443

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"] 