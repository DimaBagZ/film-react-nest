#!/bin/bash

# Тестирование API для проекта Film!
# Проверяет все основные endpoints

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_test() {
    echo -e "${YELLOW}🧪 $1${NC}"
}

# Базовый URL API
API_BASE="http://localhost:3000/api/afisha"
FRONTEND_URL="http://localhost:80"

# ID тестового фильма
TEST_FILM_ID="92b8a2a7-ab6b-4fa9-915b-d27945865e39"

echo "🧪 Тестирование API проекта Film!"
echo "=================================="

# Проверка доступности сервисов
log_info "Проверка доступности сервисов..."

# Проверка backend
if curl -s --connect-timeout 5 "$API_BASE/films" > /dev/null; then
    log_success "Backend API доступен"
else
    log_error "Backend API недоступен"
    exit 1
fi

# Проверка frontend
if curl -s --connect-timeout 5 -I "$FRONTEND_URL" | grep -q "200 OK"; then
    log_success "Frontend доступен"
else
    log_error "Frontend недоступен"
fi

echo ""

# Тест 1: Получение списка фильмов
log_test "Тест 1: GET /api/afisha/films"
response=$(curl -s "$API_BASE/films")
if echo "$response" | grep -q '"total"'; then
    total=$(echo "$response" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    log_success "Получено $total фильмов"
else
    log_error "Ошибка получения фильмов"
    echo "Ответ: $response"
fi

# Тест 2: Получение конкретного фильма
log_test "Тест 2: GET /api/afisha/films/{id}"
response=$(curl -s "$API_BASE/films/$TEST_FILM_ID")
if echo "$response" | grep -q '"id"'; then
    title=$(echo "$response" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    log_success "Получен фильм: $title"
else
    log_error "Ошибка получения фильма"
fi

# Тест 3: Получение расписания фильма
log_test "Тест 3: GET /api/afisha/films/{id}/schedule"
response=$(curl -s "$API_BASE/films/$TEST_FILM_ID/schedule")
if echo "$response" | grep -q '"total"'; then
    total=$(echo "$response" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    log_success "Получено $total сеансов"
else
    log_error "Ошибка получения расписания"
    echo "Ответ: $response"
fi

# Тест 4: Тест заказа билетов
log_test "Тест 4: POST /api/afisha/order"
order_data='{
  "filmId": "'$TEST_FILM_ID'",
  "sessionId": "5274c89d-f39c-40f9-bea8-f22a22a50c8a",
  "seats": ["1:1", "1:2"]
}'

response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$order_data" \
  "$API_BASE/order")

if echo "$response" | grep -q '"success"\|"id"'; then
    log_success "Заказ билетов работает"
else
    log_error "Ошибка заказа билетов"
    echo "Ответ: $response"
fi

# Тест 5: Проверка статических файлов
log_test "Тест 5: Статические файлы"
if curl -s -I "$API_BASE/content/afisha/bg1s.jpg" | grep -q "200 OK"; then
    log_success "Статические файлы доступны"
else
    log_error "Статические файлы недоступны"
fi

echo ""
echo "📊 Результаты тестирования:"
echo "=========================="

# Подсчет результатов
total_tests=5
passed_tests=0

# Проверяем каждый тест
if curl -s "$API_BASE/films" | grep -q '"total"'; then ((passed_tests++)); fi
if curl -s "$API_BASE/films/$TEST_FILM_ID" | grep -q '"id"'; then ((passed_tests++)); fi
if curl -s "$API_BASE/films/$TEST_FILM_ID/schedule" | grep -q '"total"'; then ((passed_tests++)); fi
if curl -s -X POST -H "Content-Type: application/json" -d "$order_data" "$API_BASE/order" | grep -q '"success"\|"id"'; then ((passed_tests++)); fi
if curl -s -I "$API_BASE/content/afisha/bg1s.jpg" | grep -q "200 OK"; then ((passed_tests++)); fi

echo "Пройдено тестов: $passed_tests из $total_tests"

if [ $passed_tests -eq $total_tests ]; then
    log_success "🎉 Все тесты пройдены успешно!"
    exit 0
else
    log_error "❌ Некоторые тесты не пройдены"
    exit 1
fi 