# 🛠️ Инструменты для проекта Film!

Эта папка содержит все необходимые скрипты для управления проектом Film!.

## 📋 Список инструментов

### 🐳 Docker Management

#### `docker-manager.sh` - Универсальный менеджер Docker

Основной скрипт для управления Docker контейнерами проекта.

```bash
# Запуск проекта
./tools/docker-manager.sh start

# Остановка проекта
./tools/docker-manager.sh stop

# Перезапуск проекта
./tools/docker-manager.sh restart

# Сборка и запуск
./tools/docker-manager.sh build

# Очистка кэша TypeORM и пересборка
./tools/docker-manager.sh clean

# Просмотр логов
./tools/docker-manager.sh logs
./tools/docker-manager.sh logs backend

# Статус контейнеров
./tools/docker-manager.sh status

# Тестирование API
./tools/docker-manager.sh test

# Полный сброс (удаление volumes и пересборка)
./tools/docker-manager.sh reset

# Справка
./tools/docker-manager.sh help
```

#### `clear-typeorm-cache.sh` - Очистка кэша TypeORM

Специализированный скрипт для решения проблем с кэшем TypeORM.

```bash
./tools/clear-typeorm-cache.sh
```

#### `clear-taken-seats.sh` - Очистка занятых мест

Скрипт для очистки занятых мест в базе данных.

```bash
# Очистить все занятые места
./tools/clear-taken-seats.sh --all

# Очистить места для конкретного фильма
./tools/clear-taken-seats.sh --film 92b8a2a7-ab6b-4fa9-915b-d27945865e39

# Очистить места для конкретного сеанса
./tools/clear-taken-seats.sh --session 5274c89d-f39c-40f9-bea8-f22a22a50c8a

# Очистить места в конкретном зале
./tools/clear-taken-seats.sh --hall 1

# Очистить места до определенной даты
./tools/clear-taken-seats.sh --before 2024-06-29

# Показать что будет очищено (dry-run)
./tools/clear-taken-seats.sh --all --dry-run
```

### 🧪 Тестирование

#### `test-api.sh` - Тестирование API

Автоматическое тестирование всех основных API endpoints.

```bash
./tools/test-api.sh
```

**Тестируемые endpoints:**

- ✅ GET /api/afisha/films
- ✅ GET /api/afisha/films/{id}
- ✅ GET /api/afisha/films/{id}/schedule
- ✅ POST /api/afisha/order
- ✅ Статические файлы

#### `test-booking.sh` - Тестирование бронирования

Тестирование функциональности заказа билетов.

```bash
./tools/test-booking.sh
```

#### `test-content.sh` - Тестирование контента

Проверка доступности статических файлов и изображений.

```bash
./tools/test-content.sh
```

### 🚀 Деплой

#### `deploy-production.sh` - Деплой в продакшен

Развертывание проекта в продакшен режиме с использованием `docker-compose.prod.yml`.

```bash
./tools/deploy-production.sh
```

**Функции:**

- Проверка переменных окружения
- Проверка Docker
- Сборка образов
- Запуск в продакшене
- Проверка здоровья сервисов

#### `deploy-to-yandex.sh` - Деплой в Yandex Cloud

Автоматический деплой в Yandex Cloud (существующий скрипт).

```bash
./tools/deploy-to-yandex.sh
```

### 🧪 Разработка

#### `start-test-server.sh` - Запуск тестового сервера

Запуск проекта в тестовом режиме с in-memory репозиторием.

```bash
./tools/start-test-server.sh
```

## 📚 Документация

### `TYPEORM_CACHE_FIX.md` - Исправление проблем TypeORM

Подробная документация по решению проблем с кэшем TypeORM.

## 🎯 Быстрый старт

### 1. Первый запуск

```bash
# Клонирование проекта
git clone <repository>
cd film-react-nest

# Настройка переменных окружения
cp env.example .env
# Отредактируйте .env файл

# Запуск проекта
./tools/docker-manager.sh build
```

### 2. Повседневное использование

```bash
# Запуск
./tools/docker-manager.sh start

# Тестирование
./tools/test-api.sh

# Просмотр логов
./tools/docker-manager.sh logs backend

# Остановка
./tools/docker-manager.sh stop
```

### 3. Решение проблем

```bash
# Очистка кэша TypeORM
./tools/docker-manager.sh clean

# Очистка занятых мест
./tools/docker-manager.sh clear-seats --all

# Полный сброс
./tools/docker-manager.sh reset
```

## 🔧 Требования

- Docker и Docker Compose
- Bash shell
- curl (для тестирования)
- Настроенный .env файл

## 📊 Мониторинг

### Доступные сервисы

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3000/api/afisha
- **pgAdmin**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### Полезные команды

```bash
# Статус всех контейнеров
docker-compose ps

# Логи всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f postgres

# Подключение к базе данных
docker-compose exec postgres psql -U postgres -d film
```

## 🆘 Устранение неполадок

### Проблема с TypeORM

```bash
./tools/docker-manager.sh clean
```

### Проблема с базой данных

```bash
./tools/docker-manager.sh reset
```

### Проблема с портами

```bash
# Проверка занятых портов
netstat -tulpn | grep :3000
netstat -tulpn | grep :80

# Остановка контейнеров
./tools/docker-manager.sh stop
```

### Проблема с образами

```bash
# Удаление образов
docker rmi ghcr.io/dimabagz/film-react-nest/backend:latest
docker rmi ghcr.io/dimabagz/film-react-nest/frontend:latest
docker rmi ghcr.io/dimabagz/film-react-nest/server:latest

# Пересборка
./tools/docker-manager.sh build
```
