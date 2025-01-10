import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(
        createOrderDto.userId,
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
  async cancelOrder(@Body() { orderId }: { orderId: number }) {
    try {
      const order = await this.orderService.cancelOrder(orderId);
      return {
        message: 'Order cancelled successfully',
        order
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to cancel order');
    }
  }

  @Get('/orders')
  async getAllOrders() {
    return this.orderService.getOrders();
  }

  @Get('/orders/:id')
  async getOrderById(@Param('id', ParseIntPipe) orderId: number) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      return {
        message: `Order retrieved: ${orderId}`,
        order
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to get order');
    }
  }

}
