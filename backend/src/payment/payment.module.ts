import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SSLCommerzPayment } from './ssl-commerz-payment.service';
import { PAYMENT_CONFIG } from './payment.constants';
import { Payment } from './payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'catering',
      entities: [Payment],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: PAYMENT_CONFIG,
      useFactory: (configService: ConfigService) => ({
        storeId: configService.get<string>('STORE_ID'),
        storePassword: configService.get<string>('STORE_PASSWORD'),
        live: configService.get<boolean>('PAYMENT_LIVE_MODE') || false,
      }),
      inject: [ConfigService],
    },
    PaymentService,
    SSLCommerzPayment,
    
  ],
})
export class PaymentModule {}
