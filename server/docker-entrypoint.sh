#!/bin/sh

# Подставляем переменные окружения в конфигурацию nginx
envsubst '${DOMAIN} ${SSL_CERT_PATH} ${SSL_KEY_PATH}' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

# Проверяем синтаксис конфигурации
nginx -t

# Запускаем переданную команду
exec "$@" 