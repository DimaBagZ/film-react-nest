#!/bin/bash

# Скрипт очистки занятых мест в базе данных
# Очищает поле 'taken' в таблице schedules

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

# Функция для показа справки
show_help() {
    echo "🧹 Очистка занятых мест в базе данных"
    echo ""
    echo "Использование: $0 [опции]"
    echo ""
    echo "Опции:"
    echo "  --all              - Очистить все занятые места"
    echo "  --film <film_id>   - Очистить места для конкретного фильма"
    echo "  --session <session_id> - Очистить места для конкретного сеанса"
    echo "  --hall <hall_number>   - Очистить места в конкретном зале"
    echo "  --before <date>    - Очистить места для сеансов до указанной даты"
    echo "  --dry-run          - Показать что будет очищено без выполнения"
    echo "  --help             - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0 --all                    # Очистить все занятые места"
    echo "  $0 --film 92b8a2a7-ab6b-4fa9-915b-d27945865e39"
    echo "  $0 --session 5274c89d-f39c-40f9-bea8-f22a22a50c8a"
    echo "  $0 --hall 1                 # Очистить места в зале 1"
    echo "  $0 --before 2024-06-29      # Очистить места до 29 июня"
    echo "  $0 --all --dry-run          # Показать что будет очищено"
}

# Функция для подключения к базе данных
connect_db() {
    # Получаем параметры подключения из .env файла
    if [ ! -f ".env" ]; then
        log_error "Файл .env не найден!"
        exit 1
    fi
    
    # Загружаем переменные из .env
    export $(grep -v '^#' .env | xargs)
    
    # Проверяем наличие обязательных переменных
    if [ -z "$DATABASE_HOST" ] || [ -z "$DATABASE_PORT" ] || [ -z "$DATABASE_NAME" ] || [ -z "$DATABASE_USERNAME" ] || [ -z "$DATABASE_PASSWORD" ]; then
        log_error "Не все переменные базы данных настроены в .env"
        exit 1
    fi
    
    # Формируем строку подключения
    DB_CONNECTION="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
}

# Функция для проверки подключения к базе данных
check_db_connection() {
    log_info "Проверка подключения к базе данных..."
    
    if psql "$DB_CONNECTION" -c "SELECT 1;" > /dev/null 2>&1; then
        log_success "Подключение к базе данных установлено"
    else
        log_error "Не удалось подключиться к базе данных"
        log_info "Убедитесь, что PostgreSQL запущен и доступен"
        exit 1
    fi
}

# Функция для получения статистики занятых мест
get_taken_seats_stats() {
    log_info "Получение статистики занятых мест..."
    
    # Подсчет сеансов с занятыми местами
    local sessions_with_taken=$(psql "$DB_CONNECTION" -t -c "
        SELECT COUNT(*) FROM schedules 
        WHERE taken IS NOT NULL AND taken != '' AND taken != '[]'
    " | tr -d ' ')
    
    # Подсчет общего количества занятых мест
    local total_taken_seats=$(psql "$DB_CONNECTION" -t -c "
        SELECT COALESCE(SUM(
            CASE 
                WHEN taken IS NULL OR taken = '' OR taken = '[]' THEN 0
                ELSE array_length(string_to_array(taken, ','), 1)
            END
        ), 0) FROM schedules
    " | tr -d ' ')
    
    echo "📊 Статистика занятых мест:"
    echo "   • Сеансов с занятыми местами: $sessions_with_taken"
    echo "   • Общее количество занятых мест: $total_taken_seats"
    echo ""
}

# Функция для очистки всех занятых мест
clear_all_taken_seats() {
    local dry_run=$1
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN: Будет очищено всех занятых мест"
        psql "$DB_CONNECTION" -c "
            SELECT 
                s.id as session_id,
                f.title as film_title,
                s.daytime,
                s.hall,
                s.taken as current_taken_seats
            FROM schedules s
            JOIN films f ON s.\"filmId\" = f.id
            WHERE s.taken IS NOT NULL AND s.taken != '' AND s.taken != '[]'
            ORDER BY s.daytime, s.hall;
        "
    else
        log_info "Очистка всех занятых мест..."
        local affected=$(psql "$DB_CONNECTION" -t -c "
            WITH updated AS (
                UPDATE schedules 
                SET taken = '[]' 
                WHERE taken IS NOT NULL AND taken != '' AND taken != '[]'
                RETURNING id
            )
            SELECT COUNT(*) FROM updated;
        " | tr -d ' ')
        
        log_success "Очищено занятых мест в $affected сеансах"
    fi
}

# Функция для очистки мест по фильму
clear_taken_seats_by_film() {
    local film_id=$1
    local dry_run=$2
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN: Будет очищено занятых мест для фильма $film_id"
        psql "$DB_CONNECTION" -c "
            SELECT 
                s.id as session_id,
                f.title as film_title,
                s.daytime,
                s.hall,
                s.taken as current_taken_seats
            FROM schedules s
            JOIN films f ON s.\"filmId\" = f.id
            WHERE s.\"filmId\" = '$film_id' 
            AND s.taken IS NOT NULL AND s.taken != '' AND s.taken != '[]'
            ORDER BY s.daytime, s.hall;
        "
    else
        log_info "Очистка занятых мест для фильма $film_id..."
        local affected=$(psql "$DB_CONNECTION" -t -c "
            WITH updated AS (
                UPDATE schedules 
                SET taken = '[]' 
                WHERE \"filmId\" = '$film_id' 
                AND taken IS NOT NULL AND taken != '' AND taken != '[]'
                RETURNING id
            )
            SELECT COUNT(*) FROM updated;
        " | tr -d ' ')
        
        log_success "Очищено занятых мест в $affected сеансах фильма"
    fi
}

# Функция для очистки мест по сеансу
clear_taken_seats_by_session() {
    local session_id=$1
    local dry_run=$2
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN: Будет очищено занятых мест для сеанса $session_id"
        psql "$DB_CONNECTION" -c "
            SELECT 
                s.id as session_id,
                f.title as film_title,
                s.daytime,
                s.hall,
                s.taken as current_taken_seats
            FROM schedules s
            JOIN films f ON s.\"filmId\" = f.id
            WHERE s.id = '$session_id';
        "
    else
        log_info "Очистка занятых мест для сеанса $session_id..."
        local affected=$(psql "$DB_CONNECTION" -t -c "
            WITH updated AS (
                UPDATE schedules 
                SET taken = '[]' 
                WHERE id = '$session_id'
                RETURNING id
            )
            SELECT COUNT(*) FROM updated;
        " | tr -d ' ')
        
        if [ "$affected" -gt 0 ]; then
            log_success "Занятые места для сеанса очищены"
        else
            log_warning "Сеанс не найден или уже пуст"
        fi
    fi
}

# Функция для очистки мест по залу
clear_taken_seats_by_hall() {
    local hall_number=$1
    local dry_run=$2
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN: Будет очищено занятых мест в зале $hall_number"
        psql "$DB_CONNECTION" -c "
            SELECT 
                s.id as session_id,
                f.title as film_title,
                s.daytime,
                s.hall,
                s.taken as current_taken_seats
            FROM schedules s
            JOIN films f ON s.\"filmId\" = f.id
            WHERE s.hall = $hall_number 
            AND s.taken IS NOT NULL AND s.taken != '' AND s.taken != '[]'
            ORDER BY s.daytime;
        "
    else
        log_info "Очистка занятых мест в зале $hall_number..."
        local affected=$(psql "$DB_CONNECTION" -t -c "
            WITH updated AS (
                UPDATE schedules 
                SET taken = '[]' 
                WHERE hall = $hall_number 
                AND taken IS NOT NULL AND taken != '' AND taken != '[]'
                RETURNING id
            )
            SELECT COUNT(*) FROM updated;
        " | tr -d ' ')
        
        log_success "Очищено занятых мест в $affected сеансах зала $hall_number"
    fi
}

# Функция для очистки мест до определенной даты
clear_taken_seats_before_date() {
    local date=$1
    local dry_run=$2
    
    if [ "$dry_run" = "true" ]; then
        log_info "DRY RUN: Будет очищено занятых мест для сеансов до $date"
        psql "$DB_CONNECTION" -c "
            SELECT 
                s.id as session_id,
                f.title as film_title,
                s.daytime,
                s.hall,
                s.taken as current_taken_seats
            FROM schedules s
            JOIN films f ON s.\"filmId\" = f.id
            WHERE s.daytime < '$date'::timestamp
            AND s.taken IS NOT NULL AND s.taken != '' AND s.taken != '[]'
            ORDER BY s.daytime, s.hall;
        "
    else
        log_info "Очистка занятых мест для сеансов до $date..."
        local affected=$(psql "$DB_CONNECTION" -t -c "
            WITH updated AS (
                UPDATE schedules 
                SET taken = '[]' 
                WHERE daytime < '$date'::timestamp
                AND taken IS NOT NULL AND taken != '' AND taken != '[]'
                RETURNING id
            )
            SELECT COUNT(*) FROM updated;
        " | tr -d ' ')
        
        log_success "Очищено занятых мест в $affected сеансах до $date"
    fi
}

# Основная функция
main() {
    echo "🧹 Очистка занятых мест в базе данных"
    echo "====================================="
    
    # Парсинг аргументов
    local action=""
    local film_id=""
    local session_id=""
    local hall_number=""
    local before_date=""
    local dry_run=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --all)
                action="all"
                shift
                ;;
            --film)
                action="film"
                film_id="$2"
                shift 2
                ;;
            --session)
                action="session"
                session_id="$2"
                shift 2
                ;;
            --hall)
                action="hall"
                hall_number="$2"
                shift 2
                ;;
            --before)
                action="before"
                before_date="$2"
                shift 2
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Неизвестная опция: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Проверка наличия действия
    if [ -z "$action" ]; then
        log_error "Не указано действие. Используйте --help для справки"
        exit 1
    fi
    
    # Подключение к базе данных
    connect_db
    check_db_connection
    
    # Показ статистики до очистки
    get_taken_seats_stats
    
    # Выполнение действия
    case $action in
        "all")
            clear_all_taken_seats $dry_run
            ;;
        "film")
            if [ -z "$film_id" ]; then
                log_error "Не указан ID фильма"
                exit 1
            fi
            clear_taken_seats_by_film "$film_id" $dry_run
            ;;
        "session")
            if [ -z "$session_id" ]; then
                log_error "Не указан ID сеанса"
                exit 1
            fi
            clear_taken_seats_by_session "$session_id" $dry_run
            ;;
        "hall")
            if [ -z "$hall_number" ]; then
                log_error "Не указан номер зала"
                exit 1
            fi
            clear_taken_seats_by_hall "$hall_number" $dry_run
            ;;
        "before")
            if [ -z "$before_date" ]; then
                log_error "Не указана дата"
                exit 1
            fi
            clear_taken_seats_before_date "$before_date" $dry_run
            ;;
    esac
    
    # Показ статистики после очистки (если не dry-run)
    if [ "$dry_run" = "false" ]; then
        echo ""
        get_taken_seats_stats
    fi
    
    log_success "Операция завершена!"
}

# Запуск основной функции
main "$@" 