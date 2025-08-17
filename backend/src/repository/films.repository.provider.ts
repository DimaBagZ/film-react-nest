import 'dotenv/config';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilmsInMemoryRepository } from './films.in-memory.repository';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FilmsPostgresRepository } from './films.postgres.repository';

const DRIVER = process.env.DATABASE_DRIVER || 'mongodb';

/**
 * Провайдер для выбора репозитория фильмов
 * Выбирает реализацию по переменной окружения DATABASE_DRIVER:
 *  - 'inmemory' → репозиторий в памяти
 *  - 'mongodb'  → MongoDB
 *  - 'postgres' → PostgreSQL (TypeORM)
 */
export const FilmsRepositoryProvider: Provider = {
  provide: 'IFilmsRepository',
  useFactory: (
    configService: ConfigService,
    // В зависимости от драйвера сюда будет подставлен нужный репозиторий
    repository?: FilmsMongoRepository | FilmsPostgresRepository,
  ) => {
    const driver = configService.get<string>('DATABASE_DRIVER', DRIVER);

    // Поддержка прежнего флага на всякий случай
    const useInMemory =
      configService.get('USE_IN_MEMORY_REPOSITORY', 'false') === 'true' ||
      driver === 'inmemory';

    if (useInMemory) {
      return new FilmsInMemoryRepository();
    }

    return repository as FilmsMongoRepository | FilmsPostgresRepository;
  },
  // Динамическое определение зависимостей по драйверу
  inject:
    DRIVER === 'postgres'
      ? [ConfigService, FilmsPostgresRepository]
      : DRIVER === 'mongodb'
        ? [ConfigService, FilmsMongoRepository]
        : [ConfigService], // inmemory не требует внешних репозиториев
};
