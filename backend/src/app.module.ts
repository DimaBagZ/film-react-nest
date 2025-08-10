import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { StaticModule } from './static/static.module';
import { StaticController } from './static/static.controller';
import { DatabaseModule } from './database/database.module';

const DRIVER = process.env.DATABASE_DRIVER || 'mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // БЛОК УСЛОВНОГО ПОДКЛЮЧЕНИЯ MONGODB
    // Подключаем Mongoose только если выбран драйвер 'mongodb'
    ...(DRIVER === 'mongodb'
      ? [
          MongooseModule.forRoot(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/film',
          ),
        ]
      : []),
    // БЛОК УСЛОВНОГО ПОДКЛЮЧЕНИЯ TYPEORM ДЛЯ POSTGRES
    // Модуль сам ничего не делает, если драйвер не 'postgres'
    DatabaseModule,
    FilmsModule,
    OrderModule,
    StaticModule,
  ],
  controllers: [StaticController],
  providers: [],
})
export class AppModule {}
