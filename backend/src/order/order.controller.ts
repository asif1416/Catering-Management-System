import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const token = req.cookies['auth-token'] || req.headers['authorization'];
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    try {
      const order = await this.orderService.createOrder(
        token,
        createOrderDto.menuItemId,
        createOrderDto.quantity,
        createOrderDto.startTime,
        createOrderDto.endTime,
      );
      return {
        message: 'Order created successfully',
        order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to create order');
    }
  }

  @Post('/cancel')
  async cancelOrder(@Req() req: Request, @Body() { orderId }: { orderId: number }) {
    const token = req.cookies['auth-token'] || req.headers['authorization'];
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    try {
      const order = await this.orderService.cancelOrder(token, orderId);
      return {
        message: 'Order cancelled successfully',
        order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to cancel order');
    }
  }

  @Get('/orders')
  async getAllOrders(@Req() req: Request) {
    const token = req.cookies['auth-token'] || req.headers['authorization'];
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return this.orderService.getOrders(token);
  }

  @Get('/orders/:id')
  async getOrderById(@Req() req: Request, @Param('id', ParseIntPipe) orderId: number) {
    const token = req.cookies['auth-token'] || req.headers['authorization'];
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    try {
      const order = await this.orderService.getOrderById(token, orderId);
      return {
        message: `Order retrieved: ${orderId}`,
        order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to get order');
    }
  }
}
