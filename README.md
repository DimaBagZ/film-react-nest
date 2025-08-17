# Film! Backend API

Бэкенд-часть проекта Film! - онлайн-сервиса бронирования билетов в кинотеатр.

## Описание

Проект реализован на Nest.js с использованием MongoDB и PostgreSQL для хранения данных. API предоставляет следующие эндпоинты:

- `GET /` - проверка статуса сервера
- `GET /api/afisha/films/` - получение списка фильмов
- `GET /api/afisha/films/:id/schedule` - получение расписания конкретного фильма
- `POST /api/afisha/order` - создание заказа на бронирование билетов
- `GET /content/afisha/*` - раздача статического контента
- `GET /api/docs` - Swagger документация API

## Swagger документация

API имеет интерактивную документацию, доступную по адресу:

```
http://localhost:3000/api/docs
```

Swagger UI позволяет:

- Просматривать все доступные эндпоинты
- Тестировать API прямо из браузера
- Изучать структуру запросов и ответов
- Видеть схемы данных (DTO)

## Установка и запуск

### Предварительные требования

- Node.js (версия 16 или выше)
- MongoDB/PostgreSQL (локально или в облаке)

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Скопируйте файл `.env.example` в `.env` и настройте переменные

### Запуск в режиме разработки

```bash
npm run start:dev
```

### Сборка для продакшена

```bash
npm run build
npm run start:prod
```

## Структура проекта

### Модули приложения

#### Films Module (`src/films/`)

Основной модуль для работы с фильмами и расписанием сеансов.

**Компоненты:**

- **DTO классы** (`dto/films.dto.ts`) - типизированные объекты для передачи данных
- **HTTP контроллер** (`films.controller.ts`) - обработка HTTP запросов
- **Бизнес-логика** (`films.service.ts`) - основная логика работы с фильмами
- **Модуль** (`films.module.ts`) - конфигурация модуля

#### Order Module (`src/order/`)

Модуль для обработки заказов и бронирования билетов.

**Компоненты:**

- **DTO классы** (`dto/order.dto.ts`) - структуры данных для заказов
- **HTTP контроллер** (`order.controller.ts`) - API эндпоинты заказов
- **Бизнес-логика** (`order.service.ts`) - валидация и обработка заказов
- **Модуль** (`order.module.ts`) - конфигурация модуля

#### Static Module (`src/static/`)

Модуль для раздачи статических файлов (изображения, CSS, JS).

**Компоненты:**

- **Контроллер** (`static.controller.ts`) - обработка запросов к статическим файлам
- **Модуль** (`static.module.ts`) - конфигурация статического сервера

### Repository Layer (`src/repository/`)

Слой абстракции для работы с данными, реализующий паттерн Repository.

**Компоненты:**

- **Интерфейс** (`films.repository.interface.ts`) - контракт для репозитория
- **In-Memory реализация** (`films.in-memory.repository.ts`) - данные в памяти для тестирования
- **MongoDB реализация** (`films.mongo.repository.ts`) - работа с MongoDB
- **PostgreSQL реализация** (`films.postgres.repository.ts`) - работа с PostgreSQL
- **Провайдер** (`films.repository.provider.ts`) - выбор реализации на основе конфигурации

### Common Components (`src/common/`)

Общие компоненты, используемые во всем приложении.

**Компоненты:**

- **Фильтры исключений** (`filters/http-exception.filter.ts`) - глобальная обработка ошибок

### Конфигурация и точка входа

**Основные файлы:**

- **Конфигурация** (`app.config.provider.ts`) - провайдер настроек приложения
- **Главный модуль** (`app.module.ts`) - корневой модуль приложения
- **Точка входа** (`main.ts`) - запуск приложения и глобальные настройки

## Архитектура и особенности реализации

### Repository Pattern

Проект использует паттерн Repository для абстракции доступа к данным:

- **`IFilmsRepository`** - интерфейс репозитория
- **`FilmsInMemoryRepository`** - реализация с данными в памяти (для тестирования)
- **`FilmsMongoRepository`** - реализация с MongoDB
- **`FilmsPostgresRepository`** - реализация с Postgre
- **`FilmsRepositoryProvider`** - Провайдер для выбора репозитория фильмов
 * Выбирает реализацию по переменной окружения DATABASE_DRIVER:
 *  - 'inmemory' → репозиторий в памяти
 *  - 'mongodb'  → MongoDB
 *  - 'postgres' → PostgreSQL (TypeORM)

Переключение между реализациями происходит через переменную окружения `USE_IN_MEMORY_REPOSITORY`.

### Глобальные настройки

- **Глобальный префикс**: `api/afisha` (исключения: `/`, `content/afisha/*`)
- **CORS**: включен для всех источников
- **Глобальный фильтр исключений**: стандартизированные ошибки API
- **Swagger**: автоматическая генерация документации

### Валидация и обработка ошибок

- **DTO валидация**: автоматическая валидация входящих данных
- **Бизнес-логика**: проверка занятости мест, валидация заказов
- **Стандартизированные ошибки**: единый формат ответов об ошибках

## API Endpoints

### Проверка статуса сервера

```http
GET /
```

**Ответ:**

```json
{
  "status": "ok",
  "message": "Film! API сервер запущен",
  "timestamp": "2024-08-07T02:48:36.861Z"
}
```

### Получение списка фильмов

```http
GET /api/afisha/films/
```

**Ответ:**

```json
{
  "total": 2,
  "items": [
    {
      "id": "film-id",
      "rating": 8.5,
      "director": "Режиссер",
      "tags": ["Драма"],
      "title": "Название фильма",
      "about": "Краткое описание",
      "description": "Полное описание",
      "image": "/bg1s.jpg",
      "cover": "/bg1c.jpg"
    }
  ]
}
```

### Получение расписания фильма

```http
GET /api/afisha/films/:id/schedule
```

**Ответ:**

```json
{
  "total": 3,
  "items": [
    {
      "id": "session-id",
      "daytime": "2024-06-28T10:00:00+03:00",
      "hall": 1,
      "rows": 5,
      "seats": 10,
      "price": 350,
      "taken": ["1:2", "3:5"]
    }
  ]
}
```

### Создание заказа

```http
POST /api/afisha/order
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+7 (999) 123-45-67",
  "tickets": [
    {
      "film": "film-id",
      "session": "session-id",
      "row": 1,
      "seat": 1,
      "price": 350
    }
  ]
}
```

**Ответ:**

```json
{
  "total": 1,
  "items": [
    {
      "film": "film-id",
      "session": "session-id",
      "daytime": "2024-06-28T10:00:00+03:00",
      "day": "28.06.2024",
      "time": "10:00",
      "row": 1,
      "seat": 1,
      "price": 350
    }
  ]
}
```

### Статические файлы

```http
GET /content/afisha/bg1c.jpg
```

Сервит изображения и другие статические файлы из папки `public/content/afisha/`.

## База данных

Проект использует MongoDB для хранения данных о фильмах и сеансах. Структура коллекции `films`:

```json
{
  "id": "film-id",
  "rating": 8.5,
  "director": "Режиссер",
  "tags": ["Драма"],
  "title": "Название фильма",
  "about": "Краткое описание",
  "description": "Полное описание",
  "image": "/bg1s.jpg",
  "cover": "/bg1c.jpg",
  "schedule": [
    {
      "id": "session-id",
      "daytime": "2024-06-28T10:00:00+03:00",
      "hall": 1,
      "rows": 5,
      "seats": 10,
      "price": 350,
      "taken": ["1:2", "3:5"]
    }
  ]
}
```

# Заполнение базы данных MongoDB

Для заполнения базы данных начальными данными используйте файл `test/mongodb_initial_stub.json`. Импортируйте данные в MongoDB с помощью MongoDB Compass или командной строки.

# Тестовые файлы для базы данных PostgreSQL

## 📁 Структура файлов

### Основные SQL скрипты:

- **`prac.init.sql`** - Создание базы данных и таблиц 
- **`prac.films.sql`** - Вставка данных фильмов (6 фильмов)
- **`prac.schedules.sql`** - Вставка данных сеансов (54 сеанса)

### Удобные скрипты:

- **`set PGCLIENTENCODING=UTF8 && psql -U postgres -d film -f test/setup_database_utf8.sql`** - Полная инициализация с правильной кодировкой UTF-8(Запускать с директории backend, создаст все таблици с данными в PSDB без нарушения кодировки)
- **`setup_database.bat`** - Windows bat-файл для автоматической настройки кодировки


## 🗄️ Структура базы данных

### Таблица `films`:

```sql
CREATE TABLE films (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rating DOUBLE PRECISION NOT NULL,
    director VARCHAR NOT NULL,
    tags TEXT NOT NULL,
    image VARCHAR NOT NULL,
    cover VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    about VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);
```

### Таблица `schedules`:

```sql
CREATE TABLE schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daytime VARCHAR NOT NULL,
    hall INTEGER NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    taken TEXT NOT NULL,
    "filmId" UUID REFERENCES films(id)
);
```

## 🎬 Фильмы в базе данных

1. **Сон в летний день** (8.1) - Амелия Хьюз
2. **Парадокс Нексуса** (9.5) - Оливер Беннет
3. **Стражи Гримуара** (8.9) - Лила Васкес
4. **Звёздное путешествие** (8.5) - Элиза Уиттакер
5. **Недостижимая утопия** (9.0) - Харрисон Рид
6. **Архитекторы общества** (2.9) - Итан Райт

## 🚀 Быстрый старт

### Вариант 1: Использование bat-файла (Windows)

```bash
cd backend
test/setup_database.bat
```
### Вариант 2: Локальный PostgreSQL с кастомным скриптом (Windows)

```bash
cd backend
# Подключитесь к PostgreSQL:
psql -h 127.0.0.1 -U postgres
# Создайте базу данных film:
CREATE DATABASE film;
# Использовать переменную окружения(Скрипт для создания фильмов и сеансов):
set PGCLIENTENCODING=UTF8 && psql -U postgres -d film -f test/setup_database_utf8.sql
```

### Вариант 3: Ручное выполнение

```bash
# Настройка кодировки терминала
chcp 65001/chcp 1251
set PGCLIENTENCODING=UTF8
# Настройка кодировки psql
\! chcp 1251
# Выполнение скрипта в psql
psql -U postgres -d film -f test/setup_database_utf8.sql
```

### Вариант 4: Пошаговое выполнение

```bash
# 1. Создание таблиц
psql -U postgres -d film -f test/prac.init.sql

# 2. Вставка фильмов
psql -U postgres -d film -f test/prac.films.sql

# 3. Вставка сеансов
psql -U postgres -d film -f test/prac.schedules.sql
```

## 📊 Проверка данных

После выполнения скриптов можно проверить данные:

```sql
-- Проверка фильмов
SELECT id, title, director, rating FROM films ORDER BY rating DESC;

-- Проверка сеансов
SELECT s.id, f.title, s.daytime, s.hall, s.price, s.taken
FROM schedules s
JOIN films f ON s."filmId" = f.id
ORDER BY s.daytime;
```


## Разработка

### Линтинг

```bash
npm run lint
```

### Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e
```

### Сборка

```bash
npm run build
```

## Особенности реализации

### Безопасность и валидация

- **Валидация мест**: Система проверяет, что места не заняты перед бронированием
- **Формат занятых мест**: Места сохраняются в формате `${row}:${seat}`
- **DTO валидация**: Автоматическая проверка входящих данных
- **Глобальный фильтр исключений**: Стандартизированные ошибки API

### Производительность

- **Repository Pattern**: Абстракция доступа к данным
- **In-Memory режим**: Быстрое тестирование без базы данных
- **Статический контент**: Оптимизированная раздача файлов

### Разработка и отладка

- **Swagger документация**: Интерактивная документация API
- **Логирование**: Подробные логи для отладки
- **CORS**: Настроен для разработки
- **TypeScript**: Полная типизация кода

### Интеграция с фронтендом

- **Совместимость DTO**: Структуры данных соответствуют ожиданиям фронтенда
- **Формат ответов**: API возвращает данные в формате, ожидаемом фронтендом
- **Обработка ошибок**: JSON ошибки для отладки в консоли браузера

## 🔧 Настройка кодировки

### Для Windows:

```bash
chcp 65001
set PGCLIENTENCODING=UTF8
```

### Для Linux/Mac:

```bash
export PGCLIENTENCODING=UTF8
```

## ⚠️ Важные замечания

1. **Кодировка**: Все файлы используют UTF-8 для корректного отображения русского текста
2. **UUID**: Используется расширение `uuid-ossp` для генерации UUID
3. **Внешние ключи**: Таблица `schedules` ссылается на `films` через `filmId`
4. **Занятые места**: Поле `taken` содержит строку с занятыми местами в формате "ряд:место,ряд:место"

## 🐛 Устранение проблем

### Ошибка кодировки:

```
ОШИБКА: для символа с последовательностью байт ... нет эквивалента в "UTF8"
```

**Решение**: Установите кодировку UTF-8 перед выполнением скрипта

### Ошибка подключения:

```
psql: error: connection to server at "localhost" (::1), port 5432 failed
```

**Решение**: Убедитесь, что PostgreSQL запущен и доступен

### Ошибка базы данных:

```
ОШИБКА: база данных "film" не существует
```

**Решение**: Создайте базу данных `film` перед выполнением скриптов
