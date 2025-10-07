#!/bin/bash

# Деплой в продакшен для проекта Film!
# Использует docker-compose.prod.yml

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

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка наличия .env файла
check_env() {
    if [ ! -f ".env" ]; then
        log_error "Файл .env не найден!"
        log_info "Скопируйте env.example в .env и настройте переменные"
        exit 1
    fi
    
    # Проверка обязательных переменных
    required_vars=("DATABASE_PASSWORD" "PGADMIN_PASSWORD" "GITHUB_TOKEN")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            log_error "Переменная $var не найдена в .env"
            exit 1
        fi
    done
    
    log_success "Переменные окружения проверены"
}

# Проверка Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker не установлен"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose не установлен"
        exit 1
    fi
    
    log_success "Docker и Docker Compose доступны"
}

# Остановка существующих контейнеров
stop_existing() {
    log_info "Остановка существующих контейнеров..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    log_success "Существующие контейнеры остановлены"
}

# Сборка и запуск в продакшене
deploy_production() {
    log_info "Деплой в продакшен..."
    
    # Сборка образов
    log_info "Сборка Docker образов..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Запуск в продакшене
    log_info "Запуск продакшен контейнеров..."
    docker-compose -f docker-compose.prod.yml up -d
    
    log_success "Деплой завершен!"
}

# Проверка здоровья сервисов
health_check() {
    log_info "Проверка здоровья сервисов..."
    
    # Ждем запуска сервисов
    sleep 30
    
    # Проверка backend
    if curl -s --connect-timeout 10 "http://localhost:3000/api/afisha/films" > /dev/null; then
        log_success "Backend API работает"
    else
        log_error "Backend API не отвечает"
        return 1
    fi
    
    # Проверка frontend через nginx
    if curl -s --connect-timeout 10 -I "http://localhost:80" | grep -q "200 OK"; then
        log_success "Frontend работает"
    else
        log_error "Frontend не отвечает"
        return 1
    fi
    
    log_success "Все сервисы работают корректно!"
}

# Показ информации о деплое
show_deploy_info() {
    echo ""
    echo "🚀 Информация о деплое:"
    echo "========================"
    echo "• Backend API: http://localhost:3000/api/afisha"
    echo "• Frontend: http://localhost:80"
    echo "• pgAdmin: http://localhost:8080"
    echo ""
    echo "📊 Статус контейнеров:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "📝 Логи:"
    echo "  docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
    echo "🛑 Остановка:"
    echo "  docker-compose -f docker-compose.prod.yml down"
}

# Основная функция
main() {
    echo "🚀 Деплой в продакшен - Film! Project"
    echo "====================================="
    
    # Проверки
    check_env
    check_docker
    
    # Подтверждение
    log_warning "Вы собираетесь развернуть проект в продакшен режиме"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Деплой отменен"
        exit 0
    fi
    
    # Выполнение деплоя
    stop_existing
    deploy_production
    health_check
    show_deploy_info
    
    log_success "🎉 Деплой в продакшен завершен успешно!"
}

# Запуск основной функции
main "$@" 