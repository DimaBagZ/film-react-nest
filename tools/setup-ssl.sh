#!/bin/bash

# Скрипт для настройки SSL сертификатов через Let's Encrypt
# Использование: ./setup-ssl.sh your-domain.nomorepartiessbs.ru

set -e

DOMAIN=$1
EMAIL="admin@${DOMAIN}"

if [ -z "$DOMAIN" ]; then
    echo "Использование: $0 your-domain.nomorepartiessbs.ru"
    exit 1
fi

echo "Настройка SSL сертификатов для домена: $DOMAIN"

# Создаем директорию для SSL сертификатов
sudo mkdir -p /opt/film-react-nest/ssl

# Устанавливаем certbot если не установлен
if ! command -v certbot &> /dev/null; then
    echo "Устанавливаем certbot..."
    sudo apt update
    sudo apt install -y certbot
fi

# Получаем SSL сертификат
echo "Получаем SSL сертификат..."
sudo certbot certonly \
    --standalone \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "api.$DOMAIN"

# Копируем сертификаты в директорию проекта
echo "Копируем сертификаты..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/film-react-nest/ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/film-react-nest/ssl/key.pem

# Устанавливаем правильные права доступа
sudo chown -R $USER:$USER /opt/film-react-nest/ssl
chmod 600 /opt/film-react-nest/ssl/*.pem

# Создаем скрипт для автоматического обновления сертификатов
cat > /opt/film-react-nest/ssl/renew.sh << EOF
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/film-react-nest/ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/film-react-nest/ssl/key.pem
chown -R $USER:$USER /opt/film-react-nest/ssl
chmod 600 /opt/film-react-nest/ssl/*.pem
docker compose -f /opt/film-react-nest/docker-compose.prod.yml restart server
EOF

chmod +x /opt/film-react-nest/ssl/renew.sh

# Добавляем cron задачу для автоматического обновления
(crontab -l 2>/dev/null; echo "0 12 * * * /opt/film-react-nest/ssl/renew.sh") | crontab -

echo "SSL сертификаты успешно настроены!"
echo "Сертификаты будут автоматически обновляться каждый день в 12:00" 