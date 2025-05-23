import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Real Time Chat API')
      .setDescription('API documentation for the Real Time Chat project')
      .setVersion('1.0')
      .addTag('chat')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
