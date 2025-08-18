-- Инициализация базы данных для проекта Film!

-- Создание таблицы films
CREATE TABLE IF NOT EXISTS films (
    id UUID PRIMARY KEY,
    rating DECIMAL(3,1) NOT NULL,
    director VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    image VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Создание таблицы schedules
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY,
    "filmId" UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime TIMESTAMP NOT NULL,
    hall INTEGER NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    taken TEXT DEFAULT '[]'
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_schedules_film_id ON schedules("filmId");
CREATE INDEX IF NOT EXISTS idx_schedules_daytime ON schedules(daytime); 