import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Customer } from '../customer/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { CustomerModule } from '../customer/customer.module';
import { AuthGuard } from './auth.guard'; 
import { Reflector } from '@nestjs/core'; 
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'catering',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      
    }),
    CustomerModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, Reflector],
})
export class AuthModule {}
