import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Get,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async createOrder(
    @Req() request: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    try {
      const order = await this.orderService.createOrder(token, createOrderDto);
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
  async cancelOrder(
    @Req() request: any,
    @Body() { orderId }: { orderId: number },
  ) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;
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
  async getAllOrders(@Req() request: any) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return this.orderService.getOrders(token);
  }

  @Get('/orders/:id')
  async getOrderById(
    @Req() request: any,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    const token =
      request.headers['authorization']?.split(' ')[1] || request.cookies?.jwt;
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
