import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsMongoRepository } from '../repository/films.mongo.repository';
import { FilmsRepositoryProvider } from '../repository/films.repository.provider';
import { Film, FilmSchema } from './schemas/film.schema';

/**
 * Модуль для работы с фильмами
 * Включает контроллер, сервис и репозиторий
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    FilmsMongoRepository,
    FilmsRepositoryProvider, // Провайдер для выбора репозитория
  ],
  exports: [FilmsService], // Экспортируем сервис для использования в других модулях
})
export class FilmsModule {}
