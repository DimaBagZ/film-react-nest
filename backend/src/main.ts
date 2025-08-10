import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка глобального префикса для API
  app.setGlobalPrefix('api/afisha', {
    exclude: ['content/afisha/(.*)', '/'],
  });

  // Включение CORS
  app.enableCors();

  // Глобальная валидация входящих данных (временно смягчена для отладки)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, не определенные в DTO
      forbidNonWhitelisted: false, // Временно отключено для отладки
      transform: true, // Автоматически преобразует типы
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422, // HTTP статус для ошибок валидации
      skipMissingProperties: true, // Пропускает отсутствующие свойства
    }),
  );

  // Глобальный фильтр исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('Film! API')
    .setDescription('API для онлайн-сервиса бронирования билетов в кинотеатр')
    .setVersion('1.0')
    .addTag('films', 'Операции с фильмами')
    .addTag('orders', 'Операции с заказами')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Настройка Swagger UI
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
