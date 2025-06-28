import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {ServerTimingMiddleware} from "./common/middleware/serverTimingMiddleware";


async function bootstrap() {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: [process.env.WEB_APP_URL]
      }
    });

    // 👇 Подключаем Server-Timing middleware
    app.use(new ServerTimingMiddleware().use);

    const config = new DocumentBuilder()
      .setTitle('Сервис доставки еды')
      .setDescription('Документация REST API')
      .setVersion('1.0.0')
      .addTag('food-delivery')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);



    await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));

  } catch (e) {
    console.log(e);
  }
}

bootstrap();
