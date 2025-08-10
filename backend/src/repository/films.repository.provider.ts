import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilmsInMemoryRepository } from './films.in-memory.repository';
import { FilmsMongoRepository } from './films.mongo.repository';

/**
 * Провайдер для выбора репозитория фильмов
 * Использует in-memory репозиторий для разработки и MongoDB для продакшена
 */
export const FilmsRepositoryProvider: Provider = {
  provide: 'IFilmsRepository',
  useFactory: (
    configService: ConfigService,
    mongoRepository: FilmsMongoRepository,
  ) => {
    const useInMemory =
      configService.get('USE_IN_MEMORY_REPOSITORY', 'false') === 'true';

    if (useInMemory) {
      return new FilmsInMemoryRepository();
    }

    return mongoRepository;
  },
  inject: [ConfigService, FilmsMongoRepository],
};
