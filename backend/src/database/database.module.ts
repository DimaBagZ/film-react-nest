import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

/**
 * Модуль базы данных
 * Подключает TypeORM только когда выбран драйвер 'postgres'
 */
@Module({
  imports: [
    ConfigModule,
    ...(process.env.DATABASE_DRIVER === 'postgres'
      ? [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              host: config.get('DATABASE_HOST', '127.0.0.1'),
              port: parseInt(config.get('DATABASE_PORT', '5432'), 10),
              username: config.get('DATABASE_USERNAME', 'postgres'),
              password: config.get('DATABASE_PASSWORD', 'postgres'),
              database: config.get('DATABASE_NAME', 'film'),
              entities: [FilmEntity, ScheduleEntity],
              synchronize: false, // отключаем синхронизацию
              logging: true, // включаем логирование SQL
            }),
          }),
        ]
      : []),
  ],
})
export class DatabaseModule {}
