import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

  app.enableCors({
    origin: frontendUrl 
      ? [frontendUrl, 'http://localhost:5173'] 
      : '*', // Si por alguna razón no existe la variable, permite cualquiera temporalmente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Pedidos API')
    .setDescription('API para gestión de pedidos de autopartes')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger en http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();