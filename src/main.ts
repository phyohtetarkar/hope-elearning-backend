import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('E-Learning API')
    .setDescription('E-Learning api backend build with NestJS.')
    .setVersion('1.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'header',
      name: 'Cookie',
    })
    .addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  await app.listen(3080);
}
bootstrap();
