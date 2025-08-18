#!/bin/bash

# Docker Manager для проекта Film!
# Универсальный скрипт для управления Docker контейнерами

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Функция для показа справки
show_help() {
    echo "🐳 Docker Manager для проекта Film!"
    echo ""
    echo "Использование: $0 [команда]"
    echo ""
    echo "Команды:"
    echo "  start     - Запустить проект"
    echo "  stop      - Остановить проект"
    echo "  restart   - Перезапустить проект"
    echo "  build     - Собрать и запустить проект"
    echo "  clean     - Очистить кэш TypeORM и пересобрать"
    echo "  logs      - Показать логи всех сервисов"
    echo "  status    - Показать статус контейнеров"
    echo "  test      - Запустить тесты API"
    echo "  reset     - Полный сброс (удалить volumes и пересобрать)"
    echo "  clear-seats - Очистить занятые места в БД"
    echo "  help      - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0 start"
    echo "  $0 clean"
    echo "  $0 logs backend"
    echo "  $0 clear-seats --all"
}

# Функция для запуска проекта
start_project() {
    log_info "Запуск проекта..."
    cd "$(dirname "$0")/.."
    docker-compose up -d
    log_success "Проект запущен!"
}

# Функция для остановки проекта
stop_project() {
    log_info "Остановка проекта..."
    cd "$(dirname "$0")/.."
    docker-compose down
    log_success "Проект остановлен!"
}

# Функция для перезапуска проекта
restart_project() {
    log_info "Перезапуск проекта..."
    cd "$(dirname "$0")/.."
    docker-compose restart
    log_success "Проект перезапущен!"
}

# Функция для сборки проекта
build_project() {
    log_info "Сборка и запуск проекта..."
    cd "$(dirname "$0")/.."
    docker-compose up --build -d
    log_success "Проект собран и запущен!"
}

# Функция для очистки кэша TypeORM
clean_typeorm_cache() {
    log_info "Очистка кэша TypeORM и пересборка..."
    cd "$(dirname "$0")/.."
    
    # Остановка контейнеров
    docker-compose down
    
    # Удаление volumes для полной очистки данных
    log_info "Удаление volumes PostgreSQL..."
    docker volume rm film-react-nest_postgres_data 2>/dev/null || true
    
    # Очистка кэша TypeORM в backend
    log_info "Очистка кэша TypeORM..."
    cd backend
    rm -rf dist/
    rm -rf node_modules/
    rm -f package-lock.json
    
    # Переустановка зависимостей
    log_info "Переустановка зависимостей..."
    npm install
    
    # Сборка проекта
    log_info "Сборка проекта..."
    npm run build
    
    # Возврат в корневую директорию
    cd ..
    
    # Запуск контейнеров
    log_info "Запуск Docker контейнеров..."
    docker-compose up -d
    
    log_success "Очистка завершена! База данных перезапущена с новыми схемами."
}

# Функция для показа логов
show_logs() {
    cd "$(dirname "$0")/.."
    if [ -n "$1" ]; then
        log_info "Логи сервиса: $1"
        docker-compose logs -f "$1"
    else
        log_info "Логи всех сервисов"
        docker-compose logs -f
    fi
}

# Функция для показа статуса
show_status() {
    cd "$(dirname "$0")/.."
    log_info "Статус контейнеров:"
    docker-compose ps
}

# Функция для тестирования API
test_api() {
    log_info "Тестирование API..."
    
    # Ждем немного для запуска сервисов
    sleep 5
    
    # Тест получения фильмов
    log_info "Тест: GET /api/afisha/films"
    if curl -s http://localhost:3000/api/afisha/films > /dev/null; then
        log_success "API фильмов работает"
    else
        log_error "API фильмов не отвечает"
        return 1
    fi
    
    # Тест получения расписания
    log_info "Тест: GET /api/afisha/films/{id}/schedule"
    if curl -s "http://localhost:3000/api/afisha/films/92b8a2a7-ab6b-4fa9-915b-d27945865e39/schedule" > /dev/null; then
        log_success "API расписания работает"
    else
        log_error "API расписания не отвечает"
        return 1
    fi
    
    # Тест веб-сервера
    log_info "Тест: Frontend (порт 80)"
    if curl -s -I http://localhost:80 | grep -q "200 OK"; then
        log_success "Frontend работает"
    else
        log_error "Frontend не отвечает"
        return 1
    fi
    
    log_success "Все тесты пройдены успешно!"
}

# Функция для полного сброса
reset_project() {
    log_warning "Полный сброс проекта (удаление всех данных)!"
    read -p "Вы уверены? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$(dirname "$0")/.."
        
        # Остановка и удаление контейнеров
        log_info "Остановка контейнеров..."
        docker-compose down
        
        # Удаление volumes
        log_info "Удаление volumes..."
        docker volume rm film-react-nest_postgres_data 2>/dev/null || true
        docker volume rm film-react-nest_pgadmin_data 2>/dev/null || true
        docker volume rm film-react-nest_frontend_static 2>/dev/null || true
        
        # Удаление образов
        log_info "Удаление образов..."
        docker rmi ghcr.io/dimabagz/film-react-nest/backend:latest 2>/dev/null || true
        docker rmi ghcr.io/dimabagz/film-react-nest/frontend:latest 2>/dev/null || true
        docker rmi ghcr.io/dimabagz/film-react-nest/server:latest 2>/dev/null || true
        
        # Очистка кэша в backend
        cd backend
        rm -rf dist/ node_modules/ package-lock.json
        
        # Восстанавливаем package-lock.json
        log_info "Восстановление package-lock.json..."
        npm install
        
        cd ..
        
        # Пересборка
        log_info "Пересборка проекта..."
        docker-compose up --build -d
        
        log_success "Полный сброс завершен!"
    else
        log_info "Сброс отменен"
    fi
}

# Функция для очистки занятых мест
clear_taken_seats() {
    log_info "Очистка занятых мест в базе данных..."
    cd "$(dirname "$0")/.."
    
    # Передаем все аргументы в скрипт очистки
    ./tools/clear-taken-seats.sh "$@"
}

# Основная логика
case "${1:-help}" in
    start)
        start_project
        ;;
    stop)
        stop_project
        ;;
    restart)
        restart_project
        ;;
    build)
        build_project
        ;;
    clean)
        clean_typeorm_cache
        ;;
    logs)
        show_logs "$2"
        ;;
    status)
        show_status
        ;;
    test)
        test_api
        ;;
    reset)
        reset_project
        ;;
    clear-seats)
        shift
        clear_taken_seats "$@"
        ;;
    help|*)
        show_help
        ;;
esac 