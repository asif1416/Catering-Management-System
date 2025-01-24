import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { MenuService } from '../menu/menu.service';
import { CustomerService } from '../customer/customer.service';
import { MailerService } from '@nestjs-modules/mailer';

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

    const message = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #f49b33;">Order Receipt - Culinary Odyssey</h2>
              <hr style="border: 1px solid #ddd;">
              <p><strong>Customer Name:</strong> ${order.customer.name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <hr style="border: 1px solid #ddd;">
              <p><strong>Menu Item:</strong> ${order.menuItem.name}</p>
              <p><strong>Quantity:</strong> ${order.quantity}</p>
              <p><strong>Price per Item:</strong> ৳${order.menuItem.price.toFixed(2)}</p>
              <hr style="border: 1px solid #ddd;">
              <p><strong>Total Price:</strong> ৳${order.totalPrice.toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <hr style="border: 1px solid #ddd;">
              <p><strong>Order Time:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Start Time:</strong> ${formatDate(order.startTime)}</p>
              <p><strong>End Time:</strong> ${formatDate(order.endTime)}</p>
              <hr style="border: 1px solid #ddd;">
              <p style="text-align: center; color: #f49b33;">Thank you for your order!</p>
            </div>
          </div>
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
    menuItemId: number,
    quantity: number,
    startTime?: string,
    endTime?: string,
  ): Promise<Order> {
    const customer = await this.customerService.getCustomer(token);

    const menuItem = await this.menuService.getMenuItemById(menuItemId);
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const totalPrice = menuItem.price * quantity;

    const order = this.orderRepository.create({
      customer,
      menuItem,
      quantity,
      totalPrice,
      startTime: startTime,
      endTime: endTime,
    });

    await this.orderRepository.save(order);
    await this.sendReciept(customer.email, order);
    return order;
  }

  async cancelOrder(token: string, orderId: number): Promise<Order> {
    const customer = await this.customerService.getCustomer(token);

    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customer.id } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = 'cancelled';
    return this.orderRepository.save(order);
  }

  async getOrders(token: string): Promise<Order[]> {
    const customer = await this.customerService.getCustomer(token);

    return this.orderRepository.find({
      where: { customer: { id: customer.id } },
    });
  }

  async getOrderById(token: string, orderId: number): Promise<Order> {
    const customer = await this.customerService.getCustomer(token);

    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customer.id } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
