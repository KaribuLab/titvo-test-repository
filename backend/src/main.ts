import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const origins =
    process.env.TRUSTED_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? ['http://localhost:3000'];
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
