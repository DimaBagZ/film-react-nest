# Film! - Онлайн-сервис бронирования билетов в кинотеатр

Полнофункциональное веб-приложение для бронирования билетов в кинотеатр с современным интерфейсом и надежным API.

## 🌐 Задеплоенное приложение

**Ссылка на приложение:** [https://your-domain.nomoreparties.site](https://your-domain.nomoreparties.site)

> **⚠️ ВАЖНО:** Замените `your-domain` на ваш реальный домен, полученный через [domain.nomoreparties.site](https://domain.nomoreparties.site)

### 🚀 Быстрый деплой

Для автоматического деплоя на Yandex Cloud используйте:

```bash
# 1. Подготовить переменные окружения
cp env.example .env
nano .env  # Отредактировать с вашими данными

# 2. Запустить проект
docker-compose up -d --build

# 3. Запустить автоматический деплой
./tools/deploy-to-yandex.sh YOUR_SERVER_IP
```

**Подробные инструкции:** [tutorial/DEPLOYMENT_YANDEX_CLOUD.md](tutorial/DEPLOYMENT_YANDEX_CLOUD.md)
**Инструменты и утилиты:** [tools/README.md](tools/README.md)

## 📋 Описание проекта

Проект состоит из трех основных компонентов:

- **Frontend** - React приложение с современным UI
- **Backend** - NestJS API с поддержкой PostgreSQL
- **Server** - Nginx сервер для раздачи статики и проксирования запросов

### Основной функционал:

- Просмотр списка фильмов
- Выбор сеансов и мест
- Бронирование билетов
- Адаптивный дизайн
- Swagger документация API

## 🏗️ Архитектура

### Backend (NestJS)

- **Framework**: NestJS с TypeScript
- **База данных**: PostgreSQL (основная)
- **Логирование**: Многоуровневая система логгеров (Dev, JSON, TSKV)
- **Тестирование**: Unit и E2E тесты с Jest
- **Документация**: Swagger/OpenAPI

### Frontend (React)

- **Framework**: React 18 с TypeScript
- **Сборка**: Vite
- **Стили**: SCSS модули
- **Компоненты**: Storybook для разработки

### Server (Nginx)

- **Веб-сервер**: Nginx
- **Статические файлы**: Раздача собранного фронтенда
- **Проксирование**: API запросы к backend
- **SSL**: Поддержка HTTPS

### DevOps

- **Контейнеризация**: Docker с multi-stage builds
- **Оркестрация**: Docker Compose
- **CI/CD**: GitHub Actions
- **Реестр**: GitHub Container Registry (GHCR)
- **Деплой**: Yandex Cloud

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонирование репозитория:**

```bash
git clone https://github.com/your-username/film-react-nest.git
cd film-react-nest
```

2. **Запуск с Docker Compose:**

```bash
# Создайте .env файл с переменными окружения
cp env.example .env

# Запуск всех сервисов
docker-compose up -d --build

# Приложение будет доступно:
# - Frontend: http://localhost:80
# - Backend API: http://localhost:3000
# - pgAdmin: http://localhost:8080
```

3. **Ручной запуск:**

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (в новом терминале)
cd frontend
npm install
npm run dev
```

## 🔧 Система логирования

Проект поддерживает три типа логгеров, выбираемых через переменную окружения `LOGGER_TYPE`:

### 1. DevLogger (dev)

- Цветной вывод для разработчиков
- Удобное чтение логов в консоли
- Подробная информация для отладки

### 2. JsonLogger (json)

- Структурированный JSON формат
- Автоматическая обработка системами мониторинга
- Включает timestamp и дополнительные параметры

### 3. TskvLogger (tskv)

- Tab-Separated Key-Value формат
- Совместимость с внешними системами логирования
- Экранирование специальных символов

### Настройка логгера:

```bash
# В корневом .env файле
LOGGER_TYPE=json  # или dev, tskv
```

## 🧪 Тестирование

### Запуск тестов:

```bash
# Backend тесты
cd backend
npm test                    # Unit тесты
npm run test:cov           # С покрытием кода
npm run test:e2e           # E2E тесты

# Frontend тесты
cd frontend
npm test                   # Unit тесты
npm run storybook          # Storybook
```

### Покрытие тестами:

- **Логгеры**: Полное покрытие всех методов форматирования
- **Контроллеры**: Тестирование всех эндпоинтов API
- **Сервисы**: Валидация бизнес-логики
- **Интеграция**: E2E тесты с реальной базой данных

### Инструменты тестирования:

```bash
# Тестирование бронирования
./tools/test-booking.sh

# Тестирование контента
./tools/test-content.sh
```

## 🐳 Docker

### Сборка образов:

```bash
# Локальная сборка
docker-compose build

# Продакшен образы
docker-compose -f docker-compose.prod.yml up -d
```

### Образы в GitHub Container Registry:

- `ghcr.io/your-username/film-react-nest/backend:latest`
- `ghcr.io/your-username/film-react-nest/frontend:latest`
- `ghcr.io/your-username/film-react-nest/server:latest`

## 📦 CI/CD Pipeline

### GitHub Actions Workflow:

1. **Триггер**: Push в main/master ветку
2. **Сборка**: Multi-stage Docker builds
3. **Тестирование**: Автоматические тесты
4. **Публикация**: Push в GHCR
5. **Деплой**: Автоматический деплой на сервер

### Переменные окружения для CI/CD:

- `GITHUB_TOKEN` - автоматически предоставляется GitHub
- `DATABASE_URL` - строка подключения к БД
- `NODE_ENV` - окружение (production/development)

## 🌍 Деплой на Yandex Cloud

### 🚀 Автоматический деплой (рекомендуется)

```bash
# 1. Подготовить переменные окружения
cp env.example .env
nano .env  # Отредактировать с вашими данными

# 2. Запустить автоматический деплой
./tools/deploy-to-yandex.sh YOUR_SERVER_IP
```

**Подробные инструкции:** [tutorial/DEPLOYMENT_YANDEX_CLOUD.md](tutorial/DEPLOYMENT_YANDEX_CLOUD.md)

### 📋 Что нужно подготовить

- ✅ **IP адрес сервера** Yandex Cloud
- ✅ **Домен** с domain.nomoreparties.site
- ✅ **GitHub токен** (Personal Access Token)
- ✅ **Сильные пароли** для базы данных и pgAdmin

### 🔧 Ручной деплой

#### 1. Создание VM в Yandex Cloud:

- Войдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
- Создайте новую VM с Ubuntu 22.04 LTS
- Рекомендуемые характеристики: 2 vCPU, 4 GB RAM, 20 GB SSD
- Откройте порты 80, 443, 22

#### 2. Установка Docker:

```bash
# Подключитесь к серверу
ssh ubuntu@your-server-ip

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
exit
# Подключиться заново
ssh ubuntu@your-server-ip
```

#### 3. Настройка проекта:

```bash
# Создать директорию проекта
mkdir -p ~/film-project
cd ~/film-project

# Скопировать файлы проекта
# (используйте scp или git clone)

# Настроить переменные окружения
cp env.example .env
nano .env  # Отредактировать с вашими данными
```

#### 4. Настройка SSL сертификата:

```bash
# Установка Certbot
sudo apt install -y certbot

# Получение SSL сертификата
sudo certbot certonly --standalone -d your-domain.nomoreparties.site

# Копирование сертификатов
mkdir -p ssl
sudo cp /etc/letsencrypt/live/your-domain.nomoreparties.site/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/your-domain.nomoreparties.site/privkey.pem ssl/
sudo chown -R ubuntu:ubuntu ssl/
```

#### 5. Запуск приложения:

```bash
# Создать необходимые директории
mkdir -p server/logs server/cache

# Запустить приложение
docker-compose -f docker-compose.prod.yml up -d

# Проверить статус
docker-compose -f docker-compose.prod.yml ps
```

### 📊 Мониторинг и обслуживание

**Подробные инструкции:** [tutorial/DEPLOYMENT_YANDEX_CLOUD.md](tutorial/DEPLOYMENT_YANDEX_CLOUD.md)

### 🗄️ Управление базой данных

**Подробные инструкции:** [tutorial/database-management.md](tutorial/database-management.md)

### 🐳 Работа с Docker

**Подробные инструкции:** [tutorial/DOCKER_WORKFLOW.md](tutorial/DOCKER_WORKFLOW.md)
**Быстрая шпаргалка:** [tutorial/DOCKER_CHEATSHEET.md](tutorial/DOCKER_CHEATSHEET.md)
**Инструменты:** [tools/README.md](tools/README.md)

```bash
# Подключение к pgAdmin (только локально)
# URL: http://localhost:8080
# Email: admin@your-domain.com
# Password: your-secure-pgadmin-password

# Импорт данных
# Выполните SQL скрипты из backend/test/
```

### Автоматическое обновление SSL сертификатов:

```bash
# Создание скрипта обновления
sudo nano /opt/film/ssl-renew.sh

# Добавьте содержимое:
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.nomoreparties.site/fullchain.pem /opt/film/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.nomoreparties.site/privkey.pem /opt/film/ssl/key.pem
docker-compose -f /opt/film/docker-compose.prod.yml restart server

# Сделайте скрипт исполняемым
chmod +x /opt/film/ssl-renew.sh

# Добавьте в crontab для автоматического обновления
sudo crontab -e
# Добавьте строку:
0 12 * * * /opt/film/ssl-renew.sh
```

## 📊 Мониторинг и логи

### Логи приложения:

```bash
# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Логи nginx
docker-compose exec server tail -f /var/log/nginx/access.log
```

### Метрики:

- **API**: Swagger UI с метриками запросов
- **База данных**: pgAdmin с мониторингом
- **Контейнеры**: Docker stats

## 🔒 Безопасность

### Настройки безопасности:

- **CORS**: Настроен для продакшена
- **Валидация**: DTO валидация всех запросов
- **Логирование**: Безопасное логирование без чувствительных данных
- **Контейнеры**: Запуск от непривилегированного пользователя

### Переменные окружения:

```bash
# Обязательные для продакшена
DATABASE_PASSWORD=secure_password
PGADMIN_PASSWORD=secure_admin_password
NODE_ENV=production
LOGGER_TYPE=json
```

## 🛠️ Разработка

### Структура проекта:

```
film-react-nest/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── films/          # Модуль фильмов
│   │   ├── order/          # Модуль заказов
│   │   ├── logger/         # Система логирования
│   │   └── repository/     # Слой данных
│   ├── test/               # SQL скрипты и тесты
│   └── Dockerfile
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   └── hooks/          # Custom hooks
│   └── Dockerfile
├── server/                 # Nginx сервер
│   ├── nginx.conf          # Конфигурация nginx
│   ├── logs/               # Логи nginx
│   ├── cache/              # Кэш nginx
│   └── Dockerfile
├── tools/                  # Инструменты и утилиты
│   ├── test-booking.sh     # Тестирование бронирования
│   ├── test-content.sh     # Тестирование контента
│   ├── deploy-to-yandex.sh # Автоматический деплой
│   └── README.md           # Документация инструментов
├── tutorial/               # Подробные инструкции
├── .github/workflows/      # CI/CD
├── docker-compose.yml      # Локальная разработка
└── docker-compose.prod.yml # Продакшен
```

### Команды разработки:

```bash
# Backend
npm run start:dev          # Режим разработки
npm run build              # Сборка
npm run lint               # Линтинг
npm run test               # Тесты

# Frontend
npm run dev                # Режим разработки
npm run build              # Сборка
npm run storybook          # Storybook
npm run lint               # Линтинг
```

## 📚 API Документация

### Swagger UI:

```
http://localhost:3000/api/docs
```

### Основные эндпоинты:

- `GET /api/afisha/films/` - список фильмов
- `GET /api/afisha/films/:id/schedule` - расписание фильма
- `POST /api/afisha/order` - создание заказа
- `GET /content/afisha/*` - статические файлы

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/your-username/film-react-nest/issues)
- **Документация**: [Wiki](https://github.com/your-username/film-react-nest/wiki)
- **Email**: your-email@example.com

## Описание

Проект реализован на Nest.js с использованием PostgreSQL для хранения данных. API предоставляет следующие эндпоинты:

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
- PostgreSQL (локально или в облаке)
- Docker и Docker Compose

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Скопируйте файлы `.env.example` в соответствующие `.env` файлы и настройте переменные

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
- **`FilmsPostgresRepository`** - реализация с PostgreSQL (TypeORM)
- **`FilmsRepositoryProvider`** - Провайдер для выбора репозитория фильмов

* Выбирает реализацию по переменной окружения DATABASE_DRIVER:
* - 'inmemory' → репозиторий в памяти
* - 'postgres' → PostgreSQL (TypeORM)

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

Проект использует PostgreSQL для хранения данных о фильмах и сеансах. Структура таблиц:

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
    taken TEXT NOT NULL DEFAULT '[]',
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
4. **Занятые места**: Поле `taken` содержит JSON строку с занятыми местами в формате "ряд:место,ряд:место"

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
