import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,

  }));
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


//instalar swagger
//npm install @nestjs/swagger