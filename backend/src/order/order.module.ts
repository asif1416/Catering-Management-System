import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { MenuModule } from '../menu/menu.module'; 
import { CustomerModule } from 'src/customer/customer.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
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
    MenuModule, 
    CustomerModule, 
  ],
  controllers: [OrderController],
  providers: [OrderService], 
  exports: [OrderService],
})
export class OrderModule {}
