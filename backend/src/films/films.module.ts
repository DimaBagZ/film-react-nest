import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsMongoRepository } from '../repository/films.mongo.repository';
import { FilmsRepositoryProvider } from '../repository/films.repository.provider';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsPostgresRepository } from '../repository/films.postgres.repository';
import { DatabaseModule } from '../database/database.module';

const DRIVER = process.env.DATABASE_DRIVER || 'mongodb';

/**
 * Модуль для работы с фильмами
 * Включает контроллер, сервис и репозитории (условно по выбранной СУБД)
 */
@Module({
  imports: [
    // БЛОК УСЛОВНОГО ПОДКЛЮЧЕНИЯ СХЕМ MONGODB
    ...(DRIVER === 'mongodb'
      ? [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]
      : []),
    // БЛОК УСЛОВНОГО ПОДКЛЮЧЕНИЯ TYPEORM ДЛЯ POSTGRES
    ...(DRIVER === 'postgres' ? [DatabaseModule] : []),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    // БЛОК УСЛОВНОГО ВКЛЮЧЕНИЯ РЕПОЗИТОРИЕВ СУБД
    ...(DRIVER === 'postgres' ? [FilmsPostgresRepository] : []),
    ...(DRIVER === 'mongodb' ? [FilmsMongoRepository] : []),
    FilmsRepositoryProvider, // Провайдер выбора репозитория (inmemory/mongo/postgres)
  ],
  exports: [FilmsService],
})
export class FilmsModule {}
