import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { StaticModule } from './static/static.module';
import { StaticController } from './static/static.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Подключение к MongoDB
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/film',
    ),
    FilmsModule,
    OrderModule,
    StaticModule,
  ],
  controllers: [StaticController],
  providers: [configProvider],
})
export class AppModule {}
