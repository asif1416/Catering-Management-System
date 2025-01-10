import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]),
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
  controllers: [MenuController], 
  providers: [MenuService], 
  exports: [MenuService], 
})
export class MenuModule {}
