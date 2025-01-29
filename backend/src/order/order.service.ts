import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { MenuService } from '../menu/menu.service';
import { CustomerService } from '../customer/customer.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly menuService: MenuService,
    private readonly customerService: CustomerService,
    private readonly mailerService: MailerService,
  ) {}

  async sendReciept(email: string, order: Order): Promise<void> {
    const formatDate = (date: Date) => {
      return date
        ? date.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
        : 'N/A';
    };

    const itemDetails = order.items
      .map(
        (item) =>
          `<p>${item.menuItem.name} - ৳${item.menuItem.price} x ${item.quantity}</p>`,
      )
      .join('');

    const message = `
  <html>
    <body>
      <h2>Order Receipt</h2>
      <div>${itemDetails}</div>
      <p>Total Price: ৳${order.totalPrice}</p>
    </body>
  </html>
`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Order Receipt',
      html: message,
    });
  }

  async createOrder(
    token: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    try {
      const customer = await this.customerService.getCustomer(token);

      const orderItems = [];
      let totalPrice = 0;

      for (const item of createOrderDto.items) {
        const menuItem = await this.menuService.getMenuItemById(
          item.menuItemId,
        );
        console.log('Menu Item:', menuItem);

        if (!menuItem) {
          throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
        }

        const itemTotalPrice = menuItem.price * item.quantity;
        totalPrice += itemTotalPrice;

        orderItems.push({
          menuItem,
          quantity: item.quantity,
          totalPrice: itemTotalPrice,
        });
      }

      const order = this.orderRepository.create({
        customer,
        items: orderItems,
        totalPrice,
        status: 'pending',
      });

      await this.orderRepository.save(order);
      await this.sendReciept(customer.email, order);

      return order;
    } catch (error) {
      // console.error('Error in createOrder:', error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

async cancelOrder(token: string, orderId: number): Promise<Order> {
  const customer = await this.customerService.getCustomer(token);

  const order = await this.orderRepository.findOne({
    where: { id: orderId, customer: { id: customer.id } },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.status === 'cancelled') {
    throw new BadRequestException('Order is already cancelled');
  }

  order.status = 'cancelled';
  return this.orderRepository.save(order);
}

  async getOrders(token: string): Promise<Order[]> {
    const customer = await this.customerService.getCustomer(token);

    return this.orderRepository.find({
      where: { customer: { id: customer.id } },
      relations: ['items', 'items.menuItem'],
    });
  }
}
