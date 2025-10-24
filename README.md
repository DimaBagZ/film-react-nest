# Film! - Онлайн-сервис бронирования билетов в кинотеатр

Полнофункциональное веб-приложение для бронирования билетов в кинотеатр с современным интерфейсом и надежным API.

## 🌐 Задеплоенное приложение

**Ссылка на приложение:** [https://film-by-bagz.nomorepartiessbs.ru](https://film-by-bagz.nomorepartiessbs.ru)

**Макет проекта:** 
[![Figma](https://img.shields.io/badge/Figma%20-brightgreen)]([https://dimabagz.github.io/blog-customizer/](https://www.figma.com/design/82PqcEWXowbRAP7HDQfKH2/8-спринт.-Yandex--Film.-Film.-Film--?node-id=244-5&p=f&t=Qb2SIlmopOe6gxR7-0))



**Доступ к pgAdmin:**
```bash
URL: http://ваш-адресс:8080 / (http://158.160.154.24:8080) - панель от проекта
Данные для входа:
Email: admin@ваш-домен.nomorepartiessbs.ru
Пароль: ваш пароль
Для подключения к базе данных PostgreSQL:
```
**Войдите в pgAdmin**
Добавьте новый сервер (правый клик на "Servers" → "Register" → "Server...")
На вкладке "General":
```bash
Name: Film Database
На вкладке "Connection":
Host name/address: film_postgres_prod (имя контейнера PostgreSQL)
Port: 5432
Maintenance database: film
Username: postgres
Password: postgres
```
**Альтернативный способ через SSH туннель (если порт 8080 заблокирован):**
```bash
ssh -i ~/.ssh/ssh-key-ВАШ-КЕЙ -L 8080:localhost:8080 ваш-юзер@1**.1**.1**.**
```
Затем откройте http://localhost:8080 в браузере.

### 🚀 Быстрый деплой

Для автоматического деплоя на удаленный сервер:

1. **Настройте GitHub Secrets** (Settings → Secrets and variables → Actions):

   - `SERVER_HOST` - IP адрес сервера
   - `SERVER_USER` - имя пользователя на сервере
   - `SERVER_SSH_KEY` - приватный SSH ключ
   - `SERVER_PORT` - порт SSH (обычно 22)
   - `GITHUB_TOKEN` - токен GitHub для registry

2. **Получите домен** на [domain.nomoreparties.site](https://domain.nomoreparties.site)

3. **Настройте сервер**:

   ```bash
   git clone https://github.com/dimabagz/film-react-nest.git /opt/film-react-nest
   cd /opt/film-react-nest
   chmod +x tools/setup-server.sh
   ./tools/setup-server.sh
   ```

4. **Настройте SSL**:
   ```bash
   chmod +x tools/setup-ssl.sh
   ./tools/setup-ssl.sh your-domain.nomoreparties.site
   ```
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



 **Запуск с Docker Compose:**

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

**Ручной запуск:**

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

Swagger UI позволяет:

- Просматривать все доступные эндпоинты
- Тестировать API прямо из браузера
- Изучать структуру запросов и ответов
- Видеть схемы данных (DTO)

## Установка и запуск для разработки

### Предварительные требования

- Node.js (версия 16 или выше)
- PostgreSQL (локально или в облаке)
- Docker и Docker Compose

### Установка зависимостей

```bash
npm install
```

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

## База данных

Проект использует PostgreSQL для хранения данных о фильмах и сеансах. Структура таблиц:

## 🎬 Фильмы в базе данных

1. **Сон в летний день** (8.1) - Амелия Хьюз
2. **Парадокс Нексуса** (9.5) - Оливер Беннет
3. **Стражи Гримуара** (8.9) - Лила Васкес
4. **Звёздное путешествие** (8.5) - Элиза Уиттакер
5. **Недостижимая утопия** (9.0) - Харрисон Рид
6. **Архитекторы общества** (2.9) - Итан Райт

## 🚀 Локальный запуск

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
### Вариант 4: Пошаговое выполнение

```bash
# 1. Создание таблиц
psql -U postgres -d film -f test/prac.init.sql

# 2. Вставка фильмов
psql -U postgres -d film -f test/prac.films.sql

# 3. Вставка сеансов
psql -U postgres -d film -f test/prac.schedules.sql
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
