import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';
import { Customer } from 'src/customer/customer.entity';
import { Menu } from 'src/menu/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Customer, Menu]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'catering',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  }),], 
  controllers: [CartController], 
  providers: [CartService], 
  exports: [CartModule],
})
export class CartModule {}
