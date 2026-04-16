import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http_exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  //configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('API Con vulnerabilidades de seguridad')
    .setDescription('Documentacion de la API de pruebas')
    .setVersion('1.0.0')
    .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
  await app.enableShutdownHooks();
}
bootstrap();


