import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
  app.use(helmet());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
