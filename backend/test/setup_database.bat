@echo off
echo Настройка кодировки для PostgreSQL...
chcp 65001 >nul
set PGCLIENTENCODING=UTF8

echo Выполнение SQL скрипта...
psql -U postgres -d film -f test/setup_database_utf8.sql

echo Готово!
pause 