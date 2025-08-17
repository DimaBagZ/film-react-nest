#!/bin/bash

# ========================================
# Скрипт деплоя проекта на Yandex Cloud
# ========================================

set -e  # Остановить выполнение при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка переменных окружения
check_env_vars() {
    print_info "Проверка переменных окружения..."
    
    required_vars=(
        "DATABASE_PASSWORD"
        "PGADMIN_PASSWORD"
        "GITHUB_REPOSITORY"
        "GITHUB_TOKEN"
        "DOMAIN"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Отсутствуют обязательные переменные окружения:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Пожалуйста, создайте файл .env на основе env.example"
        exit 1
    fi
    
    print_success "Все обязательные переменные окружения настроены"
}

# Проверка подключения к серверу
check_server_connection() {
    print_info "Проверка подключения к серверу..."
    
    if [ -z "$SERVER_IP" ]; then
        print_error "Не указан IP адрес сервера"
        echo "Использование: $0 <server-ip>"
        exit 1
    fi
    
    if ! ping -c 1 "$SERVER_IP" > /dev/null 2>&1; then
        print_error "Не удается подключиться к серверу $SERVER_IP"
        exit 1
    fi
    
    print_success "Подключение к серверу установлено"
}

# Копирование файлов на сервер
copy_files_to_server() {
    print_info "Копирование файлов на сервер..."
    
    # Создать архив проекта
    tar -czf film-project.tar.gz \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.env' \
        --exclude='*.log' \
        --exclude='backups' \
        .
    
    # Копировать архив на сервер
    scp film-project.tar.gz ubuntu@"$SERVER_IP":~/film-project.tar.gz
    
    # Удалить локальный архив
    rm film-project.tar.gz
    
    print_success "Файлы скопированы на сервер"
}

# Настройка сервера
setup_server() {
    print_info "Настройка сервера..."
    
    ssh ubuntu@"$SERVER_IP" << 'EOF'
        # Создать директорию проекта
        mkdir -p ~/film-project
        cd ~/film-project
        
        # Распаковать архив
        tar -xzf ~/film-project.tar.gz
        rm ~/film-project.tar.gz
        
        # Создать .env файл
        if [ ! -f .env ]; then
            echo "Создание .env файла..."
            cp env.example .env
            echo "Пожалуйста, отредактируйте .env файл с вашими настройками"
        fi
        
        # Создать необходимые директории
        mkdir -p server/logs server/cache ssl
        
        print_success "Сервер настроен"
EOF
}

# Установка Docker на сервере
install_docker() {
    print_info "Установка Docker на сервере..."
    
    ssh ubuntu@"$SERVER_IP" << 'EOF'
        # Проверить, установлен ли Docker
        if ! command -v docker &> /dev/null; then
            echo "Установка Docker..."
            
            # Обновить систему
            sudo apt update && sudo apt upgrade -y
            
            # Установить необходимые пакеты
            sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
            
            # Установить Docker
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            sudo apt update
            sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            
            # Добавить пользователя в группу docker
            sudo usermod -aG docker $USER
            
            echo "Docker установлен. Перезапустите SSH сессию для применения изменений."
        else
            echo "Docker уже установлен"
        fi
EOF
}

# Настройка SSL сертификата
setup_ssl() {
    print_info "Настройка SSL сертификата..."
    
    ssh ubuntu@"$SERVER_IP" << EOF
        cd ~/film-project
        
        # Установить Certbot
        sudo apt install -y certbot
        
        # Получить SSL сертификат
        sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        # Скопировать сертификаты
        sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/
        sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/
        sudo chown -R ubuntu:ubuntu ssl/
        
        echo "SSL сертификат настроен"
EOF
}

# Запуск приложения
start_application() {
    print_info "Запуск приложения..."
    
    ssh ubuntu@"$SERVER_IP" << 'EOF'
        cd ~/film-project
        
        # Остановить существующие контейнеры
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        
        # Запустить приложение
        docker-compose -f docker-compose.prod.yml up -d
        
        # Проверить статус
        docker-compose -f docker-compose.prod.yml ps
        
        echo "Приложение запущено"
EOF
}

# Настройка автоматического обновления SSL
setup_ssl_renewal() {
    print_info "Настройка автоматического обновления SSL..."
    
    ssh ubuntu@"$SERVER_IP" << EOF
        # Создать скрипт обновления SSL
        cat > ~/renew-ssl.sh << 'SSL_SCRIPT'
#!/bin/bash

# Обновить SSL сертификаты
sudo certbot renew

# Скопировать новые сертификаты
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ~/film-project/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ~/film-project/ssl/
sudo chown -R ubuntu:ubuntu ~/film-project/ssl/

# Перезапустить nginx
cd ~/film-project
docker-compose -f docker-compose.prod.yml restart server

echo "SSL certificates renewed at \$(date)"
SSL_SCRIPT
        
        # Сделать скрипт исполняемым
        chmod +x ~/renew-ssl.sh
        
        # Добавить в crontab
        (crontab -l 2>/dev/null; echo "0 */12 * * * ~/renew-ssl.sh >> ~/ssl-renewal.log 2>&1") | crontab -
        
        echo "Автоматическое обновление SSL настроено"
EOF
}

# Проверка работы приложения
test_application() {
    print_info "Проверка работы приложения..."
    
    # Проверить HTTP
    if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
        print_success "HTTP работает"
    else
        print_warning "HTTP не отвечает"
    fi
    
    # Проверить HTTPS
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200\|301\|302"; then
        print_success "HTTPS работает"
    else
        print_warning "HTTPS не отвечает"
    fi
    
    # Проверить API
    if curl -s "https://$DOMAIN/api/afisha/films" | grep -q "total"; then
        print_success "API работает"
    else
        print_warning "API не отвечает"
    fi
}

# Основная функция
main() {
    echo "========================================"
    echo "Деплой проекта на Yandex Cloud"
    echo "========================================"
    echo ""
    
    # Проверить аргументы
    if [ $# -eq 0 ]; then
        print_error "Не указан IP адрес сервера"
        echo "Использование: $0 <server-ip>"
        exit 1
    fi
    
    SERVER_IP="$1"
    
    # Загрузить переменные окружения
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        print_error "Файл .env не найден"
        exit 1
    fi
    
    # Выполнить шаги деплоя
    check_env_vars
    check_server_connection
    copy_files_to_server
    setup_server
    install_docker
    setup_ssl
    start_application
    setup_ssl_renewal
    test_application
    
    echo ""
    print_success "Деплой завершен!"
    echo ""
    echo "Ваш сайт доступен по адресу:"
    echo "  HTTP:  http://$DOMAIN"
    echo "  HTTPS: https://$DOMAIN"
    echo ""
    echo "Для управления сервером:"
    echo "  ssh ubuntu@$SERVER_IP"
    echo ""
    echo "Для просмотра логов:"
    echo "  docker-compose -f docker-compose.prod.yml logs"
}

# Запуск основной функции
main "$@" 