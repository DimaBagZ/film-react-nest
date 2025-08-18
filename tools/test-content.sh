#!/bin/bash

echo "=== Тестирование контента ==="

echo "1. Проверяем фронтенд:"
curl -I http://localhost

echo -e "\n2. Проверяем API:"
curl -I http://localhost/api/afisha/films/

echo -e "\n3. Проверяем контент через nginx:"
curl -I http://localhost/content/afisha/bg1c.jpg

echo -e "\n4. Проверяем контент напрямую через бэкенд:"
curl -I http://localhost:3000/content/afisha/bg1c.jpg

echo -e "\n5. Проверяем подключение к бэкенду из сервера:"
docker exec film_server curl -I http://backend:3000/content/afisha/bg1c.jpg

echo -e "\n=== Тест завершен ===" 