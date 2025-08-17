#!/bin/bash

echo "=== Тестирование исправления бронирования ==="

# Функция для создания заказа
create_order() {
    local order_data="$1"
    echo "Создаем заказ: $order_data"
    curl -X POST http://localhost/api/afisha/order \
        -H "Content-Type: application/json" \
        -d "$order_data"
    echo -e "\n"
}

# Функция для получения расписания
get_schedule() {
    local film_id="$1"
    echo "Получаем расписание для фильма $film_id:"
    curl -s http://localhost/api/afisha/films/$film_id/schedule
    echo -e "\n"
}

echo "1. Получаем начальное состояние расписания:"
get_schedule "92b8a2a7-ab6b-4fa9-915b-d27945865e39"

echo "2. Создаем первый заказ (2 места):"
create_order '{
  "email": "test1@example.com",
  "phone": "+7-999-123-45-67",
  "tickets": [
    {
      "film": "92b8a2a7-ab6b-4fa9-915b-d27945865e39",
      "session": "5274c89d-f39c-40f9-bea8-f22a22a50c8a",
      "row": 1,
      "seat": 1,
      "price": 500
    },
    {
      "film": "92b8a2a7-ab6b-4fa9-915b-d27945865e39", 
      "session": "5274c89d-f39c-40f9-bea8-f22a22a50c8a",
      "row": 1,
      "seat": 2,
      "price": 500
    }
  ]
}'

echo "3. Проверяем состояние после первого заказа:"
get_schedule "92b8a2a7-ab6b-4fa9-915b-d27945865e39"

echo "4. Создаем второй заказ (1 место):"
create_order '{
  "email": "test2@example.com",
  "phone": "+7-999-123-45-68",
  "tickets": [
    {
      "film": "92b8a2a7-ab6b-4fa9-915b-d27945865e39",
      "session": "5274c89d-f39c-40f9-bea8-f22a22a50c8a", 
      "row": 1,
      "seat": 3,
      "price": 500
    }
  ]
}'

echo "5. Проверяем финальное состояние:"
get_schedule "92b8a2a7-ab6b-4fa9-915b-d27945865e39"

echo "=== Тест завершен ===" 